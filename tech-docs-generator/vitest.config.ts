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
