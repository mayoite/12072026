import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GENERATED_SURFACES, getStagingGeneratedRoot } from './output-contract.mjs'
import { publishGeneratedTrees, writeSurfaceManifest } from './publish-generated-tree.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

export async function publishAll({ repoRoot = defaultRepoRoot, surfaces } = {}) {
  if (!Array.isArray(surfaces) || surfaces.length === 0) throw new Error('publishAll requires an explicit surface list')
  for (const surface of surfaces) {
    await writeSurfaceManifest({
      stagingRoot: path.join(getStagingGeneratedRoot(repoRoot), surface),
      surface,
    })
  }
  return publishGeneratedTrees({ repoRoot, surfaces })
}

function cliSurfaces(argv) {
  const option = argv.find((value) => value.startsWith('--surfaces='))
  if (option) return option.slice('--surfaces='.length).split(',').filter(Boolean)
  const positional = argv.filter((value) => !value.startsWith('-'))
  return positional.length ? positional : [...GENERATED_SURFACES]
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  publishAll({ surfaces: cliSurfaces(process.argv.slice(2)) }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
