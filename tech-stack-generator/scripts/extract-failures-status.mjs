import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createNormalizedRecord } from './normalized-record.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..')

function parseFailuresBullets(text, sourcePath) {
  const records = []
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const match = line.match(/^-\s+`\[([!~x ])\]`\s+(.+)$/)
    if (!match) continue
    const [, marker, body] = match
    records.push(
      createNormalizedRecord({
        id: `failures.${sourcePath.replace(/[^a-z0-9]+/gi, '-')}.${index}`,
        category: 'operational-status',
        label: body.split('—')[0]?.trim() ?? `Item ${index}`,
        value: body.trim(),
        sourcePath,
        sourceKind: sourcePath === 'Failures.md' ? 'failures-log' : 'handover-note',
        sourcePointer: `line ${index + 1}`,
        factClassification: marker === 'x' ? 'code-proven' : 'live-status',
        status: marker === 'x' ? 'resolved' : marker === '!' ? 'blocked' : 'partial',
      }),
    )
  }
  return records
}

export function extractFailuresStatusRecords({ repoRoot = defaultRepoRoot } = {}) {
  const records = []

  for (const relativePath of ['Failures.md']) {
    try {
      const text = readFileSync(path.join(repoRoot, relativePath), 'utf8')
      records.push(...parseFailuresBullets(text, relativePath))
    } catch {
      records.push(
        createNormalizedRecord({
          id: `failures.missing.${relativePath.replace(/\./g, '-')}`,
          category: 'operational-status',
          label: `Missing ${relativePath}`,
          value: 'Source file not readable',
          sourcePath: relativePath,
          sourceKind: relativePath === 'Failures.md' ? 'failures-log' : 'handover-note',
          sourcePointer: 'file',
          factClassification: 'unknown-gap',
        }),
      )
    }
  }

  return records.sort((left, right) => left.id.localeCompare(right.id))
}
