import Image from "next/image";
import Link from "next/link";
import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { CATEGORIES } from "@/lib/moves";
import MoveCard from "@/components/move-card";
import SearchBar from "@/components/search-bar";
import AddMoveForm from "@/components/add-move-form";

export const dynamic = "force-dynamic";

const CATEGORY_FILTERS = ["All", ...CATEGORIES];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await ensureSeeded();

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const category =
    typeof sp.category === "string" && (CATEGORIES as readonly string[]).includes(sp.category)
      ? sp.category
      : null;

  const conditions = [];
  if (q) {
    conditions.push(
      or(ilike(wrestlingMoves.name, `%${q}%`), ilike(wrestlingMoves.description, `%${q}%`)),
    );
  }
  if (category) conditions.push(eq(wrestlingMoves.category, category));
  const where = conditions.length ? and(...conditions) : undefined;

  const [moves, [totalRow], [legendaryRow]] = await Promise.all([
    db.select().from(wrestlingMoves).where(where).orderBy(asc(wrestlingMoves.name)),
    db.select({ n: count() }).from(wrestlingMoves),
    db.select({ n: count() }).from(wrestlingMoves).where(eq(wrestlingMoves.difficulty, "Legendary")),
  ]);

  const linkParams = (overrides: { category?: string | null }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const cat = overrides.category ?? category;
    if (cat) params.set("category", cat);
    const s = params.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ===== Nav ===== */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 -skew-x-6 place-items-center rounded-lg bg-red-600 text-lg font-black shadow-lg shadow-red-900/50">
              🤼
            </span>
            <span className="text-xl font-black uppercase italic tracking-tight">
              Slam<span className="text-red-500">DB</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest sm:gap-2">
            <a href="#moves" className="rounded-lg px-3 py-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
              Moves
            </a>
            <a href="#api" className="rounded-lg px-3 py-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white">
              API
            </a>
            <a
              href="/api/moves"
              className="hidden rounded-lg bg-zinc-900 px-3 py-2 text-zinc-300 ring-1 ring-zinc-700 transition hover:bg-zinc-800 hover:text-white sm:block"
            >
              JSON ⤷
            </a>
          </div>
        </nav>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/hero-ring.jpg"
          alt="An empty wrestling ring under a single spotlight in a dark arena"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-28">
          <p className="mx-auto inline-block rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
            The professional wrestling move database
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black uppercase italic leading-[0.95] tracking-tight sm:text-7xl">
            Every move.
            <br />
            <span className="text-red-500">Every legend.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {totalRow?.n ?? 0} classic moves — DDTs, suplexes, splashes, and submissions — documented with
            full descriptions, difficulty ratings, and the legends who made them famous. All served through a
            live REST API.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar initialValue={q} />
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-zinc-700/60 rounded-2xl border border-zinc-800 bg-zinc-900/50 py-4 backdrop-blur">
            <div>
              <p className="text-2xl font-black text-white sm:text-3xl">{totalRow?.n ?? 0}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Moves indexed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white sm:text-3xl">{CATEGORIES.length}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-black text-red-500 sm:text-3xl">{legendaryRow?.n ?? 0}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Legendary moves</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Move grid ===== */}
      <section id="moves" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
              The Move <span className="text-red-500">Index</span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {moves.length} move{moves.length === 1 ? "" : "s"}
              {q ? (
                <>
                  {" "}
                  matching “<span className="font-semibold text-white">{q}</span>”
                </>
              ) : null}
              {category ? (
                <>
                  {" "}
                  in <span className="font-semibold text-white">{category}</span>
                </>
              ) : null}
            </p>
          </div>
          {q || category ? (
            <a
              href="/"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 transition hover:border-red-500/50 hover:text-red-400"
            >
              ✕ Clear filters
            </a>
          ) : null}
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((c) => {
            const active = (c === "All" && !category) || c === category;
            const href = linkParams({ category: c === "All" ? null : c });
            return (
              <a
                key={c}
                href={href}
                className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest ring-1 transition ${
                  active
                    ? "bg-red-600 text-white ring-red-500"
                    : "bg-zinc-900 text-zinc-400 ring-zinc-700 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {c}
              </a>
            );
          })}
        </div>

        {moves.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-12 text-center">
            <p className="text-4xl">🤷</p>
            <p className="mt-3 text-lg font-bold uppercase tracking-wide">No moves found</p>
            <p className="mt-1 text-sm text-zinc-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moves.map((move) => (
              <MoveCard key={move.id} move={move} />
            ))}
          </div>
        )}
      </section>

      {/* ===== API docs ===== */}
      <section id="api" className="scroll-mt-20 border-t border-zinc-800/80 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
                REST <span className="text-red-500">API</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                The entire database is served over JSON. Read, search, create, and delete moves from any
                client.
              </p>
            </div>
            <a
              href="/api/moves"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500"
            >
              Try it live →
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* GET collection */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-black tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                  GET
                </span>
                <code className="text-sm font-semibold text-white">/api/moves</code>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                List &amp; search every move. Filter with query parameters.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-400">
{`GET /api/moves?q=suplex
GET /api/moves?category=Submission
GET /api/moves?difficulty=Legendary
GET /api/moves?sort=newest&limit=5`}
              </pre>
            </div>

            {/* GET single */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-black tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                  GET
                </span>
                <code className="text-sm font-semibold text-white">/api/moves/:slug</code>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Fetch one move by slug, with its full profile.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-400">
{`GET /api/moves/ddt
GET /api/moves/tombstone-piledriver
GET /api/moves/stone-cold-stunner`}
              </pre>
            </div>

            {/* POST */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-black tracking-wider text-sky-400 ring-1 ring-sky-500/30">
                  POST
                </span>
                <code className="text-sm font-semibold text-white">/api/moves</code>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Add a new move. Returns <code className="text-zinc-300">201</code> with the created record.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-400">
{`curl -X POST /api/moves \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Dragon Suplex",
       "description":"A bridging full-nelson
       suplex invented by Tatsumi Fujinami.",
       "category":"Power",
       "difficulty":"Advanced",
       "famousUsers":["Tatsumi Fujinami"]}'`}
              </pre>
            </div>

            {/* DELETE */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-[11px] font-black tracking-wider text-red-400 ring-1 ring-red-500/30">
                  DELETE
                </span>
                <code className="text-sm font-semibold text-white">/api/moves/:slug</code>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Remove a move from the database.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-400">
{`curl -X DELETE /api/moves/dragon-suplex
→ { "deleted": true,
    "move": { "slug": "dragon-suplex",
              "name": "Dragon Suplex" } }`}
              </pre>
            </div>
          </div>

          {/* Example response */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Example response — <code className="normal-case text-emerald-400">GET /api/moves/sharpshooter</code>
              </p>
            </div>
            <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-zinc-400">
{`{
  "move": {
    "id": 7,
    "slug": "sharpshooter",
    "name": "Sharpshooter",
    "description": "A leg-lock submission where the attacker steps through
      the opponent's legs, crosses them, and turns the opponent over…",
    "imageUrl": "https://images.pexels.com/photos/11392044/…",
    "category": "Submission",
    "difficulty": "Advanced",
    "origin": "Riki Chōshū (Scorpion Deathlock) — Bret Hart",
    "famousUsers": ["Bret Hart", "Natalya", "The Rock"],
    "createdAt": "2026-02-10T14:32:07.000Z"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ===== Add a move ===== */}
      <section id="add" className="scroll-mt-20 border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tight sm:text-4xl">
                Add your own <span className="text-red-500">move</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                This form posts straight to <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-red-400">POST /api/moves</code>.
                The move is validated server-side, given a unique slug, and written to PostgreSQL via Drizzle —
                then it appears in the index above.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                {[
                  "Name and description are required — everything else is optional.",
                  "Leave the image URL empty to get a category default photo.",
                  "Duplicate names get an auto-suffixed slug like “ddt-2”.",
                  "Every move gets a DELETE button on its detail page.",
                ].map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-0.5 text-red-500">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl shadow-black/30">
              <AddMoveForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            🤼 SlamDB — the professional wrestling move database
          </p>
          <p className="text-xs text-zinc-600">
            Next.js · PostgreSQL · Drizzle ORM ·{" "}
            <a href="/api/moves" className="text-zinc-500 underline underline-offset-2 hover:text-red-400">
              /api/moves
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
