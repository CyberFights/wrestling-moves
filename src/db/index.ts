import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

/**
 * Returns the (cached) connection pool, creating it on first use.
 *
 * The pool is created lazily so this module can be imported during `next build`
 * — where `DATABASE_URL` is not yet available — without throwing. Railway (and
 * most other hosts) inject `DATABASE_URL` at runtime, so the first real query
 * sees a valid URL. We only raise the helpful error below when a query is
 * actually attempted without a URL.
 */
function getPool(): Pool {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL is required. Set it in your environment — Railway injects it automatically when a PostgreSQL plugin is attached to the service.",
      );
    }
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: databaseUrl,
    });
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

/**
 * `pool` is exposed lazily via a Proxy so nothing connects (or requires the
 * env var) until a method such as `query()` or `connect()` is actually called.
 */
export const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    // drizzle()'s isConfig() reads `pool.constructor` while wiring up the db
    // instance. Answer that from the Pool class itself so we don't force pool
    // creation (and the DATABASE_URL requirement) during `next build`.
    if (prop === "constructor") {
      return Pool;
    }
    const real = getPool();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export const db = drizzle(pool);
