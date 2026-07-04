import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { techStack, techCategories } from '../data/techStack'
import { CollapsibleSection } from '../components/CollapsibleSection'
import { TableOfContents } from '../components/TableOfContents'

const categoryOrder = [
  'Runtime',
  'Dev tooling',
  'Tech-stack docs',
  'Workspace',
]

const orderedCategories = [
  ...categoryOrder.filter((category) => techCategories.includes(category)),
  ...techCategories.filter((category) => !categoryOrder.includes(category)),
]

const categoryDescriptions: Record<string, string> = {
  Runtime: 'site/package.json dependencies (production)',
  'Dev tooling': 'site/package.json devDependencies',
  'Tech-stack docs': 'tech-stack-generator package',
  Workspace: 'Root workspace package',
}

export function TechStack() {
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter ? techStack.filter(t => t.category === filter) : techStack

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8 relative items-start">
      <div className="flex-1 min-w-0">
        <header className="mb-8">
          <h1 className="section-heading">Technology Stack</h1>
        <p className="section-subheading">
          Complete inventory of dependencies and their roles in the Oando Platform.
        </p>
      </header>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !filter ? 'bg-brand-500 text-white' : 'bg-docs-surface text-docs-text-muted hover:text-docs-text-strong border border-docs-border'
          }`}
        >
          All ({techStack.length})
        </button>
        {orderedCategories.map(cat => {
          const count = techStack.filter(t => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === cat ? 'bg-brand-500 text-docs-text-strong' : 'bg-docs-surface text-docs-text-muted hover:text-docs-text-strong border border-docs-border'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Tech list grouped by category - Bento Box Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(filter ? [filter] : orderedCategories).map((category, catIdx) => {
          const items = filtered.filter(t => t.category === category)
          if (items.length === 0) return null

          // Bento sizing: Runtime spans full width, others are boxed
          const isLargePanel = !filter && catIdx === 0
          
          return (
            <div key={category} className={`relative flex flex-col p-6 rounded-[2rem] bg-docs-surface/30 border border-docs-border/60 backdrop-blur-md transition-all ${isLargePanel ? 'lg:col-span-2 xl:col-span-3' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 id={category.toLowerCase().replace(/[^a-z]+/g, '-')} className="text-xl font-bold text-docs-text-strong mb-1">
                    {category}
                  </h2>
                  <span className="text-xs text-docs-text-subtle font-medium">{categoryDescriptions[category]}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold">
                  {items.length}
                </div>
              </div>
              
              <div className={`grid grid-cols-1 ${isLargePanel ? 'md:grid-cols-2 xl:grid-cols-3 gap-4' : 'gap-3'} flex-1`}>
                {items.map(tech => (
                  <div key={tech.id ?? `${tech.name}-${tech.version}`} className="group relative bg-docs-surface/50 hover:bg-docs-surface-strong/50 border border-docs-border/50 hover:border-docs-border-hover/80 rounded-2xl p-4 transition-all duration-300">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${tech.color}`}>
                          {tech.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-docs-text-strong text-sm truncate group-hover:text-docs-text-strong transition-colors">{tech.name}</h3>
                          <span className="text-xs text-brand-400/80 font-mono">{tech.version}</span>
                        </div>
                      </div>
                      {tech.docs && (
                        <a
                          href={tech.docs}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Documentation for ${tech.name}`}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-docs-surface-strong/50 text-docs-text-muted hover:bg-brand-500 hover:text-docs-text-strong transition-all flex-shrink-0"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-docs-text-muted mb-3 leading-relaxed line-clamp-2">{tech.description}</p>
                    <div className="mt-auto">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-docs-surface-strong/40 border border-docs-border-hover/30 text-[0.6875rem] text-docs-text-muted font-medium">
                        {tech.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stack composition diagram */}
      <div className="mt-12">
        <CollapsibleSection title="Stack Composition" badge="Overview">
          <div className="space-y-3 text-sm text-docs-text-muted">
            <p>
              The platform follows a layered architecture: <strong className="text-docs-text">UI layer</strong> (React, Radix, 
              Tailwind) at the top, <strong className="text-docs-text">interactive layer</strong> (Fabric canvas, R3F 3D, Zustand 
              state) in the middle, and <strong className="text-docs-text">data layer</strong> (Supabase, Drizzle, TanStack Query) 
              at the bottom.
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-docs-text-subtle">
              <li><span className="text-docs-text">UI Layer:</span> Next.js App Router, Radix primitives, Tailwind tokens, Motion, GSAP</li>
              <li><span className="text-docs-text">Interactive Layer:</span> Fabric.js canvas, React Three Fiber 3D, Zustand stores, Fuse.js search</li>
              <li><span className="text-docs-text">Data Layer:</span> Supabase (auth + DB), Drizzle ORM, TanStack Query, Cloudflare R2 storage</li>
              <li><span className="text-docs-text">Tooling Layer:</span> TypeScript 6.x strict, Vitest + Playwright, ESLint + Prettier, Husky hooks</li>
              <li><span className="text-docs-text">Deployment:</span> Vercel hosting, R2 CDN, secretlint for secret scanning</li>
            </ul>
          </div>
          </CollapsibleSection>
        </div>
      </div>
      
      {/* Table of Contents */}
      <TableOfContents />
    </div>
  )
}
