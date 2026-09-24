import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { BackofficeScope } from "@/lib/backoffice-types";
import { getServerConfig } from "./config";
import { query } from "./db";

export type RateLimitKind = "login" | "mutation";

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export type HeaderSource = {
  get(name: string): string | null;
};

export function extractTrustedClientIp(
  headers: HeaderSource,
  trustedHeaders: readonly string[],
  production: boolean
): string {
  for (const header of trustedHeaders) {
    const value = headers.get(header)?.trim();
    if (!value) continue;
    const candidate = value.split(",", 1)[0]?.trim();
    if (candidate && isIP(candidate)) return candidate;
    if (production) throw new Error("Adresse IP client non fiable");
  }
  if (production) throw new Error("Aucun en-tête client approuvé");
  return "unknown";
}

export function isRateLimited(
  requestCount: number,
  limit: number,
  windowSeconds: number,
  now: Date = new Date()
): RateLimitResult {
  const elapsed = now.getTime() % (windowSeconds * 1000);
  const retryAfterSeconds = Math.max(1, Math.ceil((windowSeconds * 1000 - elapsed) / 1000));
  return {
    allowed: requestCount <= limit,
    retryAfterSeconds
  };
}

function digestKey(parts: readonly string[]): string {
  return createHash("sha256").update(parts.join("\0")).digest("hex");
}

export function loginRateKey(ip: string, email: string, role: string): string {
  return digestKey(["login", ip, email, role]);
}

export function mutationRateKey(scope: BackofficeScope, action: string, ip: string): string {
  return digestKey([scope.userId ?? "", action, scope.role, scope.countryCode ?? "", ip]);
}

export async function consumeRateLimit(
  kind: RateLimitKind,
  keyParts: readonly string[]
): Promise<RateLimitResult> {
  const config = getServerConfig();
  const limit = kind === "login" ? config.loginRateLimit : config.mutationRateLimit;
  const windowSeconds = kind === "login" ? config.loginRateWindowSeconds : config.mutationRateWindowSeconds;
  const key = digestKey(keyParts);

  try {
    const result = await query<{ request_count: number; retry_after: number }>(
      `WITH bucket AS (
         SELECT to_timestamp(floor(extract(epoch FROM clock_timestamp()) / $3) * $3)
       )
       INSERT INTO rate_limit_buckets (key_hash, action, bucket_start, request_count, expires_at)
       SELECT $1, $2, bucket, 1, bucket + ($3 * interval '1 second') FROM bucket
       ON CONFLICT (key_hash, action, bucket_start)
       DO UPDATE SET request_count = rate_limit_buckets.request_count + 1
       RETURNING request_count,
         GREATEST(1, CEIL(extract(epoch FROM bucket_start + ($3 * interval '1 second') - clock_timestamp()))) AS retry_after`,
      [key, kind, windowSeconds]
    );
    const row = result.rows[0];
    const decision = isRateLimited(row.request_count, limit, windowSeconds);
    return {
      allowed: decision.allowed,
      retryAfterSeconds: Math.max(decision.retryAfterSeconds, row.retry_after)
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.error("Limitation de débit indisponible", { kind });
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
