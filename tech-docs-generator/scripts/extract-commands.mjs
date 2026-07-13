import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SOURCE_PACKAGE_DIR } from './output-contract.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

export function extractCommandRecords({ repoRoot = defaultRepoRoot } = {}) {
  const packageFiles = [
    path.join(repoRoot, 'package.json'),
    path.join(repoRoot, 'site', 'package.json'),
    path.join(repoRoot, SOURCE_PACKAGE_DIR, 'package.json'),
  ]

  return packageFiles.flatMap((filePath) => {
    const pkg = readJson(filePath)
    const scripts = pkg.scripts ?? {}
    const packageName = pkg.name ?? path.basename(path.dirname(filePath))
    const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/')

    return Object.entries(scripts).map(([scriptName, command]) => ({
      id: `${packageName}:${scriptName}`,
      packageName,
      scriptName,
      command,
      sourcePath: relativePath,
      sourceKind: 'package-script',
      sourcePointer: `scripts.${scriptName}`,
    }))
  }).sort((left, right) => {
    if (left.packageName !== right.packageName) return left.packageName.localeCompare(right.packageName)
    return left.scriptName.localeCompare(right.scriptName)
  })
}
