import { z } from "zod";

const positiveInteger = z.coerce.number().int().positive();
const trustedProxyHeader = z.string().trim().toLowerCase().pipe(z.string().regex(/^[a-z0-9-]+$/));

const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  BACKOFFICE_SESSION_SECRET: z.string().min(32),
  BACKOFFICE_DOCUMENT_ENCRYPTION_KEY: z.string().min(32),
  BACKOFFICE_ALLOW_DEMO: z.enum(["true", "false"]).default("false"),
  BACKOFFICE_TRUSTED_PROXY_HEADERS: z
    .string()
    .default("")
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean).map((item) => trustedProxyHeader.parse(item))),
  BACKOFFICE_LOGIN_RATE_LIMIT: positiveInteger.default(5),
  BACKOFFICE_LOGIN_RATE_WINDOW_SECONDS: positiveInteger.default(900),
  BACKOFFICE_MUTATION_RATE_LIMIT: positiveInteger.default(30),
  BACKOFFICE_MUTATION_RATE_WINDOW_SECONDS: positiveInteger.default(60),
  BACKOFFICE_DOCUMENT_MAX_BYTES: positiveInteger.max(15 * 1024 * 1024).default(10 * 1024 * 1024),
  BACKOFFICE_DB_POOL_MAX: positiveInteger.default(10),
  BACKOFFICE_DB_IDLE_TIMEOUT_MS: positiveInteger.default(30_000),
  BACKOFFICE_DB_CONNECTION_TIMEOUT_MS: positiveInteger.default(5_000),
  BACKOFFICE_DB_QUERY_TIMEOUT_MS: positiveInteger.default(15_000),
  BACKOFFICE_DB_STATEMENT_TIMEOUT_MS: positiveInteger.default(15_000),
  BACKOFFICE_DB_LOCK_TIMEOUT_MS: positiveInteger.default(5_000)
});

export type ServerConfig = {
  databaseUrl: string;
  sessionSecret: string;
  documentEncryptionKey: string;
  allowDemo: boolean;
  trustedProxyHeaders: string[];
  loginRateLimit: number;
  loginRateWindowSeconds: number;
  mutationRateLimit: number;
  mutationRateWindowSeconds: number;
  documentMaxBytes: number;
  dbPoolMax: number;
  dbIdleTimeoutMs: number;
  dbConnectionTimeoutMs: number;
  dbQueryTimeoutMs: number;
  dbStatementTimeoutMs: number;
  dbLockTimeoutMs: number;
};

let cachedConfig: ServerConfig | null = null;

export function isDemoEnabled(): boolean {
  if (process.env.VERCEL_ENV === "preview") return process.env.BACKOFFICE_ALLOW_DEMO !== "false";
  if (process.env.VERCEL_ENV === "production") return process.env.PUBLIC_DEMO_MODE === "true" && process.env.BACKOFFICE_ALLOW_DEMO === "true";
  return process.env.NODE_ENV === "development" && process.env.BACKOFFICE_ALLOW_DEMO === "true";
}

export function getServerConfig(): ServerConfig {
  if (cachedConfig) return cachedConfig;

  const parsed = environmentSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    BACKOFFICE_SESSION_SECRET: process.env.BACKOFFICE_SESSION_SECRET,
    BACKOFFICE_DOCUMENT_ENCRYPTION_KEY: process.env.BACKOFFICE_DOCUMENT_ENCRYPTION_KEY,
    BACKOFFICE_ALLOW_DEMO: process.env.BACKOFFICE_ALLOW_DEMO ?? "false",
    BACKOFFICE_TRUSTED_PROXY_HEADERS: process.env.BACKOFFICE_TRUSTED_PROXY_HEADERS ?? "",
    BACKOFFICE_LOGIN_RATE_LIMIT: process.env.BACKOFFICE_LOGIN_RATE_LIMIT,
    BACKOFFICE_LOGIN_RATE_WINDOW_SECONDS: process.env.BACKOFFICE_LOGIN_RATE_WINDOW_SECONDS,
    BACKOFFICE_MUTATION_RATE_LIMIT: process.env.BACKOFFICE_MUTATION_RATE_LIMIT,
    BACKOFFICE_MUTATION_RATE_WINDOW_SECONDS: process.env.BACKOFFICE_MUTATION_RATE_WINDOW_SECONDS,
    BACKOFFICE_DOCUMENT_MAX_BYTES: process.env.BACKOFFICE_DOCUMENT_MAX_BYTES,
    BACKOFFICE_DB_POOL_MAX: process.env.BACKOFFICE_DB_POOL_MAX,
    BACKOFFICE_DB_IDLE_TIMEOUT_MS: process.env.BACKOFFICE_DB_IDLE_TIMEOUT_MS,
    BACKOFFICE_DB_CONNECTION_TIMEOUT_MS: process.env.BACKOFFICE_DB_CONNECTION_TIMEOUT_MS,
    BACKOFFICE_DB_QUERY_TIMEOUT_MS: process.env.BACKOFFICE_DB_QUERY_TIMEOUT_MS,
    BACKOFFICE_DB_STATEMENT_TIMEOUT_MS: process.env.BACKOFFICE_DB_STATEMENT_TIMEOUT_MS,
    BACKOFFICE_DB_LOCK_TIMEOUT_MS: process.env.BACKOFFICE_DB_LOCK_TIMEOUT_MS
  });

  if (!parsed.success) {
    throw new Error("Configuration serveur back-office invalide");
  }

  const allowDemo = parsed.data.BACKOFFICE_ALLOW_DEMO === "true";
  if (allowDemo && process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview" && !(process.env.VERCEL_ENV === "production" && process.env.PUBLIC_DEMO_MODE === "true")) {
    throw new Error("La démonstration back-office est interdite hors développement, aperçu Vercel et mode démo public explicite");
  }

  cachedConfig = {
    databaseUrl: parsed.data.DATABASE_URL,
    sessionSecret: parsed.data.BACKOFFICE_SESSION_SECRET,
    documentEncryptionKey: parsed.data.BACKOFFICE_DOCUMENT_ENCRYPTION_KEY,
    allowDemo,
    trustedProxyHeaders: parsed.data.BACKOFFICE_TRUSTED_PROXY_HEADERS,
    loginRateLimit: parsed.data.BACKOFFICE_LOGIN_RATE_LIMIT,
    loginRateWindowSeconds: parsed.data.BACKOFFICE_LOGIN_RATE_WINDOW_SECONDS,
    mutationRateLimit: parsed.data.BACKOFFICE_MUTATION_RATE_LIMIT,
    mutationRateWindowSeconds: parsed.data.BACKOFFICE_MUTATION_RATE_WINDOW_SECONDS,
    documentMaxBytes: parsed.data.BACKOFFICE_DOCUMENT_MAX_BYTES,
    dbPoolMax: parsed.data.BACKOFFICE_DB_POOL_MAX,
    dbIdleTimeoutMs: parsed.data.BACKOFFICE_DB_IDLE_TIMEOUT_MS,
    dbConnectionTimeoutMs: parsed.data.BACKOFFICE_DB_CONNECTION_TIMEOUT_MS,
    dbQueryTimeoutMs: parsed.data.BACKOFFICE_DB_QUERY_TIMEOUT_MS,
    dbStatementTimeoutMs: parsed.data.BACKOFFICE_DB_STATEMENT_TIMEOUT_MS,
    dbLockTimeoutMs: parsed.data.BACKOFFICE_DB_LOCK_TIMEOUT_MS
  };

  return cachedConfig;
}

export function resetServerConfigForTests(): void {
  cachedConfig = null;
}
