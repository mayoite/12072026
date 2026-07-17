import { describe, expect, it } from 'vitest'
import { evaluateCoverage } from '../../scripts/check-coverage.mjs'

describe('coverage gate', () => {
  it('fails when lines or page lines are below 95 percent', () => {
    const result = evaluateCoverage(
      { lines: { pct: 94 }, branches: { pct: 95 }, statements: { pct: 96 }, functions: { pct: 96 } },
      [{ file: 'src/pages/Deployment.tsx', lines: { pct: 94 } }],
    )

    expect(result.failures).toEqual([
      'lines 94% < 95%',
      'src/pages/Deployment.tsx lines 94% < 95%',
    ])
    expect(result.warnings).toEqual([])
  })

  it('fails when branches are below 90 percent', () => {
    const result = evaluateCoverage(
      { lines: { pct: 96 }, branches: { pct: 89 }, statements: { pct: 96 }, functions: { pct: 96 } },
      [],
    )

    expect(result.failures).toEqual(['branches 89% < 90%'])
  })

  it('fails when statements or functions are below 95 percent', () => {
    const result = evaluateCoverage(
      { lines: { pct: 96 }, branches: { pct: 96 }, statements: { pct: 90 }, functions: { pct: 91 } },
      [],
    )

    expect(result.failures).toEqual(['statements 90% < 95%', 'functions 91% < 95%'])
  })

  it('passes at the lines/functions 95 and branches 90 floors', () => {
    const result = evaluateCoverage(
      { lines: { pct: 95 }, branches: { pct: 90 }, statements: { pct: 95 }, functions: { pct: 95 } },
      [{ file: 'src/pages/Deployment.tsx', lines: { pct: 95 } }],
    )

    expect(result.failures).toEqual([])
    expect(result.warnings).toEqual([])
  })
})
