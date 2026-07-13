import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { rename } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { generateDocs } from '../../scripts/generate.mjs'
import { emitRendererData } from '../../scripts/emit-renderer-data.mjs'
import { buildGeneratorModel } from '../../scripts/model.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../')
const tempRoots: string[] = []

function createTempRoot() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'oando-tech-docs-'))
  tempRoots.push(root)
  return root
}

function snapshotTree(root: string, relative = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const next = relative ? path.join(relative, entry.name) : entry.name
    if (entry.isDirectory()) Object.assign(result, snapshotTree(root, next))
    if (entry.isFile()) result[next.replace(/\\/g, '/')] = readFileSync(path.join(root, next)).toString('base64')
  }
  return result
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('tech stack generation', () => {
  it('rolls back the previous docs tree when the staged swap fails', async () => {
    const documentsRoot = path.join(createTempRoot(), 'generated-documents', 'docs')
    const stagingDocumentsRoot = path.join(createTempRoot(), '.tmp', 'generated-documents', 'docs')
    const model = buildGeneratorModel({ repoRoot })
    await generateDocs({ repoRoot, model, documentsRoot, stagingDocumentsRoot, apply: true })
    const previous = snapshotTree(documentsRoot)
    const changedModel = structuredClone(model)
    changedModel.summary.commands += 1
    let renameCount = 0

    await expect(generateDocs({
      repoRoot,
      model: changedModel,
      documentsRoot,
      stagingDocumentsRoot,
      apply: true,
      publishOptions: {
        operations: {
          rename: async (source: string, target: string) => {
            renameCount += 1
            if (renameCount === 2) throw new Error('injected staged swap failure')
            await rename(source, target)
          },
        },
      },
    })).rejects.toThrow(/injected staged swap failure/)

    expect(snapshotTree(documentsRoot)).toEqual(previous)
  }, 60_000)

  it('refuses unknown renderer data and preserves an identical previous tree', async () => {
    const outDir = path.join(createTempRoot(), 'generated-documents', 'data')
    const stagingDataRoot = path.join(createTempRoot(), '.tmp', 'generated-documents', 'data')
    const model = buildGeneratorModel({ repoRoot })
    await emitRendererData({ repoRoot, model, outDir, stagingDataRoot, apply: true })
    const previous = snapshotTree(outDir)

    await emitRendererData({
      repoRoot,
      model,
      outDir,
      stagingDataRoot,
      apply: true,
      publishOptions: { operations: { rename: async () => { throw new Error('identical data must not swap') } } },
    })
    expect(snapshotTree(outDir)).toEqual(previous)

    writeFileSync(path.join(outDir, 'rogue.txt'), 'owner-data')
    await expect(emitRendererData({ repoRoot, model, outDir, stagingDataRoot, apply: true }))
      .rejects.toThrow(/Unknown file\(s\) in generated-documents\/data\/: rogue\.txt/)
    expect(readFileSync(path.join(outDir, 'rogue.txt'), 'utf8')).toBe('owner-data')
  }, 60_000)

  it('writes stable staged and applied output', async () => {
    const documentsRoot = path.join(createTempRoot(), 'Documents')
    const stagingDocumentsRoot = path.join(createTempRoot(), '.tmp', 'generated-documents', 'docs')

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
    const stagingDocumentsRoot = path.join(createTempRoot(), '.tmp', 'generated-documents', 'docs')
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

    expect(model.testingPolicy.find((record) => record.id === 'testing.coverage-floor')).toMatchObject({
      id: 'testing.coverage-floor',
      fact: {
        sourcePath: 'tech-docs-generator/scripts/check-coverage.mjs',
        sourceKind: 'checked-in-script-or-config',
        sourcePointer: 'THRESHOLDS.minimum',
        factClassification: 'code-proven',
      },
    })
  }, 30_000)
})
