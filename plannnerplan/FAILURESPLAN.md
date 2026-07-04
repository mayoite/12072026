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
| PLAN-FAIL-0401 | Packages not yet installed (Fabric 7.4.0 already; new SVG + admin panel pending) | 01 | Build agent | Open |
| PLAN-FAIL-0402 | `scripts/generate-svg.mjs` not present | 03 | SVG agent | Open |
| PLAN-FAIL-0403 | Admin SVG-editor route not scaffolded | 04 | UI agent | Open |
| PLAN-FAIL-0404 | Portal Puck.Render preview not scaffolded | 05 | UI agent | Open |
| PLAN-FAIL-0405 | Planner svgBlockDescriptorLoader not wired | 06 | Planner agent | Open |
| PLAN-FAIL-0406 | Block descriptor Zod schema not exported alongside admin | 02 | Catalog agent | Open |
| PLAN-FAIL-0407 | R2 upload path for PNG thumbs not finalized | 04 | Build agent | Resolved |
| PLAN-FAIL-0408 | Pervasive coverage floor in OOPlanner (~58%) | 06 | Test agent | Open |
| PLAN-FAIL-0409 | No Supabase `block_descriptors` table; v1 JSON-on-disk | 08 | Persistence agent | Deferred |

## Cross-phase blockers (2026-07-04)

- Phase 01 (engine lock) and Phase 04 (admin editor) parallelize; both install packages first.
- `/admin/svg-editor` is gated by `withAuth` admin role (Phase 07).
- PNG thumbs must route through R2 (`site-block-thumbs/`), NOT `public/svg-catalog/` — see IMPLEMENTATION-DECISIONS.
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
