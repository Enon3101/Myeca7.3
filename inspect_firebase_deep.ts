import { adminDb } from "./server/firebase-admin";

async function inspectFirebase() {
  try {
    console.log("--- Firebase Deep Inspection Start ---");
    
    const collections = ["blog_posts", "users", "categories", "user_services", "tax_returns"];
    
    for (const coll of collections) {
      const snapshot = await adminDb.collection(coll).get();
      console.log(`Collection '${coll}': ${snapshot.size} documents`);
      if (snapshot.size > 0) {
        console.log(`  Sample ID from '${coll}': ${snapshot.docs[0].id}`);
      }
    }
    
    console.log("--- Firebase Deep Inspection End ---");
  } catch (error) {
    console.error("CRITICAL ERROR during inspection:", error);
  } finally {
    process.exit(0);
  }
}

inspectFirebase();
