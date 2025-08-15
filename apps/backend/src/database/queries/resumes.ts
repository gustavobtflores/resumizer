import { eq } from "drizzle-orm";
import { db } from "..";
import { NewResume, resumesTable } from "../../../drizzle/schema/resumes";
import { resumeTranslationsTable } from "../../../drizzle/schema/resume-translations";

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

export function deleteResume(id: string) {
  return db.delete(resumesTable).where(eq(resumesTable.id, id));
}

export function findAllResumes() {
  return db.select().from(resumesTable);
}

export async function findResumeById(id: string) {
  const result = await db
    .select()
    .from(resumeTranslationsTable)
    .where(eq(resumeTranslationsTable.resume_id, id))
    .limit(1);

  return result[0];
}
