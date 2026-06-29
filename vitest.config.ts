import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for the Umoja Africa site.
 *
 * - jsdom environment so component tests can mount React 19 trees
 * - `@/*` path alias mirrored from `tsconfig.json` so tests can import the
 *   same way the app does
 * - Setup file wires `@testing-library/jest-dom` matchers and resets test
 *   state between cases (DOM cleanup, env stubs, mocks)
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
