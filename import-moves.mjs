// Optional bulk importer: POSTs every move in moves-100.json to /api/moves.
//
// You normally do NOT need this — src/db/seed.ts already contains the whole
// catalog and is applied automatically (create the schema with `npm run
// db:push`, then the app seeds any missing move on the first request). Use this
// only to push edits from the JSON file into an already-running database, or to
// load a catalog that lives outside the seed file.
//
// Usage:
//   1. Start the app:  npm run dev
//   2. Run importer:    node import-moves.mjs [baseUrl] [--file <json>]
//      e.g.             node import-moves.mjs http://localhost:3000
//                       node import-moves.mjs --file 100-moves.json
//
// Each object in moves-100.json also matches the `wrestlingMoves` insert
// shape in src/db/schema.ts, so you can copy/paste any single entry
// straight into the Add-Move form or a POST body.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const baseUrl = args.find((a) => /^https?:\/\//.test(a)) ?? "http://localhost:3000";
const fileFlag = args.indexOf("--file");
const dataArg = fileFlag === -1 ? undefined : args[fileFlag + 1];
const base = baseUrl.replace(/\/$/, "");

/** Read the catalog, trying the conventional file names if none was given. */
function readMoves(file) {
  const candidates = file
    ? [path.resolve(process.cwd(), file)]
    : ["moves-100.json", "100-moves.json", "moves.json"].map((name) =>
        path.resolve(path.dirname(new URL(import.meta.url).pathname), name),
      );
  for (const file of candidates) {
    let raw;
    try {
      raw = fs.readFileSync(file, "utf8");
    } catch (err) {
      if (err.code === "ENOENT") continue;
      throw new Error(`Could not read ${file}: ${err.message}`);
    }
    try {
      return { moves: JSON.parse(raw), file };
    } catch (err) {
      throw new Error(`${file} is not valid JSON: ${err.message}`);
    }
  }
  throw new Error(
    `Could not find a moves file (looked for:\n   ${candidates.join("\n   ")}).\n` +
      `Pass one explicitly: node import-moves.mjs --file 100-moves.json`,
  );
}

async function main() {
  const { moves, file } = readMoves(dataArg);
  if (!Array.isArray(moves) || moves.length === 0) {
    throw new Error(`${file} must contain a non-empty JSON array of moves.`);
  }

  const json = async (route) => {
    const res = await fetch(`${base}${route}`);
    if (!res.ok) throw new Error(`${route} responded ${res.status}`);
    return res.json();
  };

  // Fail early (and kindly) instead of mid-loop on the first move.
  try {
    await json("/api/health");
  } catch (err) {
    throw new Error(
      `Cannot reach the API at ${base} (${err.message}).\n` +
        `  Start the app first:  npm run dev      (needs a reachable DATABASE_URL)\n` +
        `  If you only want the moves in the database, skip this script: they are\n` +
        `  already part of src/db/seed.ts, so \`npm run db:push\` plus one page load\n` +
        `  seeds them automatically.`,
    );
  }

  // Moves already in the database are skipped, so re-runs don't create "rko-2".
  const existing = new Set((await json("/api/moves/names").catch(() => ({ names: [] }))).names ?? []);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const m of moves) {
    const label = m.slug ?? m.name ?? "(unnamed)";
    if (existing.has(m.name)) {
      skipped++;
      console.log(`– ${label} (already in the database)`);
      continue;
    }
    try {
      const res = await fetch(`${base}/api/moves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(m), // extra `slug` key is ignored; the API generates its own
      });
      if (res.ok) {
        ok++;
        console.log(`✔ ${label}`);
      } else {
        failed++;
        console.error(`✘ ${label} — ${res.status} ${(await res.text()).slice(0, 300)}`);
      }
    } catch (err) {
      failed++;
      console.error(`✘ ${label} — ${err.message} (server went away mid-import?)`);
    }
  }

  console.log(`\nImported ${ok}/${moves.length} moves from ${path.basename(file)} ` +
    `(${skipped} already present, ${failed} failed).`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`✘ ${err.message}`);
  process.exit(1);
});
