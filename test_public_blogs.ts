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

async function testPublicBlogs() {
  try {
    console.log("Fetching published blog posts...");
    const snapshot = await adminDb.collection("blog_posts")
      .where("status", "==", "published")
      .orderBy("createdAt", "desc")
      .get();
    
    console.log(`Found ${snapshot.size} published posts.`);
    
    const posts = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const id = doc.id;
      console.log(`Processing post: ${data.title} (${id})`);
      
      // Fetch Author
      let author = { firstName: "Team", lastName: "MyeCA" };
      if (data.authorId) {
        console.log(`  Fetching author: ${data.authorId}`);
        const authorDoc = await adminDb.collection("users").doc(data.authorId).get();
        if (authorDoc.exists) {
          const authorData = authorDoc.data()!;
          author = { 
            firstName: authorData.firstName || "Team", 
            lastName: authorData.lastName || "MyeCA" 
          };
          console.log(`  Found author: ${author.firstName}`);
        } else {
          console.log(`  Author ${data.authorId} NOT FOUND`);
        }
      }

      // Fetch Category
      let category = "General";
      if (data.categoryId) {
        console.log(`  Fetching category: ${data.categoryId}`);
        const catSnapshot = await adminDb.collection("categories")
          .where("id", "==", data.categoryId)
          .limit(1)
          .get();
        if (!catSnapshot.empty) {
          category = catSnapshot.docs[0].data().name;
          console.log(`  Found category: ${category}`);
        } else {
          console.log(`  Category ${data.categoryId} NOT FOUND`);
        }
      }

      return {
        id: doc.id,
        title: data.title,
        slug: data.slug,
        createdAt: data.createdAt,
        author,
        category,
      };
    }));

    console.log("Successfully processed all posts.");
    console.log(JSON.stringify(posts, null, 2));
  } catch (error: any) {
    console.error("TEST FAILED:", error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

testPublicBlogs();
