import type { WrestlingMove } from "@/db/schema";

/** The four move categories. */
export const CATEGORIES = ["Power", "Submission", "High-Flying", "Signature"] as const;

/** The four difficulty tiers. */
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Legendary"] as const;

/** Serialize a DB row into the public API shape (camelCase). */
export function toMoveJson(move: WrestlingMove) {
  return {
    id: move.id,
    slug: move.slug,
    name: move.name,
    description: move.description,
    imageUrl: move.imageUrl,
    category: move.category,
    difficulty: move.difficulty,
    origin: move.origin ?? null,
    famousUsers: move.famousUsers ?? [],
    createdAt: move.createdAt,
  };
}

/** Turn a title into a URL-safe slug: "Stone Cold Stunner" -> "stone-cold-stunner". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "move";
}

export function isCategory(value: unknown): value is (typeof CATEGORIES)[number] {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

export function isDifficulty(value: unknown): value is (typeof DIFFICULTIES)[number] {
  return typeof value === "string" && (DIFFICULTIES as readonly string[]).includes(value);
}

/** Default hero images per category, used when a move has no image URL. */
export const CATEGORY_IMAGE: Record<string, string> = {
  Power: "https://images.pexels.com/photos/29762867/pexels-photo-29762867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  Submission: "https://images.pexels.com/photos/38506828/pexels-photo-38506828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "High-Flying": "https://images.pexels.com/photos/30513965/pexels-photo-30513965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  Signature: "https://images.pexels.com/photos/30098566/pexels-photo-30098566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

/** Tailwind classes for category badges. */
export const CATEGORY_STYLE: Record<string, string> = {
  Power: "bg-red-500/15 text-red-400 ring-red-500/30",
  Submission: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  "High-Flying": "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  Signature: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
};

/** Tailwind classes for difficulty badges. */
export const DIFFICULTY_STYLE: Record<string, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  Intermediate: "bg-lime-500/15 text-lime-400 ring-lime-500/30",
  Advanced: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
  Legendary: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/30",
};
