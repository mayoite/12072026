# Module layout — where code should live

**Status:** Proposed (execution authority for **new** code)  
**Authority:** [`Plans/Planner-track/CONSTRAINTS.md`](../../Plans/Planner-track/CONSTRAINTS.md) → **this file** → `AGENTS.md` → [`02-DOMAINS.md`](02-DOMAINS.md)  
**Index:** [`README.md`](README.md) · [`docs/Lockedfiles/INDEX.md`](../Lockedfiles/INDEX.md)  
**UI contract:** [`03-MODULE-UI-CONTRACT.md`](03-MODULE-UI-CONTRACT.md) · [`04-CSS-SOLUTION.md`](04-CSS-SOLUTION.md)  
**Locked overlay:** [docs/Lockedfiles/01-planner-current.md](../Lockedfiles/01-planner-current.md) · engines [docs/Lockedfiles/03-dependencies-engines-current.md](../Lockedfiles/03-dependencies-engines-current.md)

---

## Problem

`site/` mixes **routes**, **features**, **marketing components**, and **legacy planner** in overlapping trees. New modules land in the nearest folder and drift follows.

Typical confusion today:

| Question | Today (haphazard) |
|----------|-------------------|
| Where is the planner workspace? | `features/planner/editor/` (+ `project/` model/persist) |
| Where is state? | `project/store/` **and** top-level `features/planner/store/` (domain/legacy dual) |
| Admin SVG editor? | `features/planner/admin/svg-editor/` + thin `app/admin/svg-editor/` |
| Marketing UI? | `components/home/` **and** `features/site-assistant/` |
| CSS for planner? | `app/css/core/locked/planner/` (`open3d-workspace.css`, `workspace-*.css`) |

---

## Target map (one rule per layer)

```text
site/
├── app/              → Routes only (thin pages, layouts, API route handlers)
├── features/         → Product domains (logic + domain UI)
├── components/       → Site marketing / shared presentational UI
├── lib/              → Pure TS, site-data, auth helpers (no feature screens)
├── platform/         → DB + Supabase clients
├── app/css/          → All styles (see 04-CSS-SOLUTION.md)
├── tests/            → Mirrors features/ (never co-located under features/)
├── config/           → Route contracts, build config
├── i18n/             → Messages
├── public/           → Static assets
└── scripts/          → Tooling
```

**Do not add** `site/modules/`, `site/src/`, or parallel trees without a plan revision.

---

## Layer rules

### 1. `app/` — routes and HTTP only

| Subfolder | Holds | Must not hold |
|-----------|--------|----------------|
| `app/(site)/` | Marketing page shells | Business logic, heavy components |
| `app/planner/` | Planner route entries, layouts, metadata | Editor panels, canvas logic |
| `app/admin/` | Admin route entries | Puck registry, compilers |
| `app/api/` | Route handlers | Zod schemas + services live in `features/` or `lib/` |

**Live routes:** `app/planner/(workspace)/guest/page.tsx` · `canvas/page.tsx` → `PlannerHost` from `features/planner/ui/`.  
**Legacy:** `/planner/open3d` · `/planner/fabric*` → **301** `/planner/canvas/` only (no product page tree).

**Max thickness:** import a feature view, pass `searchParams`, set `dynamic` / `metadata`.

```tsx
// Good — app/planner/(workspace)/guest/page.tsx (or canvas/)
import { PlannerHost } from "@/features/planner/ui/PlannerHost";
export default function Page(props) { return <PlannerHost ... />; }
```

---

### 2. `features/` — vertical domains

Top level = **product area**, not technology:

| Folder | Owns |
|--------|------|
| `features/planner/editor/` | **Live shell** — `OOPlannerWorkspace`, rails, panels |
| `features/planner/canvas/` | **Live Fabric 2D** (`PlannerFabricStage` as `PlannerCanvasStage`, testid `planner-fabric-stage`) |
| `features/planner/3d/` | Live Three viewer |
| `features/planner/project/` | Model, store, persistence, placement catalog, `canvas-stage` re-export |
| `features/planner/ui/` | Route hosts (`PlannerHost`, `PlannerWorkspaceRoute`) |
| `features/planner/landing/` | Planner marketing pages |
| `features/planner/admin/` | Admin **views** for planner domain (svg-editor, catalog admin) |
| `features/planner/_archive/` | **Historical only** if present. **No** `canvas-feasibility`. **No new code** under `_archive/` |
| `features/catalog/` | Site catalog — [`02-DOMAINS.md`](02-DOMAINS.md#catalog-three-authorities) |
| `features/crm/` | CRM — [`02-DOMAINS.md`](02-DOMAINS.md#crm) |
| `features/ops/` | Ops UI — [`02-DOMAINS.md`](02-DOMAINS.md#ops) |
| `features/shared/` | Cross-domain auth / dashboard — [`02-DOMAINS.md`](02-DOMAINS.md#auth) |
| `features/site-assistant/` | Marketing bot — [`02-DOMAINS.md`](02-DOMAINS.md#ai--assistant) |
| `features/ai/` | Shared AI advisors — [`02-DOMAINS.md`](02-DOMAINS.md#ai--assistant) |
| `features/portal/` | Portal-specific (if not under planner) |

#### Inside live layout

| Folder | Owns |
|--------|------|
| `editor/` | Workspace shell, panels, hooks (`useWorkspaceCanvas`), `*.module.css` |
| `canvas/` | `PlannerFabricStage` implementation |
| `3d/` | Three viewer + orbit defaults |
| `project/model/` | `PlannerProject`, actions, invariants |
| `project/store/` | History, selection, preferences |
| `project/lib/commands/` | `PlannerCommand` — **exists; not yet wired through `useWorkspaceCanvas`** |
| `project/persistence/` | Save/load, autosave, guest repo |
| `project/catalog/` | Search, loader, SVG consumer |
| `project/canvas-stage/` | Re-exports Fabric `PlannerCanvasStage` from `canvas/` |
| `project/shared/` | Export/import, document bridge |
| `project/ai/` | Project-scoped AI |
| `ui/` | Route host adapters **used only by planner routes** |

**New planner workspace code → `editor/` · `canvas/` · `3d/` · `project/` · `ui/`.**  
**No** product `open3d/` or `workspace/` folder. No new code under `_archive/`.

#### Dual top-level trees (honest)

Top-level `features/planner/{catalog,model,store}` serve domain/API/tools — **not** a second plan host. Do not invent `canvas-feasibility`.

---

### 3. `components/` — marketing & site chrome

| Holds | Examples |
|-------|----------|
| Homepage sections | `components/home/` |
| Site chrome | `components/site/` |
| Generic UI atoms | `components/ui/` |
| Product marketing | `components/products/` |

**Must not hold:** planner workspace panels, admin CRUD logic, API clients.

**Rule:** If it only appears on `(site)` marketing routes → `components/`. If it's planner product → `features/planner/project/`.

---

### 4. `lib/` — shared non-UI logic

- `lib/site-data/` — copy, nav, route chrome rules  
- `lib/auth/` — session helpers  
- `lib/catalog/` — catalog adapters  
- `lib/api/` — browser API helpers  

No React screens. No `*.module.css`.

---

### 5. Styles — never mirror `features/` as folders

All CSS under `app/css/` per [`04-CSS-SOLUTION.md`](04-CSS-SOLUTION.md). Feature code references tokens via layout bundles — does not get `features/planner/project/css/`.

---

### 6. Tests — mirror `features/`, never co-locate

```text
site/features/planner/editor/InventoryPanel.tsx
site/tests/unit/features/planner/editor/InventoryPanel.test.tsx  ← if needed
```

Enforced by `test:layout:check`.

---

## Admin: two folders, one contract

| Layer | Path | Role |
|-------|------|------|
| Routes | `app/admin/**` | `page.tsx`, metadata, auth gate; `[id]` may host `<Render>` preview |
| Views | `features/planner/admin/**` | Page views, svg-editor, list views |

**On disk today:** svg-editor `[id]` is a bespoke schema-driven no-code form with a debounced server-compiled preview. It is not a JSON editor and does not mount `<Puck>`. The Puck registry remains for portal rendering and legacy adapters. Quality work continues in [Admin A4](../../Plans/Admin-track/A4-no-code-svg-studio.md).

**New admin screen:** route in `app/admin/`, view in `features/planner/admin/` (or `features/crm/` for CRM-only).

---

## Data & descriptors

| Asset | Location |
|-------|----------|
| Block descriptors (disk) | `site/block-descriptors/` (today) — OK for 1B |
| Generated public SVG | `site/public/svg-catalog/` |
| Catalog static JSON | `lib/site-data/` or ingest scripts |

Dual models until migration: `BlockDescriptor` (loader consumer) + `SvgBlockDefinitionV1` (admin/compiler authority). Bridge in 1B publish adapter.

**SVG compile (honest):** API may call `svgPipelineRunner` (exec `generate-svg.mjs`) **or** tests use in-process `svgCompiler.server.ts` — unify behind API in 1B.

---

## What feels haphazard today (honest audit)

| Issue | Proposed fix | Phase |
|-------|--------------|-------|
| Dual planner trees (`project/*` vs top-level catalog/model/store) | New host code → `editor`/`canvas`/`3d`/`project`/`ui` only | **Now** |
| `useWorkspaceCanvas` bypasses `PlannerCommand` | Wire `executePlannerCommand` in dispatch path | **1A P0** |
| `features/planner/ui` hosts | Keep under `ui/`; no product `open3d/ui` | Done |
| `app/css/ooplanner/` | Folded into `core/locked/planner/workspace-*.css` | Done (2026-07-07) |
| `components/` vs `features/shared/components` | Marketing → `components/`; auth badges → `features/shared/` | Ongoing |
| Admin authoring | Schema-driven no-code form + real compiled preview | A4 templates, history, drafts, validation, a11y |
| Dual SVG compile paths | Single module authority behind publish API | 1B |

---

## New module decision tree

```text
Is it a URL/route?
  yes → app/{surface}/...
Is it planner workspace / catalog / save path?
  yes → features/planner/{editor|canvas|3d|project|ui}/...
Is it admin UI for planner/SVG?
  yes → features/planner/admin/ + app/admin/.../page.tsx
Is it marketing / homepage?
  yes → components/... or features/planner/landing/
Is it CRM?
  yes → features/crm/ + app/admin/crm or app/crm
Is it pure logic shared everywhere?
  yes → lib/
Is it DB?
  yes → platform/
```

Label PRs: `[surface]/[layer]/[module]` (same as [`03-MODULE-UI-CONTRACT.md`](03-MODULE-UI-CONTRACT.md)).

---

## Enforcement (lightweight)

| Gate | Catches |
|------|---------|
| `test:layout:check` | Tests co-located under `features/` |
| `lint:ui` / `lint:ui:strict` | Styling drift in new modules |
| Icon policy tests | Lucide/emoji in planner workspace chrome |
| `plannerCommandBoundary.test.ts` | Direct `dispatchOpen3dAction` outside allowlist |
| `plannerCommandWiring.test.ts` | `useWorkspaceCanvas` must use command seam (red until wired) |

**Optional script:** fail CI if new product files invent `features/planner/open3d/` or a second plan host.

---

## Expert review?

**No** for this layout doc — coordinator + disk audit.  
**Optional** if you plan a **large folder move** (rename/migrate) — map import graph before cutover.
