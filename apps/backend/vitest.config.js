import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    deps: {
      inline: ["@fastify/autoload", "pdf-parse"],
    },
    globalSetup: "./test/vitest-setup.ts",
    testTimeout: 120_000,
    hookTimeout: 60_000,
    watchTriggerPatterns: ["**/*.ts"],
  },
});
