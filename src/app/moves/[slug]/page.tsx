import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { CATEGORY_STYLE, DIFFICULTY_STYLE, toMoveJson } from "@/lib/moves";
import MoveCard from "@/components/move-card";
import MoveImage from "@/components/move-image";
import DeleteMoveButton from "@/components/delete-move-button";

export const dynamic = "force-dynamic";

export default async function MovePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await ensureSeeded();
  const { slug } = await params;

  const [move] = await db
    .select()
    .from(wrestlingMoves)
    .where(eq(wrestlingMoves.slug, slug))
    .limit(1);

  if (!move) notFound();

  const related = await db
    .select()
    .from(wrestlingMoves)
    .where(and(eq(wrestlingMoves.category, move.category), ne(wrestlingMoves.id, move.id)))
    .orderBy(asc(wrestlingMoves.name))
    .limit(3);

  const json = JSON.stringify({ move: toMoveJson(move) }, null, 2);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/70 bg-zinc-950/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 -skew-x-6 place-items-center rounded-lg bg-red-600 text-lg font-black shadow-lg shadow-red-900/50">
              🤼
            </span>
            <span className="text-xl font-black uppercase italic tracking-tight">
              Slam<span className="text-red-500">DB</span>
            </span>
          </Link>
          <Link
            href="/#moves"
            className="rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            ← Back to index
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/" className="transition hover:text-red-400">
            Home
          </Link>{" "}
          <span className="mx-1 text-zinc-700">/</span>
          <Link href="/#moves" className="transition hover:text-red-400">
            Moves
          </Link>{" "}
          <span className="mx-1 text-zinc-700">/</span>
          <span className="text-red-500">{move.name}</span>
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50">
            <MoveImage
              src={move.imageUrl}
              alt={move.name}
              category={move.category}
              className="aspect-[16/10] w-full"
            />
          </div>

          {/* Profile */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ring-1 ${CATEGORY_STYLE[move.category] ?? ""}`}>
                {move.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ring-1 ${DIFFICULTY_STYLE[move.difficulty] ?? ""}`}>
                {move.difficulty}
              </span>
            </div>

            <h1 className="mt-4 text-5xl font-black uppercase italic leading-[0.95] tracking-tight sm:text-6xl">
              {move.name}
            </h1>

            <p className="mt-5 text-[15px] leading-relaxed text-zinc-300">{move.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Origin</p>
                <p className="mt-1 text-sm font-semibold text-white">{move.origin ?? "Unknown"}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">API slug</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  <code className="rounded bg-black/60 px-1.5 py-0.5 text-red-400">/api/moves/{move.slug}</code>
                </p>
              </div>
            </div>

            {move.famousUsers && move.famousUsers.length > 0 && (
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Famous users</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {move.famousUsers.map((user) => (
                    <span
                      key={user}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-200 ring-1 ring-zinc-700"
                    >
                      {user}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-8">
              <DeleteMoveButton slug={move.slug} name={move.name} />
            </div>
          </div>
        </div>

        {/* Raw JSON */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Raw API response — <code className="normal-case text-emerald-400">GET /api/moves/{move.slug}</code>
            </p>
            <a
              href={`/api/moves/${move.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 ring-1 ring-zinc-700 transition hover:bg-zinc-800"
            >
              Open JSON ⤷
            </a>
          </div>
          <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-zinc-400">{json}</pre>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-black uppercase italic tracking-tight sm:text-3xl">
              More <span className="text-red-500">{move.category}</span> moves
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m) => (
                <MoveCard key={m.id} move={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
