import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { generateDocs } from '../../scripts/generate.mjs'
import { buildGeneratorModel } from '../../scripts/model.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../')
const tempRoots: string[] = []

function createTempRoot() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'oando-tech-stack-docs-'))
  tempRoots.push(root)
  return root
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('tech stack generation', () => {
  it('writes stable staged and applied output', async () => {
    const documentsRoot = path.join(createTempRoot(), 'Documents')
    const stagingDocumentsRoot = path.join(createTempRoot(), '.tmp', 'tech-stack-docs', 'Documents')

    const first = await generateDocs({ repoRoot, documentsRoot, stagingDocumentsRoot, apply: true })
    const second = await generateDocs({ repoRoot, documentsRoot, stagingDocumentsRoot, apply: true })

    expect(first.nextManifest.hash).toBe(second.nextManifest.hash)
    expect(readFileSync(path.join(documentsRoot, '_manifest.json'), 'utf8')).toContain(first.nextManifest.hash)
    expect(readFileSync(path.join(documentsRoot, 'data', 'dependencies.json'), 'utf8')).toContain('"id": "site:dependencies:next.resolved-version"')
    expect(readFileSync(path.join(documentsRoot, 'markdown', 'overview', 'index.md'), 'utf8')).toContain('# Overview')
    expect(readFileSync(path.join(documentsRoot, 'markdown', 'architecture', 'index.md'), 'utf8')).toContain('architecture.rootScripts')
    expect(readFileSync(path.join(documentsRoot, '_accuracy.json'), 'utf8')).toContain('"exactSourceMatches"')
  }, 60_000)

  it('cleans staging before writing fresh outputs', async () => {
    const documentsRoot = path.join(createTempRoot(), 'Documents')
    const stagingDocumentsRoot = path.join(createTempRoot(), '.tmp', 'tech-stack-docs', 'Documents')
    mkdirSync(stagingDocumentsRoot, { recursive: true })
    writeFileSync(path.join(stagingDocumentsRoot, 'stale.txt'), 'remove-me', 'utf8')

    await generateDocs({ repoRoot, documentsRoot, stagingDocumentsRoot, apply: false })

    expect(existsSync(path.join(stagingDocumentsRoot, 'stale.txt'))).toBe(false)
    expect(existsSync(path.join(stagingDocumentsRoot, '_manifest.json'))).toBe(true)
    expect(existsSync(path.join(stagingDocumentsRoot, 'data', 'dependencies.json'))).toBe(true)
  }, 30_000)

  it('emits normalized facts with provenance metadata', () => {
    const model = buildGeneratorModel({ repoRoot })

    expect(model.facts.length).toBeGreaterThan(0)
    for (const record of model.facts) {
      expect(record.fact).toEqual(
        expect.objectContaining({
          sourcePath: expect.any(String),
          sourceKind: expect.any(String),
          sourcePointer: expect.any(String),
          factClassification: expect.any(String),
        }),
      )
    }

    expect(model.facts.find((record) => record.id === 'overview.commands')).toMatchObject({
      id: 'overview.commands',
      category: 'overview',
      fact: expect.objectContaining({
        sourcePath: '_generated',
        sourceKind: 'generated-summary',
        sourcePointer: 'overview.commands',
        factClassification: 'code-proven',
        browserExposure: 'public-safe',
        secretRisk: 'none',
        renderSurface: ['markdown', 'renderer'],
        verificationMode: 'source-backed',
      }),
    })

    expect(model.testingPolicy.find((record) => record.id === 'testing.coverage-warning')).toMatchObject({
      id: 'testing.coverage-warning',
      fact: {
        sourcePath: 'archive/plans/done/tech-stack-docs-3-file-plan/01-execution-plan.md',
        sourceKind: 'plan-contract',
        sourcePointer: 'Phase 3 Task 10',
        factClassification: 'code-proven',
      },
    })
  }, 30_000)
})
