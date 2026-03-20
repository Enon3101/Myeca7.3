import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

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

const adminDb = admin.firestore();

async function testPublicBlogsFixed() {
  try {
    console.log("Fetching ALL blog posts for in-memory processing...");
    // Use the exact fix from public.ts
    const snapshot = await adminDb.collection("blog_posts").get();
    
    console.log(`Found ${snapshot.size} total posts in Firestore.`);
    
    const allPosts = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        status: data.status,
        createdAt: data.createdAt,
      };
    }));

    // Filter by status and sort by createdAt descending
    const publishedPosts = allPosts
      .filter(p => p.status === 'published')
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

    console.log(`Found ${publishedPosts.length} published posts after in-memory processing.`);
    publishedPosts.forEach(p => console.log(` - ${p.title} (Status: ${p.status}, CreatedAt: ${p.createdAt?.toDate?.() || p.createdAt})`));

  } catch (error: any) {
    console.error("TEST FAILED:", error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

testPublicBlogsFixed();
