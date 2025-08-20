import { FastifyInstance } from "fastify";
import {
  resumeEvaluationSystemPrompt,
  resumeEvaluationUserPrompt,
  ResumeEvaluationSchema,
} from "../../utils/prompts/resume-evaluation";

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
