import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-center text-zinc-100">
      <div>
        <p className="text-8xl font-black uppercase italic tracking-tighter text-red-600">404</p>
        <h1 className="mt-4 text-3xl font-black uppercase italic tracking-tight">
          Move not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          This move isn&apos;t in the database. It may have been deleted, or the slug is wrong.
          Check the index or search for something else.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500"
        >
          ← Back to the index
        </Link>
      </div>
    </main>
  );
}
