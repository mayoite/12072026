import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GeneratedStatusCard } from '../src/components/GeneratedStatusCard'

afterEach(() => {
  cleanup()
})

describe('GeneratedStatusCard', () => {
  it('renders code-proven classification styling', () => {
    const { container } = render(
      <GeneratedStatusCard
        label="Example status"
        value="Example value"
        classification="code-proven"
        verificationMode="source-backed"
        sourcePath="Failures.md"
        sourcePointer="line 1"
      />,
    )

    expect(screen.getByText('code-proven')).toBeTruthy()
    expect(container.innerHTML).toContain('emerald')
  })

  it('renders manual-verification classification styling', () => {
    const { container } = render(
      <GeneratedStatusCard
        label="Manual check"
        value="Confirm in dashboard"
        classification="manual-verification"
        sourcePath="HANDOVER.md"
        sourcePointer="Vercel (current truth)"
      />,
    )

    expect(screen.getByText('manual-verification')).toBeTruthy()
    expect(container.innerHTML).toContain('amber')
  })

  it('renders live-status classification styling', () => {
    const { container } = render(
      <GeneratedStatusCard
        label="Release gate"
        value="Blocked"
        classification="live-status"
        sourcePath="Failures.md"
        sourcePointer="Gate policy"
      />,
    )

    expect(screen.getByText('live-status')).toBeTruthy()
    expect(container.innerHTML).toContain('orange')
  })

  it('renders handover-proven classification styling', () => {
    const { container } = render(
      <GeneratedStatusCard
        label="Handover note"
        value="Ops context"
        classification="handover-proven"
        sourcePath="HANDOVER.md"
        sourcePointer="line 12"
      />,
    )

    expect(screen.getByText('handover-proven')).toBeTruthy()
    expect(container.innerHTML).toContain('docs-surface-raised')
  })

  it('omits verification mode suffix when not provided', () => {
    const { container } = render(
      <GeneratedStatusCard
        label="No mode"
        value="Value"
        classification="code-proven"
        sourcePath="site/vercel.json"
        sourcePointer="buildCommand"
      />,
    )

    expect(screen.getByText('site/vercel.json')).toBeTruthy()
    expect(container.textContent).not.toContain('source-backed')
  })
})
