# Planner Governance & Implementation Decisions

Date: 2026-07-04

## Authority order

1. Repository and system instructions.
2. `AGENTS.md` internal rules.
3. This file (`implementation-decisions.md`) is the planner project's source-of-truth.
4. Phase plans bind here. Active: `plan-foundation.md`, `plan-delivery.md`, `plan-closeout.md`. Full specs: `archive/plans/2026-07-05_phase1-execution/phases/`.

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

- `puckBlockRegistry` — single registry, declared at `site/features/planner/admin/svg-editor/puckBlockRegistry.tsx` (Phase 04); portal imports via a one-line alias at `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts` (Phase 05). The alias re-exports the canonical registry verbatim — no forked copy. Phase 07's auth boundary tests the alias plus the canonical path resolve to the same exported type. (GS filter: no drift allowed; cite benchmark + anti-copy + 5-product for UI: plans/2026-07-04_global-standard-revision/benchmark-summary.md BP-04/BP-05 + design §7/11 + anti-copy rule.)
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
- ~~R2 bucket name for PNG thumbs (`site-block-thumbs/...`).~~ **Resolved 2026-07-04**: R2 bucket `site-block-thumbs/` is approved by the coordinator and locked across Phases 03, 04, 05, 08, and 10 (see each phase's checklist for the per-phase ownership line). Approved by: Coordinator agent on 2026-07-04. Reason: aligns with the dual-output rule (SVG → public/svg-catalog/, PNG → R2 `site-block-thumbs/`) and uses the existing `catalog_snapshot_upload_r2.ts` helper. Cross-link: Failures.md (active) + resolved-failures.md (history) — PLAN-FAIL-0407 (Resolved). (Consolidated 2026-07-05 to 2 files only.)

## Global Standard Framework (Binding)

Every package, SVG pipeline, feature, and UI decision **must** cite at least one principle from the 2026-07-04 benchmark report.

Anti-copy rule is release-blocking: only semantic tokens from `site/app/css/`. No donor or competitor trade dress, exact geometry, palettes, or composition without documented justification + dated benchmark report.

5-product reference model is mandatory for any UI/UX/SVG/feature benchmarker.

<!-- GS justification (0415 enforced benchmark gate + 0420 packages gate): per design spec §6/10 + benchmark BP-01..07 + QUALITY-GATES Global Standard Gate; every change (e.g. Tier-2 like drei) requires fresh report + anti-copy + review per REVIEW-WORKFLOW before any I-D/PACKAGES update. 0415/0420 tracked in FAILURESPLAN. Provisional per design §16. -->

Global Standard Gate (new in quality-gates.md): Before "Implemented" on relevant work:
1. Fresh dated benchmark report exists.
2. Independent UI review (REVIEW-WORKFLOW) signed off.
3. Anti-copy + pattern attestation in Decision Log.

Applies to Phases 03, 04, 05, 06, 10 and all package/SVG/feature changes.

## UI/UX Standards (Intensified)

- **Minimize UI & Panel Grammar** (Figma UI3): Explicit hide/collapse/minimize on every panel. Small-screen = overlay + backdrop + one-active-panel. Matches current WorkspaceShell/PanelContainer/TopBar work.
- **Inventory & Search** (Sketchfab): Cursor-only pagination (≤24 items), facets (category, license, state, staffpicked, downloadable). p95 budgets per QUALITY-GATES.
- **Non-Canvas Command/Error Surface** (AutoCAD Web): Docked or contextual, keyboard + live regions.
- **Catalogue-first + 2D↔3D Continuity** (Planner 5D + Floorplanner): Default layout starts with inventory. Recoverable transitions.
- **Per-object Properties** (Floorplanner): Double-click or equivalent for extended properties.
- Small-screen/hybrid panel wiring is baseline — future changes must evolve it, not regress it.

Phases 04/05/06/10 must add "UI Global Standards Gate" checklist items.

## SVG/Features/Packages Mandates

- Strict Option A lock for SVG: `@flatten-js/core` → `polygon-clipping` → `svgo` → `@resvg/resvg-js`. No deviations without new benchmark justification.
- Contract with Phase 02: Generated SVG/PNG must match `BlockDescriptor` geometry and `resolveBlocks()` output (explicit + synthesised paths). ViewBox, dimensions, and IDs deterministic.
- Global Standard + UI/UX compliance for generated assets and previews.
- Catalogue-first + search parity (Sketchfab) for inventory.
- Locked packages with "Global Standard Package Review" gate (benchmark justification + anti-copy attestation required for any change).
- Tier-2 re-evaluation before activation in Phase 06/09.

### Global Standard Package Review (enforcement for 0420 + 0415)
Procedure (static + gate enforced; cite design spec §6 + benchmark):
1. Before any I-D/PACKAGES edit or Tier change (incl. drei, fabric pin): produce/update dated benchmark report citing relevant BP/REC (e.g. BP-04/06).
2. Run agent review workflow (REVIEW-WORKFLOW) with explicit GS-SCORE on packages/features.
3. Add anti-copy attestation + 5-product justification + design §6 cite to Decision Log here + PACKAGES.md + affected phase.
4. Phase/I-D update only after checklist pass (see phases/04/05/06 Global Standard Gate sections).
No silent changes; justification gate is release-blocking per QUALITY-GATES. Tracked PLAN-FAIL-0420/0415. Provisional (design §16).

## Decision Log (2026-07-04 Global Standard Revision)

- D2026-07-04-GS-01: Added binding Global Standard Framework (design §6) + UI/UX + Mandates + Package Review procedure. 2026-07-04 8-agent dispatch + this impl: phases 04/05/06 now have actual UI GS Gate + Global Standard Gate (Binding) enforcement checklists (0415/16/20); I-D/PACKAGES strengthened with explicit justification gate steps + design §6 cites. GS 0415/16/19/20 advanced to static enforcement (doc+code checks). All provisional (shell block + design §16 live). See Failures.md (active failures) + resolved-failures.md. (plans/2026-07-05_phase1-execution/FAILURESPLAN.md archived 2026-07-05; only 2 files now.) Cross-refs: design §6, plans/2026-07-04_global-standard-revision/benchmark-summary.md BP-*.
