import { FastifyInstance } from "fastify";
import { cleanResumeText } from "../../utils/resume-text-cleaner";
import { Result } from "pdf-parse";
import {
  resumeExtractionSystemPrompt,
  ZodResumeSchema,
} from "../../utils/prompts/resume";
import { Resume } from "../../types/resume";
import { resumeTranslationSystemPrompt } from "../../utils/prompts/translation";
import { Language } from "../../constants/languages";

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
  targetLanguage: Language
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
