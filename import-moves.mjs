// Bulk-imports every move in moves-100.json into the app via POST /api/moves.
//
// Usage:
//   1. Start the app:  npm run dev
//   2. Run importer:   node import-moves.mjs [baseUrl]
//      e.g.            node import-moves.mjs http://localhost:3000
//
// Each object in moves-100.json also matches the `wrestlingMoves` insert
// shape in src/db/schema.ts, so you can copy/paste any single entry
// straight into the Add-Move form or a POST body.
import fs from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const moves = JSON.parse(
  fs.readFileSync(new URL("./moves-100.json", import.meta.url), "utf8"),
);

let ok = 0;
for (const m of moves) {
  const res = await fetch(`${base}/api/moves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(m), // extra `slug` key is ignored; the API generates its own
  });
  if (res.ok) {
    ok++;
    console.log(`✔ ${m.slug}`);
  } else {
    console.error(`✘ ${m.slug} — ${res.status} ${await res.text()}`);
  }
}
console.log(`\nImported ${ok}/${moves.length} moves.`);
