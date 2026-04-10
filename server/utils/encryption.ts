import crypto from "crypto";

const ENCRYPTED_PREFIX = "enc:v1";

function getEncryptionKey(): Buffer {
  const rawKey = process.env.PII_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error("PII_ENCRYPTION_KEY is required");
  }

  return crypto.createHash("sha256").update(rawKey, "utf8").digest();
}

function isEncrypted(value: string) {
  return value.startsWith(`${ENCRYPTED_PREFIX}:`);
}

export function encryptPII(value?: string | null) {
  if (!value) {
    return value ?? null;
  }

  if (isEncrypted(value)) {
    return value;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTED_PREFIX,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptPII(value?: string | null) {
  if (!value) {
    return value ?? null;
  }

  if (!isEncrypted(value)) {
    return value;
  }

  const [, , ivBase64, authTagBase64, encryptedBase64] = value.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivBase64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(authTagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function maskPan(value?: string | null) {
  if (!value) {
    return value ?? null;
  }

  const normalized = value.toUpperCase();
  if (normalized.length <= 5) {
    return normalized.replace(/./g, "X");
  }

  return `${"X".repeat(Math.max(0, normalized.length - 5))}${normalized.slice(-5)}`;
}

export function maskAadhaar(value?: string | null) {
  if (!value) {
    return value ?? null;
  }

  const normalized = value.replace(/\s+/g, "");
  if (normalized.length <= 4) {
    return normalized.replace(/./g, "X");
  }

  return `${"X".repeat(Math.max(0, normalized.length - 4))}${normalized.slice(-4)}`;
}
