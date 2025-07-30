import "dotenv/config";

import fastify from "fastify";
import pdf from "pdf-parse";
import {
  cleanResumeText,
  parseOptionalFencedJson,
} from "./utils/resume-text-cleaner";
import { extractResumeData } from "./clients/openai/extractResume";
import { createResume } from "./database/queries/resumes";
import cors from "@fastify/cors";

const server = fastify();

server.register(import("@fastify/multipart"));
server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
});

server.post("/resume", async (request, reply) => {
  const data = await request.file();

  if (data === undefined) {
    reply.status(400).send({ error: "No file uploaded" });
    return;
  }

  const dataBuffer = await data.toBuffer();
  const pdfData = await pdf(dataBuffer);

  if (!pdfData.text) {
    reply.status(400).send({ error: "No text extracted from PDF" });
    return;
  }

  const cleanedText = cleanResumeText(pdfData.text);
  const extractedData = await extractResumeData(cleanedText);

  const createdResume = await createResume({
    original_json: parseOptionalFencedJson(extractedData),
  });

  reply.status(200).send(createdResume);
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
