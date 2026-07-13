import { describe, expect, it } from 'vitest'

import { navItems } from '../src/data/navigation'
import { techStack } from '../src/data/techStack'

describe('tech docs package data', () => {
  it('nav items have unique ids', () => {
    const ids = navItems.flatMap((n) => [n.id, ...(n.children?.map((c) => c.id) ?? [])])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('tech stack entries have name, category, role', () => {
    expect(techStack.length).toBeGreaterThan(5)
    for (const item of techStack) {
      expect(item.name).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.role).toBeTruthy()
    }
  })
})
