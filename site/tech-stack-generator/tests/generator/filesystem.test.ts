import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  applyManifestedDocuments,
  assertDocumentsTreeOwned,
  createManifestRecord,
  GENERATED_ROOT_CONTENT,
  GENERATED_ROOT_FILENAME,
  ensureGeneratedRoot,
  initializeDocumentsWorkspace,
  manifestHash,
} from '../../scripts/filesystem.mjs'

const tempRoots: string[] = []

function createRepoRoot() {
  const repoRoot = mkdtempSync(path.join(os.tmpdir(), 'oando-tech-stack-docs-'))
  tempRoots.push(repoRoot)
  return repoRoot
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const repoRoot = tempRoots.pop()
    if (repoRoot) {
      rmSync(repoRoot, { recursive: true, force: true })
    }
  }
})

describe('tech stack filesystem utilities', () => {
  it('initializes an empty workspace with the generated-root marker and staging path', async () => {
    const repoRoot = createRepoRoot()
    const { documentsRoot, stagingDocumentsRoot, marker } = await initializeDocumentsWorkspace(repoRoot)

    expect(documentsRoot).toBe(path.join(repoRoot, 'site', 'tech-stack-generated', 'docs'))
    expect(stagingDocumentsRoot).toBe(path.join(repoRoot, '.tmp', 'tech-stack-generated', 'docs'))
    expect(marker.created).toBe(true)
    expect(readFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), 'utf8')).toBe(
      GENERATED_ROOT_CONTENT,
    )
    expect(existsSync(stagingDocumentsRoot)).toBe(true)
  })

  it('does not create the marker when Documents is non-empty and missing it', async () => {
    const repoRoot = createRepoRoot()
    const documentsRoot = path.join(repoRoot, 'documents-generated')
    mkdirSync(documentsRoot, { recursive: true })
    writeFileSync(path.join(documentsRoot, 'rogue.txt'), 'leave-me', 'utf8')
    await expect(ensureGeneratedRoot(documentsRoot)).rejects.toThrow(
      /documents-generated\/ is not empty and is missing \.generated-root/,
    )

    expect(readFileSync(path.join(documentsRoot, 'rogue.txt'), 'utf8')).toBe('leave-me')
    expect(existsSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME))).toBe(false)
  })

  it('refuses to delete when Documents contains an unknown file', async () => {
    const repoRoot = createRepoRoot()
    const documentsRoot = path.join(repoRoot, 'documents-generated')
    const stagingDocumentsRoot = path.join(repoRoot, '.tmp', 'tech-stack-docs', 'documents-generated')
    mkdirSync(documentsRoot, { recursive: true })
    writeFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), GENERATED_ROOT_CONTENT, 'utf8')
    writeFileSync(path.join(documentsRoot, 'rogue.txt'), 'leave-me', 'utf8')
    mkdirSync(stagingDocumentsRoot, { recursive: true })

    const previousManifest = createManifestRecord({
      files: [{ path: 'owned.txt', hash: 'old' }],
    })
    const nextManifest = createManifestRecord({
      files: [],
    })

    await expect(
      applyManifestedDocuments({
        documentsRoot,
        stagingDocumentsRoot,
        previousManifest,
        nextManifest,
      }),
    ).rejects.toThrow(/Unknown file\(s\) in documents-generated\/: rogue\.txt/)

    expect(readFileSync(path.join(documentsRoot, 'rogue.txt'), 'utf8')).toBe('leave-me')
  })

  it('replaces only files owned by the previous manifest', async () => {
    const repoRoot = createRepoRoot()
    const documentsRoot = path.join(repoRoot, 'documents-generated')
    const stagingDocumentsRoot = path.join(repoRoot, '.tmp', 'tech-stack-docs', 'documents-generated')
    mkdirSync(documentsRoot, { recursive: true })
    mkdirSync(stagingDocumentsRoot, { recursive: true })
    writeFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), GENERATED_ROOT_CONTENT, 'utf8')
    writeFileSync(path.join(documentsRoot, 'owned.txt'), 'old-owned', 'utf8')
    writeFileSync(path.join(documentsRoot, 'removed.txt'), 'old-removed', 'utf8')

    writeFileSync(path.join(stagingDocumentsRoot, 'owned.txt'), 'new-owned', 'utf8')
    mkdirSync(path.join(stagingDocumentsRoot, 'nested'), { recursive: true })
    writeFileSync(path.join(stagingDocumentsRoot, 'nested', 'fresh.txt'), 'fresh', 'utf8')

    const previousManifest = createManifestRecord({
      files: [
        { path: 'owned.txt', hash: 'old-owned' },
        { path: 'removed.txt', hash: 'old-removed' },
      ],
    })
    const nextManifest = createManifestRecord({
      files: [
        { path: 'owned.txt', hash: 'new-owned' },
        { path: 'nested/fresh.txt', hash: 'fresh' },
      ],
    })

    await applyManifestedDocuments({
      documentsRoot,
      stagingDocumentsRoot,
      previousManifest,
      nextManifest,
    })

    expect(readFileSync(path.join(documentsRoot, 'owned.txt'), 'utf8')).toBe('new-owned')
    expect(existsSync(path.join(documentsRoot, 'removed.txt'))).toBe(false)
    expect(readFileSync(path.join(documentsRoot, 'nested', 'fresh.txt'), 'utf8')).toBe('fresh')
    expect(readFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), 'utf8')).toBe(
      GENERATED_ROOT_CONTENT,
    )
  })

  it('rejects undeclared staging files before copying', async () => {
    const repoRoot = createRepoRoot()
    const documentsRoot = path.join(repoRoot, 'documents-generated')
    const stagingDocumentsRoot = path.join(repoRoot, '.tmp', 'tech-stack-docs', 'documents-generated')

    mkdirSync(documentsRoot, { recursive: true })
    writeFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), GENERATED_ROOT_CONTENT, 'utf8')
    writeFileSync(path.join(documentsRoot, 'owned.txt'), 'old-owned', 'utf8')

    mkdirSync(stagingDocumentsRoot, { recursive: true })
    writeFileSync(path.join(stagingDocumentsRoot, 'owned.txt'), 'new-owned', 'utf8')
    writeFileSync(path.join(stagingDocumentsRoot, 'rogue.txt'), 'do-not-copy', 'utf8')

    const previousManifest = createManifestRecord({
      files: [{ path: 'owned.txt', hash: 'old-owned' }],
    })
    const nextManifest = createManifestRecord({
      files: [{ path: 'owned.txt', hash: 'new-owned' }],
    })

    await expect(
      applyManifestedDocuments({
        documentsRoot,
        stagingDocumentsRoot,
        previousManifest,
        nextManifest,
      }),
    ).rejects.toThrow(/Staging documents-generated\/ mismatch \(unexpected: rogue\.txt\)/)

    expect(readFileSync(path.join(documentsRoot, 'owned.txt'), 'utf8')).toBe('old-owned')
    expect(existsSync(path.join(documentsRoot, 'rogue.txt'))).toBe(false)
  })

  it('ignores Vite output under tech-stack-docs when checking ownership', async () => {
    const repoRoot = createRepoRoot()
    const documentsRoot = path.join(repoRoot, 'documents-generated')
    mkdirSync(documentsRoot, { recursive: true })
    writeFileSync(path.join(documentsRoot, GENERATED_ROOT_FILENAME), GENERATED_ROOT_CONTENT, 'utf8')
    writeFileSync(path.join(documentsRoot, 'owned.txt'), 'owned', 'utf8')
    mkdirSync(path.join(documentsRoot, 'tech-stack-docs', 'assets'), { recursive: true })
    writeFileSync(path.join(documentsRoot, 'tech-stack-docs', 'index.html'), '<html></html>', 'utf8')
    writeFileSync(path.join(documentsRoot, 'tech-stack-docs', 'assets', 'app.js'), 'js', 'utf8')

    await expect(
      assertDocumentsTreeOwned(documentsRoot, ['owned.txt']),
    ).resolves.toEqual({
      files: expect.arrayContaining([
        'owned.txt',
        'tech-stack-docs/index.html',
        'tech-stack-docs/assets/app.js',
      ]),
    })
  })

  it('produces stable manifest hashes regardless of input order or self hash', () => {
    const manifestA = createManifestRecord({
      version: 1,
      files: [
        { path: 'b.txt', hash: '2' },
        { path: 'a.txt', hash: '1' },
      ],
      removed: ['z.txt', 'x.txt'] as string[],
    })
    const manifestB = createManifestRecord({
      version: 1,
      removed: ['x.txt', 'z.txt'] as string[],
      files: [
        { path: 'a.txt', hash: '1' },
        { path: 'b.txt', hash: '2' },
      ],
    })

    expect(manifestA.files.map((file: { path: string }) => file.path)).toEqual(['a.txt', 'b.txt'])
    expect(manifestA.removed).toEqual(['x.txt', 'z.txt'])
    expect(manifestA.hash).toBe(manifestB.hash)
    expect(manifestHash({ ...manifestA, hash: 'different' })).toBe(manifestA.hash)
  })
})
