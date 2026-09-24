import type { PoolClient } from "pg";
import { z } from "zod";
import type {
  BackofficeScope,
  DossierDocument,
  OcoAssignment,
  OcoDossier,
  OcoReview,
  OcoVerdict
} from "@/lib/backoffice-types";
import { query, withTransaction } from "./db";
import { assertTransition, getWorkflowStep } from "./workflow";
import { canFinalizeOcoReview, canWriteOcoReview } from "./oco-workflow";
import { PAP_RESOURCE_TYPE_FILTER_SQL } from "./audit-filters";

const dossierStateSchema = z.enum(["RECU", "EN_VERIFICATION", "INCOMPLET", "TRANSMIS_OCO", "AVIS_RECU", "A_VALIDER", "VALIDE", "EN_MOBILITE", "EN_SUIVI", "DIPLOME", "REJETE"]);
const dateValueSchema = z.union([z.date(), z.string().datetime({ offset: true })]);
const dossierRowSchema = z.object({
  id: z.string().uuid(),
  reference: z.string(),
  student_name: z.string(),
  student_initials: z.string(),
  country_code: z.enum(["SN", "CI", "CM", "GA", "BJ", "TG", "CG", "CD"]),
  country_name: z.string(),
  country_flag: z.string(),
  antenna_city: z.string(),
  program: z.string(),
  formation: z.string(),
  state: dossierStateSchema,
  step: z.enum(["CANDIDATURE", "ORIENTATION", "MOBILITE", "SUIVI", "DIPLOME"]),
  completeness: z.coerce.number().int().min(0).max(100),
  priority: z.enum(["HAUTE", "NORMALE", "BASSE"]),
  required_action: z.string().nullable(),
  created_at: dateValueSchema,
  updated_at: dateValueSchema,
  version: z.coerce.number().int().positive(),
  assignment_id: z.string().uuid(),
  assignment_expert_user_id: z.string().uuid(),
  assignment_at: dateValueSchema,
  assignment_active: z.boolean(),
  review_id: z.string().uuid().nullable(),
  review_verdict: z.enum(["FAVORABLE", "SOUS_RESERVE", "DEFAVORABLE"]).nullable(),
  review_orientation: z.string().nullable(),
  review_analysis: z.string().nullable(),
  review_observations: z.string().nullable(),
  review_reserves: z.string().nullable(),
  review_status: z.enum(["DRAFT", "FINALIZED"]).nullable(),
  review_expert_user_id: z.string().uuid().nullable(),
  review_version: z.coerce.number().int().positive().nullable(),
  review_created_at: dateValueSchema.nullable(),
  review_updated_at: dateValueSchema.nullable(),
  review_finalized_at: dateValueSchema.nullable(),
  review_expert_name: z.string().nullable()
});
const documentRowSchema = z.object({
  id: z.string().uuid(),
  dossier_id: z.string().uuid(),
  name: z.string(),
  document_type: z.string(),
  status: z.enum(["MANQUANT", "A_VERIFIER", "VALIDE", "REFUSE"]),
  added_at: dateValueSchema.nullable(),
  verified_by_name: z.string().nullable(),
  comment: z.string().nullable(),
  updated_at: dateValueSchema,
  version: z.coerce.number().int().positive(),
  has_file: z.boolean()
});

function assertOcoScope(scope: BackofficeScope, permission: "oco.read" | "oco.reviews.read" | "oco.reviews.write" | "oco.reviews.finalize" | "history.read"): void {
  if (scope.isDemo || !scope.userId || scope.role !== "EXPERT_OCO" || !scope.permissions.includes(permission)) {
    throw new Error("Opération OCO refusée");
  }
}

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function label(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function mapReview(row: z.infer<typeof dossierRowSchema>): OcoReview | null {
  if (!row.review_id || !row.review_status || !row.review_version || !row.review_created_at || !row.review_updated_at) return null;
  return {
    id: row.review_id,
    dossierId: row.id,
    verdict: row.review_verdict,
    orientation: row.review_orientation,
    analysis: row.review_analysis ?? "",
    observations: row.review_observations ?? "",
    reserves: row.review_reserves ?? "",
    status: row.review_status,
    version: row.review_version,
    createdAt: iso(row.review_created_at),
    updatedAt: iso(row.review_updated_at),
    finalizedAt: row.review_finalized_at ? iso(row.review_finalized_at) : null,
    expertName: row.review_expert_name
  };
}

function mapDocument(row: z.infer<typeof documentRowSchema>): DossierDocument {
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

async function attachDocuments(rows: Array<z.infer<typeof dossierRowSchema>>): Promise<OcoDossier[]> {
  if (rows.length === 0) return [];
  const result = await query(
    `SELECT doc.id, doc.dossier_id, doc.name, doc.document_type, doc.status, doc.added_at,
      doc.comment, doc.updated_at, doc.version, u.display_name AS verified_by_name,
      EXISTS(SELECT 1 FROM document_storage s WHERE s.document_id = doc.id AND s.ciphertext IS NOT NULL) AS has_file
     FROM documents doc LEFT JOIN users u ON u.id = doc.verified_by
     WHERE doc.dossier_id = ANY($1::uuid[]) ORDER BY doc.name`,
    [rows.map((row) => row.id)]
  );
  const documents = new Map<string, DossierDocument[]>();
  for (const value of result.rows) {
    const row = documentRowSchema.parse(value);
    const values = documents.get(row.dossier_id) ?? [];
    values.push(mapDocument(row));
    documents.set(row.dossier_id, values);
  }
  return rows.map((row) => {
    const assignment: OcoAssignment = {
      id: row.assignment_id,
      dossierId: row.id,
      expertUserId: row.assignment_expert_user_id,
      assignedAt: iso(row.assignment_at),
      active: row.assignment_active
    };
    return {
      id: row.id,
      reference: row.reference,
      studentName: row.student_name,
      studentInitials: row.student_initials,
      countryCode: row.country_code,
      country: row.country_name,
      flag: row.country_flag,
      antennaCity: row.antenna_city,
      program: row.program,
      formation: row.formation,
      state: row.state,
      step: row.step,
      completeness: row.completeness,
      priority: row.priority,
      requiredAction: row.required_action,
      createdAt: iso(row.created_at),
      createdAtLabel: label(row.created_at),
      updatedAt: iso(row.updated_at),
      updatedAtLabel: label(row.updated_at),
      version: row.version,
      documents: documents.get(row.id) ?? [],
      review: mapReview(row),
      assignment
    };
  });
}

const dossierSelect = `d.id, d.reference, d.student_name, d.student_initials, d.country_code,
  d.country_name, d.country_flag, d.antenna_city, d.program, d.formation, d.state, d.step,
  d.completeness, d.priority, d.required_action, d.created_at, d.updated_at, d.version,
  a.id AS assignment_id, a.expert_user_id AS assignment_expert_user_id, a.assigned_at AS assignment_at, a.active AS assignment_active,
  r.id AS review_id, r.verdict AS review_verdict, r.orientation AS review_orientation,
  r.analysis AS review_analysis, r.observations AS review_observations, r.reserves AS review_reserves,
  r.status AS review_status, r.expert_user_id AS review_expert_user_id, r.version AS review_version, r.created_at AS review_created_at,
  r.updated_at AS review_updated_at, r.finalized_at AS review_finalized_at,
  u.display_name AS review_expert_name`;

export async function listOcoDossiers(scope: BackofficeScope, limit = 50, offset = 0): Promise<OcoDossier[]> {
  assertOcoScope(scope, "oco.read");
  const result = await query(
    `SELECT ${dossierSelect} FROM dossiers d
     JOIN oco_assignments a ON a.dossier_id = d.id AND a.expert_user_id = $1 AND a.active
     LEFT JOIN LATERAL (
       SELECT review.* FROM oco_reviews review
       WHERE review.dossier_id = d.id AND review.expert_user_id = $1
       ORDER BY review.updated_at DESC, review.created_at DESC LIMIT 1
     ) r ON true
     LEFT JOIN users u ON u.id = r.expert_user_id
     ORDER BY CASE WHEN d.state = 'TRANSMIS_OCO' THEN 0 ELSE 1 END, d.updated_at DESC LIMIT $2 OFFSET $3`,
    [scope.userId, Math.max(1, Math.min(limit, 100)), Math.max(0, offset)]
  );
  return attachDocuments(result.rows.map((row) => dossierRowSchema.parse(row)));
}

export async function listOcoDossiersPage(scope: BackofficeScope, page: number, pageSize: number): Promise<{ rows: OcoDossier[]; total: number; page: number; totalPages: number }> {
  assertOcoScope(scope, "oco.read");
  const boundedPageSize = Math.max(1, Math.min(pageSize, 100));
  const count = await query<{ count: number }>(
    `SELECT COUNT(*)::integer AS count FROM dossiers d
     JOIN oco_assignments a ON a.dossier_id = d.id AND a.expert_user_id = $1 AND a.active`,
    [scope.userId]
  );
  const total = count.rows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / boundedPageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const rows = await listOcoDossiers(scope, boundedPageSize, (currentPage - 1) * boundedPageSize);
  return { rows, total, page: currentPage, totalPages };
}

export async function getOcoDossier(scope: BackofficeScope, dossierId: string): Promise<OcoDossier | null> {
  assertOcoScope(scope, "oco.read");
  const result = await query(
    `SELECT ${dossierSelect} FROM dossiers d
     JOIN oco_assignments a ON a.dossier_id = d.id AND a.expert_user_id = $1 AND a.active
     LEFT JOIN LATERAL (
       SELECT review.* FROM oco_reviews review
       WHERE review.dossier_id = d.id AND review.expert_user_id = $1
       ORDER BY review.updated_at DESC, review.created_at DESC LIMIT 1
     ) r ON true
     LEFT JOIN users u ON u.id = r.expert_user_id
     WHERE d.id = $2`,
    [scope.userId, dossierId]
  );
  const row = result.rows[0];
  return row ? (await attachDocuments([dossierRowSchema.parse(row)]))[0] ?? null : null;
}

export async function getOcoReview(scope: BackofficeScope, dossierId: string): Promise<OcoReview | null> {
  const dossier = await getOcoDossier(scope, dossierId);
  return dossier?.review ?? null;
}

function assertFinalReview(input: { verdict: OcoVerdict | null; orientation: string; analysis: string; observations: string; reserves: string }): void {
  if (!input.verdict || input.analysis.length < 10 || input.observations.length < 10) throw new Error("Avis OCO incomplet");
  if ((input.verdict === "FAVORABLE" || input.verdict === "SOUS_RESERVE") && !input.orientation) throw new Error("Orientation obligatoire");
  if ((input.verdict === "SOUS_RESERVE" || input.verdict === "DEFAVORABLE") && !input.reserves) throw new Error("Réserves obligatoires");
}

async function findAssignedDossierForUpdate(client: PoolClient, scope: BackofficeScope, dossierId: string) {
  const result = await client.query(
    `SELECT ${dossierSelect} FROM dossiers d
     JOIN oco_assignments a ON a.dossier_id = d.id AND a.expert_user_id = $1 AND a.active
     LEFT JOIN LATERAL (
       SELECT review.* FROM oco_reviews review
       WHERE review.dossier_id = d.id AND review.expert_user_id = $1
       ORDER BY review.updated_at DESC, review.created_at DESC LIMIT 1
     ) r ON true
     LEFT JOIN users u ON u.id = r.expert_user_id
     WHERE d.id = $2 FOR UPDATE OF d, a`,
    [scope.userId, dossierId]
  );
  const row = result.rows[0];
  if (!row) throw new Error("Dossier introuvable");
  const dossier = dossierRowSchema.parse(row);
  if (dossier.review_expert_user_id && dossier.review_expert_user_id !== scope.userId) {
    throw new Error("Avis OCO appartenant à un autre expert");
  }
  if (dossier.review_id) {
    const lockedReview = await client.query(
      `SELECT id FROM oco_reviews WHERE id = $1 AND dossier_id = $2 FOR UPDATE`,
      [dossier.review_id, dossierId]
    );
    if (!lockedReview.rows[0]) throw new Error("Avis OCO introuvable");
  }
  return dossier;
}

export async function saveOcoReview(
  scope: BackofficeScope,
  input: { dossierId: string; version: number; verdict: OcoVerdict | null; orientation: string; analysis: string; observations: string; reserves: string; finalize: boolean }
): Promise<{ dossierVersion: number; review: OcoReview | null }> {
  assertOcoScope(scope, input.finalize ? "oco.reviews.finalize" : "oco.reviews.write");
  if (input.finalize) assertFinalReview(input);
  return withTransaction(async (client) => {
    const dossier = await findAssignedDossierForUpdate(client, scope, input.dossierId);
    if (dossier.state !== "TRANSMIS_OCO") throw new Error("Dossier non disponible pour avis OCO");
    const currentReview = dossier.review_id && dossier.review_version && dossier.review_status
      ? { version: dossier.review_version, status: dossier.review_status }
      : null;
    const allowed = input.finalize
      ? canFinalizeOcoReview({ role: scope.role, permissions: scope.permissions, assigned: true, dossierState: dossier.state, reviewStatus: currentReview?.status ?? null })
      : canWriteOcoReview({ role: scope.role, permissions: scope.permissions, assigned: true, dossierState: dossier.state, reviewStatus: currentReview?.status ?? null });
    if (!allowed) throw new Error(input.finalize ? "Finalisation OCO non autorisée" : "Avis OCO non modifiable");
    if (currentReview && currentReview.version !== input.version) throw new Error("Version de l'avis obsolète");
    if (!currentReview && input.version !== dossier.version) throw new Error("Version du dossier obsolète");
    let reviewId: string;
    if (currentReview) {
      const updated = await client.query(
        `UPDATE oco_reviews SET verdict = $1, orientation = NULLIF($2, ''), analysis = $3,
          observations = $4, reserves = $5, status = CASE WHEN $6::boolean THEN 'FINALIZED' ELSE 'DRAFT' END,
          finalized_at = CASE WHEN $6::boolean THEN now() ELSE NULL END, version = version + 1, updated_at = now()
         WHERE id = $7 AND status = 'DRAFT' AND version = $8 RETURNING id, version, status`,
        [input.verdict, input.orientation, input.analysis, input.observations, input.reserves, input.finalize, dossier.review_id, input.version]
      );
      if (!updated.rows[0]) throw new Error("Avis OCO concurrent");
      reviewId = String(updated.rows[0].id);
    } else {
      const inserted = await client.query(
        `INSERT INTO oco_reviews (dossier_id, expert_user_id, verdict, orientation, analysis, observations, reserves, status, finalized_at, version)
         VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $7, CASE WHEN $8::boolean THEN 'FINALIZED' ELSE 'DRAFT' END,
          CASE WHEN $8::boolean THEN now() ELSE NULL END, 1)
         RETURNING id, version, status`,
        [input.dossierId, scope.userId, input.verdict, input.orientation, input.analysis, input.observations, input.reserves, input.finalize]
      );
      if (!inserted.rows[0]) throw new Error("Avis OCO impossible");
      reviewId = String(inserted.rows[0].id);
    }
     if (input.finalize) assertTransition("TRANSMIS_OCO", "AVIS_RECU", scope.role, scope.permissions);
     let dossierVersion = dossier.version;
     if (input.finalize) {
       const dossierUpdate = await client.query<{ version: number }>(
         `UPDATE dossiers SET state = 'AVIS_RECU', step = $2::text, version = version + 1, updated_at = now()
          WHERE id = $1 AND version = $3 RETURNING version`,
         [input.dossierId, getWorkflowStep("AVIS_RECU"), dossier.version]
       );
       if (!dossierUpdate.rows[0]) throw new Error("Version du dossier obsolète");
       dossierVersion = dossierUpdate.rows[0].version;
     }
     await client.query(
       `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, from_state, to_state, metadata)
        VALUES ($1, 'OCO_REVIEW', $2, $3, $4, $5, $6, $7, $8::jsonb)`,
       [input.dossierId, reviewId, scope.userId, scope.role, input.finalize ? "oco.review.finalized" : currentReview ? "oco.review.updated" : "oco.review.created", "TRANSMIS_OCO", input.finalize ? "AVIS_RECU" : null, JSON.stringify({ version: input.version, verdict: input.verdict })]
     );
     return { dossierVersion, review: null };
  });
}

export async function getOcoDashboard(scope: BackofficeScope): Promise<{ assigned: number; drafts: number; toFinalize: number; processed: number }> {
  assertOcoScope(scope, "oco.read");
  const result = await query<{ assigned: number; drafts: number; to_finalize: number; processed: number }>(
    `SELECT COUNT(*) FILTER (WHERE d.state = 'TRANSMIS_OCO')::integer AS assigned,
      COUNT(*) FILTER (WHERE r.status = 'DRAFT')::integer AS drafts,
      COUNT(*) FILTER (WHERE r.status = 'DRAFT' AND r.verdict IS NOT NULL)::integer AS to_finalize,
      COUNT(*) FILTER (WHERE d.state = 'AVIS_RECU' OR r.status = 'FINALIZED')::integer AS processed
     FROM dossiers d JOIN oco_assignments a ON a.dossier_id = d.id AND a.expert_user_id = $1 AND a.active
     LEFT JOIN LATERAL (
       SELECT review.* FROM oco_reviews review
       WHERE review.dossier_id = d.id AND review.expert_user_id = $1
       ORDER BY review.updated_at DESC, review.created_at DESC LIMIT 1
     ) r ON true`,
    [scope.userId]
  );
  const row = result.rows[0];
  return { assigned: row?.assigned ?? 0, drafts: row?.drafts ?? 0, toFinalize: row?.to_finalize ?? 0, processed: row?.processed ?? 0 };
}

export async function getOcoHistory(scope: BackofficeScope) {
  assertOcoScope(scope, "history.read");
  const result = await query(
    `SELECT a.id, a.dossier_id, d.reference, d.student_name, a.action, a.from_state, a.to_state,
      a.comment, a.occurred_at, COALESCE(u.display_name, 'Système') AS user_name,
      COALESCE(a.actor_role, 'SYSTEME') AS user_role
     FROM audit_events a JOIN dossiers d ON d.id = a.dossier_id
      JOIN oco_assignments oa ON oa.dossier_id = d.id AND oa.expert_user_id = $1 AND oa.active
      LEFT JOIN users u ON u.id = a.actor_user_id
      WHERE (${PAP_RESOURCE_TYPE_FILTER_SQL})
      ORDER BY a.occurred_at DESC LIMIT 500`,
    [scope.userId]
  );
  return result.rows.map((row) => z.object({
    id: z.string().uuid(), dossierId: z.string().uuid(), reference: z.string(), studentName: z.string(),
    action: z.string(), fromState: dossierStateSchema.nullable(), toState: dossierStateSchema.nullable(),
    comment: z.string().nullable(), occurredAt: dateValueSchema, userName: z.string(), userRole: z.string()
  }).parse(row));
}
