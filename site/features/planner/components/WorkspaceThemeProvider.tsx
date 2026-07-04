import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** The user's stored preference. */
  theme: Theme
  /** The concrete theme actually applied to the document right now. */
  resolvedTheme: ResolvedTheme
  /** Persist a new preference and apply it to the document. */
  setTheme: (next: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'theme'
const subscribeToStoredTheme = () => () => {}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
  } catch {
    // localStorage may throw in private mode; fall through to default.
  }
  return 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  // `color-scheme` lets native scrollbars / form widgets pick up the theme.
  root.style.colorScheme = resolved
}

interface ThemeProviderProps {
  children: ReactNode
  /** Test override — initial theme to use instead of localStorage. */
  initialTheme?: Theme
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const storedTheme = useSyncExternalStore(
    subscribeToStoredTheme,
    readStoredTheme,
    () => initialTheme ?? 'light',
  )
  const [themeOverride, setThemeOverride] = useState<Theme | null>(null)
  const theme = themeOverride ?? initialTheme ?? storedTheme
  const resolvedTheme = resolveTheme(theme)

  // Apply the resolved theme to <html> whenever it changes.
  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    setThemeOverride(next)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Fallback used when a component that consumes the theme is rendered
 * outside a ThemeProvider — most commonly in unit tests. Returns
 * `'light' / 'light'` and a no-op setter so no consumer has to special-
 * case missing context. Real apps still render under <ThemeProvider>
 * via App.tsx, so this only kicks in for isolated component tests.
 */
const FALLBACK_CONTEXT: ThemeContextValue = {
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
}

// Co-locating `useTheme` with the provider is consistent with how
// `AuthProvider`/`useSession` are structured in this codebase. Splitting
// the hook into its own file would just churn imports for no runtime
// benefit, so we silence the react-refresh rule here.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  return ctx ?? FALLBACK_CONTEXT
}



