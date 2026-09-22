import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    }))
  : null;

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

// Null at runtime when DATABASE_URL is missing (simple/demo mode).
// Cast to non-nullable so existing admin routes still typecheck;
// public code paths guard with isDbConfigured before touching db.
export const db = (pool ? drizzle(pool) : null) as unknown as ReturnType<typeof drizzle>;
