# Dependencies & engines — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** `PACKAGES.md`, [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md), `implementation-decisions.md`, `Plans/P-track/START.md` §5  
**Per-domain breakdown:** each `*-proposed.md` has **Packages (proposed per plan)** with Phase 1A / 1B tags.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

## Runtime engines (locked)

| Engine | Package | Policy |
|--------|---------|--------|
| **2D** | `fabric@7.4.0` | Only 2D canvas runtime; guest/canvas + SVG load on canvas |
| **3D** | `three ^0.185.1` + `@react-three/fiber` | Only 3D renderer; lazy-loaded after explicit 2D activation |
| **3D helpers** | `@react-three/drei` | Tier-2 — document in PACKAGES or remove until 3D proof needs it |

No Paper, Konva, Pixi, Two.js, or second canvas engine.

## Node / toolchain

| Item | Policy |
|------|--------|
| Node | `>=24` (root engines) |
| pnpm | Workspace standard (`pnpm@11.9.0`) |
| Next / React | `^16.2.9` / `^19` |
| TypeScript | 6.x strict; no broad `any` in production |
| Planner dev | `next dev --webpack` until bundle audit says otherwise |

## Planner workspace (Tier-1)

| Package | Role |
|---------|------|
| `zustand` | Workspace, view, transient state |
| `zundo` | Document command history only |
| `@tanstack/react-query` | Remote catalogue |
| `fuse.js` | Client rank on loaded catalog |
| `sonner` | Operation feedback |
| `@phosphor-icons/react` | **Exclusive** planner chrome |
| `framer-motion` | Shell transitions only — not canvas objects |
| `react-resizable-panels` | Desktop/tablet panels (or one docking approach — pick one) |
| `vaul` | Mobile drawers (Phase 2) |
| `zod` | Commands, preferences, descriptors |

**Admin CMS:** `lucide-react` allowed; must not appear in open3d planner chunks.

## SVG & admin (Option A — Phase 1B)

| Package | Role |
|---------|------|
| `@puckeditor/core` | Admin compose + portal render |
| `@ark-ui/react` | Admin primitives |
| `react-aria-components` | Combobox / listbox gaps |
| `@flatten-js/core`, `polygon-clipping`, `svgo` | Server pipeline geometry |
| `dompurify` | Sanitize before SVGO |
| `@resvg/resvg-js`, `sharp` | Server raster only |
| `@svgdotjs/*` | **Not Phase 1** — remove from `package.json` when confirmed unused |

## Explicitly excluded from planner bundles

`@svgdotjs/*`, `svgo`, `@resvg/resvg-js`, `sharp`, `@puckeditor/core`, admin compiler paths, `@xyflow/react`, `gsap` (unless marketing-only routes), `swiper` (marketing only). Verify with bundle-boundary audit before **1A** sign-off.

## Package change gate

Any Tier move or new dependency: benchmark cite + update `PACKAGES.md` + implementation-decisions per Global Standard Package Review.

---

## Summary

Proposed state is **two engines, one SVG pipeline (Option A), planner runtime packages documented in tier tables**, and **no shadow dependencies** in open3d chunks. Admin may use Lucide; planner uses Phosphor only. Until cleanup PR ships, proposed doc is ahead of disk.

## Strengths

Clear engine boundary prevents canvas library sprawl. Option A avoids SVG.js operational cost. Tier gate ties deps to benchmark evidence. Separating admin CMS icons from planner icons is pragmatic.

## Weaknesses

Requires **cleanup PR**: remove unused `@svgdotjs/*`, reconcile drei/Lucide/XYFlow/GSAP/Swiper against tiers. **PACKAGES.md** needs planner runtime table sync. **1A / 1B acceptance pending.**
