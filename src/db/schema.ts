import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Wrestling moves database — one row per move.
 */
export const wrestlingMoves = pgTable("wrestling_moves", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  origin: text("origin"),
  famousUsers: text("famous_users").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type WrestlingMove = typeof wrestlingMoves.$inferSelect;
export type NewWrestlingMove = typeof wrestlingMoves.$inferInsert;
