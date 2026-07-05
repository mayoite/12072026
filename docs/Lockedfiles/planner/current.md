# Planner — current (locked)

**Baseline:** 2026-07-05

| Topic | On disk today | Paths | Docs |
|--------|---------------|-------|------|
| Production routes | `/planner/guest`, `/planner/canvas` — Fabric 7.4 | `site/app/planner/(workspace)/`, `features/planner/_archive/fabric/` | `implementation-decisions.md` |
| Pilot route | `/planner/open3d` — native Open3D shell (`app/planner/open3d/page.tsx` → `Open3dPlannerHost`) | `site/features/planner/open3d/` | `plann/02-PHASE-1.md`, `open3d/README.md` |
| Rollback | `/planner/fabric/guest`, `…/canvas` | Fabric archive | `implementation-decisions.md` |
| Marketing | `/planner`, `/planner/features`, `/planner/help` | `features/planner/landing/` | — |
| Code ownership | `open3d/` active pilot; Fabric in `_archive/fabric/` | `site/features/planner/` | `AGENTS.md` |
| Engines | Fabric 2D + Three/r3f 3D | `PACKAGES.md` | `plann/01-START.md` §5 |
| Commands | `plannerCommand.ts` exists; some mutations still via `updateProject` | `open3d/lib/commands/` | `plann/02-PHASE-1.md` §4 |
| CSS | Planner tokens + open3d workspace bundles | `site/app/css/core/planner/` | `plann/01-START.md` §4 |
| Plans | `plann/` product lane + `plans/01-phase1-execution/` governance | `plann/`, `plans/` | `plann/04-HANDOVER.md` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `fabric` | `7.4.0` | **Production** guest/canvas 2D engine |
| `three` | `^0.185.1` | Open3D + fabric 3D views |
| `@react-three/fiber` | `^9.6.1` | React 3D binding |
| `@react-three/drei` | `^10.7.7` | 3D helpers (installed; tier drift) |
| `zustand` | `^5.0.14` | Workspace / view state |
| `zundo` | `^2.3.0` | Undo (partial — commands not fully wired) |
| `@tanstack/react-query` | `^5.101.0` | Catalog fetch/cache |
| `fuse.js` | `^7.4.1` | Catalog search ranking |
| `sonner` | `^2.0.7` | Toasts |
| `@phosphor-icons/react` | `^2.1.10` | TopBar partial; unicode still in places |
| `lucide-react` | `^1.21.0` | **Drift** — should not be in open3d chrome |
| `framer-motion` / `motion` | `^12.x` | Shell transitions |
| `react-resizable-panels` | `^4.11.2` | In plan; open3d also uses custom docking |
| `vaul` | `^1.1.2` | Installed for Phase 2 mobile |
| `zod` | `^4.4.3` | Commands, preferences, descriptors |

**Open3D must not bundle:** Puck, SVG.js, svgo, resvg, sharp, admin compiler (boundary tests).

**Gaps:** Phosphor not everywhere; emoji/unicode in some chrome; command palette partial; layers IA vs benchmark.

---

## Summary

The planner is in a deliberate two-speed state. Guest and canvas on Fabric remain the deployable production path; Open3D is an active pilot with meaningful shell work already landed — route containment, semantic tokens, preference recovery, catalog hooks, and a large test surface. The gap between “looks like a workspace” and “CAD-grade editing” is mostly commands, tool behavior, and UI benchmark fit, not missing folders.

## Strengths

Clear ownership under `site/features/planner/open3d/` with explicit rollback Fabric routes. Token and CSS foundation is ahead of many greenfield pilots. Catalog and SVG consumer wiring (`svgBlockDescriptorLoader`, placement, inventory) give a credible path from admin output to canvas. Test coverage for open3d is broad relative to UI maturity. Plan revision (1A/1B) now matches this reality instead of blocking shell on full SVG publish.

## Weaknesses

`PlannerCommand` is defined but not authoritative — mutations still bypass it in places, so undo/history and audit story stay weak. Chrome uses mixed icon strategies and some unicode affordances that read amateur next to the benchmark target. Panel IA (inventory vs layers vs properties) does not yet match Floorplanner/Figma patterns from `plann/01-START.md`. Open3D is not deploy-ready and must not be confused with guest/canvas stability. Fabric archive aliasing in tests adds mental overhead for contributors.
