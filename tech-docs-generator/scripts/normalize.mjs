export function humanizePackageName(packageName) {
  const baseName = packageName.replace(/^@[^/]+\//, '')
  return baseName
    .replace(/[-_.]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

export function dependencyFactId(record, field) {
  return `${record.importer}:${record.section}:${record.packageName}.${field}`
}

export function normalizeDependencyRecords(records) {
  return records
    .flatMap((record) => [
      {
        id: dependencyFactId(record, 'requested-range'),
        domain: 'dependencies',
        field: 'requestedRange',
        label: `${record.displayName} requested range`,
        fact: record.requested,
      },
      {
        id: dependencyFactId(record, 'resolved-version'),
        domain: 'dependencies',
        field: 'resolvedVersion',
        label: `${record.displayName} resolved version`,
        fact: record.resolved,
      },
    ])
    .sort((left, right) => {
      if (left.id !== right.id) return left.id.localeCompare(right.id)
      if (left.field !== right.field) return left.field.localeCompare(right.field)
      return left.fact.sourcePath.localeCompare(right.fact.sourcePath)
    })
}
