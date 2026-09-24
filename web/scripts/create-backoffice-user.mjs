import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index];
  if (!key.startsWith("--")) throw new Error(`Argument invalide : ${key}`);
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Valeur manquante pour ${key}`);
  args.set(key.slice(2), value);
  index += 1;
}

const required = ["email", "name", "title", "role"];
for (const key of required) {
  if (!args.get(key)) throw new Error(`Argument requis : --${key}`);
}

const email = args.get("email").trim().toLowerCase();
const displayName = args.get("name").trim();
const userTitle = args.get("title").trim();
const role = args.get("role").toUpperCase();
const password = process.env.BACKOFFICE_BOOTSTRAP_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
  throw new Error("Adresse e-mail invalide");
}
if (!displayName || displayName.length > 200 || !userTitle || userTitle.length > 200) {
  throw new Error("Nom ou fonction invalide");
}
if (!new Set(["ANTENNE", "BEC", "EXPERT_OCO"]).has(role)) throw new Error("Rôle invalide");
if (!password || password.length < 12 || !/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
  throw new Error("BACKOFFICE_BOOTSTRAP_PASSWORD doit contenir au moins 12 caractères, une lettre, un chiffre et un symbole");
}
if (!databaseUrl) throw new Error("DATABASE_URL est requis");

const scope = role === "BEC" || role === "EXPERT_OCO"
  ? { countryCode: null, countryName: null, countryFlag: null, antennaId: null, antennaCity: null }
  : {
      countryCode: args.get("country-code")?.trim().toUpperCase() ?? "",
      countryName: args.get("country-name")?.trim() ?? "",
      countryFlag: args.get("country-flag")?.trim() ?? "",
      antennaId: args.get("antenna-id")?.trim() ?? "",
      antennaCity: args.get("antenna-city")?.trim() ?? ""
    };

if (role === "ANTENNE" && Object.values(scope).some((value) => !value)) {
  throw new Error("Un compte ANTENNE exige country-code, country-name, country-flag, antenna-id et antenna-city");
}

const passwordHash = await bcrypt.hash(password, 12);
const client = new pg.Client({ connectionString: databaseUrl, ssl: process.env.BACKOFFICE_DB_SSL === "true" ? { rejectUnauthorized: true } : undefined });
await client.connect();
try {
  await client.query("BEGIN");
  const userId = randomUUID();
  const user = await client.query(
    `INSERT INTO users (id, email, password_hash, display_name, user_title)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [userId, email, passwordHash, displayName, userTitle]
  );
  const createdUserId = user.rows[0].id;
  await client.query("INSERT INTO user_roles (user_id, role) VALUES ($1, $2)", [createdUserId, role]);
  await client.query(
    `INSERT INTO user_scopes (user_id, role, country_code, country_name, country_flag, antenna_id, antenna_city)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, role, scope.countryCode, scope.countryName, scope.countryFlag, scope.antennaId, scope.antennaCity]
  );
  await client.query("COMMIT");
  process.stdout.write(`Compte ${role} créé pour ${email}\n`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}
