import { MermaidDiagram } from '../components/MermaidDiagram'
import { CodeBlock } from '../components/CodeBlock'
import { CollapsibleSection } from '../components/CollapsibleSection'
import { GeneratedSimpleTable } from '../components/GeneratedDataTables'
import { LiveRepoSection } from '../components/LiveRepoSection'
import { featureRecords } from '../data/featuresData'
import { PenNib as PenTool, ShoppingBag, Users, Gear as Settings, Robot as Bot, Cube as Box } from "@phosphor-icons/react";const features = [
  {
    id: 'planner',
    name: 'Room Planner',
    icon: PenTool,
    color: 'text-accent-400',
    bg: 'bg-accent-500/10',
    path: 'features/planner/',
    summary: '2D/3D floorplan designer with Fabric.js canvas and React Three Fiber 3D preview.',
    keyFiles: [
      'features/planner/canvas/PlannerFabricStage.tsx',
      'features/planner/editor/OOPlannerWorkspace.tsx',
      'features/planner/3d/ThreeLazyViewer.tsx',
      'features/planner/canvas/',
      'features/planner/store/',
    ],
  },
  {
    id: 'catalog',
    name: 'Product Catalog',
    icon: ShoppingBag,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    path: 'features/catalog/',
    summary: 'Furniture product catalog with Supabase-backed data and R2 CDN assets.',
    keyFiles: [
      'features/catalog/',
      'lib/catalog/',
      'lib/getProducts.ts',
      'lib/productSlugResolver.ts',
      'scripts/ingest-planner-catalog.ts',
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    color: 'text-success-400',
    bg: 'bg-success-500/10',
    path: 'features/crm/',
    summary: 'Customer relationship management with leads pipeline and analytics dashboards.',
    keyFiles: [
      'features/crm/',
      'app/crm/',
    ],
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: Settings,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    path: 'features/admin/',
    summary: 'Admin dashboard for catalog management, users, and analytics.',
    keyFiles: [
      'features/admin/',
      'app/admin/',
    ],
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    icon: Bot,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    path: 'features/ai/',
    summary: 'AI-powered assistants for catalog QA, product descriptions, and chat support.',
    keyFiles: [
      'features/ai/',
      'features/site-assistant/',
    ],
  },
  {
    id: 'configurator',
    name: 'Configurator',
    icon: Box,
    color: 'text-warning-400',
    bg: 'bg-warning-500/10',
    path: 'lib/configurator/',
    summary: 'Product configurator logic for customizable furniture options.',
    keyFiles: [
      'lib/configurator/',
    ],
  },
]

const plannerArchitecture = `flowchart TB
    subgraph Canvas["2D Canvas (Fabric.js)"]
        Floor["FloorplanCanvas"]
        Tools["FabricDrawToolsBar"]
        CtxMenu["FabricCanvasContextMenu"]
        Lib["FabricLibraryPanel"]
        Sub["FabricCanvasSubToolbar"]
    end

    subgraph Bridge["2D ↔ 3D Bridge"]
        Conv["fabricToViewerShapes"]
        Scene["fabricSceneUtils"]
        Runtime["plannerRuntime"]
    end

    subgraph ThreeD["3D Viewer (R3F)"]
        Viewer["ThreeLazyViewer"]
        Mats["viewerMaterials"]
        Models["models/"]
    end

    subgraph State["State"]
        Store["Zustand store"]
        Hooks["hooks/"]
        Persist["persistence/"]
    end

    Floor --> Store
    Tools --> Store
    Lib --> Store
    Store --> Conv
    Conv --> Viewer
    Viewer --> Mats
    Viewer --> Models
    Store --> Persist
    Hooks --> Store

    style Canvas fill:var(--color-ecru-950),stroke:#f59e0b
    style Bridge fill:var(--color-dark-midnight-blue-700),stroke:#a855f7
    style ThreeD fill:var(--color-ocean-boat-blue-750),stroke:#0ea5e9`

export function Features() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="section-heading">Features</h1>
        <p className="section-subheading">
          Deep-dive into each feature module of the Oando Platform.
        </p>
      </header>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
        {features.map(f => {
          const Icon = f.icon
          return (
            <a
              key={f.id}
              href={`#${f.id}`}
              className="card group hover:border-docs-border-hover transition-colors"
            >
              <div className={`p-2.5 rounded-xl ${f.bg} inline-flex mb-3`}>
                <Icon size={20} className={f.color} />
              </div>
              <h3 className="font-semibold text-docs-text-strong text-sm mb-1">{f.name}</h3>
              <p className="text-xs text-docs-text-subtle leading-relaxed mb-2">{f.summary}</p>
              <code className="text-xs text-docs-text-subtle font-mono">{f.path}</code>
            </a>
          )
        })}
      </div>

      {/* Planner deep dive */}
      <section id="planner" className="mb-12 scroll-mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-accent-500/10">
            <PenTool size={20} className="text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-docs-text-strong">Room Planner</h2>
            <p className="text-xs text-docs-text-subtle">The flagship feature — 2D/3D floorplan designer</p>
          </div>
        </div>

        <p className="text-sm text-docs-text-muted mb-4">
          The planner combines a Fabric.js 2D canvas for drawing rooms and placing furniture with a React Three Fiber 
          3D viewer that renders the same scene in real-time. The Fabric.js canvas replaced the previous tldraw 
          implementation in the 2026-06-18 session for better control over furniture object model and snapping.
        </p>

        <MermaidDiagram chart={plannerArchitecture} title="Planner Component Architecture" />

        <div className="mt-6 space-y-4">
          <CollapsibleSection title="Key Canvas Components" badge="Fabric.js">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-docs-text mb-1">FloorplanCanvas.tsx</h4>
                <p className="text-xs text-docs-text-subtle">Main Fabric.js canvas instance. Initializes the canvas, handles object events, and bridges to the Zustand store.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-docs-text mb-1">PlannerHost.tsx</h4>
                <p className="text-xs text-docs-text-subtle">Top-level workspace container that lays out the canvas, toolbar, library panel, and 3D viewer in resizable panels.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-docs-text mb-1">FabricDrawToolsBar.tsx</h4>
                <p className="text-xs text-docs-text-subtle">Tool selection bar — select, wall, draw room, place furniture. Sets the active tool in the store.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-docs-text mb-1">FabricLibraryPanel.tsx</h4>
                <p className="text-xs text-docs-text-subtle">Searchable product library panel. Uses Fuse.js for fuzzy search across catalog items. Drag to canvas to place.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-docs-text mb-1">FabricCanvasContextMenu.tsx</h4>
                <p className="text-xs text-docs-text-subtle">Right-click context menu for selected objects — rotate, duplicate, delete, bring to front.</p>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="2D → 3D Conversion" badge="Bridge" defaultOpen={false}>
            <p className="text-sm text-docs-text-muted mb-3">
              The bridge layer converts Fabric.js objects into Three.js scene elements. Each furniture item has a 
              GLTF model loaded from R2 CDN, positioned and rotated based on its 2D representation.
            </p>
            <CodeBlock
              title="fabricToViewerShapes.ts (simplified)"
              language="typescript"
              code={`import type { FabricObject } from 'fabric'
import type { ViewerShape } from './types'

// Map Fabric.js objects -> R3F scene shapes
export function fabricToViewerShapes(
  objects: FabricObject[]
): ViewerShape[] {
  return objects
    .filter(obj => obj.type !== 'group-marker')
    .map(obj => {
      const meta = obj.get('plannerMeta') as PlannerMeta
      return {
        id: meta.id,
        type: meta.type,        // 'room' | 'furniture' | 'wall'
        productId: meta.productId,
        position: [obj.left ?? 0, 0, obj.top ?? 0],
        rotation: [0, (obj.angle ?? 0) * (Math.PI / 180), 0],
        scale: [obj.scaleX ?? 1, 1, obj.scaleY ?? 1],
        dimensions: meta.dimensions,  // width, depth, height in meters
      } satisfies ViewerShape
    })
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="3D Viewer" badge="R3F" defaultOpen={false}>
            <div className="space-y-3">
              <p className="text-sm text-docs-text-muted">
                <code className="text-brand-400 bg-docs-surface px-1 rounded">ThreeLazyViewer.tsx</code> renders the 
                Three.js scene declaratively with React Three Fiber. Uses drei for OrbitControls, Environment lighting, 
                and GLTF model loading.
              </p>
              <CodeBlock
                title="ThreeLazyViewer.tsx (simplified)"
                language="tsx"
                code={`import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { usePlannerStore } from '../store'
import { fabricToViewerShapes } from '../canvas/fabricToViewerShapes'
import { FurnitureModel } from './models/FurnitureModel'

export function ThreeLazyViewer() {
  const objects = usePlannerStore(s => s.objects)
  const shapes = fabricToViewerShapes(objects)

  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
      />
      <Environment preset="apartment" />
      <ContactShadows opacity={0.5} scale={20} blur={2} />

      {shapes.map(shape => (
        <FurnitureModel key={shape.id} shape={shape} />
      ))}

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}`}
              />
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mb-12 scroll-mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <ShoppingBag size={20} className="text-brand-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-docs-text-strong">Product Catalog</h2>
            <p className="text-xs text-docs-text-subtle">Furniture catalog with Supabase + R2 CDN</p>
          </div>
        </div>

        <p className="text-sm text-docs-text-muted mb-4">
          The catalog stores product metadata in Supabase PostgreSQL while images and 3D models live in Cloudflare R2. 
          A CDN asset pipeline uploads, organizes, and audits assets. TanStack Query caches product lists client-side 
          with automatic invalidation on mutations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CollapsibleSection title="Data Flow">
            <ul className="space-y-2 text-sm text-docs-text-muted list-disc list-inside">
              <li>Server catalog via <code className="text-brand-400">getProducts()</code> + <code className="text-brand-400">unstable_cache</code></li>
              <li>Client filters via TanStack Query → <code className="text-brand-400">/api/products/filter</code></li>
              <li>Fuse.js for client-side fuzzy search</li>
              <li>Slug resolution via <code className="text-brand-400">lib/productSlugResolver.ts</code></li>
            </ul>
          </CollapsibleSection>
          <CollapsibleSection title="Asset Pipeline Scripts" defaultOpen={false}>
            <ul className="space-y-2 text-sm text-docs-text-muted list-disc list-inside">
              <li><code className="text-brand-400">catalog:ingest</code> — import catalog from source</li>
              <li><code className="text-brand-400">assets:cdn:upload</code> — push to R2</li>
              <li><code className="text-brand-400">assets:cdn:audit</code> — find broken paths</li>
              <li><code className="text-brand-400">catalog:organize:apply</code> — reorganize</li>
              <li><code className="text-brand-400">audit:supabase:catalog</code> — DB audit</li>
            </ul>
          </CollapsibleSection>
        </div>

        <div className="mt-4">
          <CodeBlock
            title="Category filter query (site/app/(site)/products/[category]/FilterGridInner.tsx)"
            language="typescript"
            code={`import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['category-products', categoryId, apiQueryString],
  queryFn: async () => {
    const res = await fetch(\`/api/products/filter/?\${apiQueryString}\`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(\`Filter request failed: \${res.status}\`)
    return res.json()
  },
  placeholderData: (prev) => prev,
  staleTime: 30_000,
  gcTime: 300_000,
})`}
          />
        </div>
      </section>

      {/* CRM */}
      <section id="crm" className="mb-12 scroll-mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-success-500/10">
            <Users size={20} className="text-success-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-docs-text-strong">CRM</h2>
            <p className="text-xs text-docs-text-subtle">Customer relationship management</p>
          </div>
        </div>

        <p className="text-sm text-docs-text-muted mb-4">
          The CRM module manages customers, leads, and a sales pipeline. Recharts powers analytics dashboards 
          showing conversion rates, lead sources, and revenue tracking. All data is scoped to the authenticated 
          user via Supabase RLS.
        </p>

        <div className="card">
          <h3 className="text-sm font-semibold text-docs-text mb-3">CRM Capabilities</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              'Customer profiles with contact history',
              'Lead pipeline with stage tracking',
              'Sales analytics with Recharts',
              'Quote generation from planner exports',
              'Activity timeline per customer',
              'Team assignment and notes',
            ].map(cap => (
              <div key={cap} className="flex items-center gap-2 text-docs-text-muted">
                <span className="w-1 h-1 rounded-full bg-green-400" />
                {cap}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin */}
      <section id="admin" className="mb-12 scroll-mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <Settings size={20} className="text-brand-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-docs-text-strong">Admin Dashboard</h2>
            <p className="text-xs text-docs-text-subtle">Catalog management and platform administration</p>
          </div>
        </div>

        <p className="text-sm text-docs-text-muted">
          The admin dashboard provides CRUD operations for the product catalog, user management, and platform-wide 
          analytics. Access is restricted to admin-role users via RLS policies and middleware checks.
        </p>
      </section>

      <LiveRepoSection title="Live planner features">
        <GeneratedSimpleTable
          columns={[
            { key: 'slug', header: 'Slug' },
            { key: 'title', header: 'Title' },
            { key: 'sourcePath', header: 'Source' },
          ]}
          rows={featureRecords.map((feature) => ({
            slug: feature.slug,
            title: feature.title,
            sourcePath: feature.sourcePath,
          }))}
        />
      </LiveRepoSection>
    </div>
  )
}
