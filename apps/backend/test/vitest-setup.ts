import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Pool } from "pg";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate as drizzleMigrate } from "drizzle-orm/node-postgres/migrator";
import { resumesTable } from "../drizzle/schema/resumes";
import { jobsTable } from "../drizzle/schema/jobs";
import { resumeTranslationsTable } from "../drizzle/schema/resume-translations";

const schema = {
  resumes: resumesTable,
  jobs: jobsTable,
  resumeTranslations: resumeTranslationsTable,
};

export default async function () {
  const container = await new PostgreSqlContainer("postgres:16-alpine")
    .withDatabase("resumizer_test")
    .withUsername("test")
    .withPassword("test")
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();
  process.env.NODE_ENV = "test";

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  await drizzleMigrate(db, {
    migrationsFolder: "./drizzle/migrations",
  });
  await pool.end();

  return async () => {
    await container.stop();
  };
}
