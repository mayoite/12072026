import { describe, expect, it } from 'vitest'
import { extractApiRecords } from '../../scripts/extract-api.mjs'
import { extractDatabaseRecords } from '../../scripts/extract-database.mjs'
import { extractEnvironmentRecords } from '../../scripts/extract-environment.mjs'
import { extractCommandRecords } from '../../scripts/extract-commands.mjs'
import { extractDependencyRecords } from '../../scripts/extract-dependencies.mjs'
import { extractFeatureRecords } from '../../scripts/extract-features.mjs'
import { extractRouteRecords } from '../../scripts/extract-routes.mjs'
import { normalizeDependencyRecords } from '../../scripts/normalize.mjs'

describe('dependency extractor', () => {
  it('extracts requested and resolved dependency facts from workspace importers', () => {
    const records = extractDependencyRecords()
    const ids = records.map((record) => record.id)

    expect(ids).toContain('site:dependencies:next')
    expect(ids).toContain('tech-stack-generator:dependencies:react')
    expect(ids).toContain('.:devDependencies:zod')

    const next = records.find((record) => record.id === 'site:dependencies:next')
    expect(next?.requested).toMatchObject({
      value: '^16.2.9',
      sourceKind: 'package-manifest',
      sourcePath: 'site/package.json',
    })
    expect(next?.resolved).toMatchObject({
      value: '16.2.9',
      sourceKind: 'lockfile',
      sourcePath: 'pnpm-lock.yaml',
    })
  })

  it('normalizes dependency records into stable factual outputs', () => {
    const normalized = normalizeDependencyRecords(
      extractDependencyRecords({ importerNames: ['site'] }).slice(0, 2),
    )

    expect(normalized.length).toBe(4)
    expect(normalized[0].id).toContain('requested-range')
    expect(normalized[1].id).toContain('resolved-version')
    expect(normalized.every((entry) => entry.domain === 'dependencies')).toBe(true)
  })

  it('extracts route and api proofs from the site tree', () => {
    const routes = extractRouteRecords()
    const apiRecords = extractApiRecords()

    const plannerRoutes = routes.filter((record) => record.path === '/planner')
    expect(plannerRoutes).toHaveLength(1)
    expect(plannerRoutes[0]).toMatchObject({
      sourcePath: 'site/app/planner/(marketing)/page.tsx',
      aliasPaths: ['site/app/planner/page.tsx'],
    })
    expect(routes.some((record) => record.path === '/products/[category]')).toBe(true)
    expect(apiRecords).toContainEqual(
      expect.objectContaining({
        path: '/api/planner/ai-advisor',
        method: 'POST',
        sourceKind: 'route-file',
      }),
    )
    expect(apiRecords).toContainEqual(
      expect.objectContaining({
        path: '/api/theme/active',
        method: 'GET',
        sourceKind: 'route-file',
      }),
    )
  })

  it('extracts environment and database sources', () => {
    const envRecords = extractEnvironmentRecords()
    const databaseRecords = extractDatabaseRecords()
    const featureRecords = extractFeatureRecords()
    const commandRecords = extractCommandRecords()

    expect(envRecords.some((record) => record.name === 'NEXT_PUBLIC_SUPABASE_URL')).toBe(true)
    expect(
      envRecords.find((record) => record.name === 'OPENROUTER_API_KEY_PRIMARY')?.usages.length ?? 0,
    ).toBeGreaterThan(0)

    expect(databaseRecords.schema.tables.map((table) => table.name)).toContain('catalog_products')
    expect(databaseRecords.schema.tables.map((table) => table.name)).toContain('profiles')
    expect(databaseRecords.migrations.length).toBeGreaterThan(0)

    expect(featureRecords.map((feature) => feature.slug)).toEqual([
      'measure',
      'catalog',
      '3d-view',
      'ai-assist',
      'export',
    ])
    expect(featureRecords.find((feature) => feature.slug === 'export')).toMatchObject({
      helpSectionId: 'export-and-share',
      tryPath: '/planner/guest/',
      sourceKind: 'typed-feature-metadata',
    })

    expect(commandRecords.some((record) => record.scriptName === 'build')).toBe(true)
    expect(commandRecords.some((record) => record.packageName === 'oando-tech-stack-docs')).toBe(true)
  }, 20000)
})
