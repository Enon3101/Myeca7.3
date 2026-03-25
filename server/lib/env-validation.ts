/**
 * Validate required environment variables at startup.
 * Logs warnings for optional missing vars, throws for critical ones.
 */
export function validateEnv() {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Firebase is required
  if (!process.env.FIREBASE_PROJECT_ID && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    errors.push('FIREBASE_PROJECT_ID or GOOGLE_APPLICATION_CREDENTIALS must be set');
  }

  // Optional but recommended
  if (!process.env.ADMIN_EMAILS) {
    warnings.push('ADMIN_EMAILS not set — no admin role overrides configured');
  }

  if (!process.env.PII_ENCRYPTION_KEY) {
    warnings.push('PII_ENCRYPTION_KEY not set — PII encryption disabled');
  }

  if (!process.env.SESSION_SECRET) {
    warnings.push('SESSION_SECRET not set — using auto-generated value');
  }

  // Log warnings
  for (const w of warnings) {
    console.warn(`[ENV] Warning: ${w}`);
  }

  // Throw on critical errors
  if (errors.length > 0) {
    for (const e of errors) {
      console.error(`[ENV] Error: ${e}`);
    }
    // Don't throw in development to allow easier setup
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${errors.join(', ')}`);
    }
  }
}
