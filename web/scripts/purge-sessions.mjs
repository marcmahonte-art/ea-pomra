import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL absente");

const requested = Number.parseInt(process.argv[2] ?? "10000", 10);
if (!Number.isInteger(requested) || requested < 1 || requested > 100000) {
  throw new Error("Taille de lot invalide");
}

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
try {
  const result = await pool.query("SELECT purge_expired_sessions($1) AS sessions, purge_expired_rate_limit_buckets($1) AS rate_limit_buckets", [requested]);
  process.stdout.write(`${result.rows[0].sessions} ${result.rows[0].rate_limit_buckets}\n`);
} finally {
  await pool.end();
}
