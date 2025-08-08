import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { resumesTable } from "./resumes";

export const jobsTable = pgTable("jobs", {
  id: uuid().primaryKey().defaultRandom(),
  resume_id: uuid()
    .notNull()
    .references(() => resumesTable.id, { onDelete: "cascade" }),
  job_description: jsonb().notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
