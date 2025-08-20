import z from "zod";
import { ZodResumeSchema } from "../utils/prompts/resume";

export type Resume = z.infer<typeof ZodResumeSchema>;
