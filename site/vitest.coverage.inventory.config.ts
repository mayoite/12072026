/**
 * Dark-product inventory coverage — broad include, NO thresholds.
 * Do not chase 90% on this total. Use dual rollup for diagnosis.
 *
 *   pnpm run test:coverage:inventory
 */
import { defineConfig } from "vitest/config";
import path from "path";

import {
  VITEST_COMMON_COVERAGE_REPORTERS,
  VITEST_COMMON_EXCLUDE,
  VITEST_COVERAGE_DIRS,
  VITEST_PLANNER_INVENTORY_COVERAGE_INCLUDE,
  VITEST_REPORT_PATHS,
  VITEST_REPO_ROOT,
  VITEST_SETUP_FILE,
  VITEST_CONSOLE_REPORTER,
} from "./vitest.shared";

export default defineConfig({
  resolve: {
    alias: {
      "@/types": path.resolve(VITEST_REPO_ROOT, "config/database/types"),
      "@/app": path.resolve(VITEST_REPO_ROOT, "app"),
      "@/components": path.resolve(VITEST_REPO_ROOT, "components"),
      "@/data": path.resolve(VITEST_REPO_ROOT, "data"),
      "@/features/planner/editor": path.resolve(
        VITEST_REPO_ROOT,
        "features/planner/_archive/fabric/editor",
      ),
      "@/features/planner/canvas-fabric": path.resolve(
        VITEST_REPO_ROOT,
        "features/planner/_archive/fabric/canvas-fabric",
      ),
      "@/features": path.resolve(VITEST_REPO_ROOT, "features"),
      "@/lib": path.resolve(VITEST_REPO_ROOT, "lib"),
      "@/stores": path.resolve(VITEST_REPO_ROOT, "archive/state/state"),
      "@": VITEST_REPO_ROOT,
    },
  },
  test: {
    pool: "forks",
    globals: true,
    environment: "happy-dom",
    setupFiles: [VITEST_SETUP_FILE],
    reporters: [
      "default",
      "json",
      [VITEST_CONSOLE_REPORTER, { outputFile: VITEST_REPORT_PATHS.full.console }],
    ],
    outputFile: {
      json: VITEST_REPORT_PATHS.full.json,
    },
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: [...VITEST_COMMON_EXCLUDE],
    coverage: {
      provider: "v8",
      reportsDirectory: path.resolve(
        VITEST_COVERAGE_DIRS.full,
        "..",
        "coverage-inventory",
      ),
      reporter: [...VITEST_COMMON_COVERAGE_REPORTERS],
      all: true,
      include: [...VITEST_PLANNER_INVENTORY_COVERAGE_INCLUDE],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/node_modules/**",
        "**/features/planner/_archive/**",
        "**/scripts/**",
        "**/tests/**",
        "**/public/**",
        "**/results/**",
        "**/tech-stack-generated/**",
      ],
      // intentionally NO thresholds
    },
  },
});
