import { Router } from "express";
import memoize from "memoizee";
import { adminDb } from "../firebase-admin";
import {
  buildPublicBlogDetail,
  getCategoryLookup,
  listAllBlogPosts,
  sortPublishedPosts,
  toPublicBlogSummary,
} from "../services/blog";

const router = Router();

const getCachedPublishedPosts = memoize(
  async () => {
    return sortPublishedPosts(await listAllBlogPosts());
  },
  { promise: true, maxAge: 300000 },
);

const getCachedActiveUpdates = memoize(
  async () => {
    const snapshot = await adminDb.collection("daily_updates")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
  { promise: true, maxAge: 300000 },
);

const getCachedCategories = memoize(
  async () => {
    const lookup = await getCategoryLookup();
    return Array.from(lookup.byId.values()).sort((left, right) => left.name.localeCompare(right.name));
  },
  { promise: true, maxAge: 300000 },
);

export function clearPublicBlogCache() {
  getCachedPublishedPosts.clear();
  getCachedCategories.clear();
}

router.get("/updates/active", async (_req, res) => {
  try {
    const updates = await getCachedActiveUpdates();
    res.json({ success: true, updates });
  } catch (error) {
    console.error("Public fetch active updates error:", error);
    res.status(500).json({ error: "Failed to fetch active updates" });
  }
});

router.get("/blogs", async (_req, res) => {
  try {
    const posts = await getCachedPublishedPosts();
    res.json({
      success: true,
      posts: posts.map(toPublicBlogSummary),
    });
  } catch (error) {
    console.error("Public fetch blogs error:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/blogs/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const posts = await getCachedPublishedPosts();
    const post = posts.find((candidate) => candidate.slug === slug);

    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json({
      success: true,
      post: buildPublicBlogDetail(post, posts),
    });
  } catch (error) {
    console.error("Public fetch single blog error:", error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const categories = await getCachedCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Public fetch categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
