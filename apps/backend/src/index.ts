import "dotenv/config";
import { validate as uuidValidate } from "uuid";

import fastify from "fastify";
import pdf from "pdf-parse";
import { cleanResumeText } from "./utils/resume-text-cleaner";
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
import { CreateJobSchema } from "./utils/schemas/zod/create-job";
import {
  createResumeTranslation,
  findResumeTranslationById,
  findResumeTranslationByIdAndLanguage,
  findResumeTranslationsById,
} from "./database/queries/resume-translations";
import { translateResume } from "./clients/openai/translateResume";
import { Resume } from "./types/resume";
import { Languages, supportedLanguages } from "./types/languages";

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
    original_json: extractedData,
  });

  const createdTranslation = await createResumeTranslation({
    resume_id: createdResume[0].id,
    language: extractedData.metadata.language,
    translated_json: extractedData,
  });

  reply.status(200).send(createdResume);
});

server.get("/resumes", async (request, reply) => {
  const resumes = await findAllResumes();

  reply.status(200).send(resumes);
});

server.get("/resumes/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { language } = request.query as { language?: Languages };

  const isValidUUID = uuidValidate(id);

  if (!isValidUUID) {
    reply.status(400).send({ error: "Invalid resume ID format" });
    return;
  }

  if (language && !supportedLanguages.includes(language as Languages)) {
    reply.status(400).send({ error: "Unsupported language" });
    return;
  }

  const resume = language
    ? await findResumeTranslationByIdAndLanguage(id, language)
    : await findResumeById(id);

  if (!resume) {
    reply.status(404).send({ error: "Resume not found" });
    return;
  }

  const languages = await findResumeTranslationsById(id);

  reply.status(200).send({
    ...resume,
    available_languages: languages.map((lang) => lang.language),
  });
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

server.post("/resumes/:id/translations", async (request, reply) => {
  const { id } = request.params as { id: string };
  const { targetLanguage } = request.body as { targetLanguage: Languages };

  if (!targetLanguage) {
    reply.status(400).send({ error: "Target language is required" });
    return;
  } else if (!supportedLanguages.includes(targetLanguage)) {
    reply.status(400).send({ error: "Unsupported target language" });
    return;
  }

  const isValidUUID = uuidValidate(id);

  if (!isValidUUID) {
    reply.status(400).send({ error: "Invalid resume ID format" });
    return;
  }

  const resume = await findResumeTranslationById(id);

  if (!resume) {
    reply.status(404).send({ error: "Resume not found" });
    return;
  }

  const translatedResume = await translateResume(
    resume.translated_json as Resume,
    targetLanguage
  );

  console.log(translatedResume);

  const createdTranslatedResume = await createResumeTranslation({
    resume_id: resume.resume_id,
    language: targetLanguage,
    translated_json: translatedResume,
  });

  reply.status(201).send({
    message: "Resume translated successfully",
    translation: createdTranslatedResume,
  });
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

server.post("/jobs", async (request, reply) => {
  const body = request.body;

  const bodyParsed = CreateJobSchema.safeParse(body);

  if (!bodyParsed.success) {
    reply.status(400).send({ error: bodyParsed.error.errors });
    return;
  }

  const { resumeId, jobDescription } = bodyParsed.data;

  if (!resumeId || !jobDescription) {
    reply.status(400).send({ error: "Missing resumeId or jobDescription" });
    return;
  }

  const isValidUUID = uuidValidate(resumeId);

  if (!isValidUUID) {
    reply.status(400).send({ error: "Invalid resume ID format" });
    return;
  }

  const resume = await findResumeById(resumeId);

  if (!resume) {
    reply.status(404).send({ error: "Resume not found" });
    return;
  }

  reply.status(201).send({
    message: "Job description added successfully",
    resumeId,
    jobDescription,
  });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
