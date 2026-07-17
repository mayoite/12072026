import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const repoRoot = path.resolve(packageRoot, '..')

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // forks is safer than threads on Windows for V8 coverage file merging.
      // Vitest 4 removed `poolOptions`; the former `forks.singleFork: false`
      // is now the default (one fork per file). isolate:true recycles module
      // state per file so ts-morph ASTs don't accumulate across files.
      pool: 'forks',
      isolate: true,
      fileParallelism: false,
      // One fork only — ts-morph suites are heavy; no per-process heap cap.
      maxWorkers: 1,
      minWorkers: 1,
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        // Ambient types / empty barrels contribute 0% and dilute the gate.
        exclude: ['src/types/**', 'src/vite-env.d.ts', 'src/data/domainTypes.ts'],
        reportsDirectory: path.resolve(repoRoot, 'results', 'tooling', 'tech-docs', 'coverage'),
      },
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/',
        },
      },
    },
  }),
)
