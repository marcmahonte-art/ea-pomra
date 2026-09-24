import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { z } from "zod";
import type {
  ActivityEvent,
  BackofficeScope,
  Dossier,
  DossierDocument,
  DossierPage,
  DossierQuery,
  DossierState,
  GlobalFilters,
  ReportSnapshot,
  StoredReport,
  WorkflowStep
} from "@/lib/backoffice-types";
import { STATE_LABELS } from "@/lib/backoffice-types";
import { query, withTransaction } from "./db";
import { assertTransition, getWorkflowStep } from "./workflow";
import { type AllowedDocumentType, type OpaqueDocumentPayload } from "./document-storage";

const countryCodeSchema = z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD"]);
const dossierStateSchema = z.enum(["RECU", "EN_VERIFICATION", "INCOMPLET", "TRANSMIS_OCO", "AVIS_RECU", "A_VALIDER", "VALIDE", "EN_MOBILITE", "EN_SUIVI", "DIPLOME", "REJETE"]);
const workflowStepSchema = z.enum(["CANDIDATURE", "ORIENTATION", "MOBILITE", "SUIVI", "DIPLOME"]);
const documentStatusSchema = z.enum(["MANQUANT", "A_VERIFIER", "VALIDE", "REFUSE"]);

const dateValueSchema = z.union([z.date(), z.string().datetime({ offset: true })]);

const dossierRowSchema = z.object({
  id: z.string().uuid(),
  reference: z.string().min(1).max(100),
  student_name: z.string().min(1).max(200),
  student_initials: z.string().min(1).max(10),
  email: z.string().email().max(320),
  phone: z.string().min(1).max(50),
  country_code: countryCodeSchema,
  country_name: z.string().min(1).max(100),
  country_flag: z.string().min(1).max(20),
  antenna_city: z.string().min(1).max(100),
  program: z.string().min(1).max(200),
  formation: z.string().min(1).max(200),
  step: workflowStepSchema,
  state: dossierStateSchema,
  completeness: z.coerce.number().int().min(0).max(100),
  priority: z.enum(["HAUTE", "NORMALE", "BASSE"]),
  required_action: z.string().max(2000).nullable(),
  created_at: dateValueSchema,
  updated_at: dateValueSchema,
  version: z.coerce.number().int().positive(),
  overdue_task_count: z.coerce.number().int().nonnegative()
});

const documentRowSchema = z.object({
  id: z.string().uuid(),
  dossier_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  document_type: z.string().min(1).max(100),
  status: documentStatusSchema,
  added_at: dateValueSchema.nullable(),
  verified_by_name: z.string().nullable(),
  comment: z.string().nullable(),
  updated_at: dateValueSchema,
  has_file: z.boolean(),
  version: z.coerce.number().int().positive()
});

const activityRowSchema = z.object({
  id: z.string().uuid(),
  dossier_id: z.string().uuid().nullable(),
  occurred_at: dateValueSchema,
  reference: z.string().nullable(),
  student_name: z.string().nullable(),
  action: z.string().min(1).max(200),
  from_state: dossierStateSchema.nullable(),
  to_state: dossierStateSchema.nullable(),
  user_name: z.string(),
  user_role: z.string(),
  comment: z.string().nullable()
});

const reportSnapshotSchema = z.object({
  filters: z.object({
    country: z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD", "all"]).optional().default("all"),
    program: z.string().optional().default("all"),
    formation: z.string().optional().default("all")
  }).optional().default({ country: "all", program: "all", formation: "all" }),
  report: z.object({
    scopeLabel: z.string(),
    year: z.number().int(),
    quarter: z.number().int().min(1).max(4),
    periodLabel: z.string(),
    generatedAtLabel: z.string(),
    lines: z.array(z.object({ label: z.string(), value: z.number().int().nonnegative() })),
    statusDistribution: z.array(z.object({ label: z.string(), value: z.number().int().nonnegative(), key: z.string() })),
    programDistribution: z.array(z.object({ label: z.string(), value: z.number().int().nonnegative(), key: z.string() })),
    formationDistribution: z.array(z.object({ label: z.string(), value: z.number().int().nonnegative(), key: z.string() }))
  }),
  rows: z.array(z.object({
    reference: z.string(),
    studentName: z.string(),
    country: z.string(),
    program: z.string(),
    formation: z.string(),
    state: dossierStateSchema,
    completeness: z.number().int().min(0).max(100)
  }))
});

const reportRowSchema = z.object({
  id: z.string().uuid(),
  generated_at: dateValueSchema,
  snapshot: reportSnapshotSchema
});

const dossierSelect = `d.id, d.reference, d.student_name, d.student_initials, d.email, d.phone,
  d.country_code, d.country_name, d.country_flag, d.antenna_city, d.program, d.formation,
  d.step, d.state, d.completeness, d.priority, d.required_action, d.created_at, d.updated_at,
  d.version, (SELECT COUNT(*)::integer FROM tasks t WHERE t.dossier_id = d.id
    AND t.status IN ('OPEN', 'IN_PROGRESS') AND t.due_at < $1) AS overdue_task_count`;

type DossierRow = z.infer<typeof dossierRowSchema>;
type DocumentRow = z.infer<typeof documentRowSchema>;
type ActivityRow = z.infer<typeof activityRowSchema>;

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function label(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function assertRealScope(scope: BackofficeScope): void {
  if (scope.isDemo || !scope.userId || (scope.role === "ANTENNE" && !scope.countryCode)) {
    throw new Error("Opération PostgreSQL indisponible pour ce périmètre");
  }
}

function scopeCondition(scope: BackofficeScope, alias = "d", startIndex = 1): { sql: string; values: unknown[] } {
  return scope.role === "BEC"
    ? { sql: "TRUE", values: [] }
    : { sql: `${alias}.country_code = $${startIndex}`, values: [scope.countryCode] };
}

function mapDocument(row: DocumentRow): DossierDocument {
  return {
    id: row.id,
    name: row.name,
    type: row.document_type,
    status: row.status,
    addedAt: row.added_at ? label(row.added_at) : null,
    verifiedBy: row.verified_by_name,
    updatedAt: label(row.updated_at),
    comment: row.comment,
    hasFile: row.has_file,
    version: row.version
  };
}

function mapDossier(row: DossierRow, documents: DossierDocument[]): Dossier {
  return {
    id: row.id,
    reference: row.reference,
    studentName: row.student_name,
    studentInitials: row.student_initials,
    email: row.email,
    phone: row.phone,
    countryCode: row.country_code,
    country: row.country_name,
    flag: row.country_flag,
    antennaCity: row.antenna_city,
    program: row.program,
    formation: row.formation,
    step: row.step,
    state: row.state,
    completeness: row.completeness,
    createdAt: iso(row.created_at),
    createdAtLabel: label(row.created_at),
    updatedAt: iso(row.updated_at),
    updatedAtLabel: label(row.updated_at),
    version: row.version,
    priority: row.priority,
    requiredAction: row.required_action,
    documents,
    pap: null,
    orientation: null,
    mobilite: null,
    stss: null,
    overdueTaskCount: row.overdue_task_count
  };
}

async function attachDocuments(rows: DossierRow[]): Promise<Dossier[]> {
  if (rows.length === 0) return [];
  const result = await query(
     `SELECT doc.id, doc.dossier_id, doc.name, doc.document_type, doc.status, doc.added_at,
       doc.comment, doc.updated_at, doc.version, u.display_name AS verified_by_name,
       EXISTS(SELECT 1 FROM document_storage s WHERE s.document_id = doc.id AND s.ciphertext IS NOT NULL) AS has_file
     FROM documents doc
     LEFT JOIN users u ON u.id = doc.verified_by
     WHERE doc.dossier_id = ANY($1::uuid[])
     ORDER BY doc.name`,
    [rows.map((row) => row.id)]
  );
  const documentsByDossier = new Map<string, DossierDocument[]>();
  for (const value of result.rows) {
    const row = documentRowSchema.parse(value);
    const documents = documentsByDossier.get(row.dossier_id) ?? [];
    documents.push(mapDocument(row));
    documentsByDossier.set(row.dossier_id, documents);
  }
  return rows.map((row) => mapDossier(row, documentsByDossier.get(row.id) ?? []));
}

function parseDossierRow(value: unknown): DossierRow {
  return dossierRowSchema.parse({ ...(value as Record<string, unknown>), overdue_task_count: (value as { overdue_task_count: number }).overdue_task_count ?? 0 });
}

export async function listDossiersForScope(scope: BackofficeScope, limit = 5000): Promise<Dossier[]> {
  assertRealScope(scope);
  const boundedLimit = Math.max(1, Math.min(limit, 5000));
  const scopeFilter = scopeCondition(scope, "d", 2);
  const values = [new Date(), ...scopeFilter.values, boundedLimit];
  const result = await query(
    `SELECT ${dossierSelect} FROM dossiers d
     WHERE ${scopeFilter.sql}
     ORDER BY d.updated_at DESC
     LIMIT $${values.length}`,
    values
  );
  const rows = result.rows.map((row) => parseDossierRow(row));
  return attachDocuments(rows);
}

export async function getDossierForScope(scope: BackofficeScope, dossierId: string): Promise<Dossier | null> {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 3);
  const result = await query(
    `SELECT ${dossierSelect} FROM dossiers d
     WHERE d.id = $2 AND ${scopeFilter.sql}`,
    [new Date(), dossierId, ...scopeFilter.values]
  );
  const row = result.rows[0];
  if (!row) return null;
  return (await attachDocuments([parseDossierRow(row)]))[0] ?? null;
}

function quarterBounds(year: number, quarter: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, (quarter - 1) * 3, 1));
  return { start, end: new Date(Date.UTC(year, quarter * 3, 1)) };
}

export async function queryDossiersForScope(
  scope: BackofficeScope,
  queryInput: DossierQuery,
  referenceDate: Date
): Promise<DossierPage> {
  assertRealScope(scope);
  const values: unknown[] = [referenceDate];
  const conditions: string[] = [];
  const scopeFilter = scopeCondition(scope, "d", values.length + 1);
  values.push(...scopeFilter.values);
  conditions.push(scopeFilter.sql);
  if (queryInput.q) {
    values.push(`%${queryInput.q.trim()}%`);
    conditions.push(`(d.student_name ILIKE $${values.length} OR d.reference ILIKE $${values.length} OR d.email ILIKE $${values.length} OR d.phone ILIKE $${values.length})`);
  }
  if (queryInput.state !== "all") { values.push(queryInput.state); conditions.push(`d.state = $${values.length}`); }
  if (queryInput.program !== "all") { values.push(queryInput.program); conditions.push(`d.program = $${values.length}`); }
  if (queryInput.formation !== "all") { values.push(queryInput.formation); conditions.push(`d.formation = $${values.length}`); }
  if (queryInput.country !== "all" && scope.role === "BEC") { values.push(queryInput.country); conditions.push(`d.country_code = $${values.length}`); }
  if (queryInput.step !== "all") { values.push(queryInput.step); conditions.push(`d.step = $${values.length}`); }
  if (queryInput.completeness === "complete") conditions.push("d.completeness = 100");
  if (queryInput.completeness === "incomplete") conditions.push("d.completeness < 100");
  if (queryInput.date === "7d" || queryInput.date === "30d") {
    values.push(new Date(referenceDate.getTime() - (queryInput.date === "7d" ? 7 : 30) * 86_400_000));
    conditions.push(`d.created_at >= $${values.length}`);
  } else if (queryInput.date === "quarter") {
    const period = quarterBounds(referenceDate.getUTCFullYear(), Math.floor(referenceDate.getUTCMonth() / 3) + 1);
    values.push(period.start, period.end);
    conditions.push(`d.created_at >= $${values.length - 1} AND d.created_at < $${values.length}`);
  }
  const where = conditions.join(" AND ");
  const countResult = await query<{ count: number }>(`SELECT COUNT(*)::integer AS count FROM dossiers d WHERE ${where}`, values);
  const total = countResult.rows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / queryInput.pageSize));
  const page = Math.min(queryInput.page, totalPages);
  values.push(queryInput.pageSize, (page - 1) * queryInput.pageSize);
  const result = await query(
    `SELECT ${dossierSelect} FROM dossiers d WHERE ${where}
     ORDER BY d.updated_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  const rows = result.rows.map((row) => parseDossierRow(row));
  return { rows: await attachDocuments(rows), total, page, pageSize: queryInput.pageSize, totalPages };
}

export async function getPendingCount(scope: BackofficeScope): Promise<number> {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 1);
  const states = scope.role === "BEC" ? ["A_VALIDER"] : ["RECU", "EN_VERIFICATION", "INCOMPLET", "AVIS_RECU"];
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::integer AS count FROM dossiers d WHERE ${scopeFilter.sql} AND d.state = ANY($2::text[])`,
    [...scopeFilter.values, states]
  );
  return result.rows[0]?.count ?? 0;
}

function mapActivity(row: ActivityRow): ActivityEvent {
  return {
    id: row.id,
    dossierId: row.dossier_id ?? "",
    at: iso(row.occurred_at),
    atLabel: label(row.occurred_at),
    dossierRef: row.reference ?? "Système",
    studentName: row.student_name ?? "Système",
    action: row.action,
    fromState: row.from_state,
    toState: row.to_state,
    user: row.user_name,
    userRole: row.user_role,
    comment: row.comment
  };
}

export async function getActivityForScope(scope: BackofficeScope): Promise<ActivityEvent[]> {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 1);
  const result = await query(
    `SELECT a.id, a.dossier_id, a.occurred_at, d.reference, d.student_name, a.action,
      a.from_state, a.to_state, a.comment, COALESCE(u.display_name, 'Système') AS user_name,
      COALESCE(a.actor_role, 'SYSTEME') AS user_role
     FROM audit_events a LEFT JOIN dossiers d ON d.id = a.dossier_id
     LEFT JOIN users u ON u.id = a.actor_user_id
     WHERE ${scopeFilter.sql} ORDER BY a.occurred_at DESC LIMIT 5000`,
    scopeFilter.values
  );
  return result.rows.map((row) => mapActivity(activityRowSchema.parse(row)));
}

export async function getActivityForDossier(scope: BackofficeScope, dossierId: string): Promise<ActivityEvent[]> {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 2);
  const result = await query(
    `SELECT a.id, a.dossier_id, a.occurred_at, d.reference, d.student_name, a.action,
      a.from_state, a.to_state, a.comment, COALESCE(u.display_name, 'Système') AS user_name,
      COALESCE(a.actor_role, 'SYSTEME') AS user_role
     FROM audit_events a JOIN dossiers d ON d.id = a.dossier_id
     LEFT JOIN users u ON u.id = a.actor_user_id
     WHERE a.dossier_id = $1 AND ${scopeFilter.sql} ORDER BY a.occurred_at DESC`,
    [dossierId, ...scopeFilter.values]
  );
  return result.rows.map((row) => mapActivity(activityRowSchema.parse(row)));
}

async function findDossierForUpdate(client: PoolClient, scope: BackofficeScope, dossierId: string): Promise<DossierRow> {
  const scopeFilter = scopeCondition(scope, "d", 3);
  const result = await client.query(
    `SELECT ${dossierSelect} FROM dossiers d WHERE d.id = $2 AND ${scopeFilter.sql} FOR UPDATE`,
    [new Date(), dossierId, ...scopeFilter.values]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Dossier introuvable");
  return dossierRowSchema.parse(row);
}

export async function transitionDossier(
  scope: BackofficeScope,
  dossierId: string,
  toState: DossierState,
  expectedVersion: number,
  comment: string
): Promise<{ dossierId: string; state: DossierState; version: number }> {
  assertRealScope(scope);
  return withTransaction(async (client) => {
    const dossier = await findDossierForUpdate(client, scope, dossierId);
    if (dossier.version !== expectedVersion) throw new Error("Version du dossier obsolète");
    assertTransition(dossier.state, toState, scope.role, scope.permissions);
    const result = await client.query<{ version: number }>(
      `UPDATE dossiers SET state = $1, step = $2, version = version + 1, updated_at = now()
       WHERE id = $3 AND version = $4 RETURNING version`,
      [toState, getWorkflowStep(toState), dossierId, expectedVersion]
    );
    if (!result.rows[0]) throw new Error("Version du dossier obsolète");
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, from_state, to_state, comment, metadata)
       VALUES ($1, 'DOSSIER', $1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [dossierId, scope.userId, scope.role, "dossier.transition", dossier.state, toState, comment || null, JSON.stringify({ countryCode: scope.countryCode, antennaId: scope.antennaId })]
    );
    return { dossierId, state: toState, version: result.rows[0].version };
  });
}

export async function decideDocument(
  scope: BackofficeScope,
  dossierId: string,
  documentId: string,
  decision: "VALIDE" | "REFUSE" | "REQUIER_NOUVEAU",
  expectedVersion: number,
  comment: string
): Promise<{ dossierId: string; documentId: string; version: number }> {
  assertRealScope(scope);
  if (!scope.permissions.includes("documents.verify")) throw new Error("Permission refusée");
  if (decision === "REFUSE" && scope.role === "BEC" && !scope.permissions.includes("dossiers.reject")) throw new Error("Permission refusée");
  return withTransaction(async (client) => {
    const dossier = await findDossierForUpdate(client, scope, dossierId);
    if (dossier.version !== expectedVersion) throw new Error("Version du dossier obsolète");
    const documentResult = await client.query(
      `SELECT doc.id, doc.status, doc.comment,
        EXISTS(SELECT 1 FROM document_storage s WHERE s.document_id = doc.id AND s.ciphertext IS NOT NULL) AS has_file
       FROM documents doc WHERE doc.id = $2 AND doc.dossier_id = $1 FOR UPDATE OF doc`,
      [dossierId, documentId]
    );
    const value = documentResult.rows[0];
    if (!value) throw new Error("Document introuvable");
    const document = z.object({ id: z.string().uuid(), status: documentStatusSchema, comment: z.string().nullable(), has_file: z.boolean() }).parse(value);
    if (document.status !== "A_VERIFIER") throw new Error("Document déjà traité");
    if (decision === "REQUIER_NOUVEAU") {
      await client.query(
        `DELETE FROM document_storage WHERE document_id = $1`,
        [documentId]
      );
      await client.query(
        `UPDATE documents SET status = 'MANQUANT', verified_by = NULL, version = version + 1, updated_at = now()
         WHERE id = $1`,
        [documentId]
      );
    } else {
      if (!document.has_file) throw new Error("Fichier du document absent");
      await client.query(
        `UPDATE documents SET status = $1, comment = $2, verified_by = $3, version = version + 1, updated_at = now()
         WHERE id = $4`,
        [decision, comment || null, scope.userId, documentId]
      );
    }
    const status = decision === "REQUIER_NOUVEAU" ? "MANQUANT" : decision;
    const versionResult = await client.query<{ version: number }>(
      `UPDATE dossiers SET version = version + 1, updated_at = now() WHERE id = $1 AND version = $2 RETURNING version`,
      [dossierId, expectedVersion]
    );
    if (!versionResult.rows[0]) throw new Error("Version du dossier obsolète");
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, comment, metadata)
       VALUES ($1, 'DOCUMENT', $2, $3, $4, $5, $6, $7::jsonb)`,
      [dossierId, documentId, scope.userId, scope.role, "document.decision", comment || null, JSON.stringify({ documentId, fromStatus: document.status, toStatus: status, previousComment: document.comment, previousFilePresent: document.has_file, previousStorageDeleted: decision === "REQUIER_NOUVEAU" })]
    );
    return { dossierId, documentId, version: versionResult.rows[0].version };
  });
}

export async function uploadDocument(
  scope: BackofficeScope,
  input: { dossierId: string; documentId: string; expectedVersion: number; contentType: AllowedDocumentType; bytes: Buffer; encrypted: Omit<OpaqueDocumentPayload, "checksumSha256">; checksumSha256: string }
): Promise<{ documentId: string; dossierVersion: number; documentVersion: number }> {
  assertRealScope(scope);
  if (!scope.permissions.includes("documents.verify")) throw new Error("Permission refusée");
  return withTransaction(async (client) => {
    await findDossierForUpdate(client, scope, input.dossierId);
    const documentResult = await client.query<{ id: string; status: string; version: number }>(
      `SELECT id, status, version FROM documents
       WHERE id = $1 AND dossier_id = $2 FOR UPDATE`,
      [input.documentId, input.dossierId]
    );
    const document = documentResult.rows[0];
    if (!document) throw new Error("Document introuvable");
    if (document.version !== input.expectedVersion) throw new Error("Version du document obsolète");
    if (!["MANQUANT", "A_VERIFIER", "REFUSE"].includes(document.status)) throw new Error("Statut du document incompatible");
    const documentVersion = document.version + 1;
    await client.query(
      `UPDATE documents SET status = 'A_VERIFIER', added_at = now(), comment = NULL, verified_by = NULL,
        version = $2, updated_at = now() WHERE id = $1`,
      [input.documentId, documentVersion]
    );
    await client.query(
      `INSERT INTO document_storage (document_id, provider, object_key, content_type, byte_size, checksum_sha256, encrypted, ciphertext, initialization_vector, authentication_tag, aad_version)
       VALUES ($1, 'POSTGRES_AES_GCM', $2, $3, $4, $5, true, $6, $7, $8, $9)
       ON CONFLICT (document_id) DO UPDATE SET provider = EXCLUDED.provider, object_key = EXCLUDED.object_key,
         content_type = EXCLUDED.content_type, byte_size = EXCLUDED.byte_size, checksum_sha256 = EXCLUDED.checksum_sha256,
         encrypted = true, ciphertext = EXCLUDED.ciphertext, initialization_vector = EXCLUDED.initialization_vector,
         authentication_tag = EXCLUDED.authentication_tag, aad_version = EXCLUDED.aad_version, updated_at = now()`,
      [input.documentId, randomUUID(), input.contentType, input.bytes.length, input.checksumSha256, input.encrypted.ciphertext, input.encrypted.initializationVector, input.encrypted.authenticationTag, input.expectedVersion]
    );
    const versionResult = await client.query<{ version: number }>(
      `UPDATE dossiers SET version = version + 1, updated_at = now() WHERE id = $1 RETURNING version`,
      [input.dossierId]
    );
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, metadata)
       VALUES ($1, 'DOCUMENT', $2, $3, $4, 'document.upload', $5::jsonb)`,
      [input.dossierId, input.documentId, scope.userId, scope.role, JSON.stringify({ documentId: input.documentId, previousDocumentVersion: input.expectedVersion, documentVersion, contentType: input.contentType, byteSize: input.bytes.length, checksumSha256: input.checksumSha256 })]
    );
    return { documentId: input.documentId, dossierVersion: versionResult.rows[0].version, documentVersion };
  });
}

export async function getPrivateDocument(scope: BackofficeScope, documentId: string) {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 2);
  const result = await query(
    `SELECT doc.id, doc.version, doc.name, s.content_type, s.checksum_sha256, s.ciphertext, s.initialization_vector, s.authentication_tag, s.aad_version
     FROM documents doc JOIN dossiers d ON d.id = doc.dossier_id
     JOIN document_storage s ON s.document_id = doc.id
     WHERE doc.id = $1 AND ${scopeFilter.sql} AND s.ciphertext IS NOT NULL`,
    [documentId, ...scopeFilter.values]
  );
  const value = result.rows[0];
  if (!value) return null;
  const row = z.object({
    id: z.string().uuid(),
    version: z.coerce.number().int().positive(),
    name: z.string().min(1).max(200),
    content_type: z.string().min(1).max(100),
    checksum_sha256: z.string().regex(/^[0-9a-f]{64}$/),
    ciphertext: z.instanceof(Buffer),
    initialization_vector: z.instanceof(Buffer),
    authentication_tag: z.instanceof(Buffer),
    aad_version: z.coerce.number().int().min(0).default(0)
  }).parse(value);
  return row;
}

export async function logDocumentDownload(scope: BackofficeScope, documentId: string): Promise<void> {
  assertRealScope(scope);
  const scopeFilter = scopeCondition(scope, "d", 2);
  const result = await query<{ dossier_id: string }>(
    `SELECT doc.dossier_id FROM documents doc JOIN dossiers d ON d.id = doc.dossier_id WHERE doc.id = $1 AND ${scopeFilter.sql}`,
    [documentId, ...scopeFilter.values]
  );
  const dossier = result.rows[0];
  if (!dossier) throw new Error("Document introuvable");
  await query(
    `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, metadata)
     VALUES ($1, 'DOCUMENT', $2, $3, $4, 'document.download', '{}'::jsonb)`,
    [dossier.dossier_id, documentId, scope.userId, scope.role]
  );
}

function reportPeriod(year: number, quarter: number) {
  return quarterBounds(year, quarter);
}

function reportFilterKey(filters: GlobalFilters): string {
  return [filters.country ?? "all", filters.program ?? "all", filters.formation ?? "all"].join("|");
}

function distribution(values: readonly string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].map(([label, value]) => ({ label, value, key: label })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "fr"));
}

export async function generateReportSnapshot(
  scope: BackofficeScope,
  year: number,
  quarter: number,
  filters: GlobalFilters = {}
): Promise<{ id: string; generatedAt: string; snapshot: ReportSnapshot }> {
  assertRealScope(scope);
  if (!scope.permissions.includes("reports.generate")) throw new Error("Permission refusée");
  return withTransaction(async (client) => {
    const period = reportPeriod(year, quarter);
    const values: unknown[] = [period.start, period.end];
    const scopeFilter = scopeCondition(scope, "d", values.length + 1);
    values.push(...scopeFilter.values);
    const conditions = [`d.created_at >= $1`, `d.created_at < $2`, scopeFilter.sql];
    if (filters.country && filters.country !== "all") {
      values.push(filters.country);
      conditions.push(`d.country_code = $${values.length}`);
    }
    if (filters.program && filters.program !== "all") {
      values.push(filters.program);
      conditions.push(`d.program = $${values.length}`);
    }
    if (filters.formation && filters.formation !== "all") {
      values.push(filters.formation);
      conditions.push(`d.formation = $${values.length}`);
    }
    const result = await client.query(
      `SELECT d.reference, d.student_name, d.country_name, d.program, d.formation, d.state, d.completeness
       FROM dossiers d WHERE ${conditions.join(" AND ")} ORDER BY d.reference`,
      values
    );
    const rows = result.rows.map((row) => z.object({
      reference: z.string(), student_name: z.string(), country_name: z.string(), program: z.string(),
      formation: z.string(), state: dossierStateSchema, completeness: z.number().int().min(0).max(100)
    }).parse(row));
    const generatedAt = new Date();
    const snapshot: ReportSnapshot = {
      filters: {
        country: filters.country ?? "all",
        program: filters.program ?? "all",
        formation: filters.formation ?? "all"
      },
      report: {
        scopeLabel: scope.role === "BEC" ? "Rapport consolidé BEC — 8 pays" : `Rapport antenne — ${scope.country ?? "périmètre non défini"}`,
        year,
        quarter,
        periodLabel: `${quarter}e trimestre ${year}`,
        generatedAtLabel: label(generatedAt),
        lines: [
          { label: "Dossiers reçus", value: rows.length },
          { label: "Dossiers traités", value: rows.filter((row) => row.state !== "RECU").length },
          { label: "Dossiers en attente", value: rows.filter((row) => ["TRANSMIS_OCO", "A_VALIDER", "INCOMPLET"].includes(row.state)).length },
          { label: "Dossiers validés", value: rows.filter((row) => ["VALIDE", "EN_MOBILITE", "EN_SUIVI", "DIPLOME"].includes(row.state)).length }
        ],
        statusDistribution: distribution(rows.map((row) => STATE_LABELS[row.state])),
        programDistribution: distribution(rows.map((row) => row.program)),
        formationDistribution: distribution(rows.map((row) => row.formation))
      },
      rows: rows.map((row) => ({ reference: row.reference, studentName: row.student_name, country: row.country_name, program: row.program, formation: row.formation, state: row.state, completeness: row.completeness }))
    };
    const report = await client.query<{ id: string; generated_at: Date }>(
      `INSERT INTO reports (scope_user_id, scope_role, country_code, year, quarter, snapshot, filter_key)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
       ON CONFLICT (scope_user_id, scope_role, scope_key, year, quarter, filter_key)
       DO UPDATE SET snapshot = EXCLUDED.snapshot, generated_at = now()
       RETURNING id, generated_at`,
      [scope.userId, scope.role, scope.countryCode, year, quarter, JSON.stringify(snapshot), reportFilterKey(snapshot.filters)]
    );
    const row = report.rows[0];
    await client.query(
      `INSERT INTO audit_events (resource_type, resource_id, actor_user_id, actor_role, action, metadata)
       VALUES ('REPORT', $1, $2, $3, 'report.generate', $4::jsonb)`,
      [row.id, scope.userId, scope.role, JSON.stringify({ year, quarter, countryCode: scope.countryCode, filters })]
    );
    return { id: row.id, generatedAt: iso(row.generated_at), snapshot };
  }, "REPEATABLE READ");
}

export async function getStoredReport(
  scope: BackofficeScope,
  year: number,
  quarter: number,
  filters: GlobalFilters = {}
): Promise<StoredReport | null> {
  assertRealScope(scope);
  const expected = {
    country: filters.country ?? "all",
    program: filters.program ?? "all",
    formation: filters.formation ?? "all"
  };
  const result = await query(
    `SELECT id, generated_at, snapshot FROM reports
     WHERE scope_role = $1 AND country_code IS NOT DISTINCT FROM $2 AND year = $3 AND quarter = $4
       AND filter_key = $5
     ORDER BY generated_at DESC LIMIT 20`,
    [scope.role, scope.countryCode, year, quarter, reportFilterKey(expected)]
  );
  for (const value of result.rows) {
    const parsed = reportRowSchema.parse(value);
    if (JSON.stringify(parsed.snapshot.filters) === JSON.stringify(expected)) {
      return { id: parsed.id, generatedAt: iso(parsed.generated_at), generatedAtLabel: label(parsed.generated_at), snapshot: parsed.snapshot };
    }
  }
  return null;
}

export async function getReportForDownload(scope: BackofficeScope, reportId: string): Promise<StoredReport | null> {
  assertRealScope(scope);
  const result = await query(
    `SELECT id, generated_at, snapshot FROM reports
     WHERE id = $1 AND scope_role = $2 AND country_code IS NOT DISTINCT FROM $3`,
    [reportId, scope.role, scope.countryCode]
  );
  const row = result.rows[0];
  if (!row) return null;
  const parsed = reportRowSchema.parse(row);
  return { id: parsed.id, generatedAt: iso(parsed.generated_at), generatedAtLabel: label(parsed.generated_at), snapshot: parsed.snapshot };
}

export async function logReportDownload(scope: BackofficeScope, reportId: string): Promise<void> {
  assertRealScope(scope);
  await query(
    `INSERT INTO audit_events (resource_type, resource_id, actor_user_id, actor_role, action, metadata)
     SELECT 'REPORT', id, $2, $3, 'report.download', jsonb_build_object('year', year, 'quarter', quarter)
     FROM reports WHERE id = $1 AND scope_role = $4 AND country_code IS NOT DISTINCT FROM $5`,
    [reportId, scope.userId, scope.role, scope.role, scope.countryCode]
  );
}

export type { WorkflowStep };
