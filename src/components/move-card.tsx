import Link from "next/link";
import type { WrestlingMove } from "@/db/schema";
import { CATEGORY_STYLE, DIFFICULTY_STYLE } from "@/lib/moves";
import MoveImage from "@/components/move-image";

export default function MoveCard({ move }: { move: WrestlingMove }) {
  return (
    <Link
      href={`/moves/${move.slug}`}
      className="group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-red-900/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        <MoveImage
          src={move.imageUrl}
          alt={move.name}
          category={move.category}
          imgClassName="transition duration-500 group-hover:scale-105"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 backdrop-blur ${CATEGORY_STYLE[move.category] ?? ""}`}
        >
          {move.category}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 backdrop-blur ${DIFFICULTY_STYLE[move.difficulty] ?? ""}`}
        >
          {move.difficulty}
        </span>
        <h3 className="absolute inset-x-4 bottom-3 text-2xl font-black uppercase italic tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {move.name}
        </h3>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">{move.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {move.famousUsers?.slice(0, 2).join(" · ") || move.origin}
          </span>
          <span className="text-sm font-black uppercase text-red-500 transition group-hover:translate-x-1">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
