import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 *
 * The database URL is read from the `DATABASE_URL` environment variable so the
 * same config works locally, on Railway (which injects `DATABASE_URL` when you
 * attach a PostgreSQL plugin), and anywhere else. `dotenv/config` loads a local
 * `.env` file during development so `drizzle-kit` commands work outside of Next.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
  verbose: true,
});
