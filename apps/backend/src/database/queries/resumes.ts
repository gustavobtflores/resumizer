import { eq } from "drizzle-orm";
import { db } from "..";
import { NewResume, resumesTable } from "../schema/resumes";

export function createResume(resume: NewResume) {
  return db.insert(resumesTable).values(resume).returning();
}

export function updateResume(id: string, resume: Partial<NewResume>) {
  return db
    .update(resumesTable)
    .set({ original_json: resume })
    .where(eq(resumesTable.id, id))
    .returning();
}

export function findAllResumes() {
  return db.select().from(resumesTable);
}

export async function findResumeById(id: string) {
  const result = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.id, id))
    .limit(1);
  return result[0];
}
