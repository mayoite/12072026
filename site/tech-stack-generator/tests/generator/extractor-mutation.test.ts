import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { extractDeploymentRecords } from '../../scripts/extract-deployment.mjs'
import { stableManifestForCompare } from '../../scripts/sync-css.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../')

describe('extractor mutation proof (plan 05)', () => {
  it('changes deployment build command when vercel.json changes', () => {
    const tmpRoot = mkdtempSync(path.join(tmpdir(), 'oofpl-deploy-'))
    mkdirSync(path.join(tmpRoot, 'site'), { recursive: true })
    writeFileSync(
      path.join(tmpRoot, 'site', 'vercel.json'),
      JSON.stringify({ buildCommand: 'mutated-next-build', framework: 'nextjs' }),
      'utf8',
    )
    writeFileSync(
      path.join(tmpRoot, 'site', 'package.json'),
      JSON.stringify({ scripts: {} }),
      'utf8',
    )

    const records = extractDeploymentRecords({ repoRoot: tmpRoot, commands: [] })
    const buildRecord = records.find((record) => record.sourcePointer === 'buildCommand')
    expect(buildRecord?.value).toBe('mutated-next-build')
  })

  it('normalizes volatile syncedAt from CSS manifest comparison', () => {
    const left = stableManifestForCompare({
      version: 'v1',
      syncedAt: '2026-06-30T00:00:00.000Z',
      files: [{ path: 'entry.css', hash: 'sha256:abc' }],
    })
    const right = stableManifestForCompare({
      version: 'v1',
      syncedAt: '2026-06-30T12:00:00.000Z',
      files: [{ path: 'entry.css', hash: 'sha256:abc' }],
    })

    expect(left).toEqual(right)
  })
})
