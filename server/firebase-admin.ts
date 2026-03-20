import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(
        serviceAccountKey.startsWith("{") 
          ? serviceAccountKey 
          : require("fs").readFileSync(serviceAccountKey, "utf8")
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
      console.log("[FIREBASE] Initialized with Service Account Key");
    } catch (error) {
      console.error("[FIREBASE] Failed to load Service Account Key:", error);
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.warn("[FIREBASE] Running without Service Account Key (ADC only)");
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
