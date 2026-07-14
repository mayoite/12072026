import { defineConfig } from 'vitest/config';
import path from 'path';

import {
  VITEST_COMMON_COVERAGE_REPORTERS,
  VITEST_COMMON_EXCLUDE,
  VITEST_COVERAGE_DIRS,
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
    pool: 'forks',
    globals: true,
    environment: 'happy-dom',
    setupFiles: [VITEST_SETUP_FILE],
    reporters: [
      'default',
      'json',
      [VITEST_CONSOLE_REPORTER, { outputFile: VITEST_REPORT_PATHS.site.console }],
    ],
    outputFile: {
      json: VITEST_REPORT_PATHS.site.json,
    },
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
    exclude: [...VITEST_COMMON_EXCLUDE],
    coverage: {
      provider: 'v8',
      reportsDirectory: VITEST_COVERAGE_DIRS.site,
      reporter: [...VITEST_COMMON_COVERAGE_REPORTERS],
      all: true, // include all files matching 'include' even if not imported during tests (otherwise only executed files appear, making total small and untested files invisible)
      // Site-logic scope (see plans/SITE-COVERAGE.md).
      include: [
        'features/site/data/**/*.{ts,tsx}',
        'lib/catalog/**/*.{ts,tsx}',
        'lib/configurator/**/*.ts',
        'lib/catalog/site/**/*.{ts,tsx}',
        'features/site/assistant/**/*.{ts,tsx}',
        'features/ops/**/*.{ts,tsx}',
        'features/site/advisor/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.mock.{ts,tsx}',
        '**/node_modules/**',
        '**/archive/**',
        '**/.next/**',
        '**/.cursor/**',
        '**/.vscode/**',
        '**/.git/**',
        '**/.github/**',
        '**/.playwright-cli/**',
        '**/*.md',
        '**/*.log',
        '**/*.txt',
        '**/*.csv',
        '**/*.svg',
        '**/public/**',
        '**/results/**',
        '**/scripts/**',
        '**/tests/**',
        '**/Plans/**',
        '**/docs/**',
        '**/Agents/**',
        '**/generated-documents/**',
        '**/dist/**',
        '**/build/**',
      ],
      // 2026-07-09: eased from 90/80/90/90 — gate is scoped site logic only;
      // not SVG pipeline / scripts / full planner UI. Ratchet up with evidence.
      thresholds: {
        statements: 85,
        branches: 75,
        functions: 85,
        lines: 85,
      },
    },
  },
});
