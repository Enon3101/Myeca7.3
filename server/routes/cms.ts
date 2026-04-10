import { Router, Response } from "express";
import { z } from "zod";
import { requireAuth, requireTeamMember, AuthRequest } from "../middleware/auth";
import { adminDb } from "../firebase-admin";
import { sanitize } from "../middleware/sanitize";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { blogPostEditorSchema, blogPostUpdateSchema, slugifyHeading } from "@shared/blog";
import {
  buildBlogPostWriteData,
  getBlogPostById,
  getCategoryLookup,
  listAllBlogPosts,
} from "../services/blog";
import { clearPublicBlogCache } from "./public";

const router = Router();

const multerStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadDir = "public/uploads/blog";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().optional().nullable(),
});

const createDailyUpdateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  isActive: z.boolean().default(true),
  expiresAt: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()).optional(),
});

const updateDailyUpdateSchema = createDailyUpdateSchema.partial();

router.get("/posts", requireAuth, requireTeamMember, async (req: AuthRequest, res: Response) => {
  try {
    const { q, status, categoryId } = req.query as { q?: string; status?: string; categoryId?: string };
    let posts = await listAllBlogPosts();

    if (status && (status === "draft" || status === "published")) {
      posts = posts.filter((post) => post.status === status);
    }

    if (categoryId && categoryId !== "all") {
      posts = posts.filter((post) => post.categoryId === categoryId);
    }

    if (q) {
      const query = q.toLowerCase();
      posts = posts.filter((post) =>
        [post.title, post.slug, post.excerpt ?? "", post.authorName]
          .join(" ")
          .toLowerCase()
          .includes(query),
      );
    }

    posts.sort((left, right) => {
      const leftUpdated = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
      const rightUpdated = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
      return rightUpdated - leftUpdated;
    });

    res.json({
      success: true,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        status: post.status,
        categoryId: post.categoryId,
        category: post.category,
        coverImage: post.coverImage,
        authorName: post.authorName,
        authorRole: post.authorRole,
        readingTimeMinutes: post.readingTimeMinutes,
        isFeatured: post.isFeatured,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        createdAt: post.createdAt,
        tags: post.tags,
      })),
    });
  } catch (error) {
    console.error("CMS list posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/posts/:id", requireAuth, requireTeamMember, async (req: AuthRequest, res: Response) => {
  try {
    const post = await getBlogPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error("CMS get post error:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/posts", requireAuth, requireTeamMember, sanitize, async (req: AuthRequest, res: Response) => {
  try {
    const payload = blogPostEditorSchema.parse(req.body);
    const postRef = adminDb.collection("blog_posts").doc();
    const writeData = await buildBlogPostWriteData(payload, {
      authUserId: req.auth?.userId ?? null,
    });

    await postRef.set(writeData);
    clearPublicBlogCache();

    const saved = await getBlogPostById(postRef.id);
    res.json({ success: true, post: saved });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("CMS create post error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/posts/:id", requireAuth, requireTeamMember, sanitize, async (req: AuthRequest, res: Response) => {
  try {
    const payload = blogPostUpdateSchema.parse(req.body);
    const existing = await getBlogPostById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Post not found" });
    }

    const mergedPayload = {
      ...existing,
      ...payload,
      categoryId: payload.categoryId ?? existing.categoryId,
      tags: payload.tags ?? existing.tags,
      keyHighlights: payload.keyHighlights ?? existing.keyHighlights,
      faqItems: payload.faqItems ?? existing.faqItems,
      relatedPostIds: payload.relatedPostIds ?? existing.relatedPostIds,
      coverImage: payload.coverImage ?? existing.coverImage,
      authorId: payload.authorId ?? existing.authorId,
      authorName: payload.authorName ?? existing.authorName,
      authorRole: payload.authorRole ?? existing.authorRole,
      authorBio: payload.authorBio ?? existing.authorBio,
      seoTitle: payload.seoTitle ?? existing.seoTitle,
      seoDescription: payload.seoDescription ?? existing.seoDescription,
      ctaLabel: payload.ctaLabel ?? existing.ctaLabel,
      ctaHref: payload.ctaHref ?? existing.ctaHref,
      readingTimeMinutes: payload.readingTimeMinutes ?? existing.readingTimeMinutes,
      publishedAt: payload.publishedAt ?? existing.publishedAt,
    };

    const writeData = await buildBlogPostWriteData(blogPostEditorSchema.parse(mergedPayload), {
      authUserId: req.auth?.userId ?? null,
      existing,
    });

    await adminDb.collection("blog_posts").doc(req.params.id).set(writeData, { merge: true });
    clearPublicBlogCache();

    const saved = await getBlogPostById(req.params.id);
    res.json({ success: true, post: saved });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("CMS update post error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

router.delete("/posts/:id", requireAuth, requireTeamMember, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await getBlogPostById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Post not found" });
    }

    await adminDb.collection("blog_posts").doc(req.params.id).delete();
    clearPublicBlogCache();
    res.json({ success: true });
  } catch (error) {
    console.error("CMS delete post error:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

router.post("/upload", requireAuth, requireTeamMember, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const uploadDir = path.dirname(filePath);
    const thumbDir = path.join(uploadDir, "thumbnails");
    const thumbPath = path.join(thumbDir, fileName);

    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }

    const webpFileName = fileName.replace(path.extname(fileName), ".webp");
    const webpPath = path.join(uploadDir, webpFileName);

    await sharp(filePath)
      .resize(300, 300, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(thumbPath.replace(path.extname(thumbPath), ".webp"));

    await sharp(filePath)
      .resize(1920, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    if (path.extname(filePath).toLowerCase() !== ".webp") {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Failed to delete original upload:", err);
      }
    }

    const publicUrl = `/uploads/blog/${webpFileName}`;
    const thumbUrl = `/uploads/blog/thumbnails/${webpFileName}`;

    res.json({
      success: true,
      url: publicUrl,
      thumbnailUrl: thumbUrl,
    });
  } catch (error: any) {
    console.error("CMS upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

router.get("/media", requireAuth, requireTeamMember, async (_req: AuthRequest, res: Response) => {
  try {
    const uploadDir = "public/uploads/blog";
    if (!fs.existsSync(uploadDir)) {
      return res.json({ success: true, files: [] });
    }

    const files = fs.readdirSync(uploadDir)
      .filter((file) => /\.(webp)$/i.test(file))
      .map((file) => {
        const stats = fs.statSync(path.join(uploadDir, file));
        return {
          name: file,
          url: `/uploads/blog/${file}`,
          thumbnailUrl: fs.existsSync(path.join(uploadDir, "thumbnails", file))
            ? `/uploads/blog/thumbnails/${file}`
            : `/uploads/blog/${file}`,
          size: stats.size,
          mtime: stats.mtime,
        };
      })
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    res.json({ success: true, files });
  } catch (error) {
    console.error("CMS media list error:", error);
    res.status(500).json({ error: "Failed to list media files" });
  }
});

router.get("/categories", requireAuth, requireTeamMember, async (_req: AuthRequest, res: Response) => {
  try {
    const lookup = await getCategoryLookup();
    res.json({
      success: true,
      categories: Array.from(lookup.byId.values()).sort((left, right) => left.name.localeCompare(right.name)),
    });
  } catch (error) {
    console.error("CMS list categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", requireAuth, requireTeamMember, sanitize, async (req: AuthRequest, res: Response) => {
  try {
    const payload = createCategorySchema.parse(req.body);
    const categoryRef = adminDb.collection("categories").doc();
    const category = {
      name: payload.name.trim(),
      slug: payload.slug?.trim() || slugifyHeading(payload.name),
      description: payload.description?.trim() || null,
    };

    await categoryRef.set(category);
    clearPublicBlogCache();
    res.json({
      success: true,
      category: { id: categoryRef.id, ...category },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("CMS create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.get("/updates", requireAuth, requireTeamMember, async (_req: AuthRequest, res: Response) => {
  try {
    const snapshot = await adminDb.collection("daily_updates").orderBy("createdAt", "desc").get();
    const allUpdates = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, updates: allUpdates });
  } catch (error) {
    console.error("CMS list updates error:", error);
    res.status(500).json({ error: "Failed to fetch updates" });
  }
});

router.post("/updates", requireAuth, requireTeamMember, sanitize, async (req: AuthRequest, res: Response) => {
  try {
    const payload = createDailyUpdateSchema.parse(req.body);
    const updateRef = adminDb.collection("daily_updates").doc();
    const newUpdate = {
      ...payload,
      createdAt: new Date(),
    };
    await updateRef.set(newUpdate);
    res.json({ success: true, update: { id: updateRef.id, ...newUpdate } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
    console.error("CMS create update error:", error);
    res.status(500).json({ error: "Failed to create update" });
  }
});

router.put("/updates/:id", requireAuth, requireTeamMember, sanitize, async (req: AuthRequest, res: Response) => {
  try {
    const payload = updateDailyUpdateSchema.parse(req.body);
    const updateRef = adminDb.collection("daily_updates").doc(req.params.id);
    const doc = await updateRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Update not found" });

    await updateRef.update(payload);
    res.json({ success: true, update: { id: req.params.id, ...doc.data(), ...payload } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
    console.error("CMS update update error:", error);
    res.status(500).json({ error: "Failed to update" });
  }
});

router.delete("/updates/:id", requireAuth, requireTeamMember, async (req: AuthRequest, res: Response) => {
  try {
    await adminDb.collection("daily_updates").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error("CMS delete update error:", error);
    res.status(500).json({ error: "Failed to delete update" });
  }
});

export default router;
