import type { TechItem } from '../types'
import dependenciesJson from '../../tech-stack-generated/data/dependencies.json'

type GeneratedDependency = {
  id: string
  domain: 'dependencies'
  field: 'requestedRange' | 'resolvedVersion'
  label: string
  fact: {
    value: string
    sourcePath: string
    sourceKind: string
    sourcePointer: string
  }
}

type CollapsedDependency = {
  id: string
  importer: string
  section: string
  packageName: string
  displayName: string
  requested?: GeneratedDependency
  resolved?: GeneratedDependency
}

type ResolvedDependency = CollapsedDependency & { resolved: GeneratedDependency }

const dependencies = dependenciesJson as GeneratedDependency[]

type TechCategory = 'Runtime' | 'Dev tooling' | 'Tech-stack docs' | 'Workspace'

function parseDependencyId(id: string) {
  const match = id.match(/^(.*?):(dependencies|devDependencies):(.+?)\.(requested-range|resolved-version)$/)
  if (!match) return null

  return {
    importer: match[1],
    section: match[2],
    packageName: match[3],
  }
}

function humanizePackageName(packageName: string) {
  const baseName = packageName.replace(/^@[^/]+\//, '')
  return baseName
    .replace(/[-_.]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function categoryFor(record: CollapsedDependency): TechCategory {
  if (record.importer === 'site') {
    return record.section === 'dependencies' ? 'Runtime' : 'Dev tooling'
  }
  if (record.importer === 'tech-stack-generator') {
    return 'Tech-stack docs'
  }
  return 'Workspace'
}

const categoryColors: Record<TechCategory, string> = {
  Runtime: 'bg-blue-600 text-docs-text-strong',
  'Dev tooling': 'bg-docs-surface-strong text-docs-text-strong',
  'Tech-stack docs': 'bg-purple-600 text-docs-text-strong',
  Workspace: 'bg-slate-600 text-docs-text-strong',
}

const collapsedDependencies = [...dependencies].reduce<Map<string, CollapsedDependency>>((map, record) => {
  const parsed = parseDependencyId(record.id)
  if (!parsed) return map

  const baseId = `${parsed.importer}:${parsed.section}:${parsed.packageName}`
  const existing = map.get(baseId) ?? {
    id: baseId,
    importer: parsed.importer,
    section: parsed.section,
    packageName: parsed.packageName,
    displayName: humanizePackageName(parsed.packageName),
  }

  if (record.field === 'requestedRange') {
    existing.requested = record
  } else {
    existing.resolved = record
  }

  map.set(baseId, existing)
  return map
}, new Map())

export const techStack: TechItem[] = [...collapsedDependencies.values()]
  .filter((record): record is ResolvedDependency => Boolean(record.resolved))
  .map((record) => ({
    id: record.id,
    name: record.displayName,
    version: record.resolved.fact.value,
    category: categoryFor(record),
    description: `${record.packageName} - requested ${record.requested?.fact.value ?? 'unknown'}`,
    role: `${record.importer} · ${record.section} · ${(record.requested ?? record.resolved).fact.sourcePointer}`,
    color: categoryColors[categoryFor(record)],
  }))

export const techCategories = [...new Set(techStack.map((item) => item.category))]
