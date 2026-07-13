import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalJsonString, resetDirectory } from './filesystem.mjs'
import { getRendererDataRoot, getSourcePackageRoot, getStagingRendererDataRoot } from './output-contract.mjs'
import { publishGeneratedTree, writeSurfaceManifest } from './publish-generated-tree.mjs'
import { buildGeneratorModel } from './model.mjs'
import {
  buildRendererAccuracyReport,
  buildRendererDataPayloads,
} from './renderer-data.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

export async function emitRendererData({
  repoRoot = defaultRepoRoot,
  model = buildGeneratorModel({ repoRoot }),
  outDir = getRendererDataRoot(repoRoot),
  stagingDataRoot = getStagingRendererDataRoot(repoRoot),
  apply = true,
  publishOptions = {},
} = {}) {
  const payloads = buildRendererDataPayloads(model)
  await resetDirectory(stagingDataRoot)

  for (const [filename, value] of Object.entries(payloads)) {
    await writeFile(path.join(stagingDataRoot, filename), `${canonicalJsonString(value)}\n`, 'utf8')
  }

  const packageRoot = getSourcePackageRoot(repoRoot)
  const accuracy = buildRendererAccuracyReport(model, payloads, { packageRoot })
  await writeFile(
    path.join(stagingDataRoot, '_accuracy-renderer.json'),
    `${canonicalJsonString(accuracy)}\n`,
    'utf8',
  )
  const nextManifest = await writeSurfaceManifest({ stagingRoot: stagingDataRoot, surface: 'data' })
  if (apply) {
    await publishGeneratedTree({
      surface: 'data',
      canonicalRoot: outDir,
      stagingRoot: stagingDataRoot,
      ...publishOptions,
    })
  }

  return {
    outDir,
    stagingDataRoot,
    nextManifest,
    payloads,
    fileCount: Object.keys(payloads).length + 1,
    dependencyCount: model.dependencies.length,
    searchCount: payloads['search-items.json'].length,
  }
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  emitRendererData()
    .then((result) => {
      console.log(
        `Emitted renderer data: ${result.fileCount} files (${result.dependencyCount} dependencies, ${result.searchCount} search items) → ${result.outDir}`,
      )
    })
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
}
