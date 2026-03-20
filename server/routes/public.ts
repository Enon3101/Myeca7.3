import { Router } from "express";
import { adminDb } from "../firebase-admin";
import memoize from "memoizee";

const router = Router();

// --- Memoized Data Fetchers ---
// Caches results for 5 minutes (300,000 ms) to reduce DB load
const getCachedActiveUpdates = memoize(
  async () => {
    const snapshot = await adminDb.collection("daily_updates")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  { promise: true, maxAge: 300000 }
);

const getCachedBlogs = memoize(
  async () => {
    // Fetch all posts and filter in-memory to avoid composite index requirements
    const snapshot = await adminDb.collection("blog_posts").get();
    
    const allPosts = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      
      // Fetch Author
      let author = { firstName: "Team", lastName: "MyeCA" };
      if (data.authorId) {
        const authorDoc = await adminDb.collection("users").doc(data.authorId).get();
        if (authorDoc.exists) {
          const authorData = authorDoc.data()!;
          author = { 
            firstName: authorData.firstName || "Team", 
            lastName: authorData.lastName || "MyeCA" 
          };
        }
      }

      // Fetch Category
      let category = "General";
      if (data.categoryId) {
        // Handle numeric or string IDs
        const catSnapshot = await adminDb.collection("categories")
          .where("id", "==", data.categoryId)
          .limit(1)
          .get();
        if (!catSnapshot.empty) {
          category = catSnapshot.docs[0].data().name;
        }
      }

      return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        status: data.status,
        tags: data.tags,
        featuredImage: data.featuredImage,
        createdAt: data.createdAt,
        author,
        category,
      };
    }));

    // Filter by status and sort by createdAt descending
    const publishedPosts = allPosts
      .filter(p => p.status === 'published')
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

    return publishedPosts;
  },
  { promise: true, maxAge: 300000 }
);

const getCachedBlogBySlug = memoize(
  async (slug: string) => {
    const snapshot = await adminDb.collection("blog_posts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();

    // Fetch Author
    let author = { firstName: "Team", lastName: "MyeCA" };
    if (data.authorId) {
      const authorDoc = await adminDb.collection("users").doc(data.authorId).get();
      if (authorDoc.exists) {
        const authorData = authorDoc.data()!;
        author = { 
          firstName: authorData.firstName || "Team", 
          lastName: authorData.lastName || "MyeCA" 
        };
      }
    }

    // Fetch Category
    let category = "General";
    if (data.categoryId) {
      const catSnapshot = await adminDb.collection("categories")
        .where("id", "==", data.categoryId)
        .limit(1)
        .get();
      if (!catSnapshot.empty) {
        category = catSnapshot.docs[0].data().name;
      }
    }

    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      status: data.status,
      tags: data.tags,
      featuredImage: data.featuredImage,
      createdAt: data.createdAt,
      author,
      category,
    };
  },
  { promise: true, maxAge: 300000 }
);

const getCachedCategories = memoize(
  async () => {
    const snapshot = await adminDb.collection("categories").orderBy("name").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  { promise: true, maxAge: 300000 }
);

// Get active daily updates
router.get("/updates/active", async (req, res) => {
  try {
    const activeUpdates = await getCachedActiveUpdates();
    res.json({ success: true, updates: activeUpdates });
  } catch (error) {
    console.error("Public fetch active updates error:", error);
    res.status(500).json({ error: "Failed to fetch active updates" });
  }
});

// Get all published blogs
router.get("/blogs", async (req, res) => {
  try {
    const posts = await getCachedBlogs();
    res.json({ success: true, posts });
  } catch (error) {
    console.error("Public fetch blogs error:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get a single published blog by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await getCachedBlogBySlug(slug);

    if (!post) return res.status(404).json({ error: "Blog post not found" });

    res.json({ success: true, post });
  } catch (error) {
    console.error("Public fetch single blog error:", error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const allCategories = await getCachedCategories();
    res.json({ success: true, categories: allCategories });
  } catch (error) {
    console.error("Public fetch categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
