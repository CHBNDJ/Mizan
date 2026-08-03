import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const MAGIC = Buffer.from("ENCF1:");

function getKey(): Buffer {
  const raw = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!raw) throw new Error("MESSAGE_ENCRYPTION_KEY manquante");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32)
    throw new Error("MESSAGE_ENCRYPTION_KEY invalide (doit faire 32 octets)");
  return key;
}

export function encryptFile(plain: Buffer): Buffer {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([MAGIC, iv, tag, encrypted]);
}

export function decryptFile(stored: Buffer): Buffer {
  if (
    stored.length < MAGIC.length ||
    !stored.subarray(0, MAGIC.length).equals(MAGIC)
  ) {
    return stored;
  }
  const key = getKey();
  const iv = stored.subarray(MAGIC.length, MAGIC.length + 12);
  const tag = stored.subarray(MAGIC.length + 12, MAGIC.length + 28);
  const data = stored.subarray(MAGIC.length + 28);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function isEncryptedFile(stored: Buffer): boolean {
  return (
    stored.length >= MAGIC.length &&
    stored.subarray(0, MAGIC.length).equals(MAGIC)
  );
}
