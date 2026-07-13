import { describe, expect, it } from 'vitest'
import { getPolicy, selectPreferredSource, sourceKinds, sourcePolicy } from '../../scripts/source-policy.mjs'
import * as outputContract from '../../scripts/output-contract.mjs'
import path from 'node:path'

describe('source policy', () => {
  it('rejects reference, protected, generated, and outside-root inputs before classification', () => {
    const contract = outputContract as typeof outputContract & {
      normalizeRepositoryInput?: (repoRoot: string, inputPath: string) => string | null
    }
    const repoRoot = path.resolve('fixture-repo')
    const excluded = ['archive', 'websites', '.archive', '.websites', 'PROTECTED', 'generated-documents', 'results', 'node_modules', '.git', '.next', '.tmp']

    expect(outputContract.EXCLUDED_REPOSITORY_ROOTS).toEqual(excluded)
    for (const root of excluded) {
      expect(contract.normalizeRepositoryInput?.(repoRoot, `${root}/source.ts`)).toBeNull()
      expect(contract.normalizeRepositoryInput?.(repoRoot, path.join(repoRoot, root, 'source.ts'))).toBeNull()
    }
    expect(contract.normalizeRepositoryInput?.(repoRoot, path.resolve(repoRoot, '..', 'outside.ts'))).toBeNull()
    expect(contract.normalizeRepositoryInput?.(repoRoot, path.join(repoRoot, 'site', 'page.tsx'))).toBe('site/page.tsx')
  })

  it('stores the precedence rules as data', () => {
    expect(sourcePolicy.dependencies.precedence.map((entry) => entry.sourceKind)).toEqual([
      'package-manifest',
      'lockfile',
    ])
    expect(getPolicy('routes').precedence[0].sourceKind).toBe('page-file')
    expect(sourcePolicy.structure.conflictMode).toBe('reject-unsupported')
  })

  it('includes the plan-aligned docs and deployment domains', () => {
    expect(sourcePolicy.deployment.precedence.map((entry) => entry.sourceKind)).toEqual([
      'vercel-config',
      'workflow-file',
      'package-script',
      'handover-note',
    ])
    expect(getPolicy('docs-health').precedence[0].sourceKind).toBe('readme-doc')
    expect(sourcePolicy.coverage.precedence.map((entry) => entry.sourceKind)).toContain('coverage-summary')
    expect(sourcePolicy.failures.conflictMode).toBe('reject-mismatch')
    expect(sourceKinds).toEqual(
      expect.arrayContaining([
        'vercel-config',
        'workflow-file',
        'package-script',
        'handover-note',
        'dependabot-config',
        'source-module',
        'api-route',
        'theme-token-file',
        'generated-css-manifest',
        'failures-log',
        'readme-doc',
        'runbook-doc',
        'plan-pack',
        'architecture-doc',
        'api-doc',
        'renderer-accuracy-report',
        'generated-manifest',
        'fake-test-audit',
        'coverage-report',
        'coverage-summary',
        'docs-gate',
        'test-run',
      ]),
    )
  })

  it('prefers earlier sources and rejects same-rank conflicts', () => {
    const winner = selectPreferredSource('routes', [
      {
        sourceKind: 'route-contract',
        sourcePath: 'site/config/route-contract.json',
        sourcePointer: 'routes./tech-stack',
        value: 'metadata',
      },
      {
        sourceKind: 'page-file',
        sourcePath: 'site/app/tech-stack/page.tsx',
        sourcePointer: 'default export',
        value: 'proof',
      },
    ])

    expect(winner.sourceKind).toBe('page-file')

    expect(() =>
      selectPreferredSource('routes', [
        {
          sourceKind: 'page-file',
          sourcePath: 'site/app/tech-stack/page.tsx',
          sourcePointer: 'default export',
          value: '/tech-stack',
        },
        {
          sourceKind: 'page-file',
          sourcePath: 'site/app/tech-stack/page.tsx',
          sourcePointer: 'default export',
          value: '/tech-stack-v2',
        },
      ]),
    ).toThrow(/Source conflict/)
  })
})
