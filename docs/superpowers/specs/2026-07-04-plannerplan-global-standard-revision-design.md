# 2026-07-04 Plannerplan Global Standard Revision Design

**Date**: 2026-07-04  
**Status**: Design approved (core) — UI/UX, SVG generation, features, and packages details provisional pending live site validation. 

**Progress (supporting updates 2026-07-04)**: 
- Governance: Global Standard Framework, UI/UX Standards, SVG/Features/Packages Mandates added to 2026-07-05_implementation-decisions.md; Global Standard Gate added to 2026-07-05_quality-gates.md; REVIEW-WORKFLOW intensified; FAILURESPLAN updated with 0414+ (cross-ref design §6,8).
- Phases: BP-01..BP-07 incorporated (see plannnerplan/phases/01-*.md through 09-*.md with headings + contract details; verified by grep).
- Cross-refs standardized: BP cites in plannnerplan/phases/ point to `plans/2026-07-04/benchmark.md` (active working revision copy); immutable dated copies live in `plans/archive/00-global-standard-revision/benchmark.md` per 2026-07-05_design-benchmark-protocol.md stale-evidence policy (see also plans/archive/README.md). Critique refs use `plannnerplan/critique/plan-revision-2026-07-04.md` + `plans/2026-07-04/critique.md` (or archive equivalent). Design, benchmark, critique cross-linked in PACKAGES.md (references active `plans/2026-07-04/benchmark.md`), INDEX.md, HANDOVER.md, FAILURESPLAN.md, phases, etc. Structure of plans/archive/00-global-standard-revision/ (full content of all 5 + README) + plans/2026-07-04/ (working copies) and plannnerplan/ (phases/00-10, benchmarks/INDEX + stubs, governance incl. FAILURESPLAN.md, retained plan/ stub) aligned (verified via list_dir + grep post-fix).
- Supporting: PACKAGES.md references active benchmark path for global standard filter; `plannnerplan/benchmarks/INDEX.md` refreshed for archived stale + new structure (plans/archive/00-global-standard-revision/ finalized).
- Evidence: All updates verified post-edit via read_file + grep (no terminal runs). Current tests referenced from Failures.md (e.g. blocksResolver 25/25, 116 admin SVG tests). Suggested evidence location: results/planner/phase-*/ (or new results/planner/global-standard-revision/ for doc gates).
- Structure note below. No new files created; min necessary edits only.
- Skips: No live site validation / re-benchmark / terminal commands / tests executed (per task: file tools only). No BP items were missing (all 7 referenced + content aligned in phases).
- Revisit after tests + site up still applies.

**Note on structure (2026-07-04 current)**: 
- Revision documents (benchmark.md, critique.md, HANDOVER.md, idiothandver.md, open3d-test-error-follow-up.md) archived/finalized in `plans/archive/00-global-standard-revision/`.
- Archive: `plans/archive/00-global-standard-revision/` (full content of all 5; originals retained in plans/2026-07-04/ per archive-over-delete).
- `plannnerplan/` retains phases/, other benchmarks (local execution + INDEX + stubs), critique/plan-revision-2026-07-04.md, governance files, 2026-07-05_design-benchmark-protocol.md etc.
- `plannnerplan/plan/2026-07-04/` retained as move-stub (archive preference; no active cross-refs).
- See `plannnerplan/benchmarks/INDEX.md` and `plans/archive/README.md` for routing.
- plannnerplan/plan/ dir + old plan-revision stubs kept for history (no delete).

**Cross-refs (ensured)**: This design is referenced from HANDOVER.md (plans/ and plannnerplan/ remnants), FAILURESPLAN.md, PACKAGES.md (updated), INDEX.md (updated), phases (via benchmark), and itself. Benchmark and critique cross-linked throughout. See also root HANDOVER.md, DOC-MAP.md (consider future), Failures.md.

**Authors**: Grok (brainstorming session)  
**Authority**: Builds on `plannnerplan/2026-07-05_implementation-decisions.md`, `2026-07-05_design-benchmark-protocol.md`, `2026-07-05_quality-gates.md`, 2026-07-04 benchmark report (`plans/archive/00-global-standard-revision/benchmark.md`), and critique (`plannnerplan/critique/plan-revision-2026-07-04.md`).

## 1. Executive Summary

This design defines an intensified hybrid revision (Approach 1 + 2) of the `plannnerplan/` package. It combines:

- **A**: Reality sync with current repo state (Phase 02 resolver test, hybrid routes, small-screen panel wiring).
- **B**: Application of 2026-07-04 benchmark recommendations and critique findings (contradictions, forbidden omissions, drift).
- **C**: Formalization of repeatable revision process.

With strong emphasis on:
- **Global Standard** (world-standard benchmark discipline, anti-copy rule, 5-product reference model as binding filter).
- **UI/UX** (Figma minimize-UI, Sketchfab cursor search, AutoCAD command surface, Planner 5D catalogue-first + 2D↔3D, Floorplanner properties — applied to panels, inventory, previews).
- **SVG Generation** (Phase 03 Option A pipeline strictness, contracts with resolver, performance, visual global-standard compliance).
- **Features** (catalog, inventory, symbol consumption, resolver integration).
- **Packages** (locked set governance filtered through global standard).

The revision is **more intense** than prior deltas: binding rules, release-blocking gates, explicit checklists, and cross-phase enforcement. Detailed visual/UX/SVG/feature validation is deferred until the site is up and running.

## 2. Background and Context

Exploration of `plannnerplan/` (all files), root docs (Readme.md, AGENTS.md, START.md, Failures.md, HANDOVER.md), and relevant site code (catalog/svg, blocksResolver, hybrid routes, WorkspaceShell/PanelContainer/TopBar) revealed:

- Phase 02 resolver is unit-verified (new test `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts`, 25/25).
- Current truth: `/planner/guest` + `/planner/canvas` = live hybrid (Fabric); `/planner/open3d` = pilot.
- Small-screen panel work in progress (data-open, activePanel, minimize affordances).
- Critique identified contradictions (generatedAt, 409 codes, R2 authority, registry alias, versionMismatch HTTP).
- Benchmark report (2026-07-04) provides 5-product principles and binding proposals (BP-01 to BP-07) + rejections.
- Packages locked in IMPLEMENTATION-DECISIONS + PACKAGES.md (fabric 7.4.0, three r185, Option A SVG tools, Puck/Ark UI set).
- SVG generation (Phase 03) is the critical seam for features and UI previews.

## 3. Goals

- Produce an auditable "Global Standard Plan Revision 2026-07-04" that is reality-accurate and globally-standard-compliant.
- Embed global standard as the filter for all package, SVG, feature, and UI decisions.
- Intensify governance so future phases cannot drift without benchmark justification.
- Support repeatable process (C) for future revisions.
- Capture current work (resolver test, hybrid routes, panel wiring) while planning forward.

## 4. Scope and Boundaries (Hybrid 1+2)

**In (delta + embedded standards):**
- Governance files: HANDOVER.md, FAILURESPLAN.md, 2026-07-05_implementation-decisions.md (intensified).
- 2026-07-05_quality-gates.md and 2026-07-05_design-benchmark-protocol.md (new Global Standard Gate).
- Selective phase updates: 02 (resolver contract), 03 (SVG gen), 04 (admin), 05 (portal), 06 (inventory/features), 10 (route swap + handover).
- New/expanded cross-cutting: Global Standard Framework, UI/UX Standards, Workflow & Benchmark Enforcement.

**Out (to stay focused):**
- Full rewrite of every phase.
- Actual code changes or site modifications (design only).
- Supabase migration details (deferred).
- Live visual validation (revisit when site is up).

**Revisit note**: UI/UX patterns, SVG output visuals, feature presentation, and package-driven rendering will be re-validated once the site is running (dev server + previews).

## 5. Design Approach: Intensified Hybrid (1 + 2)

- **Delta (1)**: Focused, high-signal edits to governance + top contradictions + reality sync.
- **Embedded Comprehensive (2)**: Deeper injection of global standard + UI/UX + SVG/features/packages rules into key phases and checklists.
- **Intensity levers**: Binding language ("must", "release-blocking"), explicit PLAN-FAILs, checklists per phase, anti-copy attestations, benchmark-report prerequisites.

## 6. Global Standard Framework (Intensified)

New primary section in `2026-07-05_implementation-decisions.md`:

**"Global Standard Framework (Binding)"**

- Every package, SVG pipeline, feature, and UI decision **must** cite at least one principle from the 2026-07-04 benchmark report.
- Anti-copy rule is release-blocking: only semantic tokens from `site/app/css/`. No donor or competitor trade dress, exact geometry, palettes, or composition without documented justification + dated benchmark report.
- 5-product reference model is mandatory for any UI/UX/SVG/feature benchmarker.
- Global Standard Gate (new in 2026-07-05_quality-gates.md): Before "Implemented" on relevant work:
  1. Fresh dated benchmark report exists.
  2. Independent UI review (REVIEW-WORKFLOW) signed off.
  3. Anti-copy + pattern attestation in Decision Log.

Applies to Phases 03, 04, 05, 06, 10 and all package/SVG/feature changes.

## 7. UI/UX Standards (Intensified)

Expanded binding section in 2026-07-05_implementation-decisions.md (cross-referenced in phases):

- **Minimize UI & Panel Grammar** (Figma UI3): Explicit hide/collapse/minimize on every panel. Small-screen = overlay + backdrop + one-active-panel. Matches current WorkspaceShell/PanelContainer/TopBar work.
- **Inventory & Search** (Sketchfab): Cursor-only pagination (≤24 items), facets (category, license, state, staffpicked, downloadable). p95 budgets per QUALITY-GATES.
- **Non-Canvas Command/Error Surface** (AutoCAD Web): Docked or contextual, keyboard + live regions.
- **Catalogue-first + 2D↔3D Continuity** (Planner 5D + Floorplanner): Default layout starts with inventory. Recoverable transitions.
- **Per-object Properties** (Floorplanner): Double-click or equivalent for extended properties.
- Small-screen/hybrid panel wiring is baseline — future changes must evolve it, not regress it.

Phases 04/05/06/10 must add "UI Global Standards Gate" checklist items.

## 8. SVG Generation (Phase 03) — Intensified

- **Strict Option A lock**: `@flatten-js/core` → `polygon-clipping` → `svgo` → `@resvg/resvg-js`. No deviations without new benchmark justification.
- **Contract with Phase 02**: Generated SVG/PNG must match `BlockDescriptor` geometry and `resolveBlocks()` output (explicit + synthesised paths). ViewBox, dimensions, and IDs deterministic.
- **Global Standard + UI/UX compliance**:
  - Clean markup (svgo enforced).
  - Visuals use only semantic tokens; anti-copy gate.
  - Previews in admin (04) and portal (05) must render exactly without added styling that violates standards.
- Performance: p95 ≤ 200 ms (3-block), 100 blocks ≤ 1s.
- New checklist (03-SVG-*):
  - 03-SVG-UI-01: Global standard visual review passed.
  - 03-SVG-FEAT-01: Feeds `svgBlockDescriptorLoader` cleanly.
  - 03-SVG-PKG-01: All tools from locked Tier-1 set.
- Evidence: Golden fixtures + round-trip tests required.

## 9. Features (Catalog, Inventory, Symbol Consumption)

- Single source: `svgBlockDescriptorLoader` + Phase 02 resolver (`ResolvedBlocks`).
- **Catalogue-first + 2D↔3D** (Planner 5D) as default.
- **Search parity** (Sketchfab): Cursor pagination + facets in inventory (Phase 06).
- **Contextual properties** (Floorplanner/AutoCAD) for symbols/blocks.
- Global standard anti-copy applies to all feature visuals, previews, and generated assets.
- Small-screen support: inventory access, placement, and preview must respect minimize-UI rules.
- Integration: Phase 06 must consume resolver output directly; no monkey-patching `svgSymbols.ts`.

## 10. Packages (Intensified Governance)

Locked set filtered through global standard:

- **Engines**: `fabric@7.4.0` (strict), `three@^0.185.1` + `@react-three/fiber`.
- **SVG Pipeline (Option A)**: Exact pins for `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`.
- **Admin/Portal UI**: `@puckeditor/core`, `@ark-ui/react`, `react-aria-components`, `zod`, `@phosphor-icons/react` (`@vercel-labs/json-render` inactive Tier-3).
- No additions/swaps without:
  - Benchmark report showing support for global standard UI/UX patterns.
  - Anti-copy compliance attestation.
- Tier-2 (e.g. `drei`) re-evaluation required before Phase 06/09 activation.
- New gate in Phase 01 and IMPLEMENTATION-DECISIONS: "Global Standard Package Review".
- `PACKAGES.md` and Phase 01 checklist updated with justification requirements.

## 11. Governance File Changes (Delta + Embedded)

**HANDOVER.md**:
- Phase 02 status: Unit test surface added (Planned per phase file). Prior Implemented claims corrected for accuracy. Global standard alignment pending.
- New "2026-07-04 Global Standard Revision" section with reality snapshot, benchmark/critique items addressed, and forward references to UI/UX/SVG/features/packages mandates.
- Open items expanded into tracked workstreams (UI Global Standards, Workflow & Agent Orchestration, Benchmark Gate).

**FAILURESPLAN.md**:
- Close resolved (0401, 0410, Phase 02 test).
- New/strengthened PLAN-FAILs:
  - 0413 (blocks field) — clarified handoff.
  - 0414 (small-screen panels).
  - 0415 (global standard benchmark gate).
  - 0416 (agent review workflow).
  - 0417 (registry alias / puckBlockRegistry).
  - New for SVG/features/packages drift.
- "2026-07-04 Revision — Global Standard Intensification" subsection.

**2026-07-05_implementation-decisions.md**:
- R2 bucket locked with owner/date.
- Canonical paths locked (puckBlockRegistry + alias).
- New "Global Standard Framework", "UI/UX Standards", "SVG/Features/Packages Mandates" sections (binding).
- Package set explicitly filtered.

**2026-07-05_quality-gates.md & 2026-07-05_design-benchmark-protocol.md**:
- New "Global Standard Gate".
- Protocol updates for mandatory 5-product + anti-copy checks on UI/SVG/feature work.

## 12. Workflow and Benchmark Enforcement

- Intensify `2026-07-05_review-workflow.md`: Critic → QA → UI reviews must explicitly score against global standard + UI/UX/SVG/features/packages rules. No opinion passing between agents.
- Every UI/SVG/feature/package change requires dated benchmark report before primary agent finalization.
- Evidence capture (results/...) mandatory; "Implemented" only after gate.
- Agent handoff pattern (as in prior work) documented.

## 13. Deliverables

- Updated governance files (HANDOVER, FAILURESPLAN, IMPLEMENTATION-DECISIONS).
- Targeted phase file updates (02, 03, 04, 05, 06, 10) with new checklists.
- At least one new dated benchmark report or delta for UI/SVG/features slice.
- Revised REVIEW-WORKFLOW and QUALITY-GATES.
- This design spec (with revisit marker).
- Promotion manifest template updates if needed for Phase 10.

## 14. Success Criteria

- All top critique contradictions addressed or tracked with removal conditions.
- Global Standard Framework + UI/UX/SVG/Features/Packages sections present and cross-referenced.
- Reality sync matches current code (resolver test, hybrid routes, panel state).
- Global Standard Gate defined and referenced.
- Anti-copy attestations and benchmark citations present where required.
- (Provisional) Live site validation of UI/UX, SVG output, and features passes when site is up.

## 15. Risks and Open Items

- **Revisit risk**: UI/UX patterns, generated SVG visuals, and feature presentation may need adjustment after seeing running site (small-screen, previews, inventory).
- Dirty worktree (per prior handover) — this revision focuses on plan files only.
- Phase 01 typecheck debt (PLAN-FAIL-0412) and other open items remain outside this slice.
- Evidence script path hardcode (prior note) — not addressed here.
- Over-intensity risk: Too many binding rules could slow future work — mitigated by clear "removal condition" tracking in FAILURESPLAN.

## 16. Revisit Plan (After Tests and Site Up)

This is **not the end**. Approval of this design is provisional.

Full evaluation and finalization will happen **after tests** and **once the site is up** (dev server + admin/portal/planner routes visible and interactive).

Key activities on revisit:
- Validate UI/UX standards against actual panels, inventory, previews, and small-screen behavior.
- Check generated SVGs/PNGs for global standard compliance (visuals, dimensions, tokens, anti-copy).
- Test feature flows (catalog search, symbol placement, 2D/3D continuity, resolver integration).
- Review package-driven rendering and feature presentation.
- Run relevant tests (unit, integration, any UI smoke) and capture evidence.
- Update this design spec and the plannerplan files with any refinements or new findings.
- Run fresh benchmark report if material changes surface.
- Re-confirm global standard, workflow, and benchmark gates in practice.

Current status remains: design captured, governance and mandates ready for implementation planning, but live validation deferred.

## 17. Next Steps (After User Review of This Spec)

1. User reviews this spec file.
2. Incorporate any changes.
3. (When ready) Transition to implementation plan via writing-plans skill (targeted edits to `plannnerplan/` files + evidence).
4. Execute revision (delta updates first, then embedded standards).
5. Capture evidence per testing-handbook.
6. Revisit UI/UX/SVG/features validation once site is up.

---

**Status**: Core design approved. UI/UX/SVG generation/features/packages details to be revisited and refined once the site is up and running.

This document is the validated design baseline for the 2026-07-04 plannerplan global standard revision.