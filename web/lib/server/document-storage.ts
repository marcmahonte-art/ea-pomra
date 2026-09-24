import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import path from "node:path";
import { getServerConfig } from "./config";

export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export type AllowedDocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

export type EncryptedDocument = {
  ciphertext: Buffer;
  initializationVector: Buffer;
  authenticationTag: Buffer;
  checksumSha256: string;
};

function encryptionKey(): Buffer {
  return createHash("sha256").update(getServerConfig().documentEncryptionKey).digest();
}

export function sanitizeDocumentName(value: string): string {
  const base = path.basename(value.replaceAll("\\", "/"));
  const normalized = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 180);
  return normalized || "document";
}

export function detectDocumentType(bytes: Buffer): AllowedDocumentType | null {
  if (bytes.length >= 5 && bytes.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  return null;
}

export function validateDocumentUpload(input: {
  bytes: Buffer;
  declaredType: string;
  maxBytes: number;
}): AllowedDocumentType {
  if (input.bytes.length === 0 || input.bytes.length > input.maxBytes) {
    throw new Error("Taille de fichier interdite");
  }
  const detectedType = detectDocumentType(input.bytes);
  if (!detectedType || detectedType !== input.declaredType) {
    throw new Error("Type de fichier interdit");
  }
  return detectedType;
}

export function documentAad(documentId: string, version: number): string {
  return `documentId=${documentId};version=${version}`;
}

export function encryptDocument(bytes: Buffer, aad?: string): EncryptedDocument {
  const initializationVector = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), initializationVector);
  if (aad) cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(bytes), cipher.final()]);
  return {
    ciphertext,
    initializationVector,
    authenticationTag: cipher.getAuthTag(),
    checksumSha256: createHash("sha256").update(bytes).digest("hex")
  };
}

export function decryptDocument(input: OpaqueDocumentPayload, aad?: string): Buffer {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), input.initializationVector);
  if (aad) decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(input.authenticationTag);
  const bytes = Buffer.concat([decipher.update(input.ciphertext), decipher.final()]);
  const checksum = createHash("sha256").update(bytes).digest("hex");
  if (checksum !== input.checksumSha256) throw new Error("Contrôle d'intégrité du document échoué");
  return bytes;
}

export type OpaqueDocumentPayload = {
  ciphertext: Buffer;
  initializationVector: Buffer;
  authenticationTag: Buffer;
  checksumSha256: string;
};
