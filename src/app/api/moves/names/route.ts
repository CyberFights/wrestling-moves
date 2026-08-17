import { NextResponse } from "next/server";
import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { isCategory, isDifficulty } from "@/lib/moves";

export const dynamic = "force-dynamic";

/**
 * GET /api/moves/names
 * List just the names of every move in the database — a lightweight endpoint
 * for autocomplete, dropdowns, and "does this move exist?" checks.
 *
 * Query params:
 *  - q          Filter names by search term (matches the name only)
 *  - category   Power | Submission | High-Flying | Signature
 *  - difficulty Beginner | Intermediate | Advanced | Legendary
 *  - sort       name | newest | oldest   (default: name)
 *
 * Response:
 *  { count: number, names: string[] }
 */
export async function GET(request: Request) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const sort = searchParams.get("sort") ?? "name";

  const conditions = [];
  if (q) conditions.push(ilike(wrestlingMoves.name, `%${q}%`));
  if (isCategory(category)) conditions.push(eq(wrestlingMoves.category, category));
  if (isDifficulty(difficulty)) conditions.push(eq(wrestlingMoves.difficulty, difficulty));

  const orderBy =
    sort === "newest"
      ? desc(wrestlingMoves.createdAt)
      : sort === "oldest"
        ? asc(wrestlingMoves.createdAt)
        : asc(wrestlingMoves.name);

  const rows = await db
    .select({ name: wrestlingMoves.name })
    .from(wrestlingMoves)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy);

  const names = rows.map((row) => row.name);

  return NextResponse.json({ count: names.length, names });
}
