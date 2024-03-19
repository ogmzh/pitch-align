import { relations, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { numeric, pgTable, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").$defaultFn(uuidv4).primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  theses: many(theses),
  pitches: many(pitches),
}));

export const theses = pgTable("thesis", {
  id: text("id").$defaultFn(uuidv4).primaryKey(), // we get a mismatch on foreign keys between uuid and text...
  name: text("name").notNull(),
  tag: text("tag"),
  description: text("description"),
  color: text("color"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const thesesRelations = relations(theses, ({ one, many }) => ({
  user: one(users, {
    fields: [theses.userId],
    references: [users.id],
  }),
  thesisPitchMatch: many(thesisPitchMatches),
}));

export const pitches = pgTable("pitch", {
  id: text("id").$defaultFn(uuidv4).primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const pitchRelations = relations(pitches, ({ one, many }) => ({
  user: one(users, {
    fields: [pitches.userId],
    references: [users.id],
  }),
  thesisPitchMatch: many(thesisPitchMatches),
}));

export const thesisPitchMatches = pgTable("thesis_pitch_match", {
  id: text("id").$defaultFn(uuidv4).primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  matchPercentage: numeric("match_percentage").notNull(),
  reason: text("reason").notNull(),
  thesisId: text("thesis_id")
    .references(() => theses.id, { onDelete: "cascade" })
    .notNull(),
  pitchId: text("pitch_id")
    .references(() => pitches.id, { onDelete: "cascade" })
    .notNull(),
});

export type SelectUser = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;

export type SelectThesis = typeof theses.$inferSelect;
export type CreateThesis = typeof theses.$inferInsert;

export type SelectPitch = typeof pitches.$inferSelect;
export type CreatePitch = typeof pitches.$inferInsert;

export type SelectThesisPitchMatch = typeof thesisPitchMatches.$inferSelect;
export type CreateThesisPitchMatch = typeof thesisPitchMatches.$inferInsert;
