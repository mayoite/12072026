import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Project } from 'ts-morph'
import { extractApiRecords } from './extract-api.mjs'
import { extractRouteRecords } from './extract-routes.mjs'
import { comparePaths, normalizeSourceText } from './filesystem.mjs'
import { normalizeRepositoryInput } from './output-contract.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const SCAN_ROOTS = ['site', 'tech-docs-generator']

function sourceHash(repoRoot, relativePath) {
  try {
    const content = normalizeSourceText(readFileSync(path.join(repoRoot, relativePath), 'utf8'))
    return `sha256:${createHash('sha256').update(content, 'utf8').digest('hex')}`
  } catch {
    return 'missing'
  }
}

function walkFiles(repoRoot, relativeRoot, predicate, out = []) {
  const absRoot = path.join(repoRoot, relativeRoot)
  if (!existsSync(absRoot)) return out

  for (const entry of readdirSync(absRoot, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeRoot.replace(/\\/g, '/'), entry.name)
    if (!normalizeRepositoryInput(repoRoot, relativePath)) continue

    const abs = path.join(repoRoot, relativePath)
    if (entry.isDirectory()) {
      walkFiles(repoRoot, relativePath, predicate, out)
    } else if (predicate(relativePath, abs)) {
      out.push(relativePath.replace(/\\/g, '/'))
    }
  }

  return out
}

function isSourceFile(relativePath) {
  return SOURCE_EXTENSIONS.has(path.extname(relativePath))
}

function isTestFile(relativePath) {
  return /\.(test|spec)\.[cm]?[jt]sx?$/.test(relativePath)
}

function isWorkflowFile(relativePath) {
  return relativePath.startsWith('.github/workflows/') && relativePath.endsWith('.yml')
}

function isPackageManifest(relativePath) {
  return relativePath === 'package.json' || relativePath.endsWith('/package.json')
}

function addNode(nodes, nodeIds, node) {
  if (nodeIds.has(node.id)) return
  nodeIds.add(node.id)
  nodes.push(node)
}

function addEdge(edges, edgeIds, edge) {
  if (edgeIds.has(edge.id)) return
  edgeIds.add(edge.id)
  edges.push(edge)
}

export function extractRepoGraph({ repoRoot = defaultRepoRoot } = {}) {
  const nodes = []
  const edges = []
  const nodeIds = new Set()
  const edgeIds = new Set()

  for (const route of extractRouteRecords({ repoRoot })) {
    addNode(nodes, nodeIds, {
      id: `route:${route.path}`,
      kind: 'route',
      label: route.path,
      sourcePath: route.sourcePath,
      sourcePointer: route.sourcePointer ?? `route ${route.path}`,
      sourceHash: sourceHash(repoRoot, route.sourcePath),
    })
    addNode(nodes, nodeIds, {
      id: `file:${route.sourcePath}`,
      kind: 'file',
      label: path.basename(route.sourcePath),
      sourcePath: route.sourcePath,
      sourcePointer: route.sourcePath,
      sourceHash: sourceHash(repoRoot, route.sourcePath),
    })
    addEdge(edges, edgeIds, {
      id: `owns:route:${route.path}->file:${route.sourcePath}`,
      kind: 'owns',
      from: `route:${route.path}`,
      to: `file:${route.sourcePath}`,
      sourcePath: route.sourcePath,
      sourcePointer: route.sourcePointer ?? `route ${route.path}`,
      sourceHash: sourceHash(repoRoot, route.sourcePath),
    })
  }

  for (const apiRecord of extractApiRecords({ repoRoot })) {
    const apiId = `api:${apiRecord.path}:${apiRecord.method}`
    addNode(nodes, nodeIds, {
      id: apiId,
      kind: 'api',
      label: `${apiRecord.method} ${apiRecord.path}`,
      sourcePath: apiRecord.sourcePath,
      sourcePointer: apiRecord.sourcePointer,
      sourceHash: sourceHash(repoRoot, apiRecord.sourcePath),
    })
    addNode(nodes, nodeIds, {
      id: `file:${apiRecord.sourcePath}`,
      kind: 'file',
      label: path.basename(apiRecord.sourcePath),
      sourcePath: apiRecord.sourcePath,
      sourcePointer: apiRecord.sourcePath,
      sourceHash: sourceHash(repoRoot, apiRecord.sourcePath),
    })
    addEdge(edges, edgeIds, {
      id: `owns:${apiId}->file:${apiRecord.sourcePath}`,
      kind: 'owns',
      from: apiId,
      to: `file:${apiRecord.sourcePath}`,
      sourcePath: apiRecord.sourcePath,
      sourcePointer: apiRecord.sourcePointer,
      sourceHash: sourceHash(repoRoot, apiRecord.sourcePath),
    })
  }

  const sourceFiles = SCAN_ROOTS.flatMap((root) => walkFiles(repoRoot, root, isSourceFile))
  const testFiles = sourceFiles.filter(isTestFile)
  const workflowFiles = walkFiles(repoRoot, '.github/workflows', (relativePath) => isWorkflowFile(relativePath))
  const packageFiles = [
    'package.json',
    'site/package.json',
    'tech-docs-generator/package.json',
  ].filter((relativePath) => existsSync(path.join(repoRoot, relativePath)))

  for (const relativePath of packageFiles) {
    addNode(nodes, nodeIds, {
      id: `package:${relativePath}`,
      kind: 'package',
      label: relativePath,
      sourcePath: relativePath,
      sourcePointer: relativePath,
      sourceHash: sourceHash(repoRoot, relativePath),
    })
  }

  for (const relativePath of workflowFiles) {
    addNode(nodes, nodeIds, {
      id: `workflow:${relativePath}`,
      kind: 'workflow',
      label: path.basename(relativePath),
      sourcePath: relativePath,
      sourcePointer: relativePath,
      sourceHash: sourceHash(repoRoot, relativePath),
    })
  }

  for (const relativePath of testFiles) {
    addNode(nodes, nodeIds, {
      id: `test:${relativePath}`,
      kind: 'test',
      label: path.basename(relativePath),
      sourcePath: relativePath,
      sourcePointer: relativePath,
      sourceHash: sourceHash(repoRoot, relativePath),
    })
  }

  const tsConfigPath = path.join(repoRoot, 'site', 'tsconfig.json')
  const project = new Project({
    tsConfigFilePath: existsSync(tsConfigPath) ? tsConfigPath : undefined,
    skipAddingFilesFromTsConfig: true,
  })
  project.addSourceFilesAtPaths(sourceFiles.map((relativePath) => path.join(repoRoot, relativePath)))

  for (const sourceFile of project.getSourceFiles()) {
    const relativePath = path.relative(repoRoot, sourceFile.getFilePath()).replace(/\\/g, '/')
    if (!normalizeRepositoryInput(repoRoot, relativePath)) continue

    addNode(nodes, nodeIds, {
      id: `file:${relativePath}`,
      kind: 'file',
      label: path.basename(relativePath),
      sourcePath: relativePath,
      sourcePointer: relativePath,
      sourceHash: sourceHash(repoRoot, relativePath),
    })

    for (const importDecl of sourceFile.getImportDeclarations()) {
      const targetFile = importDecl.getModuleSpecifierSourceFile()
      if (!targetFile) continue

      const targetRelative = path.relative(repoRoot, targetFile.getFilePath()).replace(/\\/g, '/')
      if (!normalizeRepositoryInput(repoRoot, targetRelative)) continue

      addNode(nodes, nodeIds, {
        id: `file:${targetRelative}`,
        kind: 'file',
        label: path.basename(targetRelative),
        sourcePath: targetRelative,
        sourcePointer: targetRelative,
        sourceHash: sourceHash(repoRoot, targetRelative),
      })

      addEdge(edges, edgeIds, {
        id: `imports:file:${relativePath}->file:${targetRelative}:${importDecl.getModuleSpecifierValue()}`,
        kind: 'imports',
        from: `file:${relativePath}`,
        to: `file:${targetRelative}`,
        sourcePath: relativePath,
        sourcePointer: importDecl.getModuleSpecifierValue(),
        sourceHash: sourceHash(repoRoot, relativePath),
        sourceLine: importDecl.getStartLineNumber(),
      })

      if (isTestFile(relativePath) && !isTestFile(targetRelative)) {
        addEdge(edges, edgeIds, {
          id: `tests:test:${relativePath}->file:${targetRelative}`,
          kind: 'tests',
          from: `test:${relativePath}`,
          to: `file:${targetRelative}`,
          sourcePath: relativePath,
          sourcePointer: importDecl.getModuleSpecifierValue(),
          sourceHash: sourceHash(repoRoot, relativePath),
          sourceLine: importDecl.getStartLineNumber(),
        })
      }
    }
  }

  nodes.sort((left, right) => comparePaths(left.id, right.id))
  edges.sort((left, right) => comparePaths(left.id, right.id))

  return { nodes, edges }
}