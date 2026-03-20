import "dotenv/config";
import { adminDb } from "./server/firebase-admin";

async function listUsers() {
  try {
    const snapshot = await adminDb.collection("users").get();
    console.log(`Total users: ${snapshot.size}`);
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email && data.email.toLowerCase().includes("jitender")) {
        console.log(`- ${doc.id}: ${data.email} [${data.role}]`);
        console.log(JSON.stringify(data, null, 2));
      }
    });
  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    process.exit(0);
  }
}

listUsers();
