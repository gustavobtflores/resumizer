import fp from "fastify-plugin";
import OpenAI from "openai";
import * as z from "zod";
import { env } from "../utils/env";
import { zodTextFormat } from "openai/helpers/zod.js";

declare module "fastify" {
  interface FastifyInstance {
    ai: OpenAI;
    aiModels: { chat: string };
    chatJson: <T>(params: {
      system: string;
      user: string;
      schema: z.ZodType<T>;
    }) => Promise<T>;
  }
}

export default fp(async (fastify) => {
  const client = new OpenAI({
    baseURL: env.LLM_BASE_URL,
    apiKey: env.LLM_API_KEY,
  });

  fastify.decorate("ai", client);
  fastify.decorate("aiModels", { chat: env.LLM_CHAT_MODEL });

  fastify.decorate("chatJson", async function chatJson<
    T
  >({ system, user, schema }: { system: string; user: string; schema: z.ZodType<T> }): Promise<T> {
    const res = await client.responses.create({
      model: fastify.aiModels.chat,
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      text: {
        format: zodTextFormat(schema, "resume"),
      },
      temperature: 0,
    });

    const raw = res.output_text ?? "{}";
    const parsed = JSON.parse(raw);
    const result = schema.parse(parsed);
    return result;
  });
});
