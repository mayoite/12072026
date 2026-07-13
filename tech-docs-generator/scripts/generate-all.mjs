import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalJsonString } from './filesystem.mjs'
import { generateDocs } from './generate.mjs'
import { emitRendererData } from './emit-renderer-data.mjs'
import { buildGeneratorModel } from './model.mjs'
import { publishGeneratedTrees, validateGeneratedSurface } from './publish-generated-tree.mjs'
import { PARITY_DATA_FILES } from './renderer-data.mjs'
import { getStagingDocumentsRoot, getStagingRendererDataRoot } from './output-contract.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

export async function generateAll({ repoRoot = defaultRepoRoot, stageOnly = false } = {}) {
  const model = buildGeneratorModel({ repoRoot })
  const docs = await generateDocs({ repoRoot, model, apply: false })
  const data = await emitRendererData({ repoRoot, model, apply: false })
  for (const filename of PARITY_DATA_FILES) {
    const docsValue = docs.jsonOutputs[`data/${filename}`]
    const dataValue = data.payloads[filename]
    if (canonicalJsonString(docsValue) !== canonicalJsonString(dataValue)) {
      throw new Error(`Staged renderer parity mismatch: ${filename}`)
    }
  }
  await validateGeneratedSurface({ root: getStagingDocumentsRoot(repoRoot), surface: 'docs' })
  await validateGeneratedSurface({ root: getStagingRendererDataRoot(repoRoot), surface: 'data' })
  const publication = stageOnly
    ? null
    : await publishGeneratedTrees({ repoRoot, surfaces: ['docs', 'data'] })
  return { model, docs, data, publication }
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  generateAll({ stageOnly: process.argv.includes('--stage-only') }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
