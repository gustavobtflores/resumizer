import { timestamp, uuid, pgTable, jsonb } from "drizzle-orm/pg-core";
import { resumesTable } from "./resumes";
import { integer } from "drizzle-orm/pg-core";

export const resumeVersionsTable = pgTable("resume_versions", {
  id: uuid().primaryKey().defaultRandom(),
  resume_id: uuid()
    .notNull()
    .references(() => resumesTable.id),
  version_number: integer().notNull(),
  json: jsonb().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type NewResumeVersion = typeof resumeVersionsTable.$inferInsert;
export type ResumeVersion = typeof resumeVersionsTable.$inferSelect;
