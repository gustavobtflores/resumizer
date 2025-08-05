import "dotenv/config";
import { validate as uuidValidate } from "uuid";

import fastify from "fastify";
import pdf from "pdf-parse";
import {
  cleanResumeText,
  parseOptionalFencedJson,
} from "./utils/resume-text-cleaner";
import { extractResumeData } from "./clients/openai/extractResume";
import {
  createResume,
  deleteResume,
  findAllResumes,
  findResumeById,
  updateResume,
} from "./database/queries/resumes";
import cors from "@fastify/cors";
import { NewResume } from "./database/schema/resumes";

const server = fastify({
  logger: true,
});

server.register(import("@fastify/multipart"));
server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT"],
});

server.post("/resumes", async (request, reply) => {
  const data = await request.file();

  if (data === undefined) {
    reply.status(400).send({ error: "No file uploaded" });
    return;
  }

  request.log.info(`Extracting information from PDF: ${data.filename}`);

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

server.get("/resumes", async (request, reply) => {
  const resumes = await findAllResumes();

  reply.status(200).send(resumes);
});

server.get("/resumes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  const isValidUUID = uuidValidate(id);

  if (!isValidUUID) {
    reply.status(400).send({ error: "Invalid resume ID format" });
    return;
  }

  const resume = await findResumeById(id);

  if (!resume) {
    reply.status(404).send({ error: "Resume not found" });
    return;
  }

  reply.status(200).send(resume);
});

server.put("/resumes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const data = await request.body;

  if (data === undefined) {
    reply.status(400).send({ error: "No file uploaded" });
    return;
  }

  request.log.info(`Updating resume with ID: ${id}`);

  const updatedResume = await updateResume(id, data as Partial<NewResume>);

  reply.status(200).send(updatedResume[0]);
});

server.delete("/resumes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  const resume = await findResumeById(id);

  if (!resume) {
    reply.status(404).send({ error: "Resume not found" });
    return;
  }

  await deleteResume(id);

  reply.status(204).send();
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
