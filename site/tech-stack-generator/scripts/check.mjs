import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { generateDocs } from './generate.mjs'
import { getDocumentsRoot, getStagingDocumentsRoot } from './filesystem.mjs'
import { checkRendererAccuracy, checkRendererParity } from './check-renderer-parity.mjs'
import { checkHardcoding } from './hardcoding-guard.mjs'
import { auditTests } from './fake-test-audit.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..', '..')

function describeManifestMismatches(generatedManifest, actualManifest) {
  if (generatedManifest === actualManifest) {
    return []
  }

  if (!actualManifest) {
    return ['documents-generated/_manifest.json is missing']
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
      mismatches.push(
        `${filePath}: generated=${generatedFile.hash} committed=${actualFile.hash}`,
      )
    }
  }

  for (const filePath of actualFiles.keys()) {
    if (!generatedFiles.has(filePath)) {
      mismatches.push(`unexpected committed file: ${filePath}`)
    }
  }

  return mismatches
}

async function compareGeneratedOutputs(documentsRoot, stagingDocumentsRoot) {
  const generatedManifest = await readFile(path.join(stagingDocumentsRoot, '_manifest.json'), 'utf8')
  const actualManifest = await readFile(path.join(documentsRoot, '_manifest.json'), 'utf8').catch(() => null)
  const mismatches = describeManifestMismatches(generatedManifest, actualManifest)
  return { matches: mismatches.length === 0, mismatches }
}

export async function checkDocs({
  repoRoot = defaultRepoRoot,
  documentsRoot = getDocumentsRoot(repoRoot),
  stagingDocumentsRoot = getStagingDocumentsRoot(repoRoot),
} = {}) {
  await generateDocs({ repoRoot, documentsRoot, stagingDocumentsRoot, apply: false })
  const comparison = await compareGeneratedOutputs(documentsRoot, stagingDocumentsRoot).catch(() => ({
    matches: false,
    mismatches: ['Failed to compare Documents/_manifest.json'],
  }))
  if (!comparison.matches) {
    const detail = comparison.mismatches.slice(0, 10).join('; ')
    const suffix = comparison.mismatches.length > 10 ? ` (+${comparison.mismatches.length - 10} more)` : ''
    throw new Error(`Generated output does not match Documents/: ${detail}${suffix}`)
  }

  const parityMismatches = await checkRendererParity({ repoRoot, documentsRoot })
  if (parityMismatches.length > 0) {
    throw new Error(
      `Renderer parity failed (${parityMismatches.length}): ${parityMismatches
        .map((item) => `${item.file}@${item.surface}: ${item.reason}`)
        .join('; ')}`,
    )
  }

  const accuracyMismatches = await checkRendererAccuracy({ repoRoot })
  if (accuracyMismatches.length > 0) {
    throw new Error(
      `Renderer accuracy failed (${accuracyMismatches.length}): ${accuracyMismatches
        .map((item) => `${item.file}: ${item.reason}`)
        .join('; ')}`,
    )
  }

  const packageRoot = path.join(repoRoot, 'site', 'tech-stack-generator')
  const hardcodingViolations = checkHardcoding({ root: packageRoot })
  if (hardcodingViolations.length > 0) {
    throw new Error(
      `Hardcoding guard failed (${hardcodingViolations.length}): ${hardcodingViolations
        .map((item) => `${item.file}:${item.line} ${item.reason}`)
        .join('; ')}`,
    )
  }

  const fakeTestViolations = auditTests({ root: packageRoot })
  if (fakeTestViolations.length > 0) {
    throw new Error(
      `Fake-test audit failed (${fakeTestViolations.length}): ${fakeTestViolations
        .map((item) => `${item.file}: ${item.reason}`)
        .join('; ')}`,
    )
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
