import { statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createNormalizedRecord } from './normalized-record.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = path.resolve(scriptDir, '..', '..', '..')
const THEME_PATH = 'site/app/css/core/tokens/theme.css'

export function extractThemeRecords({ repoRoot = defaultRepoRoot } = {}) {
  const records = []
  const themeAbs = path.join(repoRoot, THEME_PATH)
  const themeStat = statSync(themeAbs)

  records.push(
    createNormalizedRecord({
      id: 'theme.token-source',
      category: 'theme-token',
      label: 'Design token source',
      value: THEME_PATH,
      sourcePath: THEME_PATH,
      sourceKind: 'theme-token-file',
      sourcePointer: 'theme.css',
    }),
    createNormalizedRecord({
      id: 'theme.token-source.bytes',
      category: 'theme-token',
      label: 'Token file size (bytes)',
      value: String(themeStat.size),
      sourcePath: THEME_PATH,
      sourceKind: 'theme-token-file',
      sourcePointer: 'file.size',
    }),
  )

  return records
}
