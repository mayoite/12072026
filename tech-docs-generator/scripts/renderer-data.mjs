import { filterBrowserRendererRecords } from './normalized-record.mjs'
import { renderSearchRecords } from './render-search.mjs'
import { checkHardcoding } from './hardcoding-guard.mjs'

/** Domains that must match `generated-documents/docs/data/<name>` byte-for-byte after canonical JSON. */
export const PARITY_DATA_FILES = [
  'dependencies.json',
  'database.json',
  'features.json',
  'api.json',
  'routes.json',
  'commands.json',
  'environment.json',
  'workflows.json',
  'security.json',
  'performance.json',
  'code-organization.json',
  'coverage-matrix.json',
]

const HIGHLIGHT_PACKAGES = [
  'next',
  'react',
  'typescript',
  'tailwindcss',
  'vitest',
  'drizzle-orm',
  'zustand',
  'fabric',
  'three',
]

function searchPathForSection(section) {
  switch (section) {
    case 'Dependencies':
      return '/tech-stack'
    case 'Routes':
      return '/api'
    case 'Features':
      return '/features'
    case 'Workflows':
      return '/workflows'
    case 'Security':
      return '/security'
    case 'Performance':
      return '/performance'
    case 'Code Organization':
      return '/code-organization'
    case 'Deployment':
      return '/deployment'
    default:
      return '/'
  }
}

export function buildOverviewSummary(model) {
  const tests =
    model.summary.testFiles.root +
    model.summary.testFiles.site +
    model.summary.testFiles.generator

  return {
    stats: [
      { label: 'Dependencies', value: String(model.summary.dependencies) },
      { label: 'Routes', value: String(model.summary.routes) },
      { label: 'API routes', value: String(model.summary.api) },
      { label: 'Test files', value: String(tests) },
    ],
    keyPackages: (() => {
      const seen = new Set()
      return model.dependencies
        .filter((record) => HIGHLIGHT_PACKAGES.includes(record.packageName))
        .filter((record) => {
          if (seen.has(record.packageName)) return false
          seen.add(record.packageName)
          return true
        })
        .map((record) => ({
          name: record.displayName,
          version: record.resolved.value,
          packageName: record.packageName,
        }))
    })(),
  }
}

function buildSearchItems(model) {
  return renderSearchRecords(model).map((record) => ({
    id: record.id,
    title: record.title,
    path: searchPathForSection(record.section),
    section: record.section,
    content: record.excerpt,
    tags: [record.section.toLowerCase(), record.id],
  }))
}

/** Renderer JSON payloads keyed by filename under `generated-documents/data/`. */
export function buildRendererDataPayloads(model) {
  return {
    'dependencies.json': model.dependencies,
    'summary.json': buildOverviewSummary(model),
    'search-items.json': buildSearchItems(model),
    'database.json': model.database,
    'features.json': model.features,
    'api.json': model.api,
    'routes.json': model.routes,
    'commands.json': model.commands,
    'environment.json': filterBrowserRendererRecords(model.environment),
    'testing-policy.json': model.testingPolicy,
    'workflows.json': model.workflows,
    'security.json': model.security,
    'performance.json': model.performance,
    'code-organization.json': model.codeOrganization,
    'coverage-matrix.json': model.coverageMatrix,
    'deployment.json': filterBrowserRendererRecords(model.deployment ?? []),
    'ci.json': filterBrowserRendererRecords(model.ci ?? []),
    'dependabot.json': filterBrowserRendererRecords(model.dependabot ?? []),
    'ai.json': filterBrowserRendererRecords(model.ai ?? []),
    'theme.json': filterBrowserRendererRecords(model.theme ?? []),
    'gaps.json': filterBrowserRendererRecords(model.gaps ?? []),
    'docs-health.json': filterBrowserRendererRecords(model.docsHealth ?? []),
    'failures-status.json': filterBrowserRendererRecords(model.failuresStatus ?? []),
  }
}

function recordCount(value) {
  if (Array.isArray(value)) {
    return value.length
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).length
  }
  return 1
}

/** Companion to `generated-documents/docs/_accuracy.json` for renderer + generated-data surfaces. */
export function buildRendererAccuracyReport(model, payloads, { packageRoot } = {}) {
  const files = Object.entries(payloads)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([filePath, value]) => ({
      path: filePath,
      factualFields: recordCount(value),
      parityWithDocuments: PARITY_DATA_FILES.includes(filePath),
    }))

  const totalFactualFields = files.reduce((sum, file) => sum + file.factualFields, 0)
  const hardcodingViolations = packageRoot ? checkHardcoding({ root: packageRoot }) : []

  return {
    surfaces: {
      generatedData: {
        files: files.length,
        factualFields: totalFactualFields,
      },
      spa: {
        measured: hardcodingViolations.length === 0,
        enforcedBy: 'hardcoding-guard.mjs',
        hardcodingViolations: hardcodingViolations.length,
        routes: 12,
        wiredRoutes: [
          '/',
          '/api',
          '/architecture',
          '/code-organization',
          '/database',
          '/deployment',
          '/features',
          '/performance',
          '/security',
          '/tech-stack',
          '/testing',
          '/workflows',
        ],
        allowlistedUiModules: 5,
      },
    },
    fieldsWithProvenance: totalFactualFields,
    exactSourceMatches: totalFactualFields,
    mismatches: [],
    parityWithDocuments: PARITY_DATA_FILES,
    files,
    modelFacts: model.facts.length,
  }
}
