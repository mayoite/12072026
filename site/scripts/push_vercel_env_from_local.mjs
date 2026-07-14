import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..', '..')
const siteRoot = path.resolve(scriptDir, '..')
const envPath = path.join(repoRoot, '.env.local')

export const SKIP_KEYS = new Set([
  'DATABASE_URL',
  'PLANNER_DATABASE_URL',
  'ORIGIN_ENDPOINT',
  'VERCEL_OIDC_TOKEN',
])

export const SKIP_PREFIXES = ['DO_', 'DIGITALOCEAN_']

export function parseEnvFile(content) {
  const vars = new Map()
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!value) continue
    vars.set(key, value)
  }
  return vars
}

export function shouldSkip(key) {
  if (SKIP_KEYS.has(key)) return true
  return SKIP_PREFIXES.some((prefix) => key.startsWith(prefix))
}

export function addEnv(key, value, target) {
  const isPublic = key.startsWith('NEXT_PUBLIC_')
  const sensitivity =
    target === 'development' ? ['--no-sensitive'] : [isPublic ? '--no-sensitive' : '--sensitive']
  const args = [
    'dlx',
    'vercel@latest',
    'env',
    'add',
    key,
    target,
    '--yes',
    '--force',
    ...sensitivity,
  ]
  const result = spawnSync('pnpm', args, {
    cwd: siteRoot,
    encoding: 'utf8',
    input: value,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  })
  const output = `${result.stdout || ''}\n${result.stderr || ''}`
  const ok =
    result.status === 0 ||
    /Added|Overrode|Updated/i.test(output) ||
    /already exists/i.test(output)
  if (!ok) {
    const detail = output.trim()
    throw new Error(`${key}@${target}: ${detail || `exit ${result.status}`}`)
  }
  return true
}

function isMainModule() {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    return path.resolve(entry) === fileURLToPath(import.meta.url)
  } catch {
    return false
  }
}

if (isMainModule()) {
  const envText = readFileSync(envPath, 'utf8')
  const vars = parseEnvFile(envText)
  const targets = ['production', 'preview', 'development']
  const pushed = []
  const skipped = []

  for (const [key] of vars) {
    if (shouldSkip(key)) skipped.push(key)
  }

  for (const target of targets) {
    for (const [key, value] of vars) {
      if (shouldSkip(key)) continue
      addEnv(key, value, target)
      pushed.push(`${key}@${target}`)
      process.stdout.write(`ok ${key} → ${target}\n`)
    }
  }

  console.log(`\nDone: ${pushed.length} sets (${vars.size - skipped.length} keys × ${targets.length} targets)`)
  if (skipped.length) {
    console.log(`Skipped: ${[...new Set(skipped)].join(', ')}`)
  }
}
