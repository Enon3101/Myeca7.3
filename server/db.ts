// --- Legacy Database Mock ---
// This file is kept for backward compatibility during the Firebase migration.
// New code should use adminDb from ./firebase-admin.ts

export const db: any = new Proxy({}, {
  get: () => {
    return () => {
      console.warn("⚠️ Attempted to access legacy Drizzle 'db'. This operation is not supported in the current Firebase-centric architecture.");
      throw new Error("Legacy database access is disabled. Please refactor this component to use Firestore.");
    };
  }
});

export const pool: any = null;
