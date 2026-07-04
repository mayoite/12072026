import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSearch } from '../src/hooks/useSearch'

describe('useSearch', () => {
  it('filters results and clears them again', () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.results).toEqual([])

    act(() => {
      result.current.setQuery('planner')
    })

    expect(result.current.results.length).toBeGreaterThan(0)
    expect(result.current.results.some((item) => item.section === 'Features')).toBe(true)

    act(() => {
      result.current.setQuery('')
    })

    expect(result.current.results).toEqual([])
  })
})
