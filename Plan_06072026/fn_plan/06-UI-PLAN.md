# UI Plan — Revised (execution authority)

**Status:** Locked for execution  
**Supersedes:** Conflicting UI guidance in chat and stale `RESEARCH-2026-07-05-ui-*` where they disagree  
**Authority stack:** `00-REVISION.md` → **this file** → `docs/architecture/MODULE-UI-CONTRACT.md` → `05-UI-EXPERT-PLAN.md` (reference only)  
**Date:** 2026-07-05

---

## Long-run lock (why new modules drift)

Drift happens when a **new module** copies the nearest file instead of the contract. The fix is not a design-system sprint — it is **tokens + surface rules + module checklist + CI**.

| Mechanism | Long-run role |
|-----------|----------------|
| **Semantic tokens** | One vocabulary (`theme.css` → surface maps) |
| **Surface ownership** | Planner / admin / site each have different TSX/CSS rules |
| **Module contract** | Every new feature passes checklist — see `MODULE-UI-CONTRACT.md` |
| **CI `lint:ui`** | Drift fails the build (strict after UI-1 shell) |
| **Primitive extraction** | 3rd copy → `app/css/core/components/`; no upfront library |

**Rejected for Phase 1:** Option **F** (Storybook + 20 components). Option **E** (Mantine). Cross-surface UI sprint.

**Adopted:** Option **A** (token bridge) + **B** (CSS modules + layout primitives) + selective **C** (semantic Tailwind in admin only).

---

## Coordinator revisions (vs expert draft)

| Expert | Revised call | Reason |
|--------|--------------|--------|
| **One UI sprint for all surfaces** | **Rejected** | Blocks 1A; three dialects |
| **Option F design system** | **Rejected** | Wrong phase; extract primitives after modules stabilize |
| Ark Tabs in ThemeEditor (UI-2) | **CSS `admin-tabs` in UI-0** | Smallest drift fix |
| Collapse accent to `--color-primary` | **Yes** for open3d interactive chrome | Was split across `planner-shell.css` |
| UI-3 before 1B | **UI-3 after 1A** | Avoid double churn |
| `lint-ui-contract` warn-only | **Warn until UI-1 shell done; then `lint:ui:strict` in `release:gate:fast`** | Don't block 1A P0; lock before L3 modules |
| Rewrite marketing | **Out of scope until UI-3** | Site is reference, not pain point |

---

## Execution model: layer → surface → module

**Not** component-by-component across the repo. **Not** all surfaces at once.

```text
L0  Tokens + lint contract           UI-0
L1  Shell / chrome (frame)           UI-1 first
L2  Shared primitives (per surface)   Extract on 3rd use
L3  Feature modules                   One PR each
```

Label every task: **`[surface] / [layer] / [module]`**.

### Surface sequencing (locked)

| Phase | Surface | Product tie-in |
|-------|---------|----------------|
| UI-0 | Shared tokens + ThemeEditor outlier | L0 |
| UI-1 | **Planner open3d** only | 1A — L1 then L3 |
| UI-2 | **Admin** (Puck, svg-editor) | 1B |
| UI-3 | **Site marketing** (optional) | Post-1A |

Guest/canvas shells: **Phase 2** promotion only.

---

## One primary approach (locked)

**Token-first authored CSS** per `docs/architecture/CSS-SOLUTION.md`:

```text
theme.css → surface bundles → @utility/component CSS → CSS modules (open3d) → TSX structure
```

| Surface | TSX styling rule |
|---------|------------------|
| Site marketing | `typ-*`, scheme utilities; layout Tailwind OK |
| Admin | No raw palette; `admin-pages.css` + semantic utilities |
| Planner open3d | **No Tailwind in TSX**; CSS modules + `var(--planner-*)` only |

---

## Phases

### UI-0 — Token contract — **blocks 1A token gate** ✅

- [x] Plans filed; `MODULE-UI-CONTRACT.md` linked
- [x] `--planner-accent*` = `--color-primary`; `--planner-primary*` shim
- [x] `open3d/layout.tsx` → `open3d-workspace.css`
- [x] ThemeEditor + themes page on admin tokens
- [x] `admin-tabs`, `admin-btn`, `admin-alert--info` in `admin-pages.css`
- [x] `lint:ui` script (warn mode)
- [ ] `lint:ui:strict` wired to `release:gate:fast` — **after UI-1 shell**

### UI-1 — Open3d shell + modules — **with 1A P1/P2**

**L1 — Shell (must complete before L3 polish)**

| Module | Files | Acceptance |
|--------|-------|------------|
| Shell grid | `WorkspaceShell.tsx`, `workspace.module.css` | `100dvh`, no document scroll |
| Top bar | `TopBar.tsx` | Phosphor only |
| Tool rail | `CanvasToolRail.tsx`, `canvas-tool-rail.module.css` | Token heights |
| Status / command strip | bottom surface REC-03 | Visible at 1280×800 |
| Panel regions | docked layout; `react-resizable-panels` on desktop | Resize handle; persist widths |

**L3 — Feature modules (order locked)**

| Order | Module | Path |
|-------|--------|------|
| 1 | Inventory | `InventoryPanel.tsx`, `inventory.module.css` |
| 2 | Properties | `PropertiesPanel.tsx`, `properties.module.css` |
| 3 | Layers | `LayersPanel.tsx`, `layers-panel.module.css` |
| 4 | Command palette | `CommandPalette.tsx`, `command-palette.module.css` |

Each L3 PR: module contract checklist + `lint:ui` + no new hex in module CSS.

### UI-2 — Admin + Puck — **with 1B**

- `<Puck>` mount styling; svg-editor split layout
- Ark only for Puck field primitives if CSS insufficient
- All new admin routes: `admin-page` shell + contract checklist

### UI-3 — Autoadjustment — **post-1A**

- `@container` on inventory / properties
- `data-planner-density` comfortable / compact
- Fluid `--space-panel-*` tokens
- Site marketing: token reuse only; no new palette

---

## Enforcement timeline

| When | Gate |
|------|------|
| Now | `lint:ui` (warn); manual module checklist on PR |
| UI-1 shell accepted | `lint:ui:strict` → `release:gate:fast` |
| TEST-1 | `open3dIconPolicy.test.ts`; optional stylelint on open3d modules |
| Every new module | `MODULE-UI-CONTRACT.md` checklist in PR description |

---

## Execution order (agent)

1. **planner / L1 / shell** — frame before panels
2. **1A P0** `PlannerCommand` — parallel, not blocked by UI
3. **planner / L3 / inventory** — first feature module
4. **lint:ui:strict** + `release:gate:fast` wire — when shell passes acceptance
5. **planner / L3 / properties** → **layers** → **command palette**

---

## Acceptance

### UI-0 ✅

- No `slate-|blue-|zinc-` under `app/admin/themes`
- open3d layout loads workspace bundle
- ThemeEditor test passes

### UI-1 (1A visual gates)

- `/planner/open3d`: no page scroll; marketing chrome hidden
- Phosphor-only in `features/planner/open3d/**` (grep Lucide = 0)
- L1 shell complete before L3 modules signed off
- `lint:ui:strict` green
- Evidence: `results/site/phase1/ui-1/`

---

## What NOT to do

- Cross-surface UI sprint
- Option F / Mantine / second component library
- L3 module work before L1 shell stable
- Block 1A P0 command wiring on pixel polish
- New `--planner-primary*` in new code (accent only)
- Copy styles from guest/canvas or marketing into open3d
