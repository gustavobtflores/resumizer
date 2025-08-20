import z from "zod";

export const CreateJobSchema = z.object({
  resumeId: z.string().uuid(),
  jobDescription: z.string().min(100),
  language: z.enum(["pt-BR", "en-US", "es-ES"]),
});
