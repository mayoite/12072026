import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildGeneratorModel } from '../../scripts/model.mjs'
import { buildRendererDataPayloads } from '../../scripts/renderer-data.mjs'
import { EXCLUDED_REPOSITORY_ROOTS } from '../../scripts/output-contract.mjs'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const repoRoot = path.resolve(packageRoot, '..')

describe('repo graph', () => {
  it('includes repo graph and runner selection in model and renderer payloads', () => {
    const model = buildGeneratorModel({ repoRoot })

    expect(model.repoGraph).toBeDefined()
    expect(Array.isArray(model.repoGraph.nodes)).toBe(true)
    expect(model.repoGraph.nodes.length).toBeGreaterThan(0)
    expect(Array.isArray(model.repoGraph.edges)).toBe(true)
    expect(model.runnerSelection).toBeDefined()
    expect(Array.isArray(model.runnerSelection.runners)).toBe(true)
    expect(model.runnerSelection.runners.length).toBeGreaterThan(0)
    expect(Array.isArray(model.runnerSelection.selections)).toBe(true)

    const payloads = buildRendererDataPayloads(model)
    expect(payloads['repo-graph.json']).toEqual(model.repoGraph)
    expect(payloads['runner-selection.json']).toEqual(model.runnerSelection)
  }, 60_000)

  it('keeps excluded roots out of graph nodes and edges', () => {
    const model = buildGeneratorModel({ repoRoot })
    const excluded = new Set(EXCLUDED_REPOSITORY_ROOTS)

    for (const node of model.repoGraph.nodes) {
      const firstSegment = node.sourcePath.replace(/\\/g, '/').split('/')[0]
      expect(excluded.has(firstSegment), node.sourcePath).toBe(false)
      expect(node.sourceHash).toMatch(/^sha256:|^missing$/)
    }

    for (const edge of model.repoGraph.edges) {
      const firstSegment = edge.sourcePath.replace(/\\/g, '/').split('/')[0]
      expect(excluded.has(firstSegment), edge.sourcePath).toBe(false)
      expect(edge.sourceHash).toMatch(/^sha256:|^missing$/)
    }
  }, 60_000)

  it('records import edges only for resolved module targets', () => {
    const model = buildGeneratorModel({ repoRoot })
    const importEdges = model.repoGraph.edges.filter((edge) => edge.kind === 'imports')

    expect(importEdges.length).toBeGreaterThan(0)
    for (const edge of importEdges) {
      expect(edge.from).toMatch(/^file:/)
      expect(edge.to).toMatch(/^file:/)
      expect(edge.sourcePointer).toBeTruthy()
    }
  }, 60_000)

  it('labels runner reachability separately from import edges', () => {
    const model = buildGeneratorModel({ repoRoot })

    expect(
      model.runnerSelection.selections.some((record) => record.relation === 'selected-by-runner'),
    ).toBe(true)
    expect(model.repoGraph.edges.every((edge) => edge.kind !== 'selected-by-runner')).toBe(true)
  }, 60_000)
})