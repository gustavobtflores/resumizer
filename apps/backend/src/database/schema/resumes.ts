import { timestamp, uuid, pgTable, jsonb } from "drizzle-orm/pg-core";

export const resumesTable = pgTable("resumes", {
  id: uuid().primaryKey().defaultRandom(),
  original_json: jsonb().notNull(),
  improved_json: jsonb(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type NewResume = typeof resumesTable.$inferInsert;
