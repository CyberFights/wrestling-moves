"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteMoveButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await fetch(`/api/moves/${slug}`, { method: "DELETE" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
        <span className="text-sm text-red-300">
          Delete <span className="font-bold">{name}</span> permanently?
        </span>
        <button
          onClick={remove}
          disabled={busy}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={busy}
          className="rounded-lg border border-zinc-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500/20"
    >
      🗑 Delete move (DELETE /api/moves/{slug})
    </button>
  );
}
