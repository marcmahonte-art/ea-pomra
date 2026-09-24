import { getServerConfig, isDemoEnabled } from "./server/config";
import {
  createOpaqueToken,
  hashOpaqueToken,
  isOpaqueToken
} from "./server/session-token";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { BackofficeRole, BackofficeScope, Permission } from "./backoffice-types";
import { query } from "./server/db";
import { z } from "zod";

export const BACKOFFICE_SESSION_COOKIE = "eap_backoffice_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const SESSION_DUMMY_HASH = "$2b$12$c3yma.eUPDkKYBBQzrS3jOipRdCfHb.OzMLZaN/Nxbh8VVZ1.ONwu";

const ROLE_PERMISSIONS: Record<BackofficeRole, Permission[]> = {
  ANTENNE: [
    "dossiers.read",
    "dossiers.update",
    "dossiers.assign",
    "dossiers.transmit",
    "documents.read",
    "documents.verify",
    "reports.read",
    "reports.generate",
    "history.read",
    "activity.read",
    "exports.run"
  ],
  BEC: [
    "dossiers.read",
    "dossiers.validate",
    "dossiers.reject",
    "documents.read",
    "reports.read",
    "reports.generate",
    "statistics.read",
    "history.read",
    "activity.read",
    "exports.run"
  ]
};

const DEMO_SCOPES: Record<BackofficeRole, BackofficeScope> = {
  ANTENNE: {
    userId: null,
    antennaId: "demo-antenne-senegal",
    role: "ANTENNE",
    countryCode: "SN",
    country: "Sénégal",
    flag: "🇸🇳",
    antennaCity: "Dakar",
    userName: "Mme Aïssatou Diallo",
    userTitle: "Coordonnatrice — Antenne Sénégal",
    permissions: ROLE_PERMISSIONS.ANTENNE,
    isDemo: true
  },
  BEC: {
    userId: null,
    antennaId: null,
    role: "BEC",
    countryCode: null,
    country: null,
    flag: null,
    antennaCity: null,
    userName: "M. Marc Mahonte",
    userTitle: "Bureau Exécutif Central — vue consolidée",
    permissions: ROLE_PERMISSIONS.BEC,
    isDemo: true
  }
};

const sessionRowSchema = z.object({
  user_id: z.string().uuid(),
  display_name: z.string().min(1).max(200),
  user_title: z.string().max(200),
  role: z.enum(["ANTENNE", "BEC"]),
  country_code: z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD"]).nullable(),
  country_name: z.string().nullable(),
  country_flag: z.string().nullable(),
  antenna_id: z.string().nullable(),
  antenna_city: z.string().nullable()
});

type SessionRow = z.infer<typeof sessionRowSchema>;

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

function sessionScope(row: SessionRow): BackofficeScope {
  return {
    userId: row.user_id,
    antennaId: row.antenna_id,
    role: row.role,
    countryCode: row.role === "BEC" ? null : row.country_code,
    country: row.role === "BEC" ? null : row.country_name,
    flag: row.role === "BEC" ? null : row.country_flag,
    antennaCity: row.role === "BEC" ? null : row.antenna_city,
    userName: row.display_name,
    userTitle: row.user_title,
    permissions: ROLE_PERMISSIONS[row.role],
    isDemo: false
  };
}

async function resolveSession(role?: BackofficeRole): Promise<BackofficeScope | null> {
  const store = await cookies();
  const raw = store.get(BACKOFFICE_SESSION_COOKIE)?.value;
  if (!raw) return null;
  if (!isOpaqueToken(raw)) return null;

  const result = await query<SessionRow>(
    `SELECT u.id AS user_id, u.display_name, u.user_title, s.role,
      us.country_code, us.country_name, us.country_flag, us.antenna_id, us.antenna_city
     FROM sessions s
     JOIN users u ON u.id = s.user_id AND u.active = true
     JOIN user_roles ur ON ur.user_id = u.id AND ur.role = s.role
     JOIN user_scopes us ON us.user_id = ur.user_id AND us.role = ur.role
     WHERE s.token_hash = $1
       AND s.revoked_at IS NULL
       AND s.expires_at > now()
       AND ($2::text IS NULL OR s.role = $2)`,
    [hashOpaqueToken(raw, getServerConfig().sessionSecret), role ?? null]
  );
  const row = result.rows[0];
  return row ? sessionScope(sessionRowSchema.parse(row)) : null;
}

export function hasPermission(scope: BackofficeScope, permission: Permission): boolean {
  return scope.permissions.includes(permission);
}

export async function getBackofficeScope(role: BackofficeRole): Promise<BackofficeScope> {
  const scope = await resolveSession(role);
  if (scope) return scope;
  if (isDemoEnabled()) return DEMO_SCOPES[role];
  redirect(`/backoffice/login?role=${role}`);
}

export async function getAuthenticatedScope(role?: BackofficeRole): Promise<BackofficeScope> {
  const scope = await resolveSession(role);
  if (scope) return scope;
  if (isDemoEnabled() && role) return DEMO_SCOPES[role];
  redirect(`/backoffice/login${role ? `?role=${role}` : ""}`);
}

export async function requireBackofficeScope(
  role: BackofficeRole,
  permission?: Permission
): Promise<BackofficeScope> {
  const scope = await getBackofficeScope(role);
  if (scope.role !== role) notFound();
  if (permission && !hasPermission(scope, permission)) notFound();
  return scope;
}

export async function authenticateBackofficeUser(
  email: string,
  password: string,
  role: BackofficeRole
): Promise<{ userId: string; role: BackofficeRole } | null> {
  const result = await query<{ id: string; password_hash: string; role: BackofficeRole }>(
    `SELECT u.id, u.password_hash, ur.role
     FROM users u
     JOIN user_roles ur ON ur.user_id = u.id
     WHERE lower(u.email) = $1 AND u.active = true AND ur.role = $2
     LIMIT 1`,
    [email, role]
  );
  const userValue = result.rows[0];
  const user = userValue
    ? z.object({ id: z.string().uuid(), password_hash: z.string().min(20), role: z.enum(["ANTENNE", "BEC"]) }).parse(userValue)
    : null;
  if (!user) {
    await bcrypt.compare(password, SESSION_DUMMY_HASH);
    return null;
  }
  if (bcrypt.getRounds(user.password_hash) < 12) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  return valid ? { userId: user.id, role: user.role } : null;
}

export async function createBackofficeSession(
  userId: string,
  role: BackofficeRole,
  userAgent?: string
): Promise<void> {
  const config = getServerConfig();
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const result = await query<{ id: string }>(
    `INSERT INTO sessions (user_id, role, token_hash, expires_at, user_agent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [userId, role, hashOpaqueToken(token, config.sessionSecret), expiresAt, userAgent ?? null]
  );
  const sessionId = result.rows[0].id;
  await query(
    `INSERT INTO audit_events (resource_type, resource_id, actor_user_id, actor_role, action, metadata)
     VALUES ('SESSION', $1, $2, $3, 'auth.login', '{}'::jsonb)`,
    [sessionId, userId, role]
  );
  const store = await cookies();
  store.set(BACKOFFICE_SESSION_COOKIE, token, {
    ...sessionCookieOptions(),
    expires: expiresAt
  });
}

export async function destroyBackofficeSession(userAgent?: string): Promise<void> {
  const store = await cookies();
  const raw = store.get(BACKOFFICE_SESSION_COOKIE)?.value;
  if (raw) {
    const config = getServerConfig();
    const result = await query<{ id: string; user_id: string; role: BackofficeRole }>(
      `UPDATE sessions
       SET revoked_at = now(), user_agent = COALESCE($2, user_agent)
       WHERE token_hash = $1 AND revoked_at IS NULL
       RETURNING id, user_id, role`,
      [hashOpaqueToken(raw, config.sessionSecret), userAgent ?? null]
    );
    const session = result.rows[0];
    if (session) {
      await query(
        `INSERT INTO audit_events (resource_type, resource_id, actor_user_id, actor_role, action, metadata)
         VALUES ('SESSION', $1, $2, $3, 'auth.logout', '{}'::jsonb)`,
        [session.id, session.user_id, session.role]
      );
    }
  }
  store.delete(BACKOFFICE_SESSION_COOKIE);
}
