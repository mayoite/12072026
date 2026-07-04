import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalJsonString, resetDirectory } from './filesystem.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..', '..')

function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function parseSiteCssImports(indexText) {
  return [...indexText.matchAll(/@import\s+["']\.\/([^"']+)["']/g)].map((match) =>
    match[1].replace(/\\/g, '/'),
  )
}

async function copyCssTree({ repoRoot, outRoot, manifest }) {
  const siteCssRoot = path.join(repoRoot, 'site', 'app', 'css')
  const indexText = await readFile(path.join(siteCssRoot, 'index.css'), 'utf8')
  const imports = parseSiteCssImports(indexText)

  for (const relative of imports) {
    const sourcePath = path.join(siteCssRoot, relative)
    const targetRelative = path.posix.join('site', relative)
    const targetPath = path.join(outRoot, targetRelative)
    await mkdir(path.dirname(targetPath), { recursive: true })
    const content = await readFile(sourcePath, 'utf8')
    await writeFile(targetPath, content, 'utf8')
    manifest.files.push({
      path: targetRelative.replace(/\\/g, '/'),
      sourcePath: `site/app/css/${relative}`,
      hash: `sha256:${sha256(content)}`,
    })
  }

  const entryLines = ['@import "tailwindcss";', ...imports.map((rel) => `@import "./site/${rel}";`)]
  const entryContent = `${entryLines.join('\n')}\n`
  const entryPath = path.join(outRoot, 'entry.css')
  await writeFile(entryPath, entryContent, 'utf8')
  manifest.files.push({
    path: 'entry.css',
    sourcePath: 'site/app/css/index.css',
    hash: `sha256:${sha256(entryContent)}`,
  })

  return { importCount: imports.length }
}

export async function syncSiteCss({ repoRoot = defaultRepoRoot } = {}) {
  const outRoot = path.join(repoRoot, 'site', 'tech-stack-generated', 'css')
  await resetDirectory(outRoot)

  const manifest = {
    version: 'v1',
    syncedAt: new Date().toISOString(),
    files: [],
  }

  const { importCount } = await copyCssTree({ repoRoot, outRoot, manifest })
  await writeFile(path.join(outRoot, 'manifest.json'), canonicalJsonString(manifest), 'utf8')

  return { outRoot, importCount, fileCount: manifest.files.length }
}

export function stableManifestForCompare(manifest) {
  const { syncedAt: _syncedAt, ...stable } = manifest
  return stable
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
if (entryPoint && fileURLToPath(import.meta.url) === entryPoint) {
  syncSiteCss()
    .then((result) => {
      console.log(
        `Synced site CSS → ${result.outRoot} (${result.importCount} imports, ${result.fileCount} manifest entries)`,
      )
    })
    .catch((error) => {
      console.error(error)
      process.exitCode = 1
    })
}
