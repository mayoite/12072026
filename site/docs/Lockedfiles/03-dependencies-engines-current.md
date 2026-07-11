# Dependencies & engines — current (locked)

**Baseline:** 2026-07-05  
**Source of truth for pins:** `PACKAGES.md` + `site/package.json` (disk may drift — verify lockfile)  
**Revision alignment:** Option A locked in revision — **1B not accepted**; `@svgdotjs/*` still on disk unused.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/01-MODULE-LAYOUT.md`](../architecture/01-MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/03-MODULE-UI-CONTRACT.md`](../architecture/03-MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](./INDEX.md) |

**Per-module breakdown:** each `docs/Lockedfiles/<module>/current.md` has a **Packages (on disk)** section where relevant.

---

## Runtime engines (two-engine rule)

| Engine | Package | Pin (site) | Routes / role |
|--------|---------|------------|---------------|
| **2D canvas** | `fabric` | `7.4.0` (exact) | Live open3d/guest/canvas via `canvas-fabric-stage` (`PlannerCanvasStage`); not Feasibility |
| **3D** | `three` | `^0.185.1` | Open3D lazy 3D, product viewers |
| **3D React** | `@react-three/fiber` | `^9.6.1` | R3F bindings (not a third engine) |
| **3D helpers** | `@react-three/drei` | `^10.7.7` | Installed; `PACKAGES.md` lists Tier-2 reserved — **policy drift** |

No second general canvas engine (Konva, Paper, Pixi, etc.). Do not restore Feasibility as interactive host.

## Node / toolchain

| Item | Value | Where |
|------|-------|-------|
| Node | `>=24.0.0` | root `package.json` `engines` |
| Package manager | `pnpm@11.9.0` | root `package.json` |
| Framework | `next ^16.2.9`, `react ^19.0.0` | `site/package.json` |
| TypeScript | `^6.0.3` | devDependency |
| Dev bundler | `next dev --webpack` (default) | `site/package.json` scripts |

## Planner workspace (installed)

| Package | Pin | Used for |
|---------|-----|----------|
| `zustand` | `^5.0.14` | Workspace / view state |
| `zundo` | `^2.3.0` | Document undo (commands not fully wired) |
| `@tanstack/react-query` | `^5.101.0` | Server catalogue lifecycle |
| `fuse.js` | `^7.4.1` | Client-side catalog ranking |
| `sonner` | `^2.0.7` | Toasts |
| `@phosphor-icons/react` | `^2.1.10` | Planner icons (partial adoption in UI) |
| `lucide-react` | `^1.21.0` | Admin + some planner-adjacent — **policy drift** |
| `framer-motion` / `motion` | `^12.x` | Shell motion |
| `react-resizable-panels` | `^4.11.2` | Panel layout (open3d uses custom docking too) |
| `vaul` | `^1.1.2` | Drawers (Phase 2 mobile) |
| `@ark-ui/react` | `5.37.2` | Admin headless primitives |
| `react-aria-components` | `1.19.0` | Combobox / a11y collections |
| `zod` | `^4.4.3` | Descriptors, commands, validation |

## SVG pipeline (installed)

| Package | Pin | Used for |
|---------|-----|----------|
| `@flatten-js/core` | `^1.6.12` | Geometry helpers (Option A) |
| `polygon-clipping` | `^0.15.7` | Booleans (stale npm publish) |
| `svgo` | `^4.0.1` | Server optimization |
| `@resvg/resvg-js` | `^2.6.2` | PNG raster (server) |
| `sharp` | `^0.35.2` | Thumbnails (server) |
| `dompurify` | `^3.4.11` | Server SVG sanitization |
| `@puckeditor/core` | `0.22.0` | Admin registry + portal `Render` |
| `@svgdotjs/svg.js` + plugins | `^3.2.5` etc. | **Installed, unused** |

## Admin / site (also in bundle graph)

| Package | Pin | Notes |
|---------|-----|-------|
| `@radix-ui/react-*` | various | Site marketing + legacy UI |
| `@xyflow/react` | `^12.11.0` | Installed; not in tier table |
| `gsap`, `@gsap/react` | `^3.15` / `^2.1` | Marketing motion |
| `swiper` | `^12.2.0` | Carousels |
| `drizzle-orm`, `postgres` | — | DB access |
| `@supabase/ssr`, `@supabase/supabase-js` | — | Auth session |

---

## Summary

The repo runs **Next 16 + React 19 on Node 24+** with a deliberate **Fabric + Three** engine pair for planner production. Tier-1 SVG Option A packages are installed and partially wired. The dependency graph is **wider than locked policy**: SVG.js, Lucide in planner-adjacent paths, drei, XYFlow, GSAP, and Swiper sit in `package.json` without full tier documentation or bundle-boundary proof for open3d.

## Strengths

Fabric pinned exactly at `7.4.0`. Option A SVG stack is present with boundary tests. Modern stack (React 19, TS 6, pnpm workspace). Phosphor, Puck, Ark, RAC, and Zod align with admin/planner direction. Single monorepo lockfile for site + tech-stack-generator.

## Weaknesses

**Policy vs disk drift:** `@svgdotjs/*` unused; `@react-three/drei` installed vs Tier-2 in PACKAGES; Lucide coexists with Phosphor; XYFlow/GSAP/Swiper not in exclusion list. **polygon-clipping** is stale on npm. **Dual panel libraries** — `react-resizable-panels` vs custom `useDockingSystem` in open3d. **PACKAGES.md** incomplete for planner runtime. **1A bundle audit not accepted.**

---

## Licenses (thin — OPEN until verified)

**Owner buys** paid seats. Not an `ayushdocs/` file.

| Package | Notes |
|---------|--------|
| `fabric@7.4.0` | Live planner 2D |
| `three` / R3F | Planner 3D — no mid-wave thrash |
| `@google/model-viewer` | Admin/preview only |
| `gsap` | Site motion — confirm seat if commercial expands |
| `@fancyapps/ui` | Likely unused — [S1](../../Plans/Site-track/S1-deps-cleanup.md) |
| `@puckeditor/core` | Admin SVG |
| Supabase / Drizzle | Vendor ToS |

No plagiarism · no competitor assets · research = external `websites` only. Add row + owner OK before new paid deps.
