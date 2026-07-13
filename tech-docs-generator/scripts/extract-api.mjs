import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

function walkFiles(rootDir, predicate, out = []) {
  for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
    const abs = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(abs, predicate, out)
    } else if (predicate(entry.name)) {
      out.push(abs)
    }
  }
  return out
}

function stripRouteGroup(segment) {
  return /^\(.*\)$/.test(segment) ? null : segment
}

export function deriveApiPath(filePath, repoRoot = defaultRepoRoot) {
  const relativePath = path.relative(path.join(repoRoot, 'site', 'app', 'api'), filePath).replace(/\\/g, '/')
  const segments = relativePath.split('/')
  const routeSegments = segments
    .filter((segment) => segment !== 'route.ts')
    .map(stripRouteGroup)
    .filter(Boolean)

  return `/api/${routeSegments.join('/')}`.replace(/\/+$/, '') || '/api'
}

export function extractApiRecords({ repoRoot = defaultRepoRoot } = {}) {
  const apiDir = path.join(repoRoot, 'site', 'app', 'api')
  const routeFiles = walkFiles(apiDir, (name) => name === 'route.ts')

  return routeFiles.flatMap((filePath) => {
    const sourceText = readFileSync(filePath, 'utf8')
    const methods = HTTP_METHODS.filter((method) => new RegExp(`export\\s+(?:async\\s+)?(?:function|const)\\s+${method}\\b`).test(sourceText))
    const routePath = deriveApiPath(filePath, repoRoot)

    return methods.map((method) => ({
      id: `${routePath}:${method}`,
      path: routePath,
      method,
      sourcePath: path.relative(repoRoot, filePath).replace(/\\/g, '/'),
      sourceKind: 'route-file',
      sourcePointer: `export ${method}`,
    }))
  }).sort((left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method))
}
