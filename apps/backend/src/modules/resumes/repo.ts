import { eq } from "drizzle-orm";
import { NewResume, resumesTable } from "../../../drizzle/schema/resumes";
import { db } from "../../database";
import { resumeTranslationsTable } from "../../../drizzle/schema/resume-translations";

export const ResumesRepo = {
  createResume: (resume: NewResume) => {
    return db.insert(resumesTable).values(resume).returning();
  },
  findResumeById: async (id: string) => {
    const data = await db
      .select()
      .from(resumeTranslationsTable)
      .where(eq(resumeTranslationsTable.resume_id, id))
      .limit(1);

    return data[0];
  },
  findAllResumes: () => {
    return db.select().from(resumesTable);
  },
  updateResume: (id: string, resume: Partial<NewResume>) => {
    return db
      .update(resumesTable)
      .set({ original_json: resume })
      .where(eq(resumesTable.id, id))
      .returning();
  },
  deleteResume: (id: string) => {
    return db.delete(resumesTable).where(eq(resumesTable.id, id));
  },
};
