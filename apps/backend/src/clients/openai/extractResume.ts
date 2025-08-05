import { zodTextFormat } from "openai/helpers/zod";
import { resumeExtractionPrompt } from "../../utils/prompts/resume";
import { openaiClient } from "./openai";
import { ZodResumeSchema } from "../../utils/schemas/zod/resume";

export async function extractResumeData(resumeText: string) {
  const response = await openaiClient.responses.create({
    model: "gpt-4.1",
    input: resumeExtractionPrompt(resumeText),
    text: {
      format: zodTextFormat(ZodResumeSchema, "resume"),
    },
  });

  console.log(response.output_text);

  return response.output_text;
}
