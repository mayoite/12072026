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
      '@/features/planner/editor': path.resolve(VITEST_REPO_ROOT, 'features/planner/_archive/fabric/editor'),
      '@/features/planner/canvas-fabric': path.resolve(VITEST_REPO_ROOT, 'features/planner/_archive/fabric/canvas-fabric'),
      '@/features': path.resolve(VITEST_REPO_ROOT, 'features'),
      '@/lib': path.resolve(VITEST_REPO_ROOT, 'lib'),
      '@/stores': path.resolve(VITEST_REPO_ROOT, 'archive/state/state'),
      '@': VITEST_REPO_ROOT,
    },
  },
  test: {
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
      // Force-include all source files even if no test imports them
      // Without this, untested files are invisible (not 0%) — misleading
      include: [
        'app/api/**/*.{ts,tsx}',
        'features/planner/**/*.{ts,tsx}',
        'features/crm/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'platform/**/*.{ts,tsx}',
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
        '**/dist/**',
        '**/build/**',
        '**/scripts/**',
        '**/tests/**',
        '**/Plans/**',
        '**/docs/**',
        '**/Agents/**',
        '**/tech-stack-docs/**',
        '**/tech-stack-generated/**',
      ],
    },
  },
});
