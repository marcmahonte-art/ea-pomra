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
const responsableEmail = args.get("responsable-email")?.trim().toLowerCase();
const reason = args.get("reason")?.trim();
const databaseUrl = process.env.DATABASE_URL;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

if (!dossierId || !uuidPattern.test(dossierId)) throw new Error("--dossier-id doit être un UUID valide");
if (!unassign && (!responsableEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responsableEmail))) throw new Error("--responsable-email doit être une adresse valide");
if (!reason || reason.length < 3 || reason.length > 2000) throw new Error("--reason doit contenir entre 3 et 2000 caractères");
if (!databaseUrl) throw new Error("DATABASE_URL est requis");

const client = new pg.Client({ connectionString: databaseUrl, ssl: process.env.BACKOFFICE_DB_SSL === "true" ? { rejectUnauthorized: true } : undefined });

try {
  await client.connect();
  await client.query("BEGIN");
  const dossierResult = await client.query(`SELECT id FROM dossiers WHERE id = $1 FOR UPDATE`, [dossierId]);
  if (!dossierResult.rows[0]) throw new Error("Dossier introuvable");
  const activeResult = await client.query(`SELECT id, responsable_user_id FROM pap_assignments WHERE dossier_id = $1 AND active FOR UPDATE`, [dossierId]);
  const active = activeResult.rows[0];

  if (unassign) {
    if (!active) throw new Error("Aucune affectation PAP active");
    const caseResult = await client.query(`SELECT EXISTS (SELECT 1 FROM pap_cases WHERE dossier_id = $1 AND responsable_user_id = $2 AND status <> 'CLOSED') AS has_open_case`, [dossierId, active.responsable_user_id]);
    if (caseResult.rows[0]?.has_open_case) throw new Error("Désaffectation refusée car le cas PAP est ouvert");
    await client.query(`UPDATE pap_assignments SET active = false, unassign_reason = $2 WHERE id = $1 AND active`, [active.id, reason]);
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, action) VALUES ($1, 'PAP_ASSIGNMENT', $2, 'PAP_UNASSIGNED')`, [dossierId, active.id]);
  } else {
    const responsableResult = await client.query(`SELECT u.id FROM users u JOIN user_roles ur ON ur.user_id = u.id WHERE lower(u.email) = $1 AND u.active = true AND ur.role = 'RESPONSABLE_PAP' FOR SHARE`, [responsableEmail]);
    const responsable = responsableResult.rows[0];
    if (!responsable) throw new Error("Responsable PAP actif introuvable");
    if (active) throw new Error("Une affectation PAP active existe déjà");
    const assignment = await client.query(`INSERT INTO pap_assignments (dossier_id, responsable_user_id, reason) VALUES ($1, $2, $3) RETURNING id`, [dossierId, responsable.id, reason]);
    if (!assignment.rows[0]) throw new Error("Affectation PAP impossible");
    await client.query(`INSERT INTO audit_events (dossier_id, resource_type, resource_id, action) VALUES ($1, 'PAP_ASSIGNMENT', $2, 'PAP_ASSIGNED')`, [dossierId, assignment.rows[0].id]);
  }

  await client.query("COMMIT");
  process.stdout.write(unassign ? "Affectation PAP libérée\n" : "Affectation PAP enregistrée\n");
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end();
}
