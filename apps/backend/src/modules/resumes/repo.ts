import { eq } from "drizzle-orm";
import { NewResume, resumesTable } from "../../../drizzle/schema/resumes";
import { Database, db } from "../../database";

export const ResumesRepo = {
  createResume: async (resume: NewResume, tx: Database = db) => {
    const data = await tx.insert(resumesTable).values(resume).returning();

    return data[0];
  },
  findResumeById: async (id: string) => {
    const data = await db
      .select()
      .from(resumesTable)
      .where(eq(resumesTable.id, id))
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
  existsById: async (id: string) => {
    const data = await db
      .select()
      .from(resumesTable)
      .where(eq(resumesTable.id, id))
      .limit(1);

    return data.length > 0;
  },
};
