import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  buildGeneratorModel,
  classifyEnvironmentNames,
  COVERAGE_DOMAIN_SOURCE_POLICY,
  COVERAGE_EXCLUDED_PATH_PREFIXES,
  COVERAGE_REQUIRED_DOMAINS,
  isAcceptedCoverageSourcePath,
} from '../../scripts/model.mjs'
import { renderJsonOutputs } from '../../scripts/render-json.mjs'
import { coverageMatrixSchema } from '../../scripts/schema.mjs'
import { getPolicy, sourcePolicy } from '../../scripts/source-policy.mjs'
import * as modelModule from '../../scripts/model.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../')
const requiredDomains = COVERAGE_REQUIRED_DOMAINS
const rowFields = [
  'domain',
  'status',
  'recordCount',
  'codeProvenCount',
  'handoverProvenCount',
  'manualVerificationCount',
  'liveStatusCount',
  'unknownGapCount',
  'unsupportedClaimCount',
]

describe('source coverage contract', () => {
  it('recognizes current tech-docs check and gate workflows as gate evidence', () => {
    const isGateWorkflowRecord = (
      modelModule as typeof modelModule & {
        isGateWorkflowRecord?: (record: { value: string; sourcePointer: string }) => boolean
      }
    ).isGateWorkflowRecord

    expect(isGateWorkflowRecord?.({
      value: 'pnpm --filter oando-tech-docs check',
      sourcePointer: 'scripts.tech-docs:check',
    })).toBe(true)
    expect(isGateWorkflowRecord?.({
      value: 'pnpm --filter oando-tech-docs gate',
      sourcePointer: 'scripts.tech-docs:gate',
    })).toBe(true)
  })

  it('extracts current tech-docs check and gate workflows for model evidence', () => {
    const model = buildGeneratorModel({ repoRoot })
    const sourcePointers = model.workflows.map((record) => record.sourcePointer)

    expect(sourcePointers).toEqual(expect.arrayContaining([
      'scripts.tech-docs:check',
      'scripts.tech-docs:gate',
    ]))
  }, 30_000)

  it('emits one fully bucketed coverage-matrix row per required domain', () => {
    const model = buildGeneratorModel({ repoRoot })
    const matrix = coverageMatrixSchema.parse(model.coverageMatrix)

    expect(matrix.contractSourcePath).toBe('plan/README.md')
    expect(matrix.rows.map((row) => row.domain).sort()).toEqual([...requiredDomains].sort())

    for (const row of matrix.rows) {
      expect(Object.keys(row).sort()).toEqual([...rowFields].sort())
      expect(row.unsupportedClaimCount).toBe(0)
      expect(row.recordCount).toBe(
        row.codeProvenCount +
          row.handoverProvenCount +
          row.manualVerificationCount +
          row.liveStatusCount +
          row.unknownGapCount +
          row.unsupportedClaimCount,
      )
    }
  }, 30_000)

  it('includes coverage-matrix.json in generated JSON outputs', () => {
    const model = buildGeneratorModel({ repoRoot })
    const outputs = renderJsonOutputs(model)

    expect(outputs['data/coverage-matrix.json']).toBe(model.coverageMatrix)
    expect(coverageMatrixSchema.parse(outputs['data/coverage-matrix.json']).rows).toHaveLength(requiredDomains.length)
  }, 30_000)

  it('maps every required domain to a source-policy precedence entry', () => {
    for (const domain of requiredDomains) {
      const policyKey = COVERAGE_DOMAIN_SOURCE_POLICY[domain]
      expect(policyKey, `missing policy mapping for ${domain}`).toBeTruthy()
      expect(sourcePolicy[policyKey]?.precedence?.length ?? 0).toBeGreaterThan(0)
      expect(getPolicy(policyKey).precedence[0].sourceKind).toBeTruthy()
    }
  })

  it('rejects generated, vendor, and transient paths for stable coverage evidence', () => {
    for (const prefix of COVERAGE_EXCLUDED_PATH_PREFIXES) {
      expect(isAcceptedCoverageSourcePath(`${prefix}example.ts`)).toBe(false)
    }

    expect(isAcceptedCoverageSourcePath('site/app/page.tsx')).toBe(true)
    expect(isAcceptedCoverageSourcePath('plan/README.md')).toBe(true)
    expect(isAcceptedCoverageSourcePath('archive/plans/wip/tech-stack-docs/claim-inventory.json')).toBe(false)
    expect(isAcceptedCoverageSourcePath('_generated')).toBe(false)
    expect(isAcceptedCoverageSourcePath('.env.local')).toBe(false)
  })

  it('marks dashboard-only deployment facts as manual-verification or live-status', () => {
    const model = buildGeneratorModel({ repoRoot })
    const deployment = model.coverageMatrix.rows.find((row) => row.domain === 'deployment')

    expect(deployment).toBeDefined()
    expect(deployment?.manualVerificationCount).toBeGreaterThanOrEqual(2)
    expect(deployment?.liveStatusCount).toBeGreaterThanOrEqual(1)
    expect(deployment?.codeProvenCount).toBeGreaterThanOrEqual(3)
    expect(deployment?.status).toBe('partial')
  }, 30_000)

  it('classifies environment names without merging ambiguous canonical names', () => {
    const model = buildGeneratorModel({ repoRoot })
    const classification = classifyEnvironmentNames(model.environment)

    expect(classification.canonicalNameCount).toBe(model.environment.length)
    expect(new Set(model.environment.map((record) => record.name)).size).toBe(model.environment.length)
  }, 30_000)
})
