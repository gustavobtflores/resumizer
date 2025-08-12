import { zodTextFormat } from "openai/helpers/zod";
import { resumeExtractionPrompt } from "../../utils/prompts/resume";
import { openaiClient } from "./openai";
import { ZodResumeSchema } from "../../utils/schemas/zod/resume";
import { gptDefaultModel } from "./model";

export async function extractResumeData(resumeText: string) {
  const response = await openaiClient.responses.create({
    model: gptDefaultModel,
    input: resumeExtractionPrompt(resumeText),
    text: {
      format: zodTextFormat(ZodResumeSchema, "resume"),
    },
  });

  const responseJson = JSON.parse(response.output_text);
  const parsedData = ZodResumeSchema.safeParse(responseJson);

  if (!parsedData.success) {
    throw new Error(
      "Failed to parse extracted resume data: " + parsedData.error.message
    );
  }

  return parsedData.data;
}
