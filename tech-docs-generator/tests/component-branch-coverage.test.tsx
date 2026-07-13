import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BackToTop } from '../src/components/BackToTop'
import { CommandPalette } from '../src/components/CommandPalette'
import { CopyButton } from '../src/components/CopyButton'
import { TableOfContents } from '../src/components/TableOfContents'
import { Tooltip } from '../src/components/Tooltip'

const navigate = vi.fn()
const searchState = vi.hoisted(() => ({
  query: '',
  results: [] as Array<{ id: string; path: string; title: string; section: string }>,
  suggestion: null as string | null,
  setQuery: vi.fn((value: string) => {
    searchState.query = value
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

vi.mock('../src/hooks/useSearch', async () => {
  const actual = await vi.importActual<typeof import('../src/hooks/useSearch')>('../src/hooks/useSearch')
  return { ...actual, useSearch: () => searchState }
})

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
}

beforeEach(() => {
  searchState.query = ''
  searchState.results = []
  searchState.suggestion = null
  searchState.setQuery.mockClear()
  navigate.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('component branch coverage', () => {
  it('toggles back-to-top visibility and scrolls to the top', async () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    setScrollY(0)
    render(<BackToTop />)

    expect(screen.queryByLabelText('Back to top')).toBeNull()

    setScrollY(401)
    fireEvent.scroll(window)
    const button = await screen.findByLabelText('Back to top')
    fireEvent.click(button)

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    setScrollY(1)
    fireEvent.scroll(window)
    await waitFor(() => expect(screen.queryByLabelText('Back to top')).toBeNull())
  })

  it('shows copy success and recovers from clipboard failure', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<CopyButton content="copy me" />)

    fireEvent.click(screen.getByLabelText('Copy to clipboard'))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('copy me'))

    writeText.mockRejectedValueOnce(new Error('clipboard denied'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fireEvent.click(screen.getByLabelText('Copy to clipboard'))
    await waitFor(() => expect(consoleError).toHaveBeenCalled())
    consoleError.mockRestore()
  })

  it('shows tooltip content on pointer and keyboard focus', () => {
    render(<Tooltip content="More context">Evidence</Tooltip>)
    const trigger = screen.getByText('Evidence')

    fireEvent.mouseEnter(trigger.parentElement as HTMLElement)
    expect(screen.getByText('More context')).toBeTruthy()

    fireEvent.mouseLeave(trigger.parentElement as HTMLElement)
    fireEvent.focus(trigger.parentElement as HTMLElement)
    expect(screen.getByText('More context')).toBeTruthy()
  })

  it('builds table of contents links and scrolls to headings', async () => {
    const scrollIntoView = vi.fn()
    document.body.innerHTML = '<h2 id="first">First</h2><h3 id="second">Second</h3>'
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scrollIntoView })

    render(<TableOfContents />)

    await screen.findByRole('link', { name: 'First' })
    expect(screen.getByRole('link', { name: 'Second' })).toBeTruthy()
    fireEvent.click(screen.getByRole('link', { name: 'First' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('renders command palette empty, suggestion, and result states', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={onClose} />
      </MemoryRouter>,
    )

    expect(screen.queryByPlaceholderText('Search documentation...')).toBeNull()
    expect(searchState.setQuery).toHaveBeenCalledWith('')

    searchState.query = 'zzzz'
    searchState.suggestion = 'Overview'
    rerender(
      <MemoryRouter>
        <CommandPalette isOpen onClose={onClose} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Overview')).toBeTruthy()
    fireEvent.click(screen.getByText('Overview'))
    expect(searchState.setQuery).toHaveBeenCalledWith('Overview')

    searchState.query = 'api'
    searchState.suggestion = null
    searchState.results = [{ id: 'api', path: '/api', title: 'API', section: 'Routes' }]
    rerender(
      <MemoryRouter>
        <CommandPalette isOpen onClose={onClose} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByText('API'))
    expect(navigate).toHaveBeenCalledWith('/api')
    expect(onClose).toHaveBeenCalled()
  })
})
