import { db } from "..";
import { NewResume, resumesTable } from "../schema/resumes";

export function createResume(resume: NewResume) {
  return db.insert(resumesTable).values(resume).returning();
}
