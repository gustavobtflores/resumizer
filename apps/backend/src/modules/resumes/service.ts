import { FastifyInstance } from "fastify";
import { cleanResumeText } from "../../utils/resume-text-cleaner";
import { Result } from "pdf-parse";
import { resumeExtractionSystemPrompt } from "../../utils/prompts/resume";
import { ZodResumeSchema } from "../../utils/schemas/zod/resume";
import { Resume } from "../../types/resume";
import { Languages } from "../../types/languages";
import { resumeTranslationSystemPrompt } from "../../utils/prompts/translation";

export async function extractResumeToJson(app: FastifyInstance, data: Result) {
  const cleanedText = cleanResumeText(data.text);
  const result = app.chatJson({
    system: resumeExtractionSystemPrompt,
    user: cleanedText,
    schema: ZodResumeSchema,
  });

  return result;
}

export async function translateResumeToJson(
  app: FastifyInstance,
  resumeJson: Resume,
  targetLanguage: Languages
) {
  const result = app.chatJson({
    system: resumeTranslationSystemPrompt(targetLanguage),
    user: `Target language: ${targetLanguage}\n\nResume JSON:\n${JSON.stringify(
      resumeJson
    )}`,
    schema: ZodResumeSchema,
  });

  return result;
}
