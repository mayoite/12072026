import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeneratedDomainSection } from '../src/components/GeneratedDomainSection'

describe('GeneratedDomainSection', () => {
  it('renders grouped records and falls back to the raw category title', () => {
    render(
      <GeneratedDomainSection
        records={[
          {
            id: 'command-1',
            category: 'command',
            label: 'Test',
            value: 'pnpm run test',
            sourcePath: 'generated-documents/data/commands.json',
            sourceKind: 'generated-data',
            sourcePointer: 'commands[0]',
          },
          {
            id: 'command-2',
            category: 'command',
            label: 'Typecheck',
            value: 'pnpm run typecheck',
            sourcePath: 'generated-documents/data/commands.json',
            sourceKind: 'generated-data',
            sourcePointer: 'commands[1]',
          },
          {
            id: 'custom-1',
            category: 'custom-category',
            label: 'Docs',
            value: 'Generated docs',
            sourcePath: 'generated-documents/data/summary.json',
            sourceKind: 'generated-data',
            sourcePointer: 'summary[0]',
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Commands' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'custom-category' })).toBeTruthy()
    expect(screen.getByText('Test')).toBeTruthy()
    expect(screen.getByText('Typecheck')).toBeTruthy()
    expect(screen.getByText('Docs')).toBeTruthy()
  })

  it('renders the empty state message', () => {
    render(<GeneratedDomainSection records={[]} emptyMessage="Nothing here yet." />)

    expect(screen.getByText('Nothing here yet.')).toBeTruthy()
  })
})
