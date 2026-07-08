# Planner — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** `Plans/01-execution/core/00-REVISION.md` · [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) · [`docs/architecture/README.md`](../../architecture/README.md)

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Phase split | **1A** = Open3D shell on pilot route; **1B** = SVG publish path — do not block 1A on full Puck publish | `site/features/planner/open3d/` | `Plans/01-execution/core/00-REVISION.md` Decision 2 |
| Production routes | `/planner/guest`, `/planner/canvas` remain deployable Fabric until Open3D promoted (Phase 2) | Fabric archive + workspace routes | `implementation-decisions.md` |
| Pilot route | `/planner/open3d` — **real pilot** (`site/app/planner/open3d/page.tsx` → `Open3dPlannerHost`); sole Phase 1 promotion target; not deploy-ready until 1A acceptance | `site/features/planner/open3d/` | `Plans/01-execution/core/02-PHASE-1.md`, `open3d/README.md` |
| Rollback | Explicit Fabric mirror routes kept through stabilization | `_archive/fabric/` | `implementation-decisions.md` |
| Marketing | Marketing only; not workspace | `features/planner/landing/` | — |
| Code ownership | Production code under `site/features/planner/`; `OOPlanner/`, `open3d-next-staging/` are lab/archive mirrors only | `site/features/planner/open3d/` | `AGENTS.md`, `MODULE-LAYOUT.md` |
| Engines | Only Fabric + Three/r3f; no second canvas library | `PACKAGES.md` | `Plans/01-execution/core/01-START.md` §5 |
| Commands | **P0:** All document mutations through typed `PlannerCommand` + `executePlannerCommand`; zundo on document commands only — **wiring gap:** `useWorkspaceCanvas` still calls `dispatchOpen3dAction` directly | `open3d/lib/commands/` | `Plans/01-execution/core/02-PHASE-1.md` §4, `Plans/01-execution/core/04-HANDOVER.md` |
| CSS | Semantic `--planner-*` tokens; static presentation in CSS Modules | `site/app/css/core/locked/planner/` | `Plans/01-execution/core/01-START.md` §4 |
| UI execution | **Layer → surface → module**; module contract; no cross-surface sprint | open3d editor | [`ui/MODULE-UI-CONTRACT-Locked.md`](../ui/MODULE-UI-CONTRACT-Locked.md), [`ui-execution/proposed.md`](../ui-execution/proposed.md) |
| UI benchmark | Bottom command surface; catalog ≤24; Phosphor-only planner chrome; inventory left / layers contextual | open3d editor | `benchmark-summary.md` REC-02/03 |
| Plans | UI/SVG acceptance → `Plans/01-execution/core/`; executor pins → `implementation-decisions.md` | `Plans/01-execution/core/`, `Plans/00-governance/` | `handover-routing.md` |
| Promotion | Guest/canvas unchanged until Phase 2 after **1A + 1B** on one revision | — | `00-REVISION.md` |

## Packages (proposed per plan)

**Authority:** `Plans/01-execution/core/00-REVISION.md` · **1A** = shell · **1B** = catalog SVG consume only in planner chunks

| Package | Phase | Policy |
|---------|-------|--------|
| `fabric@7.4.0` | prod | Guest/canvas until Open3D promoted (Phase 2) |
| `three`, `@react-three/fiber` | 1A lazy | 3D after explicit activation; no third engine |
| `@react-three/drei` | Tier-2 | Document in PACKAGES or remove until 3D proof |
| `zustand`, `zundo` | 1A | State + document undo via `PlannerCommand` only |
| `@tanstack/react-query`, `fuse.js` | 1A | Catalog ≤24 results (REC-02) |
| `sonner` | 1A | Operation feedback |
| `@phosphor-icons/react` | 1A | **Exclusive** planner chrome — remove Lucide from open3d |
| `framer-motion` | 1A | Shell only — not canvas objects |
| `react-resizable-panels` | 1A | Prefer over custom docking OR document exception |
| `vaul` | Phase 2 | Mobile drawers |
| `zod` | 1A | Commands + preferences |

**Excluded from `/planner/open3d` chunks:** `@puckeditor/core`, `@svgdotjs/*`, `svgo`, `@resvg/resvg-js`, `sharp`, `dompurify`, admin compiler, `lucide-react`.

## 1A acceptance (pilot route only)

Room → opening → place → edit → undo/redo → save → reload on `/planner/open3d`; route containment; tokens; no page scroll; evidence under `results/`. **Not** 1A gates: full Puck editor, Supabase revision table, guest/canvas promotion.
