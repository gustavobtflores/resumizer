import { openaiClient } from "./openai";
import { Resume } from "../../types/resume";

export async function translateResume(
  resumeJson: Resume,
  targetLanguage: "pt-BR" | "en-US" | "es-ES"
) {
  const response = await openaiClient.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content: [
          "You are an expert translation AI.",
          "Translate only user-facing fields of the JSON object into the specified target language.",
          "Do NOT translate keys, URLs, phone numbers, emails, or ISO dates.",
          "Preserve the exact schema and update metadata.language to the target language code.",
        ].join(" "),
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
