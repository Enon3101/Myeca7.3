import dotenv from "dotenv";
dotenv.config();

import { adminDb } from "./server/firebase-admin";

async function inspectFirebase() {
  try {
    console.log("--- Firebase Deep Inspection Start (with Dotenv) ---");
    console.log(`Using Project ID: ${process.env.VITE_FIREBASE_PROJECT_ID}`);
    
    const collections = ["blog_posts", "users", "categories", "user_services", "tax_returns"];
    
    for (const coll of collections) {
      try {
        const snapshot = await adminDb.collection(coll).get();
        console.log(`Collection '${coll}': ${snapshot.size} documents`);
        if (snapshot.size > 0) {
          console.log(`  Sample ID from '${coll}': ${snapshot.docs[0].id}`);
          const data = snapshot.docs[0].data();
          console.log(`  Sample Data Keys: ${Object.keys(data).join(", ")}`);
        }
      } catch (err: any) {
        console.error(`Error fetching collection '${coll}':`, err.message);
      }
    }
    
    console.log("--- Firebase Deep Inspection End ---");
  } catch (error: any) {
    console.error("CRITICAL ERROR during inspection:", error.message);
  } finally {
    process.exit(0);
  }
}

inspectFirebase();
