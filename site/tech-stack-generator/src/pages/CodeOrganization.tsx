import { CodeBlock } from '../components/CodeBlock'
import { CollapsibleSection } from '../components/CollapsibleSection'
import { GeneratedKeyValueTable } from '../components/GeneratedDataTables'
import { keyValueRowsFromDomain, LiveRepoSection } from '../components/LiveRepoSection'
import { codeOrganizationRecords } from '../data/codeOrganizationData'
import { Folder, FileCode, Settings, TestTube, Database } from 'lucide-react'

function getTopDirs() {
  return [
    { name: 'app/', desc: 'Next.js App Router - pages, layouts, API routes, global CSS', icon: FileCode, color: 'text-brand-400' },
    { name: 'features/', desc: 'Feature modules: planner, catalog, crm, admin, ai, shared', icon: Folder, color: 'text-accent-400' },
    { name: 'components/', desc: 'Shared UI components used across features', icon: FileCode, color: 'text-brand-400' },
    { name: 'lib/', desc: 'Cross-cutting utilities, Supabase clients, auth, hooks, types', icon: Folder, color: 'text-success-400' },
    { name: 'config/', desc: 'Build configs (tsconfig, eslint, playwright), DB types, env', icon: Settings, color: 'text-pink-400' },
    { name: 'tests/', desc: 'Vitest unit tests + Playwright E2E specs', icon: TestTube, color: 'text-yellow-400' },
    { name: 'scripts/', desc: 'Operational scripts: seed, migrations, CDN uploads, audits', icon: FileCode, color: 'text-warning-400' },
    { name: 'platform/', desc: 'Platform-level integrations and adapters', icon: Settings, color: 'text-brand-400' },
    { name: 'public/', desc: 'Static assets served as-is (SDKs, icons)', icon: Folder, color: 'text-docs-text-muted' },
    { name: 'data/', desc: 'Seed data and fixtures', icon: Database, color: 'text-danger-400' },
  ]
}

function getPlannerStructure() {
  return `features/planner/
├── 3d/                      # React Three Fiber 3D viewer
│   ├── Planner3DViewer.tsx  # Main 3D canvas
│   ├── viewerMaterials.ts   # Material definitions
│   ├── models/              # GLTF model components
│   └── types.ts
├── canvas-fabric/           # Fabric.js 2D canvas (replacement for tldraw)
│   ├── FloorplanCanvas.tsx  # Core canvas component
│   ├── FabricCanvasWorkspace.tsx
│   ├── FabricDrawToolsBar.tsx
│   ├── FabricLibraryPanel.tsx
│   ├── FabricCanvasContextMenu.tsx
│   ├── FabricCanvasSubToolbar.tsx
│   ├── RoomPresetsModal.tsx
│   ├── fabricToViewerShapes.ts   # 2D -> 3D bridge
│   ├── fabricObjectUtils.ts
│   ├── fabricSceneUtils.ts
│   ├── fabricDrawToolTypes.ts
│   ├── plannerRuntime.ts
│   ├── components/          # Canvas sub-components
│   ├── context/             # React context providers
│   ├── hooks/               # Canvas-specific hooks
│   └── lib/                 # Canvas helpers
├── editor/                  # Editor logic
├── components/              # Shared planner UI
├── hooks/                   # Planner-wide hooks
├── templates/               # Room templates
├── persistence/             # Save/load to Supabase
├── shared/                  # Shared types/utils
├── model/                   # Data models
├── admin/                   # Planner admin views
├── landing/                 # Planner landing page
├── store/                   # Zustand stores
└── ui/                      # Planner-specific UI primitives`
}

function getLibStructure() {
  return `lib/
├── supabase/                # Supabase client (browser + server)
├── auth/                    # Auth helpers
├── catalog/                 # Catalog utilities
├── configurator/            # Product configurator logic
├── ai/                      # AI integration helpers
├── analytics/               # Analytics tracking
├── audit/                   # Audit utilities
├── security/                # Security helpers (rate limit, etc)
├── store/                   # Shared Zustand stores
├── tracking/                # Event tracking
├── theme/                   # Theme tokens
├── types/                   # Shared TypeScript types
├── ui/                      # Shared UI utilities
├── hooks/                   # Shared React hooks
├── env.server.ts            # Server env validation
├── rateLimit.ts             # Rate limiting
├── siteNav.ts               # Site navigation config
├── siteUrl.ts               # URL helpers
├── utils.ts                 # General utilities
├── getProducts.ts           # Product fetching
├── productSlugResolver.ts   # Slug -> product
└── assetPaths.ts            # CDN asset path helpers`
}

function getConventions() {
  return [
    {
      title: 'Path Aliases',
      desc: 'Root tsconfig.json owns path aliases. Common: @/lib/*, @/features/*, @/components/*, @/app/*',
    },
    {
      title: 'Server-Only Code',
      desc: 'Use `import "server-only"` in server modules to prevent client bundle leaks. Supabase server client uses service role key.',
    },
    {
      title: 'Feature Colocation',
      desc: 'Each feature owns its components, hooks, store, and tests. App routes import from features/, keeping route files thin.',
    },
    {
      title: 'No Hex in Components',
      desc: 'All colors come from app/css/core/theme.css. Components reference CSS variables or Tailwind tokens, never raw hex.',
    },
    {
      title: 'TypeScript Strict',
      desc: 'Strict mode enabled. No implicit any, noUnusedLocals, noUnusedParameters. TS 6.x required.',
    },
    {
      title: 'Barrel Exports',
      desc: 'Features expose a public API via index.ts. Internal modules use deep imports only when necessary.',
    },
  ]
}

export function CodeOrganization() {
  const topDirs = getTopDirs()
  const conventions = getConventions()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="section-heading">Code Organization</h1>
        <p className="section-subheading">
          How the codebase is structured — directory layout, module conventions, and import patterns.
        </p>
      </header>

      {/* Top-level dirs */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-docs-text-strong mb-4">Top-Level Directories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topDirs.map(dir => {
            const Icon = dir.icon
            return (
              <div key={dir.name} className="card flex items-start gap-3">
                <div className="p-2 rounded-lg bg-docs-surface-strong/50 flex-shrink-0">
                  <Icon size={16} className={dir.color} />
                </div>
                <div>
                  <code className="text-sm font-mono text-brand-400 font-semibold">{dir.name}</code>
                  <p className="text-xs text-docs-text-subtle mt-1">{dir.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Planner structure */}
      <section className="mb-12">
        <CollapsibleSection title="features/planner/ Structure" badge="Flagship Feature">
          <CodeBlock
            title="Planner module tree"
            language="bash"
            code={getPlannerStructure()}
          />
        </CollapsibleSection>
      </section>

      {/* Lib structure */}
      <section className="mb-12">
        <CollapsibleSection title="lib/ Structure" badge="Shared Code">
          <CodeBlock
            title="Shared library tree"
            language="bash"
            code={getLibStructure()}
          />
        </CollapsibleSection>
      </section>

      {/* Config structure */}
      <section className="mb-12">
        <CollapsibleSection title="config/ Structure" badge="Build Config" defaultOpen={false}>
          <CodeBlock
            title="Config tree"
            language="bash"
            code={`config/
├── build/                   # Build tooling
│   ├── tsconfig.json        # Base TS config (root extends)
│   ├── eslint.config.mjs    # ESLint flat config
│   └── playwright.config.ts # E2E config
├── database/                # Database config
│   └── types/
│       └── database.types.ts # Supabase generated types
├── deployment/              # Deployment configs
└── environment/             # Env validation schemas`}
          />
        </CollapsibleSection>
      </section>

      {/* Conventions */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-docs-text-strong mb-4">Conventions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conventions.map(c => (
            <div key={c.title} className="card">
              <h3 className="text-sm font-semibold text-docs-text-strong mb-1">{c.title}</h3>
              <p className="text-xs text-docs-text-subtle leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Import pattern */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-docs-text-strong mb-2">Import Pattern</h2>
        <p className="text-sm text-docs-text-muted mb-4">
          A typical planner route imports feature code, which in turn pulls from shared lib utilities.
        </p>
        <CodeBlock
          title="app/planner/page.tsx (pattern)"
          language="tsx"
          code={`import { FabricCanvasWorkspace } from '@/features/planner/canvas-fabric/FabricCanvasWorkspace'
import { Planner3DViewer } from '@/features/planner/3d/Planner3DViewer'
import { plannerProducts } from './plannerProducts'
import { createClient } from '@/lib/supabase/server'

export default async function PlannerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // middleware should have redirected, but double-check
    return null
  }

  const products = await plannerProducts()

  return (
    <div className="planner-layout">
      <FabricCanvasWorkspace products={products} userId={user.id} />
      <Planner3DViewer />
    </div>
  )
}`}
        />
      </section>

      <LiveRepoSection title="Live module inventory">
        <GeneratedKeyValueTable rows={keyValueRowsFromDomain(codeOrganizationRecords)} />
      </LiveRepoSection>
    </div>
  )
}
