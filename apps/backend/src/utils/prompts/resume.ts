import z from "zod";
import { SUPPORTED_LANGUAGES } from "../../constants/languages";

export const ZodResumeSchema = z.object({
  personal_info: z.object({
    full_name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
      postal_code: z.string(),
    }),
    linkedin_url: z.string(),
    github_url: z.string(),
    portfolio_url: z.string(),
    other_urls: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      })
    ),
  }),

  professional_summary: z.string(),

  work_experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      location: z.string(),
      start_date: z.coerce.date(),
      end_date: z.coerce.date(),
      is_current: z.boolean(),
      description: z.string(),
      achievements: z.array(z.string()),
    })
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field_of_study: z.string(),
      location: z.string(),
      start_date: z.coerce.date(),
      graduation_date: z.coerce.date(),
      gpa: z.string(),
      honors: z.array(z.string()),
      relevant_coursework: z.array(z.string()),
    })
  ),

  skills: z.object({
    technical_skills: z.array(z.string()),
    languages: z.array(
      z.object({
        language: z.string(),
        proficiency: z.string(),
      })
    ),
    tools_technologies: z.array(z.string()),
  }),

  certifications: z.array(
    z.object({
      name: z.string(),
      issuing_organization: z.string(),
      issue_date: z.string(),
      expiration_date: z.string(),
      credential_id: z.string(),
    })
  ),

  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies_used: z.array(z.string()),
      start_date: z.coerce.date(),
      end_date: z.coerce.date(),
      url: z.string(),
      achievements: z.array(z.string()),
    })
  ),

  metadata: z.object({
    language: z.enum(SUPPORTED_LANGUAGES),
  }),
});

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
- Format phone number in international format and without spaces (e.g., "+12345678900").
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
