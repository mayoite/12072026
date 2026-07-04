# Planner Failures Plan

Date: 2026-07-04
Authority: IMPLEMENTATION-DECISIONS.md

## Purpose

Records plan-specific failures, blockers, skips, incomplete evidence, ownership, and resolution history.

## Status vocabulary

Use only: Planned, Implemented, Verified in staging, Promoted, Verified in production path, Piloted, Accepted, Deferred/blocked.

## Active failure IDs

| ID | Summary | Phase | Owner | Status |
|---|---|---|---|---|
| PLAN-FAIL-0401 | Packages not yet installed (Fabric 7.4.0 already; new SVG + admin panel pending) | 01 | Build agent | Resolved 2026-07-04 (Phase 01 executor) — 9/9 Tier-1 packages installed (Option A + admin + icons; `@vercel-labs/json-render` deferred per option A BLOCK-resolution; `fabric` strict-pin to 7.4.0; `three` bumped `^0.185.0`→`^0.185.1`). |
| PLAN-FAIL-0402 | `scripts/generate-svg.mjs` not present | 03 | SVG agent | Open |
| PLAN-FAIL-0403 | Admin SVG-editor route not scaffolded | 04 | UI agent | Open |
| PLAN-FAIL-0404 | Portal Puck.Render preview not scaffolded | 05 | UI agent | Open |
| PLAN-FAIL-0405 | Planner svgBlockDescriptorLoader not wired | 06 | Planner agent | Open |
| PLAN-FAIL-0406 | Block descriptor Zod schema not exported alongside admin | 02 | Catalog agent | Open |
| PLAN-FAIL-0407 | R2 upload path for PNG thumbs not finalized | 04 | Build agent | Resolved |
| PLAN-FAIL-0408 | Pervasive coverage floor in OOPlanner (~58%) | 06 | Test agent | Open |
|| PLAN-FAIL-0409 | No Supabase `block_descriptors` table; v1 JSON-on-disk | 08 | Persistence agent | Deferred |
| PLAN-FAIL-0410 | Phase 00 precheck §00-PRE-03 R2 scattered authority | 00 | Coordinator | Resolved 2026-07-04T11:40Z |
|| PLAN-FAIL-0411 | Phase 00 precheck §00-PRE-02 forbidden patterns (8 `: any` / `as any` sites in site/scripts/*; 5 `eslint-disable-next-line` annotations in site/components/home/{Hero,HomepageHero,KpiCounter}.tsx, site/features/planner/open3d/3d/ThreeViewerInner.tsx, site/features/planner/hooks/useAssetLoader.ts). Per AGENTS.md Type Safety rule scope — handwritten production + script code. Routing rule applies: ≥3 sites / ≥2 distinct file families → multi-agent fixup. Owner transferred 2026-07-04T12:21Z: from Lead → QA reviewers (3 exec-style agents per user rule, split by file-family: scripts-migrate+backup, scrape+seed, components+hooks). Lead's role: surface scope + hand off, not edit. Owner decision logged in phase-00-precheck.md §10. | 00 | QA reviewer-alpha (scripts family) + QA reviewer-bravo (components family) + QA reviewer-charlie (lint-disables) | Open — handed off |
| PLAN-FAIL-0412 | Phase 01 typecheck fails on pre-existing planner-type debt (TS2724 `_Open3d*` private re-exports across `features/planner/open3d/{3d,ai,catalog}/`; TS18048 `Open3dConfigurability|undefined` and `value|undefined` in `catalog/{catalogClient,inventory/inventoryIndex,unitConversion,assetValidation}.ts`) — 27 errors captured in `results/planner/phase-01/typecheck/typecheck-run.json`; not caused by Phase 01 install | 01 | Planner agent | Open (Phase 01 BLOCKED) |

## Cross-phase blockers (2026-07-04)

- Phase 01 (engine lock) and Phase 04 (admin editor) parallelize; both install packages first.
- `/admin/svg-editor` is gated by `withAuth` admin role (Phase 07).
- PNG thumbs must route through R2 (bucket per `IMPLEMENTATION-DECISIONS.md`), NOT `public/svg-catalog/`.
- Block descriptors v1 are JSON-on-disk at `site/block-descriptors/{slug}.json` with atomic-rename version rotation; Supabase deferred per IMPLEMENTATION-DECISIONS.

## Evidence integrity

All gate runs preserve artifacts under `results/<module>/<phase>/<cmd>/` per repository `testing-handbook.md`. Skipped/blocked/artifact-missing checks are not passes.

## Resolution history

- PLAN-FAIL-015/-016 (catalog schema/placement collision) — Resolved 2026-07-04 via BlockDescriptor Zod schema (Phase 02).
- PLAN-FAIL-017 (generatedAt=0) — Resolved 2026-07-04 via Zod date generation in BlockDescriptor schema.
- PLAN-FAIL-018 (missing SVG fixtures) — Owned by Phase 03 from 2026-07-04; 3-block fixture required by exit gate.
- PLAN-FAIL-003/-004 (Playwright verification) — Deferred behind Phase 06 host stability; explicit skip list in Phase 06/05.
- PLAN-FAIL-0407 (R2 upload path for PNG thumbs not finalized) — Resolved 2026-07-04 (Coordinator agent); see IMPLEMENTATION-DECISIONS §110.
- STAGING_PHASE_01A_RESIDUE — Resolved 2026-07-04 (Coordinator agent): STAGING_PHASE_01A_RESIDUE purge list is empty post-plan-rewrite; §10-CLN-05 reference was excised.
