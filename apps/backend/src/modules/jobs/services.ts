import { FastifyInstance } from "fastify";
import {
  resumeEvaluationSystemPrompt,
  resumeEvaluationUserPrompt,
  ResumeEvaluationSchema,
} from "../../utils/prompts/evaluation";
import {
  resumeTailoringUser,
  resumeTailorinSystem,
} from "../../utils/prompts/tailoring";
import { ZodResumeSchema } from "../../utils/prompts/resume";

export async function evaluateResume(
  fastify: FastifyInstance,
  {
    resume,
    jobDescription,
  }: {
    resume: string;
    jobDescription: string;
  }
) {
  const result = await fastify.chatJson({
    system: resumeEvaluationSystemPrompt,
    user: resumeEvaluationUserPrompt({
      jobDescription,
      resumeJson: resume,
    }),
    schema: ResumeEvaluationSchema,
  });

  return result;
}

export async function tailorResume(
  fastify: FastifyInstance,
  { jobDescription, resume }: { jobDescription: string; resume: string }
) {
  const result = await fastify.chatJson({
    system: resumeTailorinSystem,
    user: resumeTailoringUser({
      jobDescription,
      resume,
    }),
    schema: ZodResumeSchema,
  });

  return result;
}
