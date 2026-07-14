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

  it('registers the live repository regeneration plugin', () => {
    const vite = readSource(path.join(packageRoot, 'vite.config.ts'))
    const plugin = readSource(path.join(packageRoot, 'scripts', 'vite-plugin-repo-live.ts'))

    expect(vite).toContain('repoLivePlugin')
    expect(plugin).toContain("name: 'oando-repo-live'")
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

  it('uses transactional generation and build publication commands', () => {
    const packageJson = JSON.parse(readSource(path.join(packageRoot, 'package.json'))) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.dev).toBe('vite')
    expect(packageJson.scripts?.generate).toBe('node scripts/generate-all.mjs')
    expect(packageJson.scripts?.test).toBe('vitest run')
    expect(packageJson.scripts?.['test:coverage']).toBe('vitest run --coverage')
    expect(packageJson.scripts?.check).toBe('node scripts/check.mjs')
    expect(packageJson.scripts?.build).toBe(
      'node scripts/generate-all.mjs --stage-only && vite build && node scripts/publish-all.mjs',
    )
    expect(packageJson.scripts?.gate).toBe('node scripts/gate.mjs')
  })

  it('writes coverage output under root results tooling paths', () => {
    const vitest = readSource(path.join(packageRoot, 'vitest.config.ts'))
    const coverageScript = readSource(path.join(packageRoot, 'scripts', 'check-coverage.mjs'))
    const coverageReport = readSource(path.join(packageRoot, 'scripts', 'generate-coverage-report.mjs'))

    expect(vitest).toContain("path.resolve(repoRoot, 'results', 'tooling', 'tech-docs', 'coverage')")
    expect(coverageScript).toContain("path.join(root, 'results', 'tooling', 'tech-docs', 'coverage', 'coverage-summary.json')")
    expect(coverageReport).toContain("path.join(root, 'results', 'tooling', 'tech-docs', 'coverage', 'coverage-summary.json')")
  })

  it('keeps check read-only and runs the planned gate order', () => {
    const checkScript = readSource(path.join(packageRoot, 'scripts', 'check.mjs'))
    const gateScript = readSource(path.join(packageRoot, 'scripts', 'gate.mjs'))

    expect(checkScript).toContain('generateAll({ repoRoot, stageOnly: true')
    expect(checkScript).not.toContain('apply: true')
    expect(gateScript).toContain("console.log('docs:gate - generate')")
    expect(gateScript).toContain("console.log('docs:gate - check')")
    expect(gateScript).toContain("console.log('docs:gate - hardcoding guard')")
    expect(gateScript).toContain("console.log('docs:gate - fake-test audit')")
    expect(gateScript).toContain("console.log('docs:gate - theme alignment')")
    expect(gateScript).toContain("console.log('docs:gate - coverage')")
    expect(gateScript).toContain("console.log('docs:gate - typecheck')")
    expect(gateScript).toContain("console.log('docs:gate - test')")
    expect(gateScript).toContain("console.log('docs:gate - build')")
  })

  it('runs tech docs CI without path filters', () => {
    const workflow = readSource(path.join(repoRoot, '.github', 'workflows', 'tech-docs.yml'))

    expect(workflow).not.toMatch(/\n\s+paths:\n/)
    expect(workflow).toContain('run: pnpm run tech-docs:gate')
    expect(workflow).toContain('path: generated-documents/site/')
  })
})
