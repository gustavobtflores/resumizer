import z from "zod";

export const CreateJobSchema = z.object({
  resumeId: z.string().uuid(),
  jobDescription: z.string().min(10).max(1000),
});
