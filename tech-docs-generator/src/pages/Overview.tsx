import { Link } from 'react-router-dom'
import { Stack as Layers, GitBranch, PuzzlePiece as Puzzle, Database, Globe, TestTube, Rocket, Shield, Lightning as Zap, ArrowRight, Code } from "@phosphor-icons/react";import { overviewKeyTech, overviewStats } from '../data/overviewSummary'
import { overviewQuickCommands } from '../data/overviewData'
import { GeneratedKeyValueTable } from '../components/GeneratedDataTables'
import { LiveRepoSection } from '../components/LiveRepoSection'
import { Tooltip } from '../components/Tooltip'
import { CopyButton } from '../components/CopyButton'

const sections = [
  { icon: Layers, label: 'Tech Stack', path: '/tech-stack', color: 'text-brand-400', bg: 'bg-brand-500/10', desc: 'All 40+ libraries and their roles' },
  { icon: GitBranch, label: 'Architecture', path: '/architecture', color: 'text-brand-400', bg: 'bg-brand-500/10', desc: 'App structure, data flow, auth' },
  { icon: Puzzle, label: 'Features', path: '/features', color: 'text-accent-400', bg: 'bg-accent-500/10', desc: 'Planner, Catalog, CRM, Admin' },
  { icon: Database, label: 'Database', path: '/database', color: 'text-success-400', bg: 'bg-success-500/10', desc: 'PostgreSQL schema & Drizzle ORM' },
  { icon: Globe, label: 'API Design', path: '/api', color: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'Routes, patterns, validation' },
  { icon: TestTube, label: 'Testing', path: '/testing', color: 'text-yellow-400', bg: 'bg-yellow-500/10', desc: 'Vitest, Playwright, coverage' },
  { icon: Rocket, label: 'Deployment', path: '/deployment', color: 'text-warning-400', bg: 'bg-warning-500/10', desc: 'Vercel CI/CD pipeline' },
  { icon: Shield, label: 'Security', path: '/security', color: 'text-danger-400', bg: 'bg-danger-500/10', desc: 'RLS, auth, secrets management' },
  { icon: Zap, label: 'Performance', path: '/performance', color: 'text-brand-400', bg: 'bg-brand-500/10', desc: 'CDN, caching, optimization' },
  { icon: Code, label: 'Code Organization', path: '/code-organization', color: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'Module structure & conventions' },
]

export function Overview() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-12">
        <div className="relative">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-500/20 rounded-full blur-[6.25rem] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Oando Platform · Tech Stack Documentation
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black text-docs-text-strong mb-6 leading-[1.1] tracking-tight">
            Oando Platform
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-accent-400 to-brand-300">
              Tech Stack
            </span>
          </h1>
          
          <p className="text-xl text-docs-text-muted max-w-2xl leading-relaxed mb-8">
            A comprehensive furniture platform at <code className="text-brand-400 bg-docs-surface/80 px-2 py-1 rounded text-sm font-mono border border-docs-border">oando.co.in</code> — featuring
            a 2D/3D room planner, product catalog, CRM, and admin dashboard built with modern web technology.
          </p>

          {/* Premium Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-12 relative z-10">
            {overviewStats.map((s, i) => {
              const bgStyles = [
                'bg-gradient-to-br from-sky-500/20 to-sky-500/5 border-sky-500/20',
                'bg-gradient-to-br from-violet-500/20 to-violet-500/5 border-violet-500/20',
                'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
                'bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/20'
              ]
              const style = bgStyles[i % bgStyles.length]
              
              return (
                <div key={s.label} className={`relative overflow-hidden rounded-2xl border ${style} p-5 sm:p-6 backdrop-blur-sm transition-transform hover:scale-105 duration-300 group`}>
                  <div className="text-3xl sm:text-4xl font-black text-docs-text-strong mb-1 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-docs-text-muted transition-all">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-docs-text-muted uppercase tracking-widest">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Key Technologies */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-docs-text-strong mb-4">Key Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {overviewKeyTech.map(tech => (
            <span
              key={tech.name}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/5 ${tech.color}`}
            >
              {tech.name}
              <span className="text-xs opacity-60">{tech.tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div className="card mb-12">
        <h2 className="text-lg font-semibold text-docs-text-strong mb-3">About the Platform</h2>
        <div className="space-y-3 text-docs-text-muted text-sm leading-relaxed">
          <p>
            The Oando Platform is a flat-root <strong className="text-docs-text">Next.js 16 application</strong> serving a furniture 
            company's complete digital presence. The codebase uses a single monorepo structure with feature-based module 
            organization under <code className="text-brand-400 bg-docs-surface px-1 rounded">features/</code> and the Next.js App Router 
            under <code className="text-brand-400 bg-docs-surface px-1 rounded">app/</code>.
          </p>
          <p>
            The centerpiece is the <strong className="text-docs-text">Room Planner</strong> — a sophisticated 2D/3D floorplan designer 
            powered by <Tooltip content="A powerful 2D canvas library for interactive object rendering"><strong className="text-docs-text">Fabric.js</strong></Tooltip> (canvas drawing, furniture placement, wall tools) combined 
            with <Tooltip content="A React wrapper for Three.js to render 3D scenes declaratively"><strong className="text-docs-text">React Three Fiber</strong></Tooltip> for real-time 3D preview. The planner integrates 
            directly with the product catalog via <Tooltip content="An open-source Firebase alternative with PostgreSQL"><strong className="text-docs-text">Supabase</strong></Tooltip>.
          </p>
          <p>
            The platform also includes a <strong className="text-docs-text">Product Catalog</strong> with <Tooltip content="Cloudflare's zero-egress-fee object storage CDN"><strong className="text-docs-text">Cloudflare R2 CDN</strong></Tooltip> assets, 
            a <Tooltip content="Customer Relationship Management"><strong className="text-docs-text">CRM module</strong></Tooltip> for customer management, an <strong className="text-docs-text">Admin 
            dashboard</strong>, and a fully SEO-optimized marketing site.
          </p>
        </div>
      </div>

      {/* Navigation Grid */}
      <div>
        <h2 className="text-lg font-bold text-docs-text-strong mb-4">Documentation Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map(section => {
            const Icon = section.icon
            return (
              <Link
                key={section.path}
                to={section.path}
                className="card group flex items-start gap-4 hover:border-docs-border-hover transition-colors cursor-pointer"
              >
                <div className={`p-2.5 rounded-xl ${section.bg} flex-shrink-0`}>
                  <Icon size={20} className={section.color} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-docs-text-strong group-hover:text-docs-text-strong transition-colors flex items-center gap-1">
                    {section.label}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  </div>
                  <div className="text-sm text-docs-text-subtle mt-0.5">{section.desc}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="mt-12 card">
        <h2 className="text-lg font-semibold text-docs-text-strong mb-4">Quick Start Commands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-sm">
          {[
            { cmd: 'npm.cmd run dev', desc: 'Start dev server (webpack mode)' },
            { cmd: 'npm.cmd run typecheck', desc: 'TypeScript check (TS 6.x)' },
            { cmd: 'npm.cmd run lint', desc: 'ESLint (zero warnings)' },
            { cmd: 'npm.cmd run test', desc: 'Run Vitest unit tests' },
            { cmd: 'npm.cmd run test:planner', desc: 'Planner-specific tests' },
            { cmd: 'npm.cmd run test:e2e:nav', desc: 'Playwright navigation smoke' },
            { cmd: 'npm.cmd run build', desc: 'Production build' },
            { cmd: 'npm.cmd run release:gate', desc: 'Full pre-release pipeline' },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="group flex flex-col gap-1 p-3 bg-docs-surface/50 hover:bg-docs-surface/80 rounded-lg border border-docs-border transition-colors relative pr-10">
              <code className="text-brand-400 text-xs">{cmd}</code>
              <span className="text-docs-text-subtle text-xs font-sans group-hover:text-docs-text-muted transition-colors">{desc}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton content={cmd} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <LiveRepoSection title="Live quick-start scripts">
        <GeneratedKeyValueTable
          rows={overviewQuickCommands.map((command) => ({
            label: command.scriptName,
            value: command.command,
            sourcePath: command.sourcePath,
            sourcePointer: command.sourcePointer,
          }))}
        />
      </LiveRepoSection>
    </div>
  )
}
