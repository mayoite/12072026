import { describe, expect, it, vi } from 'vitest'

const overviewSummaryMock = vi.hoisted(() => ({
  stats: [{ label: 'Routes', value: '42' }],
  keyPackages: [
    { name: 'Next.js', version: '16.2.9', packageName: 'next' },
    { name: 'Custom Lib', version: '1.0.0', packageName: 'custom-lib' },
  ],
}))

const dependenciesMock = vi.hoisted(() => {
  const dependency = (importer: string, section: string, packageName: string, requested: string, resolved: string) =>
    [
      { field: 'requestedRange', suffix: 'requested-range', value: requested },
      { field: 'resolvedVersion', suffix: 'resolved-version', value: resolved },
    ].map(({ field, suffix, value }) => ({
      id: `${importer}:${section}:${packageName}.${suffix}`,
      domain: 'dependencies',
      field,
      label: packageName,
      fact: {
        value,
        sourcePath: `${importer}/package.json`,
        sourceKind: 'package-json',
        sourcePointer: `${section}.${packageName}`,
      },
    }))

  return [
    {
      id: 'invalid',
      domain: 'dependencies',
      field: 'resolvedVersion',
      label: 'Invalid',
      fact: { value: '0', sourcePath: 'invalid', sourceKind: 'test', sourcePointer: 'invalid' },
    },
    ...dependency('site', 'dependencies', 'next', '^16.2.9', '16.2.9'),
    ...dependency('site', 'devDependencies', 'vitest', '^4.1.9', '4.1.9'),
    ...dependency('tech-docs-generator', 'dependencies', 'react', '^19.1.0', '19.1.0'),
    ...dependency('shared', 'dependencies', 'clsx', '^2.1.1', '2.1.1'),
    dependency('site', 'dependencies', 'resolved-only', 'unused', '1.0.0')[1],
    dependency('site', 'dependencies', 'requested-only', '^1.0.0', 'unused')[0],
  ]
})

const commandsMock = vi.hoisted(() => [
  {
    packageName: 'oando-site',
    scriptName: 'test',
    command: 'pnpm run test',
    sourcePath: 'site/package.json',
    sourcePointer: 'scripts.test',
  },
  {
    packageName: 'oando-site',
    scriptName: 'test:e2e:nav',
    command: 'pnpm run test:e2e:nav',
    sourcePath: 'site/package.json',
    sourcePointer: 'scripts.test:e2e:nav',
  },
  {
    packageName: 'oando-site',
    scriptName: 'release:gate',
    command: 'pnpm run release:gate',
    sourcePath: 'site/package.json',
    sourcePointer: 'scripts.release:gate',
  },
  {
    packageName: 'oando-site',
    scriptName: 'test:experimental',
    command: 'pnpm run test:experimental',
    sourcePath: 'site/package.json',
    sourcePointer: 'scripts.test:experimental',
  },
])

vi.mock('../../generated-documents/data/summary.json', () => ({ default: overviewSummaryMock }))
vi.mock('../../generated-documents/data/dependencies.json', () => ({ default: dependenciesMock }))
vi.mock('../../generated-documents/data/commands.json', () => ({ default: commandsMock }))

import { overviewKeyTech, overviewStats } from '../src/data/overviewSummary'
import { techCategories, techStack } from '../src/data/techStack'
import { testCommands, testingCommandCards } from '../src/data/testingData'

describe('data helper branch coverage', () => {
  it('covers overview summary fallback categories', () => {
    expect(overviewStats).toEqual(overviewSummaryMock.stats)
    expect(overviewKeyTech).toEqual([
      { name: 'Next.js 16.2.9', tag: 'Framework', color: 'bg-docs-surface-strong text-docs-text' },
      { name: 'Custom Lib 1.0.0', tag: 'custom-lib', color: 'bg-docs-surface-strong text-docs-text' },
    ])
  })

  it('covers tech stack importer fallbacks', () => {
    expect(techStack.map((item) => item.category)).toEqual([
      'Runtime',
      'Dev tooling',
      'Tech-stack docs',
      'Workspace',
      'Runtime',
    ])
    expect(techCategories).toEqual(['Runtime', 'Dev tooling', 'Tech-stack docs', 'Workspace'])
    expect(techStack.find((item) => item.id.endsWith('resolved-only'))?.description).toContain('requested unknown')
    expect(techStack.some((item) => item.id.endsWith('requested-only'))).toBe(false)
  })

  it('covers testing command filtering and ordered cards', () => {
    expect(testCommands.map((command) => command.scriptName)).toEqual([
      'release:gate',
      'test',
      'test:e2e:nav',
      'test:experimental',
    ])
    expect(testingCommandCards.map((command) => command.scriptName)).toEqual([
      'test',
      'test:e2e:nav',
      'release:gate',
    ])
    expect(testingCommandCards.some((command) => command.scriptName === 'test:experimental')).toBe(false)
  })
})
