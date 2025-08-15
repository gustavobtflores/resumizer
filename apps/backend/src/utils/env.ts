import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
  LLM_BASE_URL: z.string().url(),
  LLM_API_KEY: z.string().optional(),
  LLM_CHAT_MODEL: z.string(),
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET: z.string(),
});

export const env = envSchema.parse(process.env);
