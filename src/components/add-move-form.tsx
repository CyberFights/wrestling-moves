"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/moves";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; slug: string; name: string }
  | { kind: "error"; message: string };

export default function AddMoveForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "Power",
    difficulty: "Intermediate",
    origin: "",
    famousUsers: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/moves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl || undefined,
          category: form.category,
          difficulty: form.difficulty,
          origin: form.origin || undefined,
          famousUsers: form.famousUsers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Failed to add the move." });
        return;
      }
      setStatus({ kind: "success", slug: data.move.slug, name: data.move.name });
      setForm({ name: "", description: "", imageUrl: "", category: "Power", difficulty: "Intermediate", origin: "", famousUsers: "" });
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Network error — could not reach the API." });
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Move name <span className="text-red-500">*</span>
          </span>
          <input
            required
            minLength={2}
            maxLength={80}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Dragon Suplex"
            className={inputClass}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Image URL <span className="text-zinc-600">(optional)</span>
          </span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="https://… (defaults per category)"
            className={inputClass}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Description <span className="text-red-500">*</span>
        </span>
        <textarea
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="How is the move performed? What makes it famous?"
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Category</span>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Difficulty</span>
          <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className={inputClass}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Origin</span>
          <input
            value={form.origin}
            onChange={(e) => update("origin", e.target.value)}
            placeholder="e.g. Bret Hart"
            className={inputClass}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Famous users <span className="text-zinc-600">(comma-separated)</span>
        </span>
        <input
          value={form.famousUsers}
          onChange={(e) => update("famousUsers", e.target.value)}
          placeholder="Kurt Angle, Brock Lesnar"
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        disabled={status.kind === "saving"}
        className="mt-1 rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status.kind === "saving" ? "Posting to /api/moves…" : "Add move to database"}
      </button>

      {status.kind === "success" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          ✅ <span className="font-bold">{status.name}</span> added!{" "}
          <a href={`/moves/${status.slug}`} className="font-bold underline underline-offset-2 hover:text-emerald-200">
            View it →
          </a>
        </div>
      )}
      {status.kind === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ❌ {status.message}
        </div>
      )}
    </form>
  );
}
