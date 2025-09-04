import { FastifyInstance } from "fastify";
import { CreateJobSchema } from "./contracts";
import { createJob, deleteJobById, findAllJobs, findJobById } from "./repo";
import { evaluateResume } from "./services";
import { findResumeTranslationByIdAndLanguage } from "../../database/queries/resume-translations";
import { ResumeVersionsRepo } from "../resume-versions/repo";
import { Resume } from "../../types/resume";

export default async function jobs(fastify: FastifyInstance) {
  fastify.post("/jobs", async (request, reply) => {
    try {
      const jobData = CreateJobSchema.parse(request.body);

      const resume = await ResumeVersionsRepo.findResumeByVersionAndId({
        id: jobData.resumeId,
        version: jobData.version,
      });

      if (!resume) throw new Error("Resume not found");

      const evaluation = await evaluateResume(fastify, {
        resume: JSON.stringify(resume.json),
        jobDescription: jobData.jobDescription,
      });

      if (!evaluation) throw new Error("Failed to evaluate resume");

      const newJob = await createJob({
        resume_version_id: resume.id,
        job_description: jobData.jobDescription,
        evaluation: evaluation,
      });

      reply.status(201).send(newJob);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Failed to create job" });
    }
  });

  fastify.get("/jobs", async (request, reply) => {
    try {
      const jobs = await findAllJobs();
      reply.status(200).send(jobs);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Failed to fetch jobs" });
    }
  });

  fastify.get("/jobs/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const job = await findJobById(id);

      if (!job) {
        reply.status(404).send({ error: "Job not found" });
        return;
      }

      reply.status(200).send(job);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Failed to fetch job" });
    }
  });

  fastify.delete("/jobs/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await deleteJobById(id);

      if (!deleted) {
        reply.status(404).send({ error: "Job not found" });
        return;
      }

      reply.status(204).send();
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Failed to delete job" });
    }
  });
}
