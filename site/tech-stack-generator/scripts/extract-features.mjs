import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..', '..')
const require = createRequire(import.meta.url)
const ts = require('typescript')

function readText(filePath) {
  return ts.sys.readFile(filePath, 'utf8') ?? ''
}

function getStringLiteral(node) {
  return ts.isStringLiteralLike(node) ? node.text : undefined
}

function getArrayOfStrings(node) {
  if (!ts.isArrayLiteralExpression(node)) return undefined
  return node.elements.map((element) => getStringLiteral(element)).filter((value) => value !== undefined)
}

function parsePlannerFeaturePages(filePath) {
  const sourceText = readText(filePath)
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const records = []

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return
    for (const declaration of node.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== 'PLANNER_FEATURE_PAGES') continue
      if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue

      declaration.initializer.elements.forEach((element, index) => {
        if (!ts.isObjectLiteralExpression(element)) return
        const feature = {
          sourcePath: path.relative(defaultRepoRoot, filePath).replace(/\\/g, '/'),
          sourceKind: 'typed-feature-metadata',
          sourcePointer: `PLANNER_FEATURE_PAGES[${index}]`,
          relatedSlugs: [],
        }

        for (const property of element.properties) {
          if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue
          const key = property.name.text
          const value = property.initializer

          if (key === 'relatedSlugs') {
            feature.relatedSlugs = getArrayOfStrings(value) ?? []
            continue
          }

          if (key === 'icon' && ts.isIdentifier(value)) {
            feature.icon = value.text
            continue
          }

          const stringValue = getStringLiteral(value)
          if (stringValue !== undefined) {
            feature[key] = stringValue
          }
        }

        records.push(feature)
      })
    }
  })

  return records
}

export function extractFeatureRecords({ repoRoot = defaultRepoRoot } = {}) {
  const featureFile = path.join(repoRoot, 'site', 'features', 'planner', 'landing', 'plannerFeaturePages.ts')
  return parsePlannerFeaturePages(featureFile)
}
