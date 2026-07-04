import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, Layers, GitBranch, Puzzle, FolderOpen, Database,
  Globe, TestTube, Rocket, Shield, Zap, GitCommit,
  Monitor, Box, Wrench, ChevronDown, Menu, X, Search,
  type LucideIcon
} from 'lucide-react'
import clsx from 'clsx'
import { navItems } from '../data/navigation'
import type { NavItem } from '../types'

const iconMap: Record<string, LucideIcon> = {
  Home, Layers, GitBranch, Puzzle, FolderOpen, Database,
  Globe, TestTube, Rocket, Shield, Zap, GitCommit,
  Monitor, Box, Wrench,
}

function NavIcon({ name, size = 16 }: { name: string; size?: number }) {
  const Icon = iconMap[name]
  return Icon ? <Icon size={size} /> : null
}

const DEPTH_PADDING = ['pl-3', 'pl-6', 'pl-9'] as const
function depthPl(depth: number) {
  return DEPTH_PADDING[Math.min(depth, DEPTH_PADDING.length - 1)]
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation()
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some(c => location.pathname === c.path.split('#')[0])
  })

  const isActive = location.pathname === item.path.split('#')[0]

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={clsx(
            'w-full flex items-center justify-between py-2 rounded-lg text-sm transition-colors group',
            depthPl(depth),
            isActive
              ? 'bg-brand-500/15 text-brand-400'
              : 'text-docs-text-muted hover:text-docs-text-strong hover:bg-docs-surface-strong/60'
          )}
        >
          <div className="flex items-center gap-2.5">
            <NavIcon name={item.icon} size={15} />
            <span className="font-medium">{item.label}</span>
          </div>
          <ChevronDown
            size={13}
            className={clsx('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
        {open && (
          <div className="mt-0.5 ml-3 border-l border-docs-border pl-3 space-y-0.5">
            {item.children.map(child => (
              <NavItemComponent key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive: linkActive }) => clsx(
        'flex items-center gap-2.5 py-1.5 rounded-lg text-sm transition-colors',
        depthPl(depth),
        depth === 0 && 'font-medium',
        linkActive || (isActive && depth === 0)
          ? 'bg-brand-500/15 text-brand-400'
          : 'text-docs-text-muted hover:text-docs-text-strong hover:bg-docs-surface-strong/60'
      )}
    >
      {depth === 0 && <NavIcon name={item.icon} size={15} />}
      {depth > 0 && <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />}
      {item.label}
    </NavLink>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-docs-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-ocean-boat-blue-500)] to-[var(--color-bronze-500)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <div>
            <div className="text-sm font-bold text-docs-text-strong">Oando</div>
            <div className="text-xs text-docs-text-subtle">Tech Stack Docs</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-docs-border">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="w-full flex items-center justify-between bg-docs-surface-raised hover:bg-docs-surface-strong border border-docs-border hover:border-docs-border-hover rounded-xl px-3 py-2 text-sm text-docs-text-muted transition-all group"
        >
          <span className="flex items-center gap-2">
            <Search size={15} className="group-hover:text-docs-text transition-colors" />
            <span className="group-hover:text-docs-text transition-colors">Search docs...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-docs-surface-strong border border-docs-border rounded text-[0.625rem] text-docs-text-subtle font-sans group-hover:text-docs-text-muted group-hover:border-docs-border-hover transition-colors">
            <span className="text-xs">⌘</span> K
          </kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => (
          <NavItemComponent key={item.id} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-docs-border">
        <p className="text-xs text-docs-text-subtle">
          Oando Platform v0.1.0
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-docs-surface-raised border border-docs-border text-docs-text-muted"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={clsx(
        'lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-docs-surface border-r border-docs-border transform transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {content}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-docs-surface border-r border-docs-border flex-shrink-0 sticky top-0 h-screen overflow-hidden">
        {content}
      </aside>
    </>
  )
}
