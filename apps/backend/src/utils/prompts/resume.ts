import { ZodResumeSchema } from "../schemas/zod/resume";

const resumeSchema = ZodResumeSchema.shape;

export const resumeExtractionSystemPrompt = `
You are an AI that extracts all possible structured information from resumes.
- Return ONLY a valid JSON object — no explanations or extra text.
- If a field is missing, set its value to null.
- Follow the provided JSON structure exactly.
- Parse dates into "YYYY-MM" format when possible, or preserve original if ambiguous.
- For ongoing positions/items, use "present".
- Extract bullet points into arrays for achievements/descriptions.
- Preserve any custom sections in "additional_sections" as key-value pairs.
- Preserve proficiency levels (e.g., "Expert", "Native") when available.
- Extract all URLs and categorize appropriately.
- For skills, categorize into technical vs. soft skills based on context.
`.trim();

export function buildResumeExtractionUserPrompt(resumeText: string): string {
  return `
Extract every piece of information from the provided resume and return it as a structured JSON object.

Resume text:
\`\`\`
${resumeText}
\`\`\`

Return the data in this exact JSON structure:
\`\`\`json
${JSON.stringify(resumeSchema, null, 2)}
\`\`\`
`.trim();
}
