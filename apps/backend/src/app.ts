import fastify from "fastify";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";
import autoload from "@fastify/autoload";
import { env } from "./utils/env";
import { join } from "path";

function buildApp() {
  const server = fastify({
    logger: {
      transport: {
        target: "@fastify/one-line-logger",
      },
    },
  });

  server.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  server.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
    logLevel: "info",
  });

  server.register(autoload, {
    dir: join(__dirname, "plugins"),
  });

  server.register(autoload, {
    dir: join(__dirname, "modules"),
    dirNameRoutePrefix: false,
  });

  server.listen({ port: env.PORT });

  return server;
}

export const app = buildApp();
