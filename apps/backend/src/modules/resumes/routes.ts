import { FastifyInstance } from "fastify";
import path from "path";
import { validate as uuidValidate } from "uuid";
import { uploadFileToS3 } from "../../clients/s3/functions/upload";
import {
  createResumeTranslation,
  findResumeTranslationsById,
  updateResumeTranslation,
  findResumeTranslationById,
} from "../../database/queries/resume-translations";
import { Resume } from "../../types/resume";
import { extractResumeToJson, translateResumeToJson } from "./service";
import { Language, SUPPORTED_LANGUAGES } from "../../constants/languages";
import { ResumesRepo } from "./repo";
import { parsePDF } from "../../utils/check-pdf";
import PdfParse from "pdf-parse";
import { ResumeVersionsRepo } from "../resume-versions/repo";
import { runTransaction } from "../../database/transaction";

export default async function resumes(fastify: FastifyInstance) {
  fastify.post("/resumes", async (request, reply) => {
    try {
      const data = await request.file();

      if (data === undefined) {
        reply.status(400).send({ error: { message: "No file uploaded" } });
        return;
      }

      if (data.mimetype !== "application/pdf") {
        reply.status(400).send({ error: { message: "Invalid file type" } });
        return;
      }

      const dataBuffer = await data.toBuffer();
      const parsedPDF = await parsePDF(dataBuffer);

      if (!parsedPDF.isPDF) {
        reply
          .status(400)
          .send({ error: { message: "File is not a valid PDF" } });
        return;
      }

      const pdfData = parsedPDF.data as PdfParse.Result;

      if (pdfData.text.trim() === "") {
        reply
          .status(400)
          .send({ error: { message: "No text extracted from PDF" } });
        return;
      }

      const s3Filename = `${
        path.parse(data.filename).name
      }-${Date.now()}${path.extname(data.filename)}`;

      await uploadFileToS3(s3Filename, dataBuffer, data.mimetype);

      const extractedData = await extractResumeToJson(fastify, pdfData);

      const createdResume = await runTransaction(async (tx) => {
        const resume = await ResumesRepo.createResume(
          {
            original_json: extractedData,
            file_path: s3Filename,
            language_detected: extractedData.metadata.language,
            current_version: 1,
          },
          tx
        );

        await ResumeVersionsRepo.createVersion(
          {
            json: extractedData,
            version_number: 1,
            resume_id: resume.id,
          },
          tx
        );

        return resume;
      });

      reply.status(200).send({
        data: {
          id: createdResume.id,
          language: createdResume.language_detected,
          ...(createdResume.original_json as Resume),
        },
      });
    } catch (error) {
      reply.status(500).send({ error: { message: "Internal server error" } });
    }
  });

  fastify.get("/resumes", async (request, reply) => {
    const resumes = await ResumesRepo.findAllResumes();

    reply.status(200).send({ data: resumes });
  });

  fastify.get("/resumes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { language } = request.query as { language?: Language };

    const isValidUUID = uuidValidate(id);

    if (!isValidUUID) {
      reply.status(400).send({ error: "Invalid resume ID format" });
      return;
    }

    if (language && !SUPPORTED_LANGUAGES.includes(language as Language)) {
      reply.status(400).send({ error: "Unsupported language" });
      return;
    }

    const resume = await ResumesRepo.findResumeById(id);

    if (!resume) {
      reply.status(404).send({ error: { message: "Resume not found" } });
      return;
    }

    const languages = await findResumeTranslationsById(id);

    reply.status(200).send({
      data: {
        resume: {
          id: resume.id,
          language: resume.language_detected,
          ...(resume.original_json as Resume),
        },
        available_languages: languages.map((lang) => lang.language),
      },
    });
  });

  fastify.put("/resumes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await request.body;

    if (data === undefined) {
      reply.status(400).send({ error: "Missing data to update resume" });
      return;
    }

    const updatedResume = await updateResumeTranslation(id, {
      translated_json: data,
    });

    reply.status(200).send(updatedResume);
  });

  fastify.post("/resumes/:id/translations", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { targetLanguage } = request.body as { targetLanguage: Language };

    if (!targetLanguage) {
      reply.status(400).send({ error: "Target language is required" });
      return;
    } else if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
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

    const translatedResume = await translateResumeToJson(
      fastify,
      resume.translated_json as Resume,
      targetLanguage
    );

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

  fastify.delete("/resumes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const resume = await ResumesRepo.findResumeById(id);

    if (!resume) {
      reply.status(404).send({ error: "Resume not found" });
      return;
    }

    await ResumesRepo.deleteResume(id);

    reply.status(204).send();
  });
}
