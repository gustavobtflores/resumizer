import { ZodResumeSchema } from "../schemas/zod/resume";

const resumeSchema = ZodResumeSchema.shape;

export const resumeExtractionPrompt = (
  resumeText: string
) => `Extract all information from the provided resume and return it as a structured JSON object. Follow these instructions exactly:

1. Extract every piece of information present in the resume
2. Return ONLY the JSON object - no explanations or additional text
3. Use null for any fields that are not present in the resume
4. Maintain the exact structure shown below
5. Parse dates into "YYYY-MM" format when possible, or preserve original format if ambiguous

Resume text:

${resumeText}

Return the data in this exact JSON structure:

${JSON.stringify(resumeSchema, null, 2)}

Important parsing rules:
- For dates, use "present" for current positions/ongoing items
- Extract bullet points into arrays for achievements/descriptions
- Preserve any custom sections in "additional_sections" as key-value pairs
- If proficiency levels are mentioned (e.g., "Expert", "Native"), preserve them
- Extract all URLs and categorize them appropriately
- For skills, attempt to categorize into technical vs soft skills based on context`;
