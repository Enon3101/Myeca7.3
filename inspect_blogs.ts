import { adminDb } from "./server/firebase-admin";

async function inspectBlogs() {
  try {
    console.log("Fetching all documents from 'blog_posts'...");
    const snapshot = await adminDb.collection("blog_posts").get();
    console.log(`Found ${snapshot.size} documents.`);
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Status: ${data.status}`);
      console.log(`CreatedAt: ${data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt}`);
      console.log("-------------------");
    });
  } catch (error) {
    console.error("Error inspecting blogs:", error);
  } finally {
    process.exit(0);
  }
}

inspectBlogs();
