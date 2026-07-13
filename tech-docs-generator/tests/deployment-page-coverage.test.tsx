import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Deployment } from '../src/pages/Deployment'

vi.mock('../src/data/deploymentData', () => ({
  deploymentStatusCards: [],
  vercelConfigRecords: [
    {
      id: 'deployment.vercel.framework',
      category: 'vercel-config',
      label: 'Framework',
      value: 'nextjs',
      sourcePath: 'site/vercel.json',
      sourceKind: 'vercel-config',
      sourcePointer: 'framework',
      factClassification: 'code-proven',
    },
  ],
  branchPolicyRecords: [],
  releaseGateSteps: [],
  deploymentCommandRecords: [],
  deploymentBlockers: [],
  handoverDeployContext: [],
  ciWorkflowRecords: [],
  dependabotPolicyRecords: [],
  deploymentEnvironmentVariables: [
    {
      name: 'EXAMPLE_ENV',
      sourceKind: 'env-example',
      sourcePath: '.env.example',
      sourcePointer: 'line 1',
      usages: [],
    },
  ],
}))

afterEach(() => {
  cleanup()
})

describe('Deployment page branch coverage', () => {
  it('renders empty blocker fallback and env rows without explicit classification', () => {
    render(<Deployment />)

    expect(screen.getByText('No generated deploy blocker records in the current snapshot.')).toBeTruthy()
    expect(screen.getByText('EXAMPLE_ENV')).toBeTruthy()
    expect(screen.getAllByText('code-proven').length).toBeGreaterThan(0)
  })
})
