import { integer } from "drizzle-orm/pg-core";
import { text, varchar } from "drizzle-orm/pg-core";
import { timestamp, uuid, pgTable, jsonb } from "drizzle-orm/pg-core";

export const resumesTable = pgTable("resumes", {
  id: uuid().primaryKey().defaultRandom(),
  original_json: jsonb().notNull(),
  language_detected: varchar({ length: 5 }).notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  file_path: text().notNull(),
  current_version: integer().notNull(),
});

export type NewResume = typeof resumesTable.$inferInsert;
