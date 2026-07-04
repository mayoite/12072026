import type { RouteDomainRecord } from '../data/routeDomainTypes'

const categoryTitles: Record<string, string> = {
  'dev-loop': 'Dev-loop scripts',
  command: 'Commands',
  module: 'Modules',
  'server-only': 'Server-only imports',
  dependency: 'Dependencies',
  'top-level-dir': 'Top-level directories',
  'feature-module': 'Feature modules',
  'path-alias': 'Path aliases',
}

function titleForCategory(category: string) {
  return categoryTitles[category] ?? category
}

function groupRecords(records: RouteDomainRecord[]) {
  const groups = new Map<string, RouteDomainRecord[]>()
  for (const record of records) {
    const bucket = groups.get(record.category) ?? []
    bucket.push(record)
    groups.set(record.category, bucket)
  }
  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))
}

export function GeneratedDomainSection({
  records,
  emptyMessage = 'No generated records.',
}: {
  records: RouteDomainRecord[]
  emptyMessage?: string
}) {
  if (records.length === 0) {
    return <p className="text-sm text-docs-text-subtle">{emptyMessage}</p>
  }

  return (
    <div className="space-y-8">
      {groupRecords(records).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-xl font-bold text-docs-text-strong mb-3">{titleForCategory(category)}</h2>
          <div className="overflow-x-auto rounded-xl border border-docs-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-docs-surface-raised/80 text-xs uppercase tracking-wide text-docs-text-subtle">
                <tr>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {items.map((record) => (
                  <tr key={record.id} className="border-t border-docs-border/80 align-top">
                    <td className="px-4 py-3 font-mono text-brand-400 whitespace-nowrap">{record.label}</td>
                    <td className="px-4 py-3 text-docs-text break-all">{record.value}</td>
                    <td className="px-4 py-3 text-xs text-docs-text-subtle whitespace-nowrap">
                      <code>{record.sourcePath}</code>
                      <span className="block text-docs-text-subtle/70">{record.sourcePointer}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
