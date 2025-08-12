import { openaiClient } from "./openai";
import { Resume } from "../../types/resume";
import { gptDefaultModel } from "./model";

export async function translateResume(
  resumeJson: Resume,
  targetLanguage: "pt-BR" | "en-US" | "es-ES"
) {
  const system = `
    You translate JSON resume content into ${targetLanguage} using ATS-friendly phrasing.
    Rules (strict):
    1) Preserve structure & keys exactly as provided. Translate values only (strings).
    2) No new facts, no deletions, no reordering of arrays. If a value is empty, keep it empty.
    3) Keep identifiers, URLs, emails, phone numbers, codes, and proper nouns as-is unless a widely accepted localized form exists.
    4) Dates & numbers: keep original formats (e.g., ISO dates YYYY-MM-DD, percentages 45%, currency symbols in text stay as-is).
    5) ATS style: concise verbs, avoid flowery language, prefer standard job/skill terms. Keep bullet-like phrasing in lists; avoid first-person.
    6) Safety valves: If text is ambiguous or untranslatable, keep the original value; do not guess.
    7) Output must validate against the provided JSON Schema (strict). No extra fields, comments, or prose.
    `.trim();

  const response = await openaiClient.responses.create({
    model: gptDefaultModel,
    input: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: `Target language: ${targetLanguage}\n\nResume JSON:\n${JSON.stringify(
          resumeJson
        )}`,
      },
    ],
  });

  return JSON.parse(response.output_text);
}
