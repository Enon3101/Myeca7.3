import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export interface AuditLogEntry {
  action: string;
  category: 'authentication' | 'document' | 'admin' | 'security' | 'access';
  metadata?: Record<string, any>;
  status?: 'success' | 'failure' | 'warning';
}

/**
 * Logs a security or operational event to Firestore for auditing.
 */
export async function logAuditEvent({ action, category, metadata = {}, status = 'success' }: AuditLogEntry) {
  try {
    const user = auth.currentUser;
    const logData = {
      uid: user?.uid || 'anonymous',
      email: user?.email || 'unknown',
      action,
      category,
      status,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      createdAt: serverTimestamp(),
    };

    const logsRef = collection(db, "audit_logs");
    await addDoc(logsRef, logData);
  } catch (error) {
    // Fail silently in production to not disrupt user experience, 
    // but log to console in development.
    if (import.meta.env.DEV) {
      console.error("Audit log failed:", error);
    }
  }
}

/**
 * Convenience method for login success events.
 */
export function logLogin(email: string) {
  return logAuditEvent({
    action: 'login_success',
    category: 'authentication',
    metadata: { email }
  });
}

/**
 * Convenience method for document access.
 */
export function logDocumentAccess(docId: string, actionDesc: string) {
  return logAuditEvent({
    action: actionDesc,
    category: 'document',
    metadata: { docId }
  });
}

/**
 * Convenience method for MFA actions.
 */
export function logMfaAction(actionType: 'enroll' | 'unenroll' | 'verify_success' | 'verify_failure') {
  return logAuditEvent({
    action: `mfa_${actionType}`,
    category: 'security'
  });
}
