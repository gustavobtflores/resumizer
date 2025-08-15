import { and, eq } from "drizzle-orm";
import { db } from "..";
import {
  NewResumeTranslation,
  resumeTranslationsTable,
} from "../../../drizzle/schema/resume-translations";

export function createResumeTranslation(translation: NewResumeTranslation) {
  return db.insert(resumeTranslationsTable).values(translation).returning();
}

export async function findResumeTranslationById(id: string) {
  const data = await db
    .select()
    .from(resumeTranslationsTable)
    .where(eq(resumeTranslationsTable.id, id))
    .limit(1);

  return data[0];
}

export async function findResumeTranslationByIdAndLanguage(
  id: string,
  language: string
) {
  const data = await db
    .select()
    .from(resumeTranslationsTable)
    .where(
      and(
        eq(resumeTranslationsTable.resume_id, id),
        eq(resumeTranslationsTable.language, language)
      )
    )
    .limit(1);

  return data[0];
}

export async function findResumeTranslationsById(id: string) {
  const data = await db
    .select({
      language: resumeTranslationsTable.language,
    })
    .from(resumeTranslationsTable)
    .where(eq(resumeTranslationsTable.resume_id, id));

  return data;
}

export async function updateResumeTranslation(
  id: string,
  data: Partial<NewResumeTranslation>
) {
  const result = await db
    .update(resumeTranslationsTable)
    .set(data)
    .where(eq(resumeTranslationsTable.id, id))
    .returning();

  return result[0];
}
