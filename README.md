# SlamDB — The Pro Wrestling Move Database

A searchable database of professional wrestling moves (DDT, German Suplex, RKO,
Stone Cold Stunner, and more) with descriptions, images, difficulty ratings, and
the legends who made them famous. Built with **Next.js 16**, **PostgreSQL**, and
**Drizzle ORM**, with a live REST API.

## Stack

- **Next.js 16** (App Router, React Server Components)
- **PostgreSQL** via **Drizzle ORM** (`node-postgres` driver)
- **Tailwind CSS 4**

## API

| Method | Route                | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/api/moves`         | List, search, and filter moves       |
| POST   | `/api/moves`         | Add a new move                       |
| GET    | `/api/moves/names`   | List just the move names             |
| GET    | `/api/moves/:slug`   | Fetch a single move by slug          |
| DELETE | `/api/moves/:slug`   | Remove a move                        |
| GET    | `/api/health`        | Health check (verifies DB connection)|

## Seeding

`npm run db:push` only creates the **schema** (`src/db/schema.ts`). The **rows**
live in `src/db/seed.ts` — the full catalog of 119 moves (19 curated starters
plus the 100-move extended catalog) as typed `NewWrestlingMove[]` data — and are
written by `ensureSeeded()`, which every page and API route calls:

- an empty database gets the whole catalog on the first request;
- a database seeded earlier is **back-filled** with any slug that is missing, so
  adding a move to `seed.ts` (or shipping a bigger catalog later) is enough to
  propagate it to already-running deployments;
- once the catalog is fully present the call is a no-op (a single `count(*)`).

No import step is needed after `db:push`. `moves-100.json` is kept for the
optional importer below and for ad-hoc `POST /api/moves` payloads.

## Importing moves from JSON (optional)

`import-moves.mjs` bulk-loads a JSON array through the live API — handy if you
edit `moves-100.json` and want those changes in a database that is already
running (moves already present are skipped, so re-runs are safe):

```bash
npm run dev                                   # in another terminal; needs a reachable DATABASE_URL
node import-moves.mjs                         # → http://localhost:3000 with moves-100.json
node import-moves.mjs https://your-app.railway.app  # against a deployed instance
node import-moves.mjs --file 100-moves.json   # a differently-named catalog file
```

The script pings `/api/health` first and tells you to start the app if it cannot
reach the API, rather than dying mid-import.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start a PostgreSQL instance and set the connection string:

   ```bash
   cp .env.example .env
   # edit .env with your local database URL
   ```

3. Create the database schema:

   ```bash
   npm run db:push
   ```

   The move catalog itself is seeded from `src/db/seed.ts` on the first request
   (see [Seeding](#seeding)) — nothing else to run.

4. Run the dev server:

   ```bash
   npm run dev
   ```

## Deploying to Railway

1. Push this repository to GitHub (or connect it directly from Railway).
2. In Railway, create a **New Project → Deploy from GitHub repo** and select this
   repository.
3. Provision a **PostgreSQL** plugin (right-click the canvas → **Database →
   PostgreSQL**). Railway automatically injects `DATABASE_URL` into the service.
4. Deploy. The `railway.json` config handles the rest:
   - Builds with **Nixpacks** (`npm run build`).
   - On start, runs `npm run db:push` to create/update the schema, then
     `npm start` (which binds to `0.0.0.0` and Railway's `PORT`).
   - Runs a health check against `/api/health`.

Railway provides the `DATABASE_URL` environment variable automatically when a
PostgreSQL plugin is attached — no manual configuration is required. The
database is seeded with the full wrestling-move catalog on the first request.

### Configuration reference (`railway.json`)

| Setting                | Value                  | Purpose                              |
| ---------------------- | ---------------------- | ------------------------------------ |
| `build.builder`        | `NIXPACKS`             | Zero-config Node/Next.js build       |
| `build.buildCommand`   | `npm run build`        | Compile the Next.js app              |
| `deploy.startCommand`  | `npm run db:push && npm start` | Create schema, then serve      |
| `deploy.healthcheckPath` | `/api/health`        | Verify the app + DB are healthy      |
| `deploy.restartPolicyType` | `ON_FAILURE`       | Restart only on failure              |

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start the Next.js dev server             |
| `npm run build`  | Production build                         |
| `npm start`      | Serve the production build (`0.0.0.0`)   |
| `npm run db:generate` | Generate SQL migrations from schema  |
| `npm run db:migrate`  | Apply generated migrations           |
| `npm run db:push`     | Push the schema directly to the DB   |
| `npm run db:studio`   | Open Drizzle Studio                  |
