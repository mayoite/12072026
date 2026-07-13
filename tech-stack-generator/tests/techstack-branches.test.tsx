import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const techStackMock = vi.hoisted(() => ({
  techStack: [
    {
      name: 'Alpha',
      version: '1.0.0',
      category: 'Runtime',
      description: 'Alpha desc',
      role: 'Alpha role',
      docs: 'https://example.com/alpha',
      color: 'bg-danger-500 text-white',
    },
    {
      name: 'Beta',
      version: '2.0.0',
      category: 'Dev tooling',
      description: 'Beta desc',
      role: 'Beta role',
      color: 'bg-blue-500 text-white',
    },
  ],
  techCategories: ['Runtime', 'Dev tooling', 'Tech-stack docs'],
}))

vi.mock('../src/data/techStack', () => techStackMock)

import { TechStack } from '../src/pages/TechStack'

describe('TechStack branch coverage', () => {
  it('covers empty categories and items without docs', () => {
    render(<TechStack />)

    expect(screen.getByText('Alpha')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
    expect(screen.getAllByRole('link').length).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: /tech-stack docs \(0\)/i }))
    expect(screen.queryByRole('heading', { level: 2, name: /tech-stack docs/i })).toBeNull()
  })
})
