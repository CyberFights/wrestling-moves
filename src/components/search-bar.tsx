"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const term = value.trim();
    if (term) params.set("q", term);
    else params.delete("q");
    params.delete("offset");
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl items-stretch gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search moves… try “suplex” or “submission”"
          className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/80 py-3 pl-11 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none backdrop-blur transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-red-600 px-6 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500 active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
