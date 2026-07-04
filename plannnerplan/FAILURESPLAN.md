# Planner Failures Plan

Date: 2026-07-04
Authority: IMPLEMENTATION-DECISIONS.md

## Purpose

Records plan-specific failures, blockers, skips, incomplete evidence, ownership, and resolution history.

## Status vocabulary

Ledger statuses used in this file:

- `Open`
- `Open — handed off`
- `Open (Phase 01 BLOCKED)`
- `Resolved`
- `Verified-at-unit`

Planner phase promotion still uses the `IMPLEMENTATION-DECISIONS.md` vocabulary: `Planned`, `Implemented`, `Verified in staging`, `Promoted`, `Verified in production path`, `Piloted`, `Accepted`, `Deferred/blocked`.

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
| PLAN-FAIL-0409 | No Supabase `block_descriptors` table; v1 JSON-on-disk | 08 | Persistence agent | Deferred |
| PLAN-FAIL-0410 | Phase 00 precheck §00-PRE-03 R2 scattered authority | 00 | Coordinator | Resolved 2026-07-04T11:40Z |
| PLAN-FAIL-0411 | Phase 00 precheck §00-PRE-02 forbidden patterns (8 `: any` / `as any` sites in site/scripts/*; 5 `eslint-disable-next-line` annotations in site/components/home/{Hero,HomepageHero,KpiCounter}.tsx, site/features/planner/open3d/3d/ThreeViewerInner.tsx, site/features/planner/hooks/useAssetLoader.ts). Per AGENTS.md Type Safety rule scope — handwritten production + script code. Routing rule applies: ≥3 sites / ≥2 distinct file families → multi-agent fixup. Owner transferred 2026-07-04T12:21Z: from Lead → QA reviewers (3 exec-style agents per user rule, split by file-family: scripts-migrate+backup, scrape+seed, components+hooks). Lead's role: surface scope + hand off, not edit. Owner decision logged in phase-00-precheck.md §10. | 00 | QA reviewer-alpha (scripts family) + QA reviewer-bravo (components family) + QA reviewer-charlie (lint-disables) | Open — handed off |
| PLAN-FAIL-0412 | Phase 01 typecheck fails on pre-existing planner-type debt (TS2724 `_Open3d*` private re-exports across `features/planner/open3d/{3d,ai,catalog}/`; TS18048 `Open3dConfigurability|undefined` and `value|undefined` in `catalog/{catalogClient,inventory/inventoryIndex,unitConversion,assetValidation}.ts`) — 27 errors captured in `results/planner/phase-01/typecheck/typecheck-run.json`; not caused by Phase 01 install | 01 | Planner agent | Open (Phase 01 BLOCKED) |
| PLAN-FAIL-0413 | `BlockDescriptor` Zod schema lacks an optional `blocks: []` field — resolver currently reads it via `as { blocks?: unknown }` extension at the input boundary. Schema-extension is the cleanest seam so the cast at the resolver boundary can be removed. Crosses Phase 02 (resolver-test-author observed 2026-07-04) and Phase 06 (loader integrator). Owner transfer: Catalog (Phase 02) → Planner (Phase 06). Tracking reason + removal condition: extension of `BlockDescriptorCommonBaseSchema` with `blocks: z.array(BlockDescriptorViewBoxSchema.optional())` or equivalent typed shape; removal condition: resolver no longer needs the `unknown`-cast at its input boundary. | 02→06 | Catalog → Planner | Open — handed off |

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
- Phase 02 unit-test surface — Implemented + Verified-at-unit 2026-07-04 (resolver-test-author). Evidence at `results/qa/resolver/test-planner/` (test-planner-raw.log, test-planner-run.json, blocksResolver-focused-raw.log). 25/25 cases pass. Exit code 1 on the broader `pnpm --filter oando-site run test:planner` is pre-existing baseline (8 failures across `plannerAutosaveIdentity.test.tsx`, `catalog.test.ts`, `threeViewerInner.test.tsx`) — attributed in `run.json` and explicitly NOT in scope for this agent per Iteration Discipline.

## Outstanding items handed off

- **Phase 03 (pipeline integrator)**: synthesised-row semantics + `block-synth` id literal must be accepted or extended in `scripts/generate-svg.mjs`. Resolver does NOT export `DEFAULT_BLOCKID_PREFIX`. If Phase 03 needs the prefix externally, request a Phase-02 follow-up to expose it.
- **Phase 06 (loader integrator)**: see PLAN-FAIL-0413 above — extend `BlockDescriptorCommonBaseSchema` with an optional typed `blocks` array so the resolver's `unknown`-cast at its input boundary can be removed.

## 2026-07-04 Revision — Global Standard Intensification

Per approved design spec (`docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`; see also `plans/2026-07-04/benchmark.md` (or archived version in `plans/archive/2026-07-04/benchmark.md`) and `plannnerplan/critique/plan-revision-2026-07-04.md`): Structure in plans/2026-07-04/ and plannnerplan/ (incl. phases with BP-01..BP-07 alignments, governance) verified aligned to benchmark report (BP-01 engine pin/FACT-01/08, BP-02 schema/PLAN-FAIL-0406/0413, BP-03 SVG/Option A, BP-04 admin pkgs/REJ-06, BP-05 Puck limit/REC-01, BP-06 catalog/REC-02/04, BP-07 3D/REC-05; RECs/REJs/anti-copy per §3-6). Global Standard PLAN-FAIL-0415/0418/0419/0420 track benchmark gate + alignments.

- Added binding Global Standard Framework, UI/UX Standards, SVG/Features/Packages Mandates to IMPLEMENTATION-DECISIONS.md.
- New Global Standard Gate in QUALITY-GATES.md (release-blocking for Phases 03/04/05/06/10).
- Intensified REVIEW-WORKFLOW.md for explicit global standard scoring.
- Reality sync: Phase 02 resolver test (blocksResolver.test.ts, 25/25 pass, evidence in results/qa/resolver/test-planner/); hybrid routes (/planner/guest + /planner/canvas = Fabric live; /planner/open3d = pilot); small-screen panel wiring in progress (WorkspaceShell/PanelContainer/TopBar).
- Current tests incorporated: blocksResolver.test.ts (25/25), admin/catalog SVG tests (116 pass), Phase 03 generator restore smoke, sanitize test, route correction verified.
- Current blockers from Failures.md (2026-07-04): planner route naming correction (verified docs), Phase 04 admin SVG persistence (verified), Phase 03 generator/asset/sanitizer (verified), native Open3D not deployable (live routes restored to Fabric), native guest autosave continued.
- New/strengthened PLAN-FAIL entries below for global standard items. All new content marked **Provisional pending live site validation after tests and site up (design §16)**.

### New/Updated PLAN-FAIL entries (Global Standard)

- PLAN-FAIL-0414: UI small-screen panel system incomplete (missing mobilePanelActions / panelBackdrop CSS, activePanel wiring not fully validated against global standard patterns). Owner: UI agent. Status: Open. Cross-ref: design §7, idiothandver.md.
- PLAN-FAIL-0415: No enforced global standard benchmark gate on UI-affecting phases. Owner: Coordinator. Status: Open.
- PLAN-FAIL-0416: Agent review workflow (critic → QA → UI) not consistently executed or evidenced for global standard compliance. Owner: QA. Status: Open — handed off.
- PLAN-FAIL-0417: Registry alias drift and puckBlockRegistry canonical path not locked with global standard filter. Owner: Planner. Status: Open.
- PLAN-FAIL-0418: SVG generation (Phase 03) lacks strict Option A enforcement and resolver contract in plans (generatedAt, blocks field, anti-copy). Owner: SVG agent. Status: Open.
- PLAN-FAIL-0419: Features (catalog/inventory) lack catalogue-first, search parity (Sketchfab), resolver integration in plans. Owner: Planner agent. Status: Open.
- PLAN-FAIL-0420: Packages lack global standard justification gate for changes (Tier-2 re-eval, anti-copy). Owner: Build. Status: Open.

**Critique-derived items (from plannnerplan/critique/plan-revision-2026-07-04.md, merged 2026-07-04)**:
- GeneratedAt contradiction (Phase 02 §02-CAT-08 vs Phase 08 §08-PERS-05): stamp first-write only, freeze thereafter. Tracked in 0413/0418.
- 409 sources (Phase 02/08/07): introduce error_code suffixes (409.lock_busy, 409.hash_mismatch, 409.save_conflict). Update error taxonomy.
- versionMismatch (Phase 08 §08-PERS-10): map to 422 (not 404); treat as input-compatibility.
- R2 authority (I-D §96 vs phases): resolved (moved out of needs-approval).
- Registry alias drift (Phase 05 vs Phase 04): documented in I-D; canonical at features/planner/admin/puckBlockRegistry.ts.
- Forbidden-list omissions: added for Phase 01-10 (e.g., no --no-frozen-lockfile, no shell:true spawn, no base64 PNG, etc.).
- Status hygiene: fixed "Removed-task" label in Phase 04.
- Phase 10 §10-CLN-05 STAGING_PHASE_01A_RESIDUE: excised (no longer referenced).
- Phase 07 §07-TEST-04: use regex for service-role leak signal, not single env var.
- Scope: Phase 09 mixes 3D/export/AI (acceptable but watch); Phase 08 Supabase speculative (fence behind dual-read).

All updates include cross-refs to design spec, benchmark report, current tests evidence, and Failures.md entries. Evidence integrity per testing-handbook.md.
