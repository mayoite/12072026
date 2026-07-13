import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { generateAll } from './generate-all.mjs'
import { canonicalJsonString } from './filesystem.mjs'
import { PARITY_DATA_FILES } from './renderer-data.mjs'
import {
  getDocumentsRoot,
  getRendererDataRoot,
  getStagingDocumentsRoot,
  getStagingRendererDataRoot,
} from './output-contract.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

function describeManifestMismatches(surface, generatedManifest, actualManifest) {
  if (generatedManifest === actualManifest) {
    return []
  }

  if (!actualManifest) {
    return [`generated-documents/${surface}/_manifest.json is missing`]
  }

  const generated = JSON.parse(generatedManifest)
  const actual = JSON.parse(actualManifest)
  const mismatches = []

  if (generated.hash !== actual.hash) {
    mismatches.push(`manifest hash: generated=${generated.hash} committed=${actual.hash}`)
  }

  const generatedFiles = new Map(generated.files.map((file) => [file.path, file]))
  const actualFiles = new Map(actual.files.map((file) => [file.path, file]))

  for (const [filePath, generatedFile] of generatedFiles) {
    const actualFile = actualFiles.get(filePath)
    if (!actualFile) {
      mismatches.push(`missing committed file: ${filePath}`)
      continue
    }
    if (generatedFile.hash !== actualFile.hash) {
      mismatches.push(`${filePath}: generated=${generatedFile.hash} committed=${actualFile.hash}`)
    }
  }

  for (const filePath of actualFiles.keys()) {
    if (!generatedFiles.has(filePath)) {
      mismatches.push(`unexpected committed file: ${filePath}`)
    }
  }

  return mismatches
}

async function compareSurface(surface, stagingRoot, canonicalRoot) {
  const generatedManifest = await readFile(path.join(stagingRoot, '_manifest.json'), 'utf8')
  const actualManifest = await readFile(path.join(canonicalRoot, '_manifest.json'), 'utf8').catch(() => null)
  return describeManifestMismatches(surface, generatedManifest, actualManifest)
}

async function compareStagedParity(stagingDocumentsRoot, stagingDataRoot) {
  const mismatches = []

  for (const filename of PARITY_DATA_FILES) {
    const documentsValue = await readFile(path.join(stagingDocumentsRoot, 'data', filename), 'utf8').catch(() => null)
    const rendererValue = await readFile(path.join(stagingDataRoot, filename), 'utf8').catch(() => null)

    if (documentsValue === null) {
      mismatches.push(`missing staged docs parity file: ${filename}`)
      continue
    }

    if (rendererValue === null) {
      mismatches.push(`missing staged renderer parity file: ${filename}`)
      continue
    }

    if (canonicalJsonString(JSON.parse(documentsValue)) !== canonicalJsonString(JSON.parse(rendererValue))) {
      mismatches.push(`staged docs and renderer data differ: ${filename}`)
    }
  }

  return mismatches
}

export async function checkDocs({
  repoRoot = defaultRepoRoot,
  documentsRoot = getDocumentsRoot(repoRoot),
  rendererDataRoot = getRendererDataRoot(repoRoot),
  stagingDocumentsRoot = getStagingDocumentsRoot(repoRoot),
  stagingDataRoot = getStagingRendererDataRoot(repoRoot),
} = {}) {
  await generateAll({ repoRoot, stageOnly: true })

  const surfaceMismatches = [
    ...await compareSurface('docs', stagingDocumentsRoot, documentsRoot),
    ...await compareSurface('data', stagingDataRoot, rendererDataRoot),
  ]
  if (surfaceMismatches.length > 0) {
    const detail = surfaceMismatches.slice(0, 10).join('; ')
    const suffix = surfaceMismatches.length > 10 ? ` (+${surfaceMismatches.length - 10} more)` : ''
    throw new Error(`Generated output does not match canonical generated-documents/: ${detail}${suffix}`)
  }

  const parityMismatches = await compareStagedParity(stagingDocumentsRoot, stagingDataRoot)
  if (parityMismatches.length > 0) {
    throw new Error(`Staged renderer parity failed: ${parityMismatches.join('; ')}`)
  }

  return true
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  checkDocs().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
