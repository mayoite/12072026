import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(scriptDir, '..')
const repoRoot = path.resolve(packageRoot, '..')

const THRESHOLDS = {
  // Lines/statements/functions stay at the product quality floor.
  minimum: 95,
  // Presentation components leave a few optional UI branches hard to force
  // under jsdom (media queries, intersection, empty generated snapshots).
  // Keep page line coverage at 95% below; do not weaken that page gate.
  branches: 90,
}

export function evaluateCoverage(summary, pageSummaries = []) {
  const linesPct = summary.lines.pct
  const branchesPct = summary.branches.pct
  const statementsPct = summary.statements.pct
  const functionsPct = summary.functions.pct
  const failures = []

  if (linesPct < THRESHOLDS.minimum) {
    failures.push(`lines ${linesPct}% < ${THRESHOLDS.minimum}%`)
  }

  if (branchesPct < THRESHOLDS.branches) {
    failures.push(`branches ${branchesPct}% < ${THRESHOLDS.branches}%`)
  }

  if (statementsPct < THRESHOLDS.minimum) {
    failures.push(`statements ${statementsPct}% < ${THRESHOLDS.minimum}%`)
  }

  if (functionsPct < THRESHOLDS.minimum) {
    failures.push(`functions ${functionsPct}% < ${THRESHOLDS.minimum}%`)
  }

  for (const page of pageSummaries) {
    if (page.lines.pct < THRESHOLDS.minimum) {
      failures.push(`${page.file} lines ${page.lines.pct}% < ${THRESHOLDS.minimum}%`)
    }
  }

  return { failures, warnings: [], linesPct, branchesPct, statementsPct, functionsPct }
}

export function loadCoverageSummary({ root = repoRoot } = {}) {
  const summaryPath = path.join(root, 'results', 'tooling', 'tech-docs', 'coverage', 'coverage-summary.json')
  const raw = JSON.parse(readFileSync(summaryPath, 'utf8'))
  const total = raw.total

  const pageSummaries = Object.entries(raw)
    .filter(([key]) => key.startsWith('src/pages/') && key.endsWith('.tsx'))
    .map(([file, metrics]) => ({ file, lines: metrics.lines }))

  return {
    summary: total,
    pageSummaries,
  }
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  try {
    const { summary, pageSummaries } = loadCoverageSummary()
    const result = evaluateCoverage(summary, pageSummaries)

    for (const warning of result.warnings) {
      console.warn(`COVERAGE WARN: ${warning}`)
    }

    if (result.failures.length > 0) {
      console.error(`Coverage check failed:`)
      for (const failure of result.failures) {
        console.error(`- ${failure}`)
      }
      process.exitCode = 1
    } else {
      console.log(
        `Coverage check passed (lines ${result.linesPct}%, branches ${result.branchesPct}%, statements ${result.statementsPct}%, functions ${result.functionsPct}%)`,
      )
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    console.error('Run pnpm --filter oando-tech-docs run test:coverage first')
    process.exitCode = 1
  }
}
