import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { getServerConfig } from "./config";

const globalForPool = globalThis as unknown as { backofficePool?: Pool };
let pool: Pool | undefined;

export function getPool(): Pool {
  if (pool) return pool;

  const config = getServerConfig();
  pool =
    globalForPool.backofficePool ??
    new Pool({
      connectionString: config.databaseUrl,
      application_name: "ea-pomra-backoffice",
      max: config.dbPoolMax,
      idleTimeoutMillis: config.dbIdleTimeoutMs,
      connectionTimeoutMillis: config.dbConnectionTimeoutMs,
      query_timeout: config.dbQueryTimeoutMs,
      statement_timeout: config.dbStatementTimeoutMs,
      lock_timeout: config.dbLockTimeoutMs,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined
    });
  pool.on("error", (error: NodeJS.ErrnoException) => {
    console.error("Erreur du pool PostgreSQL", { code: error.code ?? "UNKNOWN" });
  });
  globalForPool.backofficePool = pool;
  return pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, values);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  isolation: "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" = "READ COMMITTED"
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query(`BEGIN ISOLATION LEVEL ${isolation}`);
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  const currentPool = pool;
  await currentPool.end();
  pool = undefined;
  if (globalForPool.backofficePool === currentPool) {
    delete globalForPool.backofficePool;
  }
}
