import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const app = initializeApp(firebaseConfig);

// Initialize App Check with reCAPTCHA Enterprise
if (typeof window !== 'undefined') {
  // Check if we have a site key, otherwise fallback to debug in dev or skip
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
  } else if (import.meta.env.DEV) {
    // Optional: Enable debug token in development
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
