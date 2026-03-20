import { adminDb } from "./server/firebase-admin";

async function inspectBlogs() {
  try {
    console.log("--- Firebase Inspection Start ---");
    const snapshot = await adminDb.collection("blog_posts").get();
    console.log(`Total documents in 'blog_posts': ${snapshot.size}`);
    
    if (snapshot.size === 0) {
      console.log("Checking other common collection names...");
      const postsSnapshot = await adminDb.collection("posts").get();
      console.log(`Documents in 'posts': ${postsSnapshot.size}`);
      const blogsSnapshot = await adminDb.collection("blogs").get();
      console.log(`Documents in 'blogs': ${blogsSnapshot.size}`);
    }

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`[${index}] ID: ${doc.id}`);
      console.log(`    Title: ${data.title}`);
      console.log(`    Status: ${data.status}`);
      console.log(`    Has createdAt: ${!!data.createdAt}`);
      if (data.createdAt) {
          console.log(`    createdAt value: ${JSON.stringify(data.createdAt)}`);
      }
    });
    console.log("--- Firebase Inspection End ---");
  } catch (error) {
    console.error("CRITICAL ERROR during inspection:", error);
  } finally {
    process.exit(0);
  }
}

inspectBlogs();
