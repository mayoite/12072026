# Plan A — 00A: Start (Ground Truth + Foundation)

**Status:** Implemented (2026-07-09) — ground truth frozen + Phase 1 evidence closed + dead deps removed  
**Revision:** 2026-07-09  
**Baseline commit (doc birth):** `a7fadf7`  
**Implementation HEAD (evidence):** `831d0f5` + working tree (salvage layouts/tests + 00A dep removal)  
**Evidence root:** `results/planner/00a-start/`, `results/planner/phase-1a/`, `results/planner/phase-1b/`  
**Authority:** Plan A documents > all files in `archive/plans-v1-2026-07-08/`  
**Next:** [01A-PHASE-2A.md](01A-PHASE-2A.md)

**Plan A consists of 4 documents:**

| Document | Covers |
|----------|--------|
| **00A-START.md** (this file) | Ground truth, Phase 1 status, rules, package ownership |
| [01A-PHASE-2A.md](01A-PHASE-2A.md) | Phase 2A — UI Stabilisation |
| [02B-PHASE-2B-2C.md](02B-PHASE-2B-2C.md) | Phase 2B — Canvas & Open3D + Phase 2C — Asset Engine |
| [03C-HANDOVER.md](03C-HANDOVER.md) | Phase 3 — Polish & Mobile + Phase 4 — Handover |

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

| Layer | Status |
|-------|--------|
| **Target (Phase 2B)** | **Fabric.js v7 full stage** — one 2D engine for plan tooling (select, transform, groups). **No Konva hybrid.** |
| **Live today** | `FeasibilityCanvas.tsx` — raw Canvas 2D API (~1k lines): grid, walls, rooms, openings, pan/zoom/snap. Fragile for full tooling. |

`fabric@7.4.0` is the **chosen 2D interaction engine** (installed). Cutover is **2B work**, not “idle insurance.”  
Insurance language is invalid unless Fabric is proven unworkable in a **failed spike** — then Konva **full** (still no hybrid).

> **Risk until cutover:** FeasibilityCanvas pointer math is fragile. Any canvas change needs geometry/interaction tests.  
> **Naming:** "Fabric.js" = npm package; `/planner/fabric` = archived old route (`_archive/fabric/`).

### 3D Engine

| Surface | Stack | Role |
|---------|--------|------|
| Planner 3D | Three.js + React Three Fiber + Drei (`ThreeLazyViewer`) | Full scene from **document model** |
| Admin GLB preview | `@google/model-viewer` | Single-asset orbit preview only — **not** the planner 3D engine |

### UI Component Libraries

| Library | Where Used | Status |
|---------|-----------|--------|
| React Aria Components | Planner chrome: toolbars, menus, dialogs, fields (a11y) — **not** split layout | ✅ Active |
| `react-resizable-panels` | Workspace splits | ✅ Active |
| `vaul` | Mobile drawers | ✅ Active |
| Phosphor Icons | **Only** icon system site-wide | ✅ Active |
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

### Product Types — System-generated first (must-do)

Designers **cannot** author 100 hand-made `.glb` files. Default path is **component choice → good generated mesh/GLB**.

| Priority | Type | Example | 2D | 3D | Admin |
|----------|------|---------|----|----|-------|
| **P0 must-do** | **Parametric / modular** | Cabinet, desk, shelving | `ParametricBuilder` footprint | Generated mesh (box / L / U / parts) | Choose components + W/D/H + materials — **no GLB upload** |
| **P1** | **Extruded** | Countertop, irregular shelf | SVG outline | Extrude → generated `.glb` | SVG + thickness + material |
| **P2 exception** | **Static GLB** | Branded sculptural piece | Uploaded SVG footprint | Uploaded `.glb` | **Exception only:** flag + size limit + review |

**Must-do system (quality bar):** admin (or catalog config) selects **every component** (carcass, doors, legs, top, hardware style, material) and the pipeline produces a **good** 2D footprint + 3D mesh/GLB. Parametric is not a toy box only — it is the **primary manufacturing path**.

**Static GLB policy:** allowed only as exception (`staticGlb: true` or equivalent + max file size + human review). Not the default catalog path.

**Why not thousands of designer GLBs?** Scale and cost. Generate from structured options; upload GLB only when generation cannot represent the form.

### Test Status (00A implementation 2026-07-09)

| Check | Result | Evidence |
|-------|--------|----------|
| Phase 1A command/catalog vitest | **14/14 pass** | `results/planner/phase-1a/vitest-1a-commands/` |
| Phase 1B SVG boundaries | **pass** | `results/planner/phase-1b/vitest-1b-svg-boundaries/` |
| Phase 1B SVG pipeline suite | **pass** | `results/planner/phase-1b/vitest-1b-svg-pipeline/` |
| Typecheck (post dead-dep removal) | **pass** | `results/planner/00a-start/typecheck/` |
| Import census (dead deps) | **0 production imports** | `results/planner/00a-start/import-census/` |
| Full Vitest / coverage floor | **Not re-run in 00A** | Prior: `PLAN-FAIL-0408`; full suite deferred to release/ship |
| Runtime HTTP probe | **Not re-run in 00A** | Prior green at `075f92b` — re-run only if routes claimed |

> **Note:** Historical claim of missing `results/planner/phase-1a|1b/` is closed for 00A-scoped suites. Full-suite numbers from `075f92b` (4812/4812) are **not** re-asserted here.

### Dead Dependencies (00A completed)

| Package | Imports | Action | Status |
|---------|---------|--------|--------|
| `@svgdotjs/svg.js` | 0 production | Remove | **Removed 2026-07-09** |
| `@svgdotjs/svg.resize.js` | 0 production | Remove | **Removed 2026-07-09** |
| `@svgdotjs/svg.select.js` | 0 production | Remove | **Removed 2026-07-09** |
| `html-to-image` | 0 production | Remove | **Removed 2026-07-09** |
| `motion` | 0 production | Remove if orphan | **Removed 2026-07-09** (direct dep; app uses `framer-motion`) |
| `motion-utils` | 0 production | Remove if orphan | **Removed 2026-07-09** |

### Dependencies — locked choices (2026-07-09)

| Package | Notes |
|---------|-------|
| `fabric@7` | **Chosen 2D engine** — cutover in Phase 2B. Not “idle insurance”; only abandoned if spike proves unworkable → then Konva **full**. |
| `@phosphor-icons/react` | **Only** icons (lucide removed). |
| `three` + R3F + drei | Planner 3D. |
| `@google/model-viewer` | Admin single-asset preview only. |
| `html2canvas` | pdfExport. Keep. |
| `framer-motion` | Marketing/shell motion primary. |
| Visual regression | **Playwright `toHaveScreenshot`** — Percy removed. |
| `wrangler` / Lighthouse | Keep (R2 + perf). |

---

## Phase 1 — Foundation (COMPLETED with 00A evidence 2026-07-09)

> Phase 1 code was delivered across commits `9360b53` → `a7fadf7`.  
> **00A closed the evidence gap** under `results/planner/phase-1a/` and `results/planner/phase-1b/` (scoped suites — not full release gate).

### 1A — Open3D Shell ✅

- [x] Route containment (`/planner/open3d` as workspace route)
- [x] 100dvh workspace, no page scroll, safe-area support
- [x] Semantic CSS tokens mapped to O&O theme
- [x] `PlannerCommand` type + `executePlannerCommand` (unit-tested) — evidence: phase-1a vitest
- [x] Command palette (Ctrl/Cmd+K)
- [x] Phosphor icons for inventory taxonomy
- [x] `lint:ui:strict` in release gate script (`site/package.json`)

### 1B — SVG Production Path ✅

- [x] `SvgBlockDefinitionV1` + Zod schemas — evidence: svgFoundation / svgPhase1Completion
- [x] SVG compiler + sanitizer + SVGO path — evidence: svgPipelineGolden / svgPipelineRunner
- [x] Puck field metadata path — evidence: svgPhase1Completion
- [x] Boundary tests (server packages absent from client bundles under scan) — evidence: svgPackageBoundaries
- [x] Reference block / golden fixtures (chaise, side-table, sectional)

### 1A/1B Gaps Carried Forward

- [ ] Full draw → save → reload acceptance (§11A) — **carried to Phase 2B**
- [ ] Full `<Puck>` mount with `onPublish` → API — **carried to Phase 2C**
- [ ] CSS hardcoding audit gate — **carried to Phase 2A**
- [ ] Three theme adapter — **carried to Phase 2B**

---

## Non-Negotiable Rules (Apply at ALL Phases)

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

---

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
| `@phosphor-icons/react` | **Only** icon system (site-wide) |
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
2. Plan A documents (00A → 03C)
3. docs/architecture/MODULE-LAYOUT.md (where new code goes)
4. docs/architecture/MODULE-UI-CONTRACT.md (surface anti-drift)
5. testing-handbook.md (test evidence rules)
```

All prior plan files (`01-START.md` through `07C-PHASE-2C-ASSET-ENGINE.md`) are archived in `archive/plans-v1-2026-07-08/` for historical reference only.

---

## Appendix: Key Packages in `site/package.json` (Verified 2026-07-09)

Planner-relevant deps. Versions as declared in `site/package.json` (caret ranges shown where present).

| Package | Version | Purpose | Used By |
|---------|---------|---------|--------|
| `fabric` | 7.4.0 | **Chosen 2D plan engine** | Cutover in 2B; installed now |
| `three` | ^0.185.1 | 3D rendering | ThreeLazyViewer, GlbExtruderPreview, ParametricBuilder |
| `@react-three/fiber` | ^9.6.1 | React bindings for Three.js | ThreeViewerInner |
| `@react-three/drei` | ^10.7.7 | Three.js helpers | ThreeViewerInner |
| `@google/model-viewer` | ^4.3.1 | GLB preview web component | ModelViewerPreview |
| `react-aria-components` | 1.19.0 | Accessible UI primitives | CommandPalette, TopBar, PropertiesPanel, etc. |
| `@phosphor-icons/react` | ^2.1.10 | Icon system (preferred) | inventoryIcons, partial planner use |
| `lucide-react` | — | — | **Removed** — use `@phosphor-icons/react` only |
| `zustand` | ^5.0.14 | State management | Workspace state, selections |
| `zundo` | ^2.3.0 | Undo/redo for zustand | Document history |
| `zod` | ^4.4.3 | Schema validation | Descriptors, commands, forms |
| `@tanstack/react-query` | ^5.101.0 | Server state / caching | Catalog fetching |
| `fuse.js` | ^7.4.1 | Fuzzy search | Catalog search |
| `react-resizable-panels` | ^4.11.2 | Resizable panel layout | WorkspaceShell |
| `vaul` | ^1.1.2 | Mobile drawer | Mobile planner panels |
| `framer-motion` | ^12.41.0 | Animation | Shell + marketing components |
| `sonner` | ^2.0.7 | Toasts | Save confirmations, errors |
| `@puckeditor/core` | 0.22.0 | Visual block editor | Admin svg-editor |
| `sharp` | ^0.35.2 | Image processing (server) | Thumbnails |
| `@resvg/resvg-js` | ^2.6.2 | SVG → PNG (server) | Pipeline |
| `svgo` | ^4.0.1 | SVG optimisation (server) | Pipeline |
| `dompurify` | ^3.4.11 | SVG sanitisation (server) | Pipeline |
| `@flatten-js/core` | ^1.6.12 | Geometry math (server) | SVG compilation |
| `polygon-clipping` | ^0.15.7 | Boolean polygon ops (server) | SVG compilation |
| `tailwind-merge` | ^3.6.0 | CSS class merging | `cn()` utility |
| `html2canvas` | ^1.4.1 | HTML → canvas | pdfExport.ts (KEEP) |
| `@svgdotjs/*`, `html-to-image`, `motion`, `motion-utils` | — | — | **Removed in 00A** |
