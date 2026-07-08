# Plan A — O&O Planner: Start → Handover

**Status:** Active  
**Revision:** 2026-07-08 (replaces all prior plan files 01–07C)  
**Baseline commit:** `a7fadf7`  
**Authority:** This document > all files in `archive/plans-v1-2026-07-08/`

---

## 00 — Ground Truth (What Exists Right Now)

### Product Summary

A browser-based **custom furniture planner** for One&Only (O&O).

**What customers do:**
1. Open `/planner/open3d` (or `/planner/guest` without login)
2. Draw rooms by clicking to place walls, doors, and windows on a 2D floor plan
3. Browse a catalog of furniture items (sofas, tables, cabinets) and drag them into rooms
4. Toggle to 3D to see a rendered view of the room with placed furniture
5. Adjust dimensions, materials, and positions via the properties panel
6. Save the plan (locally for guests, to Supabase for logged-in users)

**What admins do:**
1. Open `/admin/svg-editor` to create product definitions
2. Define each product's geometry (dimensions), materials, variants (e.g. "oak" vs "walnut")
3. Preview the product as it would appear in the planner
4. Publish the product so it appears in the customer-facing catalog

**What the server does:**
- Validates all product definitions against strict Zod schemas (no arbitrary data accepted)
- Compiles SVG representations of products (geometry → SVG paths)
- Sanitises SVGs with DOMPurify (security: no executable code in SVGs)
- Optimises SVGs with SVGO (file size reduction)
- Renders PNG thumbnails with resvg + Sharp (for catalog cards)
- Persists everything to disk (migrating to Supabase in Phase 2C)

### Live Routes

| Route | Status | What It Renders |
|-------|--------|-----------------|
| `/planner/open3d` | ✅ Primary | `OOPlannerWorkspace` — 2D canvas + 3D viewer + all panels |
| `/planner/guest` | ✅ Live | Same as open3d, guest mode (no auth) |
| `/planner/canvas` | ✅ Live | Same as open3d, with optional auth |
| `/admin/svg-editor` | ✅ Live | Block descriptor list + JSON editor + Puck Render preview |
| `/admin/svg-editor/[id]` | ✅ Live | Single descriptor edit view |
| `/planner/fabric/*` | ❌ Archived | Old Fabric-based workspace, code in `_archive/fabric/` |

### Module Map (`site/features/planner/`)

The planner feature has **21 subdirectories**. The main workspace lives under `open3d/`. Supporting modules live alongside it.

```
features/planner/
│
├── open3d/                     ← THE MAIN WORKSPACE (where customers draw)
│   ├── canvas-feasibility/     FeasibilityCanvas.tsx (1075 lines, pure Canvas 2D API)
│   ├── 3d/                     ThreeLazyViewer.tsx, ThreeViewerInner.tsx + CSS Modules
│   ├── editor/                 OOPlannerWorkspace, TopBar, CommandPalette,
│   │                           PropertiesPanel, InventoryPanel, LayersPanel,
│   │                           WorkspaceShell, PanelContainer, CanvasToolRail
│   │                           + CSS Modules + hooks (docking, keyboard, canvas, placement)
│   ├── catalog/                catalogClient, catalogTypes, catalogMapping,
│   │                           catalogSearch, catalogTaxonomy, parametricBuilder,
│   │                           placementAction, recentFavorites, unitConversion
│   │   └── svg/                svgCompiler.server, svgTypes, descriptorLoader
│   │   └── inventory/          inventory data adapters
│   ├── model/                  types, project, invariants, units
│   │   ├── actions/            walls, openings, furniture, projectActions
│   │   └── operations/         pureActions (reducer-style state transforms)
│   ├── store/                  history, selection, workspacePreferences
│   ├── lib/                    commands/ (PlannerCommand registry), geometry/ (snapping, picking)
│   ├── persistence/            autosave, cloud save, guest/member repositories, session
│   ├── ai/                     AI advisor client, sketch-to-plan pipeline
│   ├── cleanup/                importGraphProof, assetClassification
│   ├── shared/                 document utils, export, theme color tokens
│   └── ui/                     Open3dNativeHost.tsx
│
├── admin/                      ← ADMIN TOOLS (where admins create products)
│   ├── svg-editor/             Block descriptor editor (see detail below)
│   └── Admin*PageView.tsx      Dashboard, catalog, plans, inventory, workspace catalog
│
├── ui/                         PlannerSessionDialog, PlannerSaveIndicator,
│                               PlannerEmptyCanvas, PlannerTooltip, Tooltip,
│                               Open3dPlannerWorkspaceRoute
│
├── shared/                     Shared components: Catalog, Inspector, SplitViewLayout,
│                               WorkspaceShell, ViewToggle, Toolbar
│   ├── boq/                    Bill of Quantities
│   ├── catalog/                Shared catalog data layer
│   ├── components/             Reusable planner components
│   ├── document/               Document format types
│   ├── export/                 PDF export, BOQ export
│   ├── hooks/                  Shared planner hooks
│   └── types/                  Shared planner types
│
├── 3d/                         Planner3DViewer.tsx (standalone 3D viewer)
├── ai/                         AiAdvisorChat.tsx
├── onboarding/                 OnboardingCoach, ProjectSetupStep, StartingPointStep
├── landing/                    PlannerFeaturesHubPage, PlannerToolsShowcase
├── help/                       PlannerHelpPage
├── portal/                     PortalPlanPageView (customer portal view)
├── templates/                  Template system
├── _archive/                   Archived Fabric-based canvas (historical)
└── CONTENTS.md                 Module inventory
```

### Admin SVG Editor (`site/features/planner/admin/svg-editor/`)

```
svg-editor/
├── AdminSvgEditorEditView.tsx        Main edit page (JSON + Puck Render preview)
├── AdminSvgEditorListView.tsx        Block descriptor listing
├── puckBlockRegistry.tsx             27KB — Puck component/field definitions
├── svgBlockSchemas.ts                Zod schemas for block descriptors
├── svgPipelineRunner.ts              Orchestrates compiler + sanitizer + SVGO
├── svgArtifactCompiler.server.ts     Server-side SVG compilation
├── svgRevisionRepository.server.ts   Revision persistence (server-only)
├── svgFieldMetadata.ts               Zod metadata for Puck field generation
├── svgReferenceDefinitions.ts        Reference block definitions (table, door, cabinet)
├── persistBlockDescriptor.ts         Disk persistence for block descriptors (13KB)
├── descriptorLock.ts                 Concurrency locking
├── descriptorArchive.ts              Archival logic
├── plannerSvgAdapter.ts              Adapts descriptors for planner consumption
├── uploadAsset.ts                    Asset upload utility
├── GlbExtruderPreview.tsx            SVG → 3D extrusion via Three.js (working)
├── ModelViewerPreview.tsx            GLB preview via Google <model-viewer> (working)
└── dualReadHarness.ts                Migration harness for dual descriptor formats
```

### 2D Canvas Engine

`FeasibilityCanvas.tsx` uses **raw HTML5 Canvas 2D API** (`canvas.getContext("2d")`).  
Hand-codes: grid, walls, rooms, doors, windows, furniture, pan, zoom, snap, pointer capture.  
Does **NOT** use Fabric.js, Konva, or any canvas library.  
`fabric` is in `package.json` but has **zero active imports** (only `_archive/fabric/`).

> **Why this matters:** The pure Canvas 2D approach means every interactive feature (selection handles, resize grips, rotation widgets, multi-select) must be coded from scratch. Canvas libraries like Fabric.js or Konva provide these out of the box. Phase 2B includes a spike to evaluate whether adopting one would reduce development time.
>
> **Risk:** At 1075 lines, the canvas is fragile — a small pointer math change can break multiple drawing tools. Any canvas work MUST be accompanied by geometry and interaction tests.

### The "Fabric" Confusion (Explained)

Previous plans used "Fabric" to mean two different things, creating persistent confusion:

1. **`fabric` (npm package, v7.4)** — A JavaScript canvas library for 2D drawing with built-in selection, grouping, transforms, and snapping. It is **installed** (`package.json` line 163) but **no active code imports it**. The only imports live in `_archive/fabric/` (the old workspace that was replaced).

2. **`/planner/fabric` (the route)** — A standalone page that used the old Fabric-based 2D-only workspace. This route's code has been moved to `_archive/fabric/`. The route files may still exist in `app/planner/(workspace)/fabric/` but are unreachable from any navigation link.

**Going forward:** Plan A uses "Fabric.js" (with ".js") to mean the npm package, and "/planner/fabric" to mean the archived route. The 2D engine in production is `FeasibilityCanvas.tsx` (pure Canvas 2D API).

### 3D Engine

Three.js + React Three Fiber + Drei. Lazy-loaded via `ThreeLazyViewer.tsx`.  
`@google/model-viewer` used in admin for GLB previews.

### UI Component Libraries

| Library | Where Used | Status |
|---------|-----------|--------|
| React Aria Components | Planner: CommandPalette, TopBar, PropertiesPanel, InventoryPanel, Tooltip, PlannerSessionDialog | ✅ Active |
| Phosphor Icons | Planner inventory taxonomy (`inventoryIcons.tsx`) | ✅ Active (partial) |
| Lucide React | ~50 files across planner, admin, shared, auth, landing, site-assistant, CRM | ✅ Active (dominant) |
| Ark UI | ❌ Removed from `package.json` | Gone |
| Radix UI | ❌ Removed from `package.json` (vestigial comment in `Slot.tsx`) | Gone |

### CSS Architecture

- Tailwind CSS v4 as build infrastructure (`@theme {}` directives in `theme.css`)
- `app-shell.css` + semantic CSS custom properties = design token source of truth
- CSS Modules for component-scoped styles (`.module.css` files in `editor/`)
- `cn()` utility (`clsx` + `tailwind-merge`) used in 13+ files
- Tailwind utility classes purged from JSX; framework retained for CSS compilation

### Pipeline (Server-Side) — What "Option A" Means

The "server pipeline" is the sequence of steps that transforms an admin's product definition into visual assets. It runs entirely on the server — no browser involved.

```
Admin fills out product form (dimensions, material, variant)
  ↓
JSON sent to POST /api/admin/svg-editor
  ↓
Step 1: Zod validation (reject invalid/malformed JSON)
  ↓
Step 2: SVG compilation (svgArtifactCompiler.server.ts)
         Turns geometry JSON → SVG markup with <rect>, <path>, <circle>, etc.
  ↓
Step 3: DOMPurify sanitisation (strip any <script>, onclick, etc.)
  ↓
Step 4: SVGO optimisation (minify SVG, remove unused attributes)
  ↓
Step 5: resvg PNG render (SVG → high-quality PNG at 2× resolution)
  ↓
Step 6: Sharp thumbnail (resize PNG to catalog card size)
  ↓
Step 7: Persist to disk (currently site/block-descriptors/, migrating to Supabase in Phase 2C)
```

**Server cost:** ~200ms per product publish on a 2-CPU machine. Trivial.

All server packages installed: `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`, `sharp`, `dompurify`.

> **Why "Option A"?** The old plan files described three different pipeline architectures (server-only, client-only, hybrid). We chose server-only because (a) the code already implements it, (b) it's the most secure (no untrusted browser output gets persisted), and (c) the user has server budget. The only thing the client handles is 3D rendering (Three.js), because the server can't run WebGL.

### Client-Side 3D Generation (Partial)

- `parametricBuilder.ts` — generates 2D SVG paths + 3D BoxGeometry from W/D/H JSON. **Working, used by FeasibilityCanvas.**
- `GlbExtruderPreview.tsx` — extrudes SVG → 3D mesh → exports `.glb` blob in browser. **Working.**
- `ModelViewerPreview.tsx` — previews `.glb` files with orbit controls. **Working.**

### Product Types — Why Three Pipelines?

Custom furniture comes in fundamentally different shapes. Forcing one pipeline on all types is either wasteful (uploading .glb files for simple boxes) or insufficient (parametric math can't represent organic shapes). So the plan uses three product types:

| Type | Example | How 2D Renders | How 3D Renders | What Admin Does |
|------|---------|---------------|---------------|----------------|
| **Parametric** | Kitchen cabinet 600×900×600mm | `ParametricBuilder.generate2DFootprint()` → SVG rect path | `ParametricBuilder.generate3DMesh()` → `THREE.BoxGeometry` | Sets W/D/H + material in Puck form. No file upload. |
| **Static** | Branded sofa, designer lamp | Admin-uploaded `.svg` footprint | Admin-uploaded `.glb` 3D model | Uploads 2 files. Server validates size/format. |
| **Extruded** | Custom countertop, irregular shelf | Admin-uploaded `.svg` outline | Browser extrudes SVG → 3D via `GlbExtruderPreview.tsx` | Uploads SVG + sets thickness. Browser generates `.glb`. |

**Why not thousands of .glb files?** Because parametric items (cabinets, shelving, counters) are the majority of the catalog, and they're just boxes/L-shapes/U-shapes. Generating them from JSON dimensions is instant, scalable, and requires zero file storage.

### Test Status (as of `075f92b`)

| Check | Result |
|-------|--------|
| Vitest (full) | 4812/4812 pass |
| Typecheck | Pass |
| Lint (ESLint) | Pass (0 errors) |
| Runtime HTTP probe | Pass (all routes 200) |
| Coverage floor | INCOMPLETE (`PLAN-FAIL-0408`) |

> **Note:** Test results are from commit `075f92b`. Current HEAD is `a7fadf7` (2 commits ahead). The test results directory is at `site/results/` (audit CSVs). There is NO `results/planner/phase-1a/` or `results/planner/phase-1b/` evidence directory — these were referenced in the old plans but never created.

### Dead Dependencies (Confirmed)

| Package | Imports | Action |
|---------|---------|--------|
| `@svgdotjs/svg.js` | 0 | Remove |
| `@svgdotjs/svg.resize.js` | 0 | Remove |
| `@svgdotjs/svg.select.js` | 0 | Remove |
| `html-to-image` | 0 | Remove |

### Dependencies Under Observation

| Package | Notes |
|---------|-------|
| `fabric` | Installed, zero active imports. Keep as insurance until canvas engine decision finalised. |
| `lucide-react` | ~50 files. User prefers Phosphor. Migration is Phase 2A work. |
| `html2canvas` | Used by `pdfExport.ts`. Keep. |
| `motion`, `motion-utils` | May be `framer-motion` peer deps. Verify before removing. |

---

## Phase 1 — Foundation (PARTIALLY COMPLETED)

> Phase 1 work was done across commits `9360b53` → `a7fadf7`.  
> **⚠ Evidence gap:** No `results/planner/phase-1a/` or `phase-1b/` directories exist. The old plans claimed completion but did not generate evidence artifacts. Phase 1 checklist items below are marked based on code inspection, not formal test evidence.

### 1A — Open3D Shell ✅

- [x] Route containment (`/planner/open3d` as workspace route)
- [x] 100dvh workspace, no page scroll, safe-area support
- [x] Semantic CSS tokens mapped to O&O theme
- [x] `PlannerCommand` type + `executePlannerCommand` (unit-tested)
- [x] Command palette (Ctrl/Cmd+K)
- [x] Phosphor icons for inventory taxonomy
- [x] `lint:ui:strict` in release gate

### 1B — SVG Production Path ✅

- [x] `SvgBlockDefinitionV1` + Zod schemas
- [x] SVG compiler + sanitizer + SVGO + resvg + Sharp pipeline
- [x] Puck Render preview on admin routes
- [x] Boundary tests (server packages absent from client)
- [x] Reference block definitions (table, door, cabinet)

### 1A/1B Gaps Carried Forward

- [ ] Full draw → save → reload acceptance (§11A) — **carried to Phase 2B**
- [ ] Full `<Puck>` mount with `onPublish` → API — **carried to Phase 2C**
- [ ] CSS hardcoding audit gate — **carried to Phase 2A**
- [ ] Three theme adapter — **carried to Phase 2B**

---

## Phase 2A — UI Stabilisation

**Goal:** Lock the UI foundation. Fix component library conflicts, standardise icons, harden the CSS contract.

**Prerequisite:** None (start immediately)

### 2A.1 — React Aria Completion

- [ ] Audit all planner components for remaining hand-rolled keyboard/focus logic
- [ ] Ensure CommandPalette, TopBar, PropertiesPanel, InventoryPanel are fully React Aria
- [ ] Write integration tests for keyboard nav (Tab, Arrow, Enter, Escape) across all React Aria components
- [ ] Verify 100dvh layout holds after every component change

### 2A.2 — Lucide → Phosphor Migration (Planner Module Only)

- [ ] Map every `lucide-react` import in `features/planner/**` to Phosphor equivalent
- [ ] Replace imports in: TopBar, PropertiesPanel, InventoryPanel, CanvasToolRail, PlannerSaveIndicator, PlannerSessionDialog, PlannerEmptyCanvas, ViewToggle, Toolbar, LayersPanel
- [ ] Replace imports in: admin SVG editor views, admin catalog views
- [ ] Replace imports in: onboarding, landing pages
- [ ] Add `open3dIconPolicy.test.tsx` guard: no `lucide-react` in `features/planner/**`
- [ ] **Do NOT touch** `features/shared/`, `features/site-assistant/`, `features/crm/`, `components/` (those stay Lucide for now)

### 2A.3 — CSS Hardening

- [ ] Run CSS hardcoding audit and pass gate
- [ ] Verify all planner components use CSS Modules or semantic tokens
- [ ] No raw colours, inline z-index, magic spacing, or hardcoded breakpoints in planner JSX
- [ ] Add reduced-motion, forced-colors, focus-visible states to planner components

### 2A.4 — Dead Dependency Cleanup

- [ ] Remove `@svgdotjs/svg.js`, `@svgdotjs/svg.resize.js`, `@svgdotjs/svg.select.js` from `package.json`
- [ ] Remove `html-to-image` from `package.json`
- [ ] Verify `motion` / `motion-utils` are peer deps or standalone; remove if standalone with zero imports
- [ ] Run `pnpm install` + `pnpm run typecheck` + `pnpm run test` after removal

### 2A Gates

- [ ] `pnpm run typecheck` — pass
- [ ] `pnpm run lint` — pass
- [ ] `pnpm run test` — pass (no regressions)
- [ ] `pnpm run lint:ui:strict` — pass
- [ ] No `lucide-react` in `features/planner/**` (test guard)
- [ ] Keyboard nav test suite for React Aria components — pass
- [ ] 100dvh layout verified at 1440×900, 1024×768, 768×1024, 390×844

---

## Phase 2B — Canvas & Open3D Unification

**Goal:** Make the 2D/3D workspace production-ready. Solidify the canvas, unify state, complete the draw→save→reload flow.

**Prerequisite:** Phase 2A gates pass

### 2B.1 — Canvas Stabilisation

- [ ] Audit `FeasibilityCanvas.tsx` (1075 lines) — identify fragile pointer math, missing edge cases
- [ ] Add unit tests for coordinate transforms (`screenToProject`, `projectToScreen`, `zoomTransformAt`, `snapDrawingPoint`)
- [ ] Add unit tests for `pointInPolygon`, `pickWallAtPoint`, `pickWallWithPosition`
- [ ] Test deterministic: draw room → add wall → add door → add window → place furniture → undo → redo → save → reload
- [ ] Fix any discovered state desynchronisation between canvas and workspace store

### 2B.2 — Selection & Interaction (Evaluate Canvas Engine)

> The current pure Canvas 2D approach has no selection handles, resize grips, or rotation widgets. These are needed for production.

- [ ] **Spike (2 days):** Prototype Konva integration for ONE interaction — furniture selection with drag + resize handles
  - Install `konva` + `react-konva` in a branch
  - Render furniture items as Konva nodes on a transparent layer over the existing canvas
  - Test: click to select, drag to move, handles to resize, rotation handle
  - Measure: code complexity vs hand-rolling equivalent in Canvas 2D
- [ ] **Decision gate:** Based on spike results, choose:
  - **Option K:** Adopt Konva for interactive objects, keep Canvas 2D for static grid/walls (hybrid)
  - **Option F:** Adopt Fabric.js (already installed) for the full canvas
  - **Option H:** Continue hand-rolling in Canvas 2D (if complexity is manageable)
- [ ] Implement chosen approach for: select, move, resize, rotate, delete on furniture items
- [ ] Implement wall selection + property editing
- [ ] Implement room selection + property editing
- [ ] Multi-select with bounding box

### 2B.3 — 2D ↔ 3D State Continuity

- [ ] Verify `workspaceCanvas.project` state (walls, rooms, furniture coordinates) is shared between FeasibilityCanvas and ThreeLazyViewer
- [ ] Toggle 2D → 3D preserves: room dimensions, wall positions, furniture positions and rotations
- [ ] Toggle 3D → 2D preserves: any changes made in 3D mode
- [ ] Default boot: 2D `FeasibilityCanvas` (not 3D)
- [ ] Integrate `parametricBuilder.generate3DMesh()` with the 3D viewer for furniture items

### 2B.4 — Draw → Save → Reload Flow

- [ ] Complete: draw room → add opening → place item → edit dimensions → undo/redo → save → reload
- [ ] Complete keyboard equivalent through layers, commands, and numeric controls
- [ ] Existing documents remain compatible after reload
- [ ] Autosave works without data loss
- [ ] Cloud save to Supabase works for authenticated users

### 2B.5 — Route Cleanup

- [ ] Update stale "Fabric-backed" comments in `guest/page.tsx` and `canvas/page.tsx`
- [ ] Verify `/planner/fabric/*` routes are unreachable from navigation (already archived)
- [ ] Update `importGraphProof.ts` to reflect current state

### 2B Gates

- [ ] Full draw → save → reload acceptance test — pass
- [ ] 2D ↔ 3D toggle preserves all state — verified
- [ ] Canvas engine decision documented
- [ ] No console errors on `/planner/open3d`, `/planner/guest`, `/planner/canvas`
- [ ] `pnpm run typecheck` + `pnpm run test` — pass

---

## Phase 2C — Asset Engine & Admin Publishing

**Goal:** Complete the admin publish pipeline so products flow from admin creation → catalog → planner placement.

**Prerequisite:** Phase 2B gates pass

### 2C.1 — Full Puck Editor Mount

- [ ] Replace JSON text box in `AdminSvgEditorEditView.tsx` with full `<Puck editor={...} config={...} onPublish={...}>`
- [ ] Admin visually composes block configuration using Puck fields
- [ ] `onPublish` sends validated JSON to `POST /api/admin/svg-editor`
- [ ] API route runs SVG pipeline (validate → compile → sanitize → optimise → render PNG → persist)
- [ ] On failure: return 422 with error message, Puck shows error to admin
- [ ] On success: persist descriptor to **Supabase** (not disk)

### 2C.2 — Storage Migration (Disk → Supabase)

- [ ] Migrate block descriptor JSON from `site/block-descriptors/` to Supabase Postgres
- [ ] Migrate asset files (`.glb`, `.svg`, thumbnails) to Supabase Storage
- [ ] Update `catalogClient.ts` to fetch from Supabase instead of disk/API
- [ ] Maintain backward compatibility: read from disk as fallback during migration
- [ ] Remove disk-based persistence code after migration verified

### 2C.3 — Product Type Pipelines

**Custom furniture (parametric) — no file uploads:**
- [ ] Admin sets W/D/H bounds + material selection in Puck
- [ ] Server stores JSON only (no files)
- [ ] Client generates 2D footprint via `ParametricBuilder.generate2DFootprint()`
- [ ] Client generates 3D mesh via `ParametricBuilder.generate3DMesh()`
- [ ] Extend `ParametricBuilder` beyond boxes: L-shapes, U-shapes for counters; door/drawer faces for cabinets

**Static/branded items (dual-asset upload):**
- [ ] Admin uploads `.glb` (3D model) and `.svg` (2D footprint) via Puck fields
- [ ] Server validates: file size limits, GLTF structure validation, SVG sanitisation
- [ ] Files stored to Supabase Storage, URLs saved in descriptor JSON
- [ ] Client renders `.glb` with Three.js, `.svg` on 2D canvas

**Extruded items (SVG → 3D):**
- [ ] Admin uploads `.svg` outline + enters thickness + selects material
- [ ] `GlbExtruderPreview.tsx` generates 3D preview in admin panel
- [ ] On publish: browser exports `.glb` blob → uploads to server
- [ ] Server validates `.glb` (file size, GLTF structure) before persisting
- [ ] Stored `.glb` served to planner for 3D rendering

### 2C.4 — Catalog End-to-End

- [ ] Admin creates product → publishes → product appears in planner catalog
- [ ] Customer selects product → places in room → sees 2D footprint
- [ ] Customer toggles 3D → sees 3D model/mesh
- [ ] Product variants (colour, material) work in both views
- [ ] Catalog search (Fuse.js) works with new Supabase-sourced data

### 2C Gates

- [ ] Admin can publish a parametric product end-to-end
- [ ] Admin can publish a static product with uploaded `.glb` + `.svg`
- [ ] Admin can publish an extruded product with SVG → 3D
- [ ] All three product types appear in customer catalog and render in 2D + 3D
- [ ] `pnpm run typecheck` + `pnpm run test` — pass
- [ ] SVG security fixtures (malicious SVG rejected)
- [ ] Pipeline determinism (identical input → identical output)

---

## Phase 3 — Polish & Mobile

**Goal:** Professional-grade UX. Mobile editing. Accessibility. Performance.

**Prerequisite:** Phase 2C gates pass

### 3.1 — Professional Workspace Polish

- [ ] Top bar: project name, save state indicator, floor selector, unit selector, 2D/3D toggle, undo/redo, save
- [ ] Resizable panels (react-resizable-panels, already installed)
- [ ] Canvas-maximise mode (collapse panels, exact restore)
- [ ] Canvas ≥ 60% of workspace at 1440px with panels open
- [ ] Keyboard shortcuts: V (select), W (wall), D (door), H (window), T (text), Space (pan), Escape (cancel)
- [ ] Status bar: active tool, measurement input, coordinate display
- [ ] First-use guidance: draw room, place furniture, or import floorplan

### 3.2 — Mobile Editing

- [ ] Canvas-first layout on mobile
- [ ] Vaul drawer for panels (one at a time)
- [ ] Compact bottom command bar
- [ ] 44×44 CSS-pixel touch targets
- [ ] Gesture precedence: pan, pinch-zoom, object drag, drawer swipe
- [ ] Safe-area and virtual-keyboard bounds respected
- [ ] Landscape layout on tablets (not stretched portrait drawers)

### 3.3 — Accessibility

- [ ] Screen reader: announce tool changes, selections, save state, validation errors
- [ ] Focus order: top bar → tools → canvas (with alternative accessible representation) → panels → status
- [ ] Non-pointer editing: numeric controls for all geometry operations
- [ ] Reduced motion support
- [ ] Forced colours support
- [ ] 200% zoom support
- [ ] Axe: zero serious/critical violations

### 3.4 — Performance

- [ ] First usable 2D canvas ≤ 2.5 seconds on baseline hardware
- [ ] 3D scene interactive ≤ 4 seconds after activation
- [ ] Interaction targets 60fps, never below 45fps
- [ ] 3D code absent from initial 2D loading (lazy-load gate)
- [ ] Admin/compiler packages absent from planner bundles (boundary test)
- [ ] Pause/reduce 3D rendering when tab hidden or backgrounded

### Phase 3 Gates

- [ ] Full workflow at 1440×900, 1024×768, 768×1024, 390×844, mobile landscape
- [ ] Axe audit pass
- [ ] Manual keyboard-only workflow pass
- [ ] Performance budgets met
- [ ] `pnpm run release:gate` — pass

---

## Phase 4 — Promotion & Handover

**Goal:** Controlled rollout. Documentation. Transfer.

**Prerequisite:** Phase 3 gates pass

### 4.1 — Route Promotion

- [ ] Accept Open3D on one unchanged revision with full evidence
- [ ] `/planner/open3d` — production (already live)
- [ ] `/planner/guest` — verified: guest restrictions, persistence boundaries, onboarding
- [ ] `/planner/canvas` — verified: authenticated save/reload, document compatibility
- [ ] Compare: screenshots, commands, saved documents, permissions, bundle boundaries before each promotion
- [ ] Retain rollback capability (archive previous route implementations)

### 4.2 — Admin Publishing Hardening

- [ ] Role permissions: create, edit, approve, publish, rollback, archive
- [ ] Optimistic concurrency (revision IDs prevent silent overwrites)
- [ ] Immutable published revisions
- [ ] Version comparison, clone, import, export
- [ ] Unknown/deprecated blocks render as recoverable placeholders

### 4.3 — Documentation

- [ ] Update `Readme.md` with current architecture
- [ ] Update `START.md` with current dev commands
- [ ] Update `docs/architecture/` to reflect Plan A decisions
- [x] Archive old plan files to `archive/plans-v1-2026-07-08/` (done 2026-07-08)
- [ ] Write operator runbook for admin publishing workflow

### 4.4 — Handover Checklist

- [ ] All Phase 3 gates pass on one unchanged revision
- [ ] Evidence captured under `results/<module>/<phase>/<cmd>/`
- [ ] No unexplained console errors, warnings, failed requests
- [ ] Coverage floor met (`PLAN-FAIL-0408` resolved)
- [ ] Rollback procedures tested
- [ ] Handover document signed off

---

## Non-Negotiable Rules (Carried from Original Plans)

These apply at ALL phases:

1. Production planner code stays under `site/features/planner/`
2. Routes stay thin (logic in features, not in `app/`)
3. No arbitrary JavaScript, CSS, or executable SVG from administrators
4. Failed validation blocks publication — never guess around invalid geometry
5. Opening a document never silently migrates or overwrites it
6. Static presentation belongs in CSS, not JSX
7. No raw colours, emoji controls, inline z-index, magic spacing in planner JSX
8. Runtime inline values limited to: canvas geometry, transforms, pointer coordinates, calculated dimensions, dynamic asset data
9. Node-only packages (`resvg`, `sharp`, `svgo`, server compiler) never in client bundles
10. Fabric.js, Three.js, and Puck runtime objects never persisted to database

## Package Ownership (Single Source of Truth)

### Rendering Engines
| Package | Owns | Notes |
|---------|------|-------|
| Canvas 2D API | 2D floor plan drawing | Via `FeasibilityCanvas.tsx`. Konva/Fabric under evaluation (Phase 2B spike). |
| `three` + `@react-three/fiber` + `@react-three/drei` | 3D rendering | Lazy-loaded. |
| `@google/model-viewer` | Admin GLB previews | Used in `ModelViewerPreview.tsx`. |

### UI & Interaction
| Package | Owns |
|---------|------|
| `react-aria-components` | Planner accessible components (menus, dialogs, number fields, listbox) |
| `@phosphor-icons/react` | Planner icon system (migration from lucide in progress) |
| `react-resizable-panels` | Desktop/tablet panel layout |
| `vaul` | Mobile drawers |
| `framer-motion` | Shell transitions, placement feedback (NOT canvas animation) |
| `sonner` | Transient toast notifications |

### Data & State
| Package | Owns |
|---------|------|
| `zustand` | Workspace, view, and transient state |
| `zundo` | Document undo/redo (command-backed mutations only) |
| `zod` | All validation (commands, preferences, descriptors, publishing) |
| `@tanstack/react-query` | Server catalog requests, caching, retry |
| `fuse.js` | Client-side catalog search ranking |

### Server Pipeline
| Package | Owns |
|---------|------|
| `@flatten-js/core` | Geometry validation |
| `polygon-clipping` | Boolean polygon operations |
| `dompurify` | SVG sanitisation before SVGO |
| `svgo` | SVG optimisation |
| `@resvg/resvg-js` | Server SVG → PNG rendering |
| `sharp` | Server thumbnail generation |

### Admin Composition
| Package | Owns |
|---------|------|
| `@puckeditor/core` | Admin block composition, fields, preview |

### Explicitly Excluded
- No second canvas/2D engine (unless Phase 2B spike proves Konva/Fabric necessary)
- No second page builder (no GrapesJS, Craft.js, Builder.io)
- No Babylon.js, Pixi.js, Paper.js, Blueprint3D
- No Ark UI, Radix UI (removed)
- No browser-side `sharp`, `resvg`, or `svgo`

---

## Rollback Policy

- Every phase is rollback-safe via git
- Route promotion is reversible (archive prior route code, don't delete)
- Published product revisions are immutable; rollback changes active pointer only
- Preserve all failure evidence under `results/`
- Roll back for: document corruption, save/reload mismatch, engine identity drift, unsafe publication, accessibility regression, or performance-budget failure

---

## Authority Chain

```
1. User message + AGENTS.md
2. This file (Plan A)
3. docs/architecture/MODULE-LAYOUT.md (where new code goes)
4. docs/architecture/MODULE-UI-CONTRACT.md (surface anti-drift)
5. testing-handbook.md (test evidence rules)
```

All prior plan files (`01-START.md` through `07C-PHASE-2C-ASSET-ENGINE.md`) are archived in `archive/plans-v1-2026-07-08/` for historical reference only and do not supersede Plan A.

---

## Appendix: Key Packages in `package.json` (Verified 2026-07-08)

These are the packages most relevant to the planner. The full `package.json` has ~70 dependencies.

| Package | Version | Purpose | Used By |
|---------|---------|---------|--------|
| `fabric` | 7.4.0 | Canvas 2D library | ❌ Zero active imports (only `_archive/`) |
| `three` | 0.185.1 | 3D rendering | ThreeLazyViewer, GlbExtruderPreview, ParametricBuilder |
| `@react-three/fiber` | 9.6.1 | React bindings for Three.js | ThreeViewerInner |
| `@react-three/drei` | 10.7.7 | Three.js helpers (OrbitControls, etc.) | ThreeViewerInner |
| `@google/model-viewer` | 4.3.1 | GLB 3D preview web component | ModelViewerPreview |
| `react-aria-components` | 1.19.0 | Accessible UI primitives | CommandPalette, TopBar, PropertiesPanel, etc. |
| `@phosphor-icons/react` | 2.1.10 | Icon system (preferred) | inventoryIcons, partial planner use |
| `lucide-react` | 1.21.0 | Icon system (legacy, ~50 files) | Planner, admin, auth, CRM, site |
| `zustand` | 5.0.14 | State management | Workspace state, selections |
| `zundo` | 2.3.0 | Undo/redo for zustand | Document history |
| `zod` | 4.4.3 | Schema validation | All descriptors, commands, forms |
| `@tanstack/react-query` | 5.101.0 | Server state / caching | Catalog data fetching |
| `fuse.js` | 7.4.1 | Fuzzy search | Catalog search |
| `react-resizable-panels` | 4.11.2 | Resizable panel layout | WorkspaceShell |
| `vaul` | 1.1.2 | Mobile drawer component | Mobile planner panels |
| `framer-motion` | 12.41.0 | Animation library | Shell transitions, placement feedback |
| `sonner` | 2.0.7 | Toast notifications | Save confirmations, errors |
| `@puckeditor/core` | 0.22.0 | Visual block editor | Admin svg-editor |
| `sharp` | 0.35.2 | Image processing (server) | Thumbnail generation |
| `@resvg/resvg-js` | 2.6.2 | SVG → PNG (server) | Pipeline render step |
| `svgo` | 4.0.1 | SVG optimisation (server) | Pipeline optimise step |
| `dompurify` | 3.4.11 | SVG sanitisation (server) | Pipeline sanitise step |
| `@flatten-js/core` | 1.6.12 | Geometry math (server) | SVG compilation |
| `polygon-clipping` | 0.15.7 | Boolean polygon ops (server) | SVG compilation |
| `tailwindcss` | 4.3.0 (dev) | CSS framework / build tool | `@theme {}` in theme.css |
| `tailwind-merge` | 3.6.0 | CSS class merging | `cn()` utility in 13+ files |
| `@svgdotjs/svg.js` | 3.2.5 | SVG manipulation | ❌ Zero active imports — DEAD |
| `@svgdotjs/svg.resize.js` | 2.0.5 | SVG resize plugin | ❌ Zero active imports — DEAD |
| `@svgdotjs/svg.select.js` | 4.0.3 | SVG select plugin | ❌ Zero active imports — DEAD |
| `html-to-image` | 1.11.13 | HTML → image | ❌ Zero active imports — DEAD |
| `html2canvas` | 1.4.1 | HTML → canvas screenshot | pdfExport.ts (KEEP) |
| `motion` | 12.40.0 | Animation (may be framer peer) | Verify before removing |
| `motion-utils` | 12.39.0 | Animation utils | Verify before removing |
