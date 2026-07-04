# Planner Governance & Implementation Decisions

Date: 2026-07-04

## Authority order

1. Warp Rule 1 (top) — all commands, tests, sub-agents may run without explicit per-call permission.
2. AGENTS.md internal rules apply within documents.
3. This file (IMPLEMENTATION-DECISIONS) is the planner project's source-of-truth.
4. Phase files (plannnerplan/phases/**) bind to this file; conflicts go here.

## Non-negotiable release dimensions

Build and validate in dependency order. Each dimension is release-blocking.

1. Workflow integrity, data safety, auth correctness.
2. Drawing-tool and geometry correctness.
3. UX and accessibility.
4. UI structure and responsive layout.
5. Inventory architecture and arrangement.
6. Dockable, movable, recoverable toolbars/panels.
7. Visual outlook, consistency, performance.

## Status vocabulary (use only these words)

Planned, Implemented, Verified in staging, Promoted, Verified in production path, Piloted, Accepted, Deferred/blocked.

Lack of permission to run a check allows `Implemented`, never `Verified`/`Accepted`.

## Live routes (2026-07-04)

| Route | Stack | Notes |
|---|---|---|
| /planner/guest | Fabric 7.4.0 | Deployable production |
| /planner/canvas | Fabric 7.4.0 | Deployable production |
| /planner/open3d | Native Open3D | Pilot only — not deploy-ready |
| /planner/fabric/guest, /planner/fabric/canvas | Fabric mirror | Rollback drill |
| /admin/svg-editor (NEW) | Puck + Ark UI | Member-gated via withAuth |
| /admin/svg-editor/[id] (NEW) | Puck + Ark UI | Member-gated |
| /portal/svg-catalog (NEW) | Puck.Render | Public preview |
| /portal/svg-catalog/[slug] (NEW) | Puck.Render | Public per-block |

## Locked package set (2026-07-04)

Engines (only two):
- `fabric` 7.4.0 — 2D canvas runtime + `loadSVGFromString`
- `three` ^0.185.1 + `@react-three/fiber` — 3D renderer (r3f is React binding, not a third engine)

SVG pipeline (Option A — authoritative):
- `@flatten-js/core` — measure / closest-point / perimeter
- `polygon-clipping` — Martinez booleans
- `svgo` — path optimization
- `@resvg/resvg-js` — PNG thumbnails (no Chromium, pure Rust)

Admin portal layer:
- `@puckeditor/core` — visual composer
- `@ark-ui/react` — headless primitives (state-machine via Zag.js)
- `react-aria-components` — combobox / date-picker / a11y gap fill
- `zod` — block descriptor schema (admin writes + planner reads)
- `@vercel-labs/json-render` — AI-returned UI trees (Tier-3 reserved for v1; installed but inactive)
- `@phosphor-icons/react` — icon system

Architecture: admin JSON → Zod BlockDescriptor → `scripts/generate-svg.mjs` runs Option A pipeline → R2 PNG thumbs + `public/svg-catalog/*.svg` → portal `Puck.Render` mounts ≤ 1 per admin/portal route → planner `svgBlockDescriptorLoader` reads registered descriptors → catalog/symbol consumers.

Module paths (canonical, post-critique alignment):

- `puckBlockRegistry.ts` — single registry, declared at `features/planner/admin/puckBlockRegistry.ts` (Phase 04); portal imports via a one-line alias at `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts` (Phase 05). The alias re-exports the canonical registry verbatim — no forked copy. Phase 07's auth boundary tests the alias plus the canonical path resolve to the same exported type.
- `BlockDescriptor` Zod schema — `features/planner/open3d/catalog/svg/svgTypes.ts` (Phase 02). Re-exported by `svgBlockDescriptorLoader.ts` at the same depth. No parallel schemas at admin, portal, or planner routes.

Phase ownership of `site/config/route-contract.json`: schema is owned by Phase 07 (auth gates); route paths are appended by Phase 04 (admin editor), Phase 05 (portal public), Phase 06 (inventory consumer reads). Schema drift between Phase 04 and Phase 07 fails Phase 07's `tsc --noEmit` lint gate.

## State ownership

- Canonical document: geometry, floors, openings, placed items, product/configuration snapshots, annotations, units, document metadata. The catalog symbol library at `features/planner/open3d/catalog/svg/svgSymbols.ts` is canonical.
- View state: active floor, selection, visibility, 2D camera, 3D camera, view mode. Persist only where explicitly specified.
- Workspace preferences: panel docking/layout, density, theme, inventory filters. User/browser/device scoped, separately versioned. Never canonical geometry.
- Transient session state: pointer gestures, drag previews, pending commands, ephemeral errors. Never persisted.

Invalid or off-screen preferences recover to safe default without changing document.

## Migration policy

- Never overwrite original by opening it.
- Immutable source backup before any conversion.
- Pure `fromVersion -> toVersion` migrations; deterministic, idempotent, fixture-tested.
- Conversion report: preserved, transformed, approximated, unsupported, failed entities.
- Atomic commit of converted data only after validation.
- Open-original/rollback retention during dual-read.

## Source of truth and promotion

- `open3d-floorplan/` is immutable donor.
- `site/features/planner/open3d/` is production source-of-truth for planner code.
- `OOPlanner/` and `open3d-next-staging/` are archive mirrors only.
- Promotion manifest required when moving to production.

## Coverage and code quality

- Target 95% statements/branches/functions/lines globally and per handwritten production file.
- Hard floor 90%; report progress toward target.
- No explicit `any`, no `@ts-ignore`, no `@ts-nocheck`, no ESLint-disable, no test skip, no coverage exclusion in handwritten converted scope.

## Decisions still requiring explicit owner approval

- Supported browser versions and secondary engine.
- Final performance budgets after baseline measurement.
- Background-image storage ownership and size limits.
- Guest-claim copy/move semantics and backup retention.
- Pilot cohort, telemetry boundaries, kill-switch owner, soak duration.
- ~~R2 bucket name for PNG thumbs (`site-block-thumbs/...`).~~ **Resolved 2026-07-04**: R2 bucket `site-block-thumbs/` is approved by the coordinator and locked across Phases 03, 04, 05, 08, and 10 (see each phase's checklist for the per-phase ownership line). Approved by: Coordinator agent on 2026-07-04. Reason: aligns with the dual-output rule (SVG → public/svg-catalog/, PNG → R2 `site-block-thumbs/`) and uses the existing `catalog_snapshot_upload_r2.ts` helper. Cross-link: `FAILURESPLAN.md` §'Active failure IDs' / §'Resolution history' — PLAN-FAIL-0407 (Resolved 2026-07-04, Coordinator agent).
