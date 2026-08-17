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

The database is auto-seeded on first request, so the site is usable immediately
after the schema is created.

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
