import { defineConfig } from 'vitest/config';
import path from 'path';
import { loadEnv } from 'vite';

import {
  VITEST_COMMON_COVERAGE_REPORTERS,
  VITEST_COMMON_EXCLUDE,
  VITEST_COVERAGE_DIRS,
  VITEST_PLANNER_GATE_COVERAGE_EXCLUDE,
  VITEST_PLANNER_GATE_COVERAGE_INCLUDE,
  VITEST_PLANNER_GATE_THRESHOLDS,
  VITEST_REPORT_PATHS,
  VITEST_REPO_ROOT,
  VITEST_SETUP_FILE,
  VITEST_CONSOLE_REPORTER,
} from './vitest.shared';

export default defineConfig({
  resolve: {
    alias: {
      '@/types': path.resolve(VITEST_REPO_ROOT, 'config/database/types'),
      '@/app': path.resolve(VITEST_REPO_ROOT, 'app'),
      '@/components': path.resolve(VITEST_REPO_ROOT, 'components'),
      '@/data': path.resolve(VITEST_REPO_ROOT, 'data'),
      '@/features': path.resolve(VITEST_REPO_ROOT, 'features'),
      '@/lib': path.resolve(VITEST_REPO_ROOT, 'lib'),
      '@': VITEST_REPO_ROOT,
    },
  },
  test: {
    // Load repo-root .env.local so auth/CSRF/env-gated code sees real vars in test
    env: {
      ...loadEnv('test', path.resolve(VITEST_REPO_ROOT, '..'), ''),
      DEV_AUTH_BYPASS: 'true',
    },
    // forks is safer than threads on Windows for V8 coverage file merging
    pool: 'forks',
    globals: true,
    environment: 'happy-dom',
    setupFiles: [VITEST_SETUP_FILE],
    reporters: [
      'default',
      'json',
      [VITEST_CONSOLE_REPORTER, { outputFile: VITEST_REPORT_PATHS.full.console }],
    ],
    outputFile: {
      json: VITEST_REPORT_PATHS.full.json,
    },
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
    exclude: [...VITEST_COMMON_EXCLUDE],
    coverage: {
      provider: 'v8',
      reportsDirectory: VITEST_COVERAGE_DIRS.full,
      reporter: [...VITEST_COMMON_COVERAGE_REPORTERS],
      // Gate scope only (2026-07-09): pure open3d/shared modules — not UI shells, not
      // _archive fabric, not SVG pipeline. Inventory = npm run test:coverage:inventory.
      all: true,
      include: [...VITEST_PLANNER_GATE_COVERAGE_INCLUDE],
      exclude: [...VITEST_PLANNER_GATE_COVERAGE_EXCLUDE],
      thresholds: { ...VITEST_PLANNER_GATE_THRESHOLDS },
    },
  },
});
