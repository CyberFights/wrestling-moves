import { NextResponse } from "next/server";
import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import {
  CATEGORY_IMAGE,
  isCategory,
  isDifficulty,
  slugify,
  toMoveJson,
} from "@/lib/moves";

export const dynamic = "force-dynamic";

/**
 * GET /api/moves
 * List, search, and filter the wrestling moves database.
 *
 * Query params:
 *  - q          Search term (matches name or description)
 *  - category   Power | Submission | High-Flying | Signature
 *  - difficulty Beginner | Intermediate | Advanced | Legendary
 *  - sort       name | newest | oldest   (default: name)
 *  - limit      1–100 (default: 50)
 *  - offset     pagination offset (default: 0)
 */
export async function GET(request: Request) {
  await ensureSeeded();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const sort = searchParams.get("sort") ?? "name";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 1), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10) || 0, 0);

  const conditions = [];
  if (q) conditions.push(or(ilike(wrestlingMoves.name, `%${q}%`), ilike(wrestlingMoves.description, `%${q}%`)));
  if (isCategory(category)) conditions.push(eq(wrestlingMoves.category, category));
  if (isDifficulty(difficulty)) conditions.push(eq(wrestlingMoves.difficulty, difficulty));

  const orderBy =
    sort === "newest"
      ? desc(wrestlingMoves.createdAt)
      : sort === "oldest"
        ? asc(wrestlingMoves.createdAt)
        : asc(wrestlingMoves.name);

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [countRow]] = await Promise.all([
    db.select().from(wrestlingMoves).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ n: count() }).from(wrestlingMoves).where(where),
  ]);

  return NextResponse.json({
    count: countRow?.n ?? rows.length,
    limit,
    offset,
    moves: rows.map(toMoveJson),
  });
}

/**
 * POST /api/moves
 * Add a new move to the database.
 *
 * Body (JSON):
 *  - name        (required)
 *  - description (required)
 *  - imageUrl    (optional — falls back to a category default)
 *  - category    (optional — defaults to "Power")
 *  - difficulty  (optional — defaults to "Intermediate")
 *  - origin      (optional)
 *  - famousUsers (optional string[] or comma-separated string)
 */
export async function POST(request: Request) {
  await ensureSeeded();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";

  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Move name is required (2–80 characters)." }, { status: 400 });
  }
  if (!description || description.length < 10 || description.length > 2000) {
    return NextResponse.json({ error: "Move description is required (10–2000 characters)." }, { status: 400 });
  }

  const category = isCategory(data.category) ? data.category : "Power";
  const difficulty = isDifficulty(data.difficulty) ? data.difficulty : "Intermediate";
  const origin = typeof data.origin === "string" && data.origin.trim() ? data.origin.trim() : null;

  let famousUsers: string[] = [];
  if (Array.isArray(data.famousUsers)) {
    famousUsers = data.famousUsers
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      .map((u) => u.trim())
      .slice(0, 12);
  } else if (typeof data.famousUsers === "string" && data.famousUsers.trim()) {
    famousUsers = data.famousUsers
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  const imageUrl =
    typeof data.imageUrl === "string" && data.imageUrl.trim()
      ? data.imageUrl.trim()
      : CATEGORY_IMAGE[category];

  // Ensure a unique slug: "name", "name-2", "name-3", …
  const baseSlug = slugify(name);
  let slug = baseSlug;
  for (let i = 2; i <= 12; i++) {
    const existing = await db
      .select({ id: wrestlingMoves.id })
      .from(wrestlingMoves)
      .where(eq(wrestlingMoves.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    slug = `${baseSlug}-${i}`;
  }

  const [created] = await db
    .insert(wrestlingMoves)
    .values({ slug, name, description, imageUrl, category, difficulty, origin, famousUsers })
    .returning();

  return NextResponse.json({ move: toMoveJson(created) }, { status: 201 });
}
