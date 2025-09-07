import { z } from "zod";

export const ResumeEvaluationSchema = z
  .object({
    company: z.string().min(1),
    job_title: z.string().min(1),
    role_summary: z.string().min(1),
    match_score: z.number().int().min(0).max(100),
    subscores: z
      .object({
        skills_tech: z.number().int().min(0).max(100),
        experience_scope: z.number().int().min(0).max(100),
        impact_results: z.number().int().min(0).max(100),
        domain_industry: z.number().int().min(0).max(100),
        education_certs: z.number().int().min(0).max(100),
      })
      .strict(),
    keyword_coverage: z.array(
      z
        .object({
          keyword: z.string(),
          present: z.boolean(),
          evidence_paths: z.array(z.string()),
          importance: z.enum(["high", "medium", "low"]),
          comment: z.string().nullable(),
        })
        .strict()
    ),
    strengths: z.array(z.string()),
    risks_or_flags: z.array(z.string()),
    achievement_rewrites: z.array(
      z
        .object({
          original_path: z.string(),
          rewritten: z.string(),
        })
        .strict()
    ),
    tailoring_suggestions: z.array(
      z
        .object({
          priority: z.number().int().min(1),
          suggestion: z.string(),
          rationale: z.string(),
          estimated_impact: z.enum(["high", "medium", "low"]),
        })
        .strict()
    ),
    interview_prep_questions: z.array(
      z.object({
        question: z.string(),
        draft_response: z.string(),
      })
    ),
    seniority_estimate: z.enum([
      "junior",
      "mid",
      "senior",
      "staff+",
      "unknown",
    ]),
  })
  .strict();

export const resumeEvaluationSystemPrompt = `
You are an expert ATS evaluator. Assess the fit between a job description and a resume already parsed as JSON.
Return ONE JSON object conforming exactly to the schema. Be conservative. Do not invent facts.
Current date: ${new Date().toLocaleDateString()}

1) Extract JD requirements; normalize keywords.
2) Map evidence from RESUME_JSON with explicit evidence_paths.
3) Score subscores (0-100) with weights; compute match_score conservatively.
4) List gaps and concrete edits; rewrite 2-5 bullets with metrics.
5) Provide a 2-3 sentence JD-aligned summary.
6) Write the JSON values in PT-BR, but keep keys in English.
7) Only include evidence paths where is explicitly requested in the JSON schema.
No prose outside JSON. No extra keys. If unknown, use null or [].
Rules: treat “required/must/minimum/degree/cert” as mandatory; prefer recent; penalize domain mismatch; map synonyms (ts/typescript, node/node.js, postgres/postgresql, aws/amazon web services).
`;

export const resumeEvaluationUserPrompt = ({
  jobDescription,
  resumeJson,
}: {
  jobDescription: string;
  resumeJson: any;
}) => `
Evaluate the resume against the job description. Return only the JSON object.

JOB_DESCRIPTION:
${jobDescription}

RESUME_JSON:
${JSON.stringify(resumeJson, null, 2)}
`;
