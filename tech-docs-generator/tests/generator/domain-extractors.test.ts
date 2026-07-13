import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildRendererDataPayloads } from '../../scripts/renderer-data.mjs'
import { buildGeneratorModel } from '../../scripts/model.mjs'
import { extractDeploymentRecords } from '../../scripts/extract-deployment.mjs'
import { extractCiRecords } from '../../scripts/extract-ci.mjs'
import { extractDependabotRecords } from '../../scripts/extract-dependabot.mjs'
import { extractAiRecords } from '../../scripts/extract-ai.mjs'
import { extractThemeRecords } from '../../scripts/extract-theme.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../')

const PLAN_PAYLOADS = [
  'deployment.json',
  'ci.json',
  'dependabot.json',
  'ai.json',
  'theme.json',
  'gaps.json',
  'docs-health.json',
  'failures-status.json',
  'coverage-matrix.json',
]

describe('domain extractors (plan 02)', () => {
  it('extracts deployment records with status cards and vercel config', () => {
    const model = buildGeneratorModel({ repoRoot })
    const records = extractDeploymentRecords({ repoRoot, commands: model.commands })

    expect(records.some((record) => record.category === 'vercel-config')).toBe(true)
    expect(records.some((record) => record.category === 'status-card' && record.factClassification === 'manual-verification')).toBe(true)
    expect(records.every((record) => record.sourcePath && record.sourcePointer && record.factClassification)).toBe(true)
  }, 30_000)

  it('extracts CI workflow metadata without secret values', () => {
    const records = extractCiRecords({ repoRoot })
    expect(records.length).toBeGreaterThan(3)
    expect(records.some((record) => record.category === 'workflow-schedule')).toBe(true)
    expect(JSON.stringify(records)).not.toMatch(/sk-[a-z0-9]/i)
  }, 30_000)

  it('extracts dependabot policy records from checked-in config', () => {
    const records = extractDependabotRecords({ repoRoot })
    expect(records.some((record) => record.category === 'dependabot-ecosystem')).toBe(true)
    expect(records.some((record) => record.value.includes('weekly'))).toBe(true)
  })

  it('extracts AI provider chain facts without emitting key values', () => {
    const model = buildGeneratorModel({ repoRoot })
    const records = extractAiRecords({ repoRoot, api: model.api })
    expect(records.some((record) => record.id === 'ai.openrouter.fallback')).toBe(true)
    expect(records.some((record) => record.label === 'OPENROUTER_API_KEY_PRIMARY')).toBe(true)
    expect(JSON.stringify(records)).not.toMatch(/OPENROUTER_API_KEY_PRIMARY":"[^"]+/)
  }, 30_000)

  it('extracts theme token and CSS sync records', () => {
    const records = extractThemeRecords({ repoRoot })
    expect(records.some((record) => record.sourcePath === 'site/app/css/core/theme.css')).toBe(true)
    expect(records.some((record) => record.sourceKind === 'theme-token-file')).toBe(true)
  })

  it('keeps docs-health deterministic by excluding generated-artifact self-checks', () => {
    const model = buildGeneratorModel({ repoRoot })

    expect(model.docsHealth.some((record) => record.category === 'generated-artifact')).toBe(false)
  }, 30_000)
})

describe('renderer payloads (plan 02)', () => {
  it('emits all planned renderer JSON payloads', () => {
    const model = buildGeneratorModel({ repoRoot })
    const payloads = buildRendererDataPayloads(model)

    for (const fileName of PLAN_PAYLOADS) {
      expect(payloads[fileName], `missing payload ${fileName}`).toBeDefined()
    }

    expect(Array.isArray(payloads['deployment.json'])).toBe(true)
    expect(payloads['deployment.json'].length).toBeGreaterThan(0)
    expect(payloads['gaps.json'].length).toBeGreaterThan(0)
  }, 30_000)

  it('excludes secret-value-forbidden records from browser environment payload', () => {
    const model = buildGeneratorModel({ repoRoot })
    const payloads = buildRendererDataPayloads(model)
    for (const record of payloads['environment.json']) {
      expect(record.browserExposure).not.toBe('secret-value-forbidden')
      expect(record.browserExposure).not.toBe('server-report-only')
    }
  }, 30_000)
})
