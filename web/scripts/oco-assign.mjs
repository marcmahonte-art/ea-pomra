import pg from "pg";

const args = new Map();
let unassign = false;
for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index];
  if (key === "--unassign") {
    unassign = true;
    continue;
  }
  if (!key.startsWith("--")) throw new Error(`Argument invalide : ${key}`);
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Valeur manquante pour ${key}`);
  args.set(key.slice(2), value);
  index += 1;
}

const dossierId = args.get("dossier-id")?.trim();
const expertEmail = args.get("expert-email")?.trim().toLowerCase();
const reason = args.get("reason")?.trim();
const databaseUrl = process.env.DATABASE_URL;

if (!dossierId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(dossierId)) {
  throw new Error("--dossier-id doit être un UUID valide");
}
if (!unassign && (!expertEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(expertEmail))) {
  throw new Error("--expert-email doit être une adresse valide");
}
if (!reason || reason.length < 3 || reason.length > 2000) {
  throw new Error("--reason doit contenir entre 3 et 2000 caractères");
}
if (!databaseUrl) throw new Error("DATABASE_URL est requis");

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: process.env.BACKOFFICE_DB_SSL === "true" ? { rejectUnauthorized: true } : undefined
});

try {
  await client.connect();
  await client.query("BEGIN");
  const dossierResult = await client.query(
    `SELECT id, state FROM dossiers WHERE id = $1 FOR UPDATE`,
    [dossierId]
  );
  const dossier = dossierResult.rows[0];
  if (!dossier) throw new Error("Dossier introuvable");
  if (dossier.state !== "TRANSMIS_OCO") throw new Error("Le dossier doit être à l'état TRANSMIS_OCO");

  const reviewResult = await client.query(
    `SELECT EXISTS (
       SELECT 1 FROM oco_reviews
       WHERE dossier_id = $1 AND (status = 'FINALIZED' OR finalized_at IS NOT NULL)
     ) AS has_finalized_review`,
    [dossierId]
  );
  const hasFinalizedReview = reviewResult.rows[0]?.has_finalized_review === true;

  if (unassign) {
    const assignmentResult = await client.query(
      `SELECT id, expert_user_id FROM oco_assignments WHERE dossier_id = $1 AND active FOR UPDATE`,
      [dossierId]
    );
    const assignment = assignmentResult.rows[0];
    if (!assignment) throw new Error("Aucune affectation active");
    if (hasFinalizedReview) throw new Error("Réaffectation interdite car un avis finalisé existe");
    const released = await client.query(
      `UPDATE oco_assignments SET active = false WHERE id = $1 AND active RETURNING id`,
      [assignment.id]
    );
    if (!released.rows[0]) throw new Error("Affectation déjà libérée");
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, action, metadata)
       VALUES ($1, 'OCO_ASSIGNMENT', $2, 'OCO_UNASSIGNED', $3::jsonb)`,
      [dossierId, assignment.id, JSON.stringify({ expertUserId: assignment.expert_user_id, reason })]
    );
    await client.query("COMMIT");
    process.stdout.write(`Affectation libérée pour ${dossierId}\n`);
  } else {
    const expertResult = await client.query(
      `SELECT u.id
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.id
       WHERE lower(u.email) = $1 AND u.active = true AND ur.role = 'EXPERT_OCO'
       FOR SHARE`,
      [expertEmail]
    );
    const expert = expertResult.rows[0];
    if (!expert) throw new Error("Expert OCO actif introuvable");
    const activeResult = await client.query(
      `SELECT id FROM oco_assignments WHERE dossier_id = $1 AND active FOR UPDATE`,
      [dossierId]
    );
    if (activeResult.rows[0]) throw new Error("Une affectation active existe déjà");
    if (hasFinalizedReview) throw new Error("Réaffectation interdite car un avis finalisé existe");
    const assignment = await client.query(
      `INSERT INTO oco_assignments (dossier_id, expert_user_id) VALUES ($1, $2) RETURNING id`,
      [dossierId, expert.id]
    );
    const assignmentId = assignment.rows[0]?.id;
    if (!assignmentId) throw new Error("Affectation impossible");
    await client.query(
      `INSERT INTO audit_events (dossier_id, resource_type, resource_id, action, metadata)
       VALUES ($1, 'OCO_ASSIGNMENT', $2, 'OCO_ASSIGNED', $3::jsonb)`,
      [dossierId, assignmentId, JSON.stringify({ expertUserId: expert.id, expertEmail, reason })]
    );
    await client.query("COMMIT");
    process.stdout.write(`Dossier ${dossierId} affecté à ${expertEmail}\n`);
  }
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end();
}
