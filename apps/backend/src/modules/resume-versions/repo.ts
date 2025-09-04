import { and, desc, eq } from "drizzle-orm";
import {
  NewResumeVersion,
  resumeVersionsTable,
} from "../../../drizzle/schema/resume-versions";
import { Database, db } from "../../database";

export const ResumeVersionsRepo = {
  findResumeVersions: async (id: string) => {
    const data = await db
      .select({
        version_number: resumeVersionsTable.version_number,
      })
      .from(resumeVersionsTable)
      .where(eq(resumeVersionsTable.resume_id, id));

    return data;
  },
  findVersionById: async (id: string) => {
    const data = await db
      .select()
      .from(resumeVersionsTable)
      .where(eq(resumeVersionsTable.id, id))
      .limit(1);

    return data[0];
  },
  findLatestVersionByResumeId: async (id: string) => {
    const data = await db
      .select()
      .from(resumeVersionsTable)
      .where(eq(resumeVersionsTable.resume_id, id))
      .orderBy(desc(resumeVersionsTable.version_number))
      .limit(1);

    return data[0];
  },
  createVersion: async (version: NewResumeVersion, tx: Database = db) => {
    const data = await tx
      .insert(resumeVersionsTable)
      .values(version)
      .returning();

    return data[0];
  },
  findResumeByVersionAndId: async ({
    id,
    version,
  }: {
    id: string;
    version: number;
  }) => {
    const data = await db
      .select()
      .from(resumeVersionsTable)
      .where(
        and(
          eq(resumeVersionsTable.resume_id, id),
          eq(resumeVersionsTable.version_number, version)
        )
      )
      .limit(1);

    return data[0];
  },
};
