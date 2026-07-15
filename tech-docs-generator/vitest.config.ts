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
      // The ts-morph graph/extractor suites each need >4GB. On a many-core
      // host Vitest would otherwise spawn one fork per core and collectively
      // exhaust RAM, and even one fork exceeds the default 4GB heap. Bound the
      // fork count and raise each fork's heap via the Node arg passed to forks.
      maxWorkers: 1,
      minWorkers: 1,
      execArgv: ['--max-old-space-size=24576'],
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,tsx}'],
      setupFiles: ['tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
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
