import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";
import Database from "better-sqlite3";
import path from "path";

// Explicitly set project ID
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (projectId) {
    process.env.GOOGLE_CLOUD_PROJECT = projectId;
    process.env.GCLOUD_PROJECT = projectId;
}

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
      const key = serviceAccountKey.trim();
      const serviceAccount = JSON.parse(
        key.startsWith("{") 
          ? key 
          : require("fs").readFileSync(key, "utf8")
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
  } else {
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

const db = admin.firestore();
const adminId = "nMN3h2b65ZQZQX0IS5IC5Kdmo5A3";

async function migrate() {
  try {
    const sqlitePath = path.resolve(process.cwd(), "dev.db");
    const sqlite = new Database(sqlitePath);
    
    console.log("--- Migration Started ---");
    
    // 1. Migrate Categories
    console.log("Migrating Categories...");
    const sqliteCategories = sqlite.prepare("SELECT * FROM categories").all();
    console.log(`Found ${sqliteCategories.length} categories in SQLite.`);
    
    for (const cat of sqliteCategories) {
      const catRef = db.collection("categories").doc(cat.id.toString());
      await catRef.set({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      });
      console.log(`  - Migrated category: ${cat.name}`);
    }

    // 2. Migrate Blog Posts
    console.log("Migrating Blog Posts...");
    const sqlitePosts = sqlite.prepare("SELECT * FROM blog_posts").all();
    console.log(`Found ${sqlitePosts.length} posts in SQLite.`);
    
    for (const post of sqlitePosts) {
      // Map fields from snake_case (SQLite) to camelCase (Firebase if needed) or as expected by model
      // Looking at shared/schema.ts, it uses camelCase: title, slug, content, excerpt, authorId, categoryId, status, tags, featuredImage, publishedAt, createdAt, updatedAt
      
      const postData: any = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        authorId: adminId,
        categoryId: post.category_id,
        status: post.status,
        tags: post.tags,
        featuredImage: post.featured_image,
        createdAt: post.created_at ? new Date(post.created_at) : new Date(),
        updatedAt: post.updated_at ? new Date(post.updated_at) : new Date(),
      };
      
      if (post.published_at) {
          postData.publishedAt = new Date(post.published_at);
      }

      await db.collection("blog_posts").add(postData);
      console.log(`  - Migrated post: ${post.title}`);
    }

    console.log("--- Migration Completed Successfully ---");
    sqlite.close();
  } catch (error: any) {
    console.error("Migration FAILED:", error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

migrate();
