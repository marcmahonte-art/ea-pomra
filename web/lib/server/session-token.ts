import { createHmac, randomBytes } from "node:crypto";

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string, secret: string): string {
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function isOpaqueToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{40,128}$/.test(value);
}

export function isSessionActive(expiresAt: Date | string, now = Date.now()): boolean {
  return new Date(expiresAt).getTime() > now;
}
