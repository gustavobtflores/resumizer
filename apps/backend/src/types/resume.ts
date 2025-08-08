import z from "zod";
import { ZodResumeSchema } from "../utils/schemas/zod/resume";

export type Resume = z.infer<typeof ZodResumeSchema>;
