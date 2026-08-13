import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { wrestlingMoves } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { toMoveJson } from "@/lib/moves";

export const dynamic = "force-dynamic";

/**
 * GET /api/moves/:slug
 * Fetch a single move by its slug (e.g. /api/moves/ddt).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  await ensureSeeded();
  const { slug } = await context.params;

  const [move] = await db
    .select()
    .from(wrestlingMoves)
    .where(eq(wrestlingMoves.slug, slug))
    .limit(1);

  if (!move) {
    return NextResponse.json({ error: `Move "${slug}" not found.` }, { status: 404 });
  }

  return NextResponse.json({ move: toMoveJson(move) });
}

/**
 * DELETE /api/moves/:slug
 * Remove a move from the database.
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  const [deleted] = await db
    .delete(wrestlingMoves)
    .where(eq(wrestlingMoves.slug, slug))
    .returning({ slug: wrestlingMoves.slug, name: wrestlingMoves.name });

  if (!deleted) {
    return NextResponse.json({ error: `Move "${slug}" not found.` }, { status: 404 });
  }

  return NextResponse.json({ deleted: true, move: deleted });
}
