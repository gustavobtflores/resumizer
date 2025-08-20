import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { resumeTranslationsTable } from "./resume-translations";

export const jobsTable = pgTable("jobs", {
  id: uuid().primaryKey().defaultRandom(),
  resume_id: uuid()
    .notNull()
    .references(() => resumeTranslationsTable.id, { onDelete: "cascade" }),
  job_description: text().notNull(),
  evaluation: jsonb().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type Job = typeof jobsTable.$inferSelect;
export type NewJob = typeof jobsTable.$inferInsert;
