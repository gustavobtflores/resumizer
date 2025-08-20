import { eq } from "drizzle-orm";
import { jobsTable, NewJob } from "../../../drizzle/schema/jobs";
import { db } from "../../database";

export async function createJob(jobData: NewJob) {
  const data = await db.insert(jobsTable).values(jobData).returning();

  return {
    ...data[0],
  };
}

export async function findJobById(id: string) {
  const data = await db
    .select()
    .from(jobsTable)
    .where(eq(jobsTable.id, id))
    .limit(1);

  if (data.length === 0) return null;

  return {
    ...data[0],
  };
}

export async function findAllJobs() {
  const data = await db.select().from(jobsTable);

  return data.map((job) => ({
    ...job,
  }));
}

export async function deleteJobById(id: string) {
  const result = await db
    .delete(jobsTable)
    .where(eq(jobsTable.id, id))
    .returning();

  return result.length > 0;
}
