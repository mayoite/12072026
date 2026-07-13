import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(packageRoot, '..')

function readSource(filePath: string) {
  return readFileSync(filePath, 'utf8')
}

function readWorkspacePackages(source: string) {
  const packages: string[] = []
  let inPackages = false

  for (const line of source.split(/\r?\n/)) {
    if (/^packages:\s*$/.test(line)) {
      inPackages = true
      continue
    }

    if (!inPackages) continue
    if (line.trim() === '') continue
    if (!/^\s+-\s+/.test(line)) break

    const rawEntry = line.replace(/^\s+-\s+/, '').trim()
    const quoted = rawEntry.match(/^(['"])(.*)\1$/)
    packages.push(quoted?.[2] ?? rawEntry)
  }

  return packages
}

describe('tech docs package contract', () => {
  it('uses the approved workspace directory', () => {
    const workspace = readSource(path.join(repoRoot, 'pnpm-workspace.yaml'))
    const packages = readWorkspacePackages(workspace)

    expect(packages).toContain('tech-docs-generator')
  })

  it('removes the legacy workspace directory', () => {
    const workspace = readSource(path.join(repoRoot, 'pnpm-workspace.yaml'))
    const packages = readWorkspacePackages(workspace)

    expect(packages).not.toContain('tech-stack-generator')
  })

  it('uses the approved package name', () => {
    const packageJson = JSON.parse(readSource(path.join(packageRoot, 'package.json'))) as {
      name?: unknown
    }

    expect(packageJson.name).toBe('oando-tech-docs')
  })

  it('uses a portable Vite base', () => {
    const vite = readSource(path.join(packageRoot, 'vite.config.ts'))

    expect(vite).toMatch(/base:\s*['"]\.\/['"]/)
  })

  it('uses the approved temporary Vite site output', () => {
    const vite = readSource(path.join(packageRoot, 'vite.config.ts'))

    expect(vite).toContain("../.tmp/generated-documents/site")
  })

  it('keeps the Vite and Vitest cache outside the package node_modules', () => {
    const vite = readSource(path.join(packageRoot, 'vite.config.ts'))

    expect(vite).toMatch(/cacheDir:\s*path\.resolve\(repoRoot,\s*['"]\.tmp['"],\s*['"]tech-docs['"],\s*['"]vite-cache['"]\)/)
  })

  it('documents the current tech docs development command', () => {
    const start = readSource(path.join(repoRoot, 'START.md'))

    expect(start).toContain('pnpm run tech-docs:dev')
    expect(start).not.toContain('pnpm run dev:tech-stack')
  })
})
