import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createNormalizedRecord } from './normalized-record.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

const ROOT_DOCS = [
  'AGENTS.md',
  'Readme.md',
  'START.md',
  'testing-handbook.md',
  'OPERATIONS_RUNBOOK.md',
  'Failures.md',
  'docs/INDEX.md',
  'plan/README.md',
]

const TECH_STACK_DOCS = [
  'tech-stack-generator/README.md',
]

const OUTPUT_PATH_SNIPPETS = [
  { label: 'Vite outDir', needle: 'tech-stack-docs/', files: TECH_STACK_DOCS },
  { label: 'docs:sync script', needle: 'docs:sync:tech-stack', files: ['package.json', ...TECH_STACK_DOCS] },
]

export function extractDocsHealthRecords({ repoRoot = defaultRepoRoot } = {}) {
  const records = []

  for (const relativePath of ROOT_DOCS) {
    const exists = existsSync(path.join(repoRoot, relativePath))
    records.push(
      createNormalizedRecord({
        id: `docs-health.root.${relativePath.replace(/[^a-z0-9]+/gi, '-')}`,
        category: 'root-doc',
        label: relativePath,
        value: exists ? 'present' : 'missing',
        sourcePath: relativePath,
        sourceKind: 'readme-doc',
        sourcePointer: 'file.exists',
        factClassification: exists ? 'code-proven' : 'unknown-gap',
      }),
    )
  }

  for (const check of OUTPUT_PATH_SNIPPETS) {
    const matches = check.files.filter((filePath) => {
      try {
        return readFileSync(path.join(repoRoot, filePath), 'utf8').includes(check.needle)
      } catch {
        return false
      }
    })
    records.push(
      createNormalizedRecord({
        id: `docs-health.consistency.${check.label.replace(/[^a-z0-9]+/gi, '-')}`,
        category: 'docs-consistency',
        label: check.label,
        value: matches.length === check.files.length ? 'consistent' : `matched ${matches.length}/${check.files.length} files`,
        sourcePath: matches[0] ?? check.files[0],
        sourceKind: 'readme-doc',
        sourcePointer: check.needle,
        factClassification: matches.length === check.files.length ? 'code-proven' : 'partial',
        verificationMode: matches.length === check.files.length ? 'source-backed' : 'manual-verification',
      }),
    )
  }

  const manifestPath = 'tech-stack-generated/docs/_manifest.json'
  const accuracyPath = 'tech-stack-generated/data/_accuracy-renderer.json'
  for (const [relativePath, kind] of [
    [manifestPath, 'generated-manifest'],
    [accuracyPath, 'renderer-accuracy-report'],
  ]) {
    const exists = existsSync(path.join(repoRoot, relativePath))
    records.push(
      createNormalizedRecord({
        id: `docs-health.generated.${relativePath.replace(/[^a-z0-9]+/gi, '-')}`,
        category: 'generated-artifact',
        label: relativePath,
        value: exists ? 'present' : 'missing — run docs:sync:tech-stack',
        sourcePath: relativePath,
        sourceKind: kind,
        sourcePointer: 'file.exists',
        factClassification: exists ? 'code-proven' : 'unknown-gap',
      }),
    )
  }

  records.push(
    createNormalizedRecord({
      id: 'docs-health.fake-test-audit.shape',
      category: 'audit-shape',
      label: 'Fake-test audit',
      value: 'Enforced by docs:gate via fake-test-audit.mjs',
      sourcePath: 'tech-stack-generator/scripts/fake-test-audit.mjs',
      sourceKind: 'fake-test-audit',
      sourcePointer: 'auditTests',
      factClassification: 'code-proven',
    }),
  )

  const themeChecks = [
    {
      id: 'docs-health.theme.renderer-token-bridge',
      label: 'Renderer token bridge maps brand/accent to site tokens',
      sourcePath: 'tech-stack-generator/scripts/check-theme-alignment.mjs',
      sourcePointer: 'checkThemeAlignment',
    },
    {
      id: 'docs-health.theme.mobile-overlap',
      label: 'Mobile table/sidebar overlap and tone',
      sourcePath: 'tech-stack-generator/src/index.css',
      sourcePointer: 'manual.browser.visual',
    },
    {
      id: 'docs-health.theme.mermaid-render',
      label: 'Mermaid diagram contrast on site surfaces',
      sourcePath: 'tech-stack-generator/src/components/MermaidDiagram.tsx',
      sourcePointer: 'manual.browser.visual',
    },
  ]

  for (const check of themeChecks) {
    records.push(
      createNormalizedRecord({
        id: check.id,
        category: 'theme-visual',
        label: check.label,
        value: check.id.includes('token-bridge') ? 'static-check in docs:gate' : 'requires browser proof',
        sourcePath: check.sourcePath,
        sourceKind: 'theme-alignment',
        sourcePointer: check.sourcePointer,
        factClassification: check.id.includes('token-bridge') ? 'code-proven' : 'partial',
        verificationMode: check.id.includes('token-bridge') ? 'source-backed' : 'manual-verification',
        browserExposure: 'public-safe',
        renderSurface: ['docs-health', 'renderer'],
      }),
    )
  }

  return records.sort((left, right) => left.id.localeCompare(right.id))
}
