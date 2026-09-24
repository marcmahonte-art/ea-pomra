import type { PoolClient } from "pg";
import { z } from "zod";
import type { BackofficeScope } from "@/lib/backoffice-types";
import type { PapAlert, PapCaseStatus, PapCaseSummary, PapDashboard, PapHistoryEvent, PapIntervention } from "@/lib/pap-types";
import { assertPapScope } from "@/lib/pap-types";
import { canTransitionPapAlert, canTransitionPapCase, canTransitionPapIntervention, canWritePapAlert, canWritePapIntervention } from "@/lib/server/pap-workflow";
import { query, withTransaction } from "@/lib/server/db";

const dateValueSchema = z.union([z.date(), z.string().datetime({ offset: true })]);
const caseStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]);
const alertStatusSchema = z.enum(["OPEN", "ACKNOWLEDGED", "CLOSED"]);
const alertLevelSchema = z.enum(["INFO", "ATTENTION", "URGENT"]);
const interventionStatusSchema = z.enum(["PLANNED", "DONE", "CANCELLED"]);
const baseDossierSchema = z.object({
  dossier_id: z.string().uuid(),
  dossier_ref: z.string(),
  student_initials: z.string()
});
const caseRowSchema = baseDossierSchema.extend({
  case_id: z.string().uuid().nullable(),
  dossier_version: z.coerce.number().int().positive(),
  status: caseStatusSchema.nullable(),
  version: z.coerce.number().int().positive().nullable(),
  created_at: dateValueSchema.nullable(),
  updated_at: dateValueSchema.nullable()
});
const alertRowSchema = baseDossierSchema.extend({
  id: z.string().uuid(),
  case_id: z.string().uuid(),
  level: alertLevelSchema,
  subject: z.string(),
  status: alertStatusSchema,
  version: z.coerce.number().int().positive(),
  created_at: dateValueSchema,
  updated_at: dateValueSchema
});
const interventionRowSchema = baseDossierSchema.extend({
  id: z.string().uuid(),
  case_id: z.string().uuid(),
  intervention_date: z.string().date(),
  intervention_type: z.string(),
  objective: z.string(),
  observation: z.string(),
  next_action: z.string(),
  status: interventionStatusSchema,
  version: z.coerce.number().int().positive(),
  created_at: dateValueSchema,
  updated_at: dateValueSchema,
  responsible_name: z.string()
});
const historyRowSchema = z.object({
  id: z.string().uuid(),
  dossier_id: z.string().uuid(),
  dossier_ref: z.string(),
  student_initials: z.string(),
  action: z.string(),
  occurred_at: dateValueSchema,
  user_name: z.string(),
  user_role: z.string()
});

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapCase(row: z.infer<typeof caseRowSchema>): PapCaseSummary {
  return {
    id: row.case_id ?? row.dossier_id,
    dossierId: row.dossier_id,
    dossierRef: row.dossier_ref,
    studentInitials: row.student_initials,
    status: row.status ?? "OPEN",
    version: row.version ?? 1,
    createdAt: iso(row.created_at ?? new Date()),
    updatedAt: iso(row.updated_at ?? new Date()),
    dossierVersion: row.dossier_version
  };
}

function mapAlert(row: z.infer<typeof alertRowSchema>): PapAlert {
  return { id: row.id, caseId: row.case_id, dossierId: row.dossier_id, dossierRef: row.dossier_ref, studentInitials: row.student_initials, level: row.level, subject: row.subject, status: row.status, version: row.version, createdAt: iso(row.created_at), updatedAt: iso(row.updated_at) };
}

function mapIntervention(row: z.infer<typeof interventionRowSchema>): PapIntervention {
  return { id: row.id, caseId: row.case_id, dossierId: row.dossier_id, dossierRef: row.dossier_ref, studentInitials: row.student_initials, interventionDate: row.intervention_date, interventionType: row.intervention_type, objective: row.objective, observation: row.observation, nextAction: row.next_action, status: row.status, version: row.version, createdAt: iso(row.created_at), updatedAt: iso(row.updated_at), responsibleName: row.responsible_name };
}

async function lockAssignment(client: PoolClient, scope: BackofficeScope, dossierId: string): Promise<void> {
  const result = await client.query(
    `SELECT 1 FROM dossiers d WHERE d.id = $1 AND EXISTS (SELECT 1 FROM pap_assignments pa WHERE pa.dossier_id = d.id AND pa.responsable_user_id = $2 AND pa.active) FOR UPDATE`,
    [dossierId, scope.userId]
  );
  if (!result.rows[0]) throw new Error("Dossier PAP introuvable");
}

async function ensureCase(client: PoolClient, scope: BackofficeScope, dossierId: string): Promise<{ id: string; version: number; status: PapCaseStatus }> {
  const result = await client.query<{ id: string; version: number; status: PapCaseStatus }>(
    `SELECT id, version, status FROM pap_cases WHERE dossier_id = $1 AND responsable_user_id = $2 FOR UPDATE`,
    [dossierId, scope.userId]
  );
  if (result.rows[0]) return result.rows[0];
  const inserted = await client.query<{ id: string; version: number; status: PapCaseStatus }>(
    `INSERT INTO pap_cases (dossier_id, responsable_user_id) VALUES ($1, $2)
     ON CONFLICT (dossier_id, responsable_user_id) DO UPDATE SET updated_at = now()
     RETURNING id, version, status`,
    [dossierId, scope.userId]
  );
  if (!inserted.rows[0]) throw new Error("Suivi PAP impossible");
  await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action) VALUES ($1, 'PAP_CASE', $2, $3, $4, 'pap.case.created')`, [dossierId, inserted.rows[0].id, scope.userId, scope.role]);
  return inserted.rows[0];
}

export async function getPapDashboard(scope: BackofficeScope): Promise<PapDashboard> {
  assertPapScope(scope, "pap.read");
  const result = await query<{ active_alerts: number; follow_ups: number; mentorats: number; recent_interventions: number }>(
    `SELECT
      COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('OPEN', 'ACKNOWLEDGED'))::integer AS active_alerts,
      COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'IN_PROGRESS')::integer AS follow_ups,
      COUNT(DISTINCT c.id) FILTER (WHERE c.status IN ('OPEN', 'IN_PROGRESS'))::integer AS mentorats,
      COUNT(DISTINCT i.id) FILTER (WHERE i.created_at >= now() - interval '30 days')::integer AS recent_interventions
     FROM dossiers d
     JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active
     LEFT JOIN pap_cases c ON c.dossier_id = d.id AND c.responsable_user_id = $1
     LEFT JOIN pap_alerts a ON a.case_id = c.id AND a.responsable_user_id = $1
     LEFT JOIN pap_interventions i ON i.case_id = c.id AND i.responsable_user_id = $1`,
    [scope.userId]
  );
  const row = result.rows[0];
  return { activeAlerts: row?.active_alerts ?? 0, followUpsInProgress: row?.follow_ups ?? 0, activeMentorats: row?.mentorats ?? 0, recentInterventions: row?.recent_interventions ?? 0 };
}

export async function listPapCases(scope: BackofficeScope, page = 1, pageSize = 50): Promise<{ rows: PapCaseSummary[]; total: number; page: number; totalPages: number }> {
  assertPapScope(scope, "pap.mentorat.read");
  const bounded = Math.max(1, Math.min(pageSize, 100));
  const count = await query<{ count: number }>(
    `SELECT COUNT(*)::integer AS count FROM dossiers d JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active`,
    [scope.userId]
  );
  const total = count.rows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / bounded));
  const current = Math.max(1, Math.min(page, totalPages));
  const result = await query(
     `SELECT d.id AS dossier_id, d.reference AS dossier_ref, d.student_initials, d.version AS dossier_version, c.id AS case_id, c.status, c.version, c.created_at, c.updated_at
     FROM dossiers d JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active
     LEFT JOIN pap_cases c ON c.dossier_id = d.id AND c.responsable_user_id = $1
     ORDER BY COALESCE(c.updated_at, d.updated_at) DESC LIMIT $2 OFFSET $3`,
    [scope.userId, bounded, (current - 1) * bounded]
  );
  return { rows: result.rows.map((row) => mapCase(caseRowSchema.parse(row))), total, page: current, totalPages };
}

export async function getPapMentorat(scope: BackofficeScope, dossierId: string): Promise<{ dossier: PapCaseSummary; interventions: PapIntervention[] } | null> {
  assertPapScope(scope, "pap.mentorat.read");
  const result = await query(
     `SELECT d.id AS dossier_id, d.reference AS dossier_ref, d.student_initials, d.version AS dossier_version, c.id AS case_id, c.status, c.version, c.created_at, c.updated_at
     FROM dossiers d JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active
     LEFT JOIN pap_cases c ON c.dossier_id = d.id AND c.responsable_user_id = $1 WHERE d.id = $2`,
    [scope.userId, dossierId]
  );
  const row = result.rows[0];
  if (!row) return null;
  const dossier = mapCase(caseRowSchema.parse(row));
  const interventions = await query(
     `SELECT i.id, i.case_id, i.dossier_id, d.reference AS dossier_ref, d.student_initials, i.intervention_date, i.intervention_type, i.objective, i.observation, i.next_action, i.status, i.version, i.created_at, i.updated_at, u.display_name AS responsible_name
      FROM pap_interventions i JOIN dossiers d ON d.id = i.dossier_id JOIN pap_assignments pa ON pa.dossier_id = i.dossier_id AND pa.responsable_user_id = $2 AND pa.active LEFT JOIN users u ON u.id = i.responsable_user_id
      WHERE i.case_id = $1 AND i.responsable_user_id = $2 ORDER BY i.intervention_date DESC, i.created_at DESC LIMIT 100`,
    [dossier.id, scope.userId]
  );
  return { dossier, interventions: interventions.rows.map((item) => mapIntervention(interventionRowSchema.parse(item))) };
}

export async function listPapAlerts(scope: BackofficeScope, page = 1, pageSize = 50): Promise<{ rows: PapAlert[]; total: number; page: number; totalPages: number }> {
  assertPapScope(scope, "pap.alerts.read");
  const bounded = Math.max(1, Math.min(pageSize, 100));
  const count = await query<{ count: number }>(
    `SELECT COUNT(*)::integer AS count FROM pap_alerts a JOIN pap_assignments pa ON pa.dossier_id = a.dossier_id AND pa.responsable_user_id = $1 AND pa.active`,
    [scope.userId]
  );
  const total = count.rows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / bounded));
  const current = Math.max(1, Math.min(page, totalPages));
  const result = await query(
    `SELECT a.id, a.case_id, a.dossier_id, d.reference AS dossier_ref, d.student_initials, a.level, a.subject, a.status, a.version, a.created_at, a.updated_at
     FROM pap_alerts a JOIN dossiers d ON d.id = a.dossier_id JOIN pap_assignments pa ON pa.dossier_id = a.dossier_id AND pa.responsable_user_id = $1 AND pa.active
     ORDER BY a.updated_at DESC LIMIT $2 OFFSET $3`,
    [scope.userId, bounded, (current - 1) * bounded]
  );
  return { rows: result.rows.map((row) => mapAlert(alertRowSchema.parse(row))), total, page: current, totalPages };
}

export async function getPapHistory(scope: BackofficeScope, page = 1, pageSize = 50): Promise<{ rows: PapHistoryEvent[]; total: number; page: number; totalPages: number }> {
  assertPapScope(scope, "history.read");
  const bounded = Math.max(1, Math.min(pageSize, 100));
  const count = await query<{ count: number }>(
    `SELECT COUNT(*)::integer AS count FROM audit_events ae JOIN dossiers d ON d.id = ae.dossier_id JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active WHERE ae.resource_type IN ('PAP_CASE', 'PAP_ALERT', 'PAP_INTERVENTION', 'PAP_ASSIGNMENT')`,
    [scope.userId]
  );
  const total = count.rows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / bounded));
  const current = Math.max(1, Math.min(page, totalPages));
  const result = await query(
    `SELECT ae.id, d.id AS dossier_id, d.reference AS dossier_ref, d.student_initials, ae.action, ae.occurred_at, COALESCE(u.display_name, 'Système') AS user_name, COALESCE(ae.actor_role, 'SYSTEME') AS user_role
     FROM audit_events ae JOIN dossiers d ON d.id = ae.dossier_id JOIN pap_assignments pa ON pa.dossier_id = d.id AND pa.responsable_user_id = $1 AND pa.active LEFT JOIN users u ON u.id = ae.actor_user_id
     WHERE ae.resource_type IN ('PAP_CASE', 'PAP_ALERT', 'PAP_INTERVENTION', 'PAP_ASSIGNMENT') ORDER BY ae.occurred_at DESC LIMIT $2 OFFSET $3`,
    [scope.userId, bounded, (current - 1) * bounded]
  );
  return { rows: result.rows.map((row) => { const event = historyRowSchema.parse(row); return { id: event.id, dossierId: event.dossier_id, dossierRef: event.dossier_ref, studentInitials: event.student_initials, action: event.action, occurredAt: iso(event.occurred_at), userName: event.user_name, userRole: event.user_role }; }), total, page: current, totalPages };
}

export async function createPapAlert(scope: BackofficeScope, input: { dossierId: string; dossierVersion: number; level: PapAlert["level"]; subject: string }): Promise<{ alertId: string; version: number }> {
  assertPapScope(scope, "pap.alerts.write");
  return withTransaction(async (client) => {
    await lockAssignment(client, scope, input.dossierId);
    const dossier = await client.query<{ version: number }>(`SELECT version FROM dossiers WHERE id = $1 FOR UPDATE`, [input.dossierId]);
    if (dossier.rows[0]?.version !== input.dossierVersion) throw new Error("Version du dossier obsolète");
    const papCase = await ensureCase(client, scope, input.dossierId);
    if (papCase.status === "CLOSED") throw new Error("Dossier PAP clôturé");
    const inserted = await client.query<{ id: string; version: number }>(`INSERT INTO pap_alerts (case_id, dossier_id, responsable_user_id, level, subject) VALUES ($1, $2, $3, $4, $5) RETURNING id, version`, [papCase.id, input.dossierId, scope.userId, input.level, input.subject]);
    if (!inserted.rows[0]) throw new Error("Alerte PAP impossible");
    const updatedDossier = await client.query<{ version: number }>(`UPDATE dossiers SET version = version + 1, updated_at = now() WHERE id = $1 AND version = $2 RETURNING version`, [input.dossierId, input.dossierVersion]);
    if (!updatedDossier.rows[0]) throw new Error("Version du dossier obsolète");
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action) VALUES ($1, 'PAP_ALERT', $2, $3, $4, 'pap.alert.created')`, [input.dossierId, inserted.rows[0].id, scope.userId, scope.role]);
    return { alertId: inserted.rows[0].id, version: inserted.rows[0].version };
  });
}

export async function updatePapAlert(scope: BackofficeScope, input: { alertId: string; version: number; status: PapAlert["status"] }): Promise<{ version: number }> {
  assertPapScope(scope, "pap.alerts.write");
  return withTransaction(async (client) => {
    const current = await client.query<{ id: string; dossier_id: string; status: PapAlert["status"]; version: number }>(`SELECT a.id, a.dossier_id, a.status, a.version FROM pap_alerts a JOIN pap_assignments pa ON pa.dossier_id = a.dossier_id AND pa.responsable_user_id = $1 AND pa.active WHERE a.id = $2 FOR UPDATE OF a, pa`, [scope.userId, input.alertId]);
    const alert = current.rows[0];
    if (!alert) throw new Error("Alerte PAP introuvable");
    if (!canWritePapAlert({ role: scope.role, permissions: scope.permissions, assigned: true, status: alert.status })) throw new Error("Écriture d’alerte PAP refusée");
    if (alert.version !== input.version || !canTransitionPapAlert(alert.status, input.status)) throw new Error("Transition d’alerte refusée");
    const updated = await client.query<{ version: number }>(`UPDATE pap_alerts SET status = $1, version = version + 1, updated_at = now() WHERE id = $2 AND version = $3 RETURNING version`, [input.status, input.alertId, input.version]);
    if (!updated.rows[0]) throw new Error("Version de l’alerte obsolète");
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action) VALUES ($1, 'PAP_ALERT', $2, $3, $4, 'pap.alert.status_changed')`, [alert.dossier_id, input.alertId, scope.userId, scope.role]);
    return updated.rows[0];
  });
}

export async function createPapIntervention(scope: BackofficeScope, input: { dossierId: string; dossierVersion: number; interventionDate: string; interventionType: string; objective: string; observation: string; nextAction: string }): Promise<{ interventionId: string; version: number }> {
  assertPapScope(scope, "pap.mentorat.write");
  return withTransaction(async (client) => {
    await lockAssignment(client, scope, input.dossierId);
    const dossier = await client.query<{ version: number }>(`SELECT version FROM dossiers WHERE id = $1 FOR UPDATE`, [input.dossierId]);
    if (dossier.rows[0]?.version !== input.dossierVersion) throw new Error("Version du dossier obsolète");
    if (!canWritePapIntervention({ role: scope.role, permissions: scope.permissions, assigned: true, status: "PLANNED" })) throw new Error("Écriture d’intervention PAP refusée");
    const papCase = await ensureCase(client, scope, input.dossierId);
    if (papCase.status === "CLOSED") throw new Error("Dossier PAP clôturé");
    const inserted = await client.query<{ id: string; version: number }>(`INSERT INTO pap_interventions (case_id, dossier_id, responsable_user_id, intervention_date, intervention_type, objective, observation, next_action) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, version`, [papCase.id, input.dossierId, scope.userId, input.interventionDate, input.interventionType, input.objective, input.observation, input.nextAction]);
    if (!inserted.rows[0]) throw new Error("Intervention PAP impossible");
    const updatedDossier = await client.query<{ version: number }>(`UPDATE dossiers SET version = version + 1, updated_at = now() WHERE id = $1 AND version = $2 RETURNING version`, [input.dossierId, input.dossierVersion]);
    if (!updatedDossier.rows[0]) throw new Error("Version du dossier obsolète");
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action) VALUES ($1, 'PAP_INTERVENTION', $2, $3, $4, 'pap.intervention.created')`, [input.dossierId, inserted.rows[0].id, scope.userId, scope.role]);
    return { interventionId: inserted.rows[0].id, version: inserted.rows[0].version };
  });
}

export async function updatePapInterventionStatus(scope: BackofficeScope, input: { interventionId: string; version: number; status: PapIntervention["status"] }): Promise<{ version: number }> {
  assertPapScope(scope, "pap.mentorat.write");
  return withTransaction(async (client) => {
    const current = await client.query<{ id: string; case_id: string; dossier_id: string; status: PapIntervention["status"]; version: number; case_status: PapCaseStatus }>(
      `SELECT i.id, i.case_id, i.dossier_id, i.status, i.version, c.status AS case_status
       FROM pap_interventions i JOIN pap_cases c ON c.id = i.case_id
       JOIN pap_assignments pa ON pa.dossier_id = i.dossier_id AND pa.responsable_user_id = $1 AND pa.active
       WHERE i.id = $2 FOR UPDATE OF i, c, pa`,
      [scope.userId, input.interventionId]
    );
    const intervention = current.rows[0];
    if (!intervention) throw new Error("Intervention PAP introuvable");
    if (intervention.case_status === "CLOSED") throw new Error("Dossier PAP clôturé");
    if (!canWritePapIntervention({ role: scope.role, permissions: scope.permissions, assigned: true, status: intervention.status })) throw new Error("Écriture d’intervention PAP refusée");
    if (intervention.version !== input.version || !canTransitionPapIntervention(intervention.status, input.status)) throw new Error("Transition d’intervention refusée");
    const updated = await client.query<{ version: number }>(
      `UPDATE pap_interventions SET status = $1, version = version + 1, updated_at = now()
       WHERE id = $2 AND version = $3 AND status = 'PLANNED' RETURNING version`,
      [input.status, input.interventionId, input.version]
    );
    if (!updated.rows[0]) throw new Error("Version de l’intervention obsolète");
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action, metadata)
       VALUES ($1, 'PAP_INTERVENTION', $2, $3, $4, 'pap.intervention.status_changed', $5::jsonb)`,
      [intervention.dossier_id, input.interventionId, scope.userId, scope.role, JSON.stringify({ fromStatus: intervention.status, toStatus: input.status })]
    );
    return updated.rows[0];
  });
}

export async function updatePapCaseStatus(scope: BackofficeScope, input: { caseId: string; version: number; status: PapCaseStatus }): Promise<{ version: number }> {
  assertPapScope(scope, "pap.mentorat.write");
  return withTransaction(async (client) => {
    const current = await client.query<{ dossier_id: string; status: PapCaseStatus; version: number }>(`SELECT c.dossier_id, c.status, c.version FROM pap_cases c JOIN pap_assignments pa ON pa.dossier_id = c.dossier_id AND pa.responsable_user_id = $1 AND pa.active WHERE c.id = $2 FOR UPDATE OF c, pa`, [scope.userId, input.caseId]);
    const papCase = current.rows[0];
    if (!papCase) throw new Error("Suivi PAP introuvable");
    if (papCase.version !== input.version || !canTransitionPapCase(papCase.status, input.status)) throw new Error("Transition de suivi refusée");
    const updated = await client.query<{ version: number }>(`UPDATE pap_cases SET status = $1, version = version + 1, updated_at = now() WHERE id = $2 AND version = $3 RETURNING version`, [input.status, input.caseId, input.version]);
    if (!updated.rows[0]) throw new Error("Version du suivi obsolète");
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, actor_user_id, actor_role, action) VALUES ($1, 'PAP_CASE', $2, $3, $4, 'pap.case.status_changed')`, [papCase.dossier_id, input.caseId, scope.userId, scope.role]);
    return updated.rows[0];
  });
}
