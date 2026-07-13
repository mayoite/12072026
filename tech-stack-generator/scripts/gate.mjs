import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkDocs } from './check.mjs'
import { checkHardcoding } from './hardcoding-guard.mjs'
import { auditTests } from './fake-test-audit.mjs'
import { evaluateCoverage, loadCoverageSummary } from './check-coverage.mjs'
import { checkThemeAlignment } from './check-theme-alignment.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..', '..')
const packageRoot = path.resolve(scriptDir, '..')

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit ${result.status ?? 'unknown'}`)
  }
}

export async function runDocsGate({ root = repoRoot } = {}) {
  console.log('docs:gate — sync/check')
  await checkDocs({ repoRoot: root })

  console.log('docs:gate — hardcoding guard')
  const hardcoding = checkHardcoding({ root: packageRoot })
  if (hardcoding.length > 0) {
    throw new Error(
      `Hardcoding guard failed (${hardcoding.length}): ${hardcoding
        .map((item) => `${item.file}:${item.line}`)
        .join(', ')}`,
    )
  }

  console.log('docs:gate — fake-test audit')
  const fakeTests = auditTests({ root: packageRoot })
  if (fakeTests.length > 0) {
    throw new Error(`Fake-test audit failed (${fakeTests.length})`)
  }

  console.log('docs:gate — theme alignment')
  const themeViolations = checkThemeAlignment({ root: packageRoot })
  if (themeViolations.length > 0) {
    throw new Error(
      `Theme alignment failed (${themeViolations.length}): ${themeViolations
        .map((item) => `${item.file}: ${item.reason}`)
        .join('; ')}`,
    )
  }

  console.log('docs:gate — coverage')
  run('pnpm', ['--filter', 'oando-site-workflow-docs', 'run', 'test:coverage'], root)
  const { summary, pageSummaries } = loadCoverageSummary({ root: packageRoot })
  const coverage = evaluateCoverage(summary, pageSummaries)
  for (const warning of coverage.warnings) {
    console.warn(`COVERAGE WARN: ${warning}`)
  }
  if (coverage.failures.length > 0) {
    throw new Error(`Coverage failed: ${coverage.failures.join('; ')}`)
  }

  console.log('docs:gate — typecheck')
  run('pnpm', ['run', 'docs:typecheck:tech-stack'], root)

  console.log('docs:gate — test')
  run('pnpm', ['run', 'docs:test:tech-stack'], root)

  console.log('docs:gate — build')
  run('pnpm', ['run', 'docs:build:tech-stack'], root)

  console.log('docs:gate — passed')
  return true
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  runDocsGate().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
