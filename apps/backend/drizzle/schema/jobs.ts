import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { resumeVersionsTable } from "./resume-versions";

export const jobsTable = pgTable("jobs", {
  id: uuid().primaryKey().defaultRandom(),
  resume_version_id: uuid()
    .notNull()
    .references(() => resumeVersionsTable.id, { onDelete: "set null" }),
  job_description: text().notNull(),
  evaluation: jsonb().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type Job = typeof jobsTable.$inferSelect;
export type NewJob = typeof jobsTable.$inferInsert;
