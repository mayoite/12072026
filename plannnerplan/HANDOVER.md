# Planner Handover (Live)

Date: 2026-07-04

## Current status at a glance

| Item | Status |
|---|---|
| Engines locked | Fabric 7.4.0 (2D), Three.js r185 + r3f (3D) |
| New packages | `pnpm add` not yet run for SVG pipeline + admin panel set |
| Admin SVG-editor | Planned (`/admin/svg-editor`, gated by `withAuth`) |
| Portal preview | Planned (`/portal/svg-catalog/[slug]`) |
| Planner consumer | Planned (`svgBlockDescriptorLoader`) |
| Block descriptor persistence | JSON-on-disk v1; R2 PNG thumbs |
| Live routes | /planner/guest + /planner/canvas = Fabric (deploy); /planner/open3d = pilot; /planner/fabric/* = rollback drill |

## Phase status table

| Phase | Status | Owner |
|---|---|---|
| 01 Engine Lock & Workspace Bootstrap | Planned | Build |
| 02 Catalog Source of Truth + BlockDescriptor | Planned | Catalog |
| 03 SVG Pipeline (Option A) | Planned | SVG |
| 04 Admin Portal SVG Editor | Planned | UI |
| 05 Portal Public Render | Planned | UI |
| 06 Planner Inventory + Symbol Consumer | Planned | Planner |
| 07 Auth and Permissions | Planned | Identity |
| 08 Persistence and Migration | Planned | Persistence |
| 09 3D Lazy, Export, AI | Planned | 3D |
| 10 Route Swap, Cleanup, Handover | Planned | Coordinator |

## Architecture snapshot

Admin JSON → Zod BlockDescriptor validated → `scripts/generate-svg.mjs` runs Option A pipeline (`@flatten-js/core` → `polygon-clipping` → `svgo` → `@resvg/resvg-js`) → outputs to `public/svg-catalog/{slug}.svg` (small, runtime-served) + R2 `<bucket per IMPLEMENTATION-DECISIONS.md>/{slug}.png` (CDN-cached imagery) → portal `<Puck.Render>` mounts at `/portal/svg-catalog/[slug]` → planner `features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts` reads registered descriptors → catalog/symbol consumers update.

## Modified files (this session)

- `IMPLEMENTATION-DECISIONS.md` — locked package set, route map
- `QUALITY-GATES.md` — coverage, accessibility, performance gates
- `DESIGN-BENCHMARK-PROTOCOL.md` — benchmark protocol (refreshed)
- `FAILURESPLAN.md` — failure index (re-id to 4xxx range)
- `HANDOVER.md` (this file) — live status

## Open items

- pnpm add for the locked package set.
- `scripts/generate-svg.mjs` skeleton.
- Zod `BlockDescriptor` schema location to be confirmed in Phase 02 — recommend `features/planner/open3d/catalog/svg/svgTypes.ts`.
- R2 bucket name to be confirmed by persistence agent for Phase 08 migration evidence.
- **Phase 00 status (2026-07-04T11:40Z)**: R2 authority consolidated (PLAN-FAIL-0410 Resolved). Remaining blocker is PLAN-FAIL-0411 — `any` in `site/scripts/*` and `eslint-disable-next-line` in `site/components/*` and a planner hook/view. Resolution path: narrow exception inventory under AGENTS.md type-safety rules, OR scope-reset the §00-PRE-02 scan (these are scripts/UI, not converted-planner code). See `benchmarks/phase-00-precheck.md`.

## Upcoming execution (next prompt cycle)

- Phase 01 install sequence (single `pnpm add --filter oando-site fabric@7.4.0 three @react-three/fiber @flatten-js/core polygon-clipping svgo @resvg/resvg-js @puckeditor/core @ark-ui/react react-aria-components zod @phosphor-icons/react @vercel-labs/json-render`).
- Phase 02 first author: BlockDescriptor Zod schema and `Open3dCatalogClient` adaption.
- Phase 03 `scripts/generate-svg.mjs` minimum-viable script with 3 fixture blocks.

## Forbidden without explicit ask

- Do NOT commit in `D:\new` (work happens in `D:\oandO04072026`).
- Do NOT delete `_archive/fabric/` mirrors (Phase 10 cleanup gate).
- Do NOT enable `@vercel-labs/json-render` yet — Tier-3 reserved, install but inactive.
- Do NOT add Mantine — Plan-Mantine question resolved as deferred.
