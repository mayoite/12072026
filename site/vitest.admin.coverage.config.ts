import { defineConfig } from "vitest/config";
import path from "path";

import {
  VITEST_COMMON_COVERAGE_REPORTERS,
  VITEST_COMMON_EXCLUDE,
  VITEST_COVERAGE_DIRS,
  VITEST_CONSOLE_REPORTER,
  VITEST_REPO_ROOT,
  VITEST_SETUP_FILE,
} from "./vitest.shared";

export default defineConfig({
  resolve: {
    alias: {
      "@/types": path.resolve(VITEST_REPO_ROOT, "config/database/types"),
      "@/app": path.resolve(VITEST_REPO_ROOT, "app"),
      "@/components": path.resolve(VITEST_REPO_ROOT, "components"),
      "@/data": path.resolve(VITEST_REPO_ROOT, "data"),
      "@/features": path.resolve(VITEST_REPO_ROOT, "features"),
      "@/lib": path.resolve(VITEST_REPO_ROOT, "lib"),
      "@": VITEST_REPO_ROOT,
    },
  },
  test: {
    pool: "forks",
    globals: true,
    environment: "happy-dom",
    setupFiles: [VITEST_SETUP_FILE],
    reporters: ["default", "json"],
    include: [
      "tests/unit/features/admin/**/*.test.ts",
      "tests/unit/features/admin/**/*.test.tsx",
      "tests/unit/app/api/admin/**/*.test.ts",
      "tests/unit/app/admin/**/*.test.ts",
      "tests/unit/app/admin/**/*.test.tsx",
    ],
    exclude: [...VITEST_COMMON_EXCLUDE],
    coverage: {
      provider: "v8",
      reportsDirectory: VITEST_COVERAGE_DIRS.admin,
      reporter: [...VITEST_COMMON_COVERAGE_REPORTERS],
      all: true,
      include: ["features/admin/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/node_modules/**",
        "**/archive/**",
        "**/.next/**",
        "**/public/**",
        "**/results/**",
        "**/scripts/**",
        "**/tests/**",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});