import { test, expect, describe, beforeAll, afterAll, vi } from "vitest";
import { app } from "../../src/app";
import FormData from "form-data";
import { ResumesRepo } from "../../src/modules/resumes/repo";
import { readFileSync } from "fs";
import path from "path";
import { createResumeTranslation } from "../../src/database/queries/resume-translations";
const openAiFixture = vi.hoisted(
  async () => await import("../fixtures/openai-response-fixture.json")
);

vi.mock("openai", async () => {
  const create = vi.fn().mockResolvedValue({
    output_text: JSON.stringify((await openAiFixture).default),
  });

  const OpenAI = vi.fn().mockImplementation(() => {
    return { responses: { create } };
  });

  return { default: OpenAI };
});

const resumeFixture = readFileSync(
  path.resolve(__dirname, "../fixtures/resume.pdf")
);

function buildMultipartPDF(filename = "resume.pdf", buf?: Buffer) {
  const form = new FormData();
  const pdfBuffer =
    buf ?? Buffer.from("%PDF-1.4\n%…mock pdf bytes, content not used…");
  form.append("file", pdfBuffer, {
    filename,
    contentType: "application/pdf",
  });

  return { payload: form.getBuffer(), headers: form.getHeaders() };
}

describe("Resumes data functional tests", () => {
  const defaultResume = {
    id: "4fda5136-6069-468d-819b-f54189813c4d",
    file_path: "path/to/file.pdf",
    original_json: {},
  };

  beforeAll(async () => {
    await ResumesRepo.createResume(defaultResume);

    await createResumeTranslation({
      resume_id: defaultResume.id,
      language: "en-US",
      translated_json: defaultResume.original_json,
    });
  });

  afterAll(async () => {
    await ResumesRepo.deleteResume(defaultResume.id);
  });

  test("GET /resumes should return ok", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/resumes",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ data: expect.any(Array) });
  });

  test("GET /resumes/:id should return a specific resume", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/resumes/${defaultResume.id}`,
    });

    const responseData = response.json();

    expect(response.statusCode).toBe(200);
    expect(responseData).toEqual({
      data: expect.objectContaining({
        resume: expect.any(Object),
        available_languages: expect.any(Array),
      }),
    });
  });

  test("GET /resumes/:id should return 404 if the resume does not exist", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/resumes/00000000-0000-0000-0000-000000000000`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      error: { message: "Resume not found" },
    });
  });

  test("POST /resumes should upload and create a new resume", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/resumes",
      ...buildMultipartPDF("resume.pdf", resumeFixture),
    });

    expect(response.statusCode).toBe(200);
    const data = response.json();
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("language");
    expect(data).toHaveProperty("translated_json");
  });

  test("POST /resumes should return 400 if the file is not a PDF", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/resumes",
      ...buildMultipartPDF("resume.txt", Buffer.from("This is not a PDF")),
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: { message: "File is not a valid PDF" },
    });
  });
});
