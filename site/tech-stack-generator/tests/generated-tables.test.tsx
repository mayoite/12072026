import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  GeneratedApiTable,
  GeneratedKeyValueTable,
  GeneratedSimpleTable,
} from '../src/components/GeneratedDataTables'

describe('GeneratedDataTables', () => {
  it('renders API routes with known and fallback method colors', () => {
    render(
      <GeneratedApiTable
        routes={[
          {
            method: 'HEAD',
            path: '/api/ping',
            sourcePath: 'site/app/api/ping/route.ts',
            sourcePointer: 'HEAD handler',
          },
          {
            method: 'GET',
            path: '/api/health',
            sourcePath: 'site/app/api/health/route.ts',
            sourcePointer: 'GET handler',
          },
        ]}
      />,
    )

    expect(screen.getByText('/api/ping')).toBeTruthy()
    expect(screen.getByText('HEAD')).toBeTruthy()
    expect(screen.getByText('GET handler')).toBeTruthy()
    expect(screen.getByText('HEAD').closest('span')?.className).toContain('bg-docs-surface-strong')
  })

  it('renders key-value rows with optional metadata', () => {
    render(
      <GeneratedKeyValueTable
        rows={[
          {
            label: 'Routes',
            value: '75',
            sourcePath: 'site/app',
            sourcePointer: 'route scan',
          },
          {
            label: 'Classification only',
            value: 'code-proven',
            sourcePath: 'site/tech-stack-generated/data/testing-policy.json',
            sourcePointer: 'testingPolicy[0].fact',
            classification: 'code-proven',
          },
          {
            label: 'Browser exposure only',
            value: 'public-safe',
            sourcePath: 'site/tech-stack-generated/data/testing-policy.json',
            sourcePointer: 'testingPolicy[1].fact',
            browserExposure: 'public-safe',
          },
          {
            label: 'Verification only',
            value: 'source-backed',
            sourcePath: 'site/tech-stack-generated/data/testing-policy.json',
            sourcePointer: 'testingPolicy[2].fact',
            verificationMode: 'source-backed',
          },
          {
            label: 'Surface array',
            value: 'markdown + renderer',
            sourcePath: 'site/tech-stack-generated/data/testing-policy.json',
            sourcePointer: 'testingPolicy[3].fact',
            renderSurface: ['markdown', 'renderer'],
          },
          {
            label: 'Surface string',
            value: 'markdown',
            sourcePath: 'site/tech-stack-generated/data/environment.json',
            sourcePointer: 'deploymentEnvironmentVariables[0].fact',
            renderSurface: 'markdown',
          },
        ]}
      />,
    )

    expect(screen.getByText('Routes')).toBeTruthy()
    expect(screen.getByText('75')).toBeTruthy()
    expect(screen.getByText('Classification only')).toBeTruthy()
    expect(screen.getByText('Browser exposure only')).toBeTruthy()
    expect(screen.getByText('Verification only')).toBeTruthy()
    expect(screen.getByText('Surface array')).toBeTruthy()
    expect(screen.getByText('Surface string')).toBeTruthy()
    expect(screen.getAllByText(/code-proven/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/public-safe/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/source-backed/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/markdown, renderer/i).length).toBeGreaterThan(0)
  })

  it('renders simple tables with dynamic columns', () => {
    render(
      <GeneratedSimpleTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'path', header: 'Path' },
        ]}
        rows={[{ name: 'planner', path: 'features/planner/' }]}
      />,
    )

    expect(screen.getByText('planner')).toBeTruthy()
    expect(screen.getByText('features/planner/')).toBeTruthy()
  })
})
