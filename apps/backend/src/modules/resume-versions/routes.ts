import { FastifyInstance } from "fastify";
import { ResumeVersionsRepo } from "./repo";
import { Resume } from "../../types/resume";
import { ResumesRepo } from "../resumes/repo";

export default async function resumes(fastify: FastifyInstance) {
  fastify.get("/resumes/:id/versions/latest", async (request, reply) => {
    const { id } = request.params as { id: string };

    if (!id) {
      reply.status(400).send({ error: { message: "ID is required" } });
      return;
    }

    const resume = await ResumeVersionsRepo.findLatestVersionByResumeId(id);
    const versions = (await ResumeVersionsRepo.findResumeVersions(id)).map(
      (v) => v.version_number
    );

    if (!resume) {
      reply.status(404).send({ error: { message: "Resume not found" } });
      return;
    }

    reply.status(200).send({
      data: {
        resume: {
          id: resume.id,
          version: resume.version_number,
          ...(resume.json as Resume),
        },
        language: (resume.json as Resume).metadata.language,
        versions,
      },
    });
  });

  fastify.get("/resumes/:id/versions", async (request, reply) => {
    const { id } = request.params as { id: string };

    const resumeExists = await ResumesRepo.existsById(id);

    if (!resumeExists)
      reply.status(404).send({ error: { message: "Resume not found" } });

    const versions = (await ResumeVersionsRepo.findResumeVersions(id)).map(
      (v) => v.version_number
    );

    reply.status(200).send({
      data: {
        versions,
      },
    });
  });
}
