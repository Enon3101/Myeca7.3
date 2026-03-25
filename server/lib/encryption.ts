import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.PII_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error('PII_ENCRYPTION_KEY must be set and at least 32 characters');
  }
  // Derive a consistent 32-byte key
  return crypto.createHash('sha256').update(key).digest();
}

/**
 * Encrypt a plaintext string (e.g., PAN, Aadhaar).
 * Returns a base64 string containing IV + encrypted data + auth tag.
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) return plaintext;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // IV (16) + tag (16) + encrypted data
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/**
 * Decrypt a previously encrypted PII string.
 */
export function decryptPII(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  try {
    const key = getEncryptionKey();
    const data = Buffer.from(ciphertext, 'base64');
    const iv = data.subarray(0, IV_LENGTH);
    const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final('utf8');
  } catch {
    // If decryption fails, value might be plaintext (pre-migration)
    return ciphertext;
  }
}

/**
 * Mask a PII value for display (e.g., "ABCDE1234F" -> "ABCD****4F")
 */
export function maskPII(value: string, visibleStart = 4, visibleEnd = 2): string {
  if (!value || value.length <= visibleStart + visibleEnd) return '****';
  return value.slice(0, visibleStart) + '****' + value.slice(-visibleEnd);
}
