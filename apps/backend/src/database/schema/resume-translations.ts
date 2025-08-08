import { varchar } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { resumesTable } from "./resumes";

export const resumeTranslationsTable = pgTable("resume_translations", {
  id: uuid().primaryKey().defaultRandom(),
  resume_id: uuid()
    .notNull()
    .references(() => resumesTable.id, { onDelete: "cascade" }),
  language: varchar({ length: 5 }).notNull(),
  translated_json: jsonb().notNull(),
});

export type NewResumeTranslation = typeof resumeTranslationsTable.$inferInsert;
export type ResumeTranslation = typeof resumeTranslationsTable.$inferSelect;
