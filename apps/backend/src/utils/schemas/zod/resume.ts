import { z } from "zod";
import { supportedLanguages } from "../../../types/languages";

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
    language: z.enum(supportedLanguages),
  }),
});
