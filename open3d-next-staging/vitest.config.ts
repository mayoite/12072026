import { defineConfig } from "vitest/config";

const coverageRun = process.argv.some(
  (arg) => arg === "--coverage" || arg.startsWith("--coverage."),
);

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/src/**/*.test.{ts,tsx}"],
    env: {
      VITEST_COVERAGE_RUN: coverageRun ? "1" : "",
    },
    coverage: {
      provider: "v8",
      enabled: false,
      include: [
        "app/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/node_modules/**",
        "src/canvas-fabric/**/*",
        "src/catalog/**/*",
        "src/embed/**/*",
        "src/lib/commands/**/*",
        "src/lib/embed/**/*",
        "src/lib/geometry/**/*",
        "src/lib/stores/**/*",
        "src/lib/utils/**/*",
        "src/model/**/*",
        "src/persistence/**/*",
        "src/shared/**/*",
        "src/store/**/*",
        "src/editor/index.ts",
        "src/editor/useDockingSystem.ts",
        "src/editor/useWorkspaceCanvas.ts",
      ],
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        perFile: true,
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});
