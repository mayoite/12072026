# Benchmark Report — OOFPLWeb Planner Plan Revision

Date authored: 2026-07-04
Authority: DESIGN-BENCHMARK-PROTOCOL.md, IMPLEMENTATION-DECISIONS.md, PACKAGES.md.
Coverage scope: governance source-of-truth files (IMPLEMENTATION-DECISIONS, QUALITY-GATES, DESIGN-BENCHMARK-PROTOCOL, HANDOVER, FAILURESPLAN, PACKAGES) plus Phase 01 — Engine Lock & Workspace Bootstrap.

Coverage caveat (binding on a future audit): Phases 02–10 (`plannnerplan/phases/02…10…md`) and the parallel `benchmarks/` and `critique/` reports were not authored yet at the time this benchmark ran (3 execution agents running concurrently; only `01-engine-lock-and-workspace-bootstrap.md` was on disk). Binding proposals for those phases are framed as "incorporate on first author / revise on file drop"; a re-run benchmark is warranted after the execution agents commit. This report honors DESIGN-BENCHMARK-PROTOCOL.md §"Stale-evidence policy" — it is dated and additive, never overwritten.

## 1. Five-product comparison

Five leading products whose interaction principles inform the OOFPLWeb plan suite. All citations carry an access date of 2026-07-04.

1. Planner 5D (floor-planning/interior-design). Applicable principle: catalogue-first sidebar with room-by-room progression, 2D↔3D continuity, large merged-material library displayed with material-and-color customization, and AI-assisted entry paths that compose from existing geometry rather than generate cold start. Citation: support.planner5d.com/en/articles/5876855-catalogue-menu-web and planner5d.com/blog/ai-studio-interior-design-workflow (docs dated 2026-01-27 through 2026-05-19, accessed 2026-07-04).

2. Floorplanner (floor-planning/interior-design, 2021 editor refresh). Applicable principle: mandatory canvas-to-chrome ratio with the tools in a single sidebar plus per-object floating handles and an extended-properties double-click affordance; the post-2021 refresh explicitly reorganized because a growing feature set had accumulated in illogical places — the same risk the OOFPLWeb portal faces. Citation: orooloo.com/blog-new-redesign-for-floorplanner-2021 and cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf (accessed 2026-07-04).

3. AutoCAD Web — autocad-web (CAD/spatial-authoring). Applicable principle: workspace-as-named-bundle of palette/ribbon/command-window state with docking, anchoring, floating, and auto-hide behavior; the Access·ible Command Line docked at the bottom is the strongest reference for a non-canvas error/prompt surface. Citation: autodesk.com/products/autocad-web/features and help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-D550C560-FDC0-4A68-A56C-52C98C3DD0A6.htm (current 2026 product help, accessed 2026-07-04).

4. Figma UI3 (professional creative-tool). Applicable principle: thin resizable sidebars, floating bottom toolbar, "Minimize UI" affordance that collapses panels without losing the canvas, and contextual-right-panel grammar ("Properties" reorganized by what the user is editing). Applicable specifically to Puck + Ark UI chrome (Phase 04/05). Citation: help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3 and figma.com/blog/behind-our-redesign-ui3 (accessed 2026-07-04).

5. Sketchfab (large-catalog / asset-library UX). Applicable principle: dense, response-bounded search (`limit` capped at 24, cursor-paginated, faceted by category/license/animation/staff-pick/downloadable) is the cleanest public reference for a 10K+-row planner catalog; the Explore-3D-Models page shows filters that scale without overwhelming row density. Citation: sketchfab.com/3d-models?sort_by=-likeCount and api.parse.bot/marketplace/...sketchfab-api API contract endpoint `search_models` (accessed 2026-07-04).

## 2. Observed facts (separated from recommendations)

These are read-only findings from the files actually on disk at 2026-07-04 02:57Z.

FACT-01 The locked package set in PACKAGES.md resolves cleanly into a per-phase ownership map (Phase 01 engines; Phase 02 zod; Phase 03 Option A; Phase 04 admin panel; Phase 06 descriptor registry; Phase 09 3D + r3f). Today's Phase 01 file names the engines and the admin-panel listed packages, but does not yet pin Fabric 7.4.0 strictly (`01-INST-01`) in a single-line assertion — the pin lives inside the numbered checklist rather than a declarative `scripts/workspace/lock.json` reference. No fact of drift; observation of structure only.

FACT-02 IMPLEMENTATION-DECISIONS.md §"Authority order" makes IMPLEMENTATION-DECISIONS the authoritative file over phase files, with `Planned → Implemented → Verified in staging → Promoted → Verified in production path → Piloted → Accepted → Deferred/blocked` as the only allowed vocabulary. No "wip", "todo", or "drafting" appears in any on-disk file.

FACT-03 QUALITY-GATES.md sets the coverage target at 95% with a 90% hard floor for converted-planner code; zero bypass allowed (no explicit `any`, no `@ts-ignore`, no `@ts-nocheck`, no ESLint-disable in converted-planner code/tests). The headline target in I-D §"Coverage and code quality" matches Q-G exactly (95% / 90% / no bypasses).

FACT-04 HANDOVER.md still lists every phase as `Planned` and includes `PLAN-FAIL-0401` though `01-INST-04` is scheduled to install the locked set on the first execution cycle. There is no staging or production-path promotion entry yet, which matches the rubric that "lack of permission to run a check allows `Implemented`, never `Verified`/`Accepted`".

FACT-05 FAILURESPLAN.md re-IDs failure indexes into the 4xxx range and ties PLAN-FAIL-0406 (Block descriptor Zod schema not exported alongside admin) to Phase 02, PLAN-FAIL-0408 (pervasive coverage floor in OOPlanner ~58%) to Phase 06, and PLAN-FAIL-0409 (no Supabase `block_descriptors` table) to Phase 08 deferred. The cross-phase blockers correctly flag that PNG thumbs must route to R2 `site-block-thumbs/`, NOT `public/svg-catalog/`.

FACT-06 DESIGN-BENCHMARK-PROTOCOL.md §"Mandate" forbids reproducing donor visual composition, panel arrangement, styling, or information hierarchy unless current evidence independently supports it. This benchmark is the first advisory report following the rewrite of the protocol on 2026-07-04 14:53Z.

FACT-07 Phase 01 §"Architecture" is absent (the phase file does not sit under an architecture section header) — it leans entirely on the "Inputs to read" → "Scope" → "Checklist" path. There is no Phase Governance called out for cross-cutting strand such as information architecture, dockable panel grammar, or inventory navigation model — that is expected for a workspace-bootstrap phase but should be carried forward by Phase 04, 05, and 06.

FACT-08 Phase 01 §"Rollback criteria" names conditions such as `peer-dep warnings escalated to errors` and `vitest smoke shows new failures`, but does not yet reference the FAILURESPLAN.md failure IDs (e.g., PLAN-FAIL-0401). Cross-link gap.

FACT-09 The locked package set in PACKAGES.md mentions a recommendation for `drei` as "Reserved Tier-2 → Phase 06 3D". Phase 06 must therefore own the drei decision if/when advanced 3D helpers are needed. No fact violation; an explicit handoff record is required at Phase 06 entry.

FACT-10 Autonomy posture: external rules (the user's Warp Rule 1 and AGENTS.md-scope rule) are correctly cited in Phase 01 §"Forbidden actions" and §"Phase entry checklist" — no project rule is contradicting the orchestrator's authority order. No leaks observed on this axis.

## 3. Recommendations (separated from observed facts)

These are proposals a future benchmarking pass would attach to the package once the still-missing phases materialize.

REC-01 Adopt the Figma "Minimize UI" semantic explicitly: every panel surface that Puck mounts in Phase 04 / Phase 05 must declare hide/collapse/minimize affordances in the binding design brief, not as a chrome afterthought.

REC-02 Adopt the Sketchfab `search_models` cursor-paginated filter grammar for the planner catalog consumer in Phase 06: cap response size, support `category`, `license`, `animated`/state flags, and paginate cursors rather than offsets so search parity holds at 10K+ records.

REC-03 Adopt the AutoCAD Web "Command Line docked at the bottom" affordance as the Phase 04 / 06 non-canvas command + error surface; combine with Floorplanner's per-object double-click → extended-properties modal idiom where the selection-context panel is the editor.

REC-04 Adopt the Planner 5D catalogue-first sidebar pattern as the Phase 06 default, but combine it with the Floorplanner "favorites list under the brand logo" pattern only if we ship branded-product subcatalogs; otherwise do not.

REC-05 Hold AI integration out of default UI surfacing: Planner 5D's AI Studio / Smart Wizard are entry paths, not chrome layers. The Tier-3 reservation of `@vercel-labs/json-render` aligns with this — keep it installed-but-inactive through Phase 09 until a binding path-projection design brief confirms where its UI tree renders.

## 4. Binding proposals

Each binding proposal targets a phase file. For Phase 01 the action is "amend the existing file"; for Phases 02–06 the action is "incorporate on first author / revise on file drop" — verbatim mapping replaces the existing plans once the 3 execution agents drop their revisions.

BP-01
- Phase: 01
- Target section: §"Checklist > Install (01-INST)" — add an explicit single-line engine-pin assertion and a §"Forbidden actions" cross-link to FAILURESPLAN.md
- Proposal: add an item `01-INST-00` asserting `fabric@7.4.0` exact pin is sourced verbatim from PACKAGES.md §"Tier-1 locked > Engine" and that Phase 01 rollback criteria cross-references `PLAN-FAIL-0401` by ID
- Reason: today Phase 01 connects package pin to §"Rollback criteria" via prose only; a numbered checklist anchor and a FAILURESPLAN ID make rollback logic auditable in one line, satisfying IMPLEMENTATION-DECISIONS §"Authority order"
- Acceptance: `grep -n "PLAN-FAIL-0401" plannnerplan/phases/01-engine-lock-and-workspace-bootstrap.md` and `grep -n "7.4.0" plannnerplan/phases/01-engine-lock-and-workspace-bootstrap.md` both return ≥ 1 hit, each within the named section

BP-02
- Phase: 02 (catalog/source-of-truth + BlockDescriptor)
- Target section: §"Inputs to read" and a new §"Schema anchoring"
- Proposal: pin Zod `BlockDescriptor` author location to `features/planner/open3d/catalog/svg/svgTypes.ts` (consistent with HANDOVER §"Open items") and assert that the schema is the single contract consumed by Phase 03 generator AND Phase 04 admin editor AND Phase 06 descriptor loader
- Reason: the schema location is unconfirmed in current governance and HANDOVER recommends it. Single-source avoids the schema-fork risk called out in FAILURESPLAN PLAN-FAIL-0406 ("Block descriptor Zod schema not exported alongside admin")
- Acceptance: Phase 02 file contains the line `@zod-schema: features/planner/open3d/catalog/svg/svgTypes.ts` and references Phase 03 / 04 / 06 by `XX-XXX-NN` traceability IDs

BP-03
- Phase: 03 (SVG pipeline Option A)
- Target section: §"Architecture" and §"Source-quality gate"
- Proposal: declare the pipeline order `JSON → @flatten-js/core (measure) → polygon-clipping (Martinez booleans) → svgo → write public/svg-catalog/{slug}.svg | fabric.loadSVGFromString → @resvg/resvg-js → R2 site-block-thumbs/{slug}.png`; pin each of {`@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`, `fabric` 7.4.0} to a version-locked single line
- Reason: PACKAGES.md locks these as Option A. Phase 03 must not silently drop a step or substitute `svg-path-commander` (the only Tier-1 candidate rejection in PACKAGES.md §"Skip rationale")
- Acceptance: first 5-line block in §"Architecture" equals the pipeline order above; `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js` each appear in §"Checklist" with at least one reference

BP-04
- Phase: 04 (admin portal / Puck editor)
- Target section: §"Inputs to read", §"Forbidden actions", and a new §"Accessibility" subsection
- Proposal: enforce `@puckeditor/core`, `@ark-ui/react`, `react-aria-components`, `zod`, `@phosphor-icons/react`, (`@vercel-labs/json-render` listed as inactive) as the visible chrome sources for the admin editor — every panel/control component used in Phase 04 must originate from one of those
- Reason: the locked package set trusts Ark UI's Zag.js state machines and react-aria for combobox/date-picker a11y gaps. A Phase 04 file that allows a Radix mix-and-match silently violates the gate and re-opens the bus-factor risk PACKAGES.md §"Skipped" already documented
- Acceptance: a `## Allowed component packages` block lists the six allows verbatim; a `## Disallowed in this phase` block lists `@radix-ui/react-*` (Radix retained as fallback only, not for Phase 04 chrome)

BP-05
- Phase: 05 (portal Puck.Render public preview)
- Target section: §"Performance budgets" and §"Anti-copy rule"
- Proposal: declare ≤ 1 `<Puck.Render>` mount per admin/portal route as a hard constraint and assert no internet-visible trade dress from Planner 5D, Floorplanner, AutoCAD Web, Figma, or Sketchfab (per DESIGN-BENCHMARK-PROTOCOL.md §"Anti-copy rule")
- Reason: the architecture snapshot in HANDOVER already mandates "≤ 1 per admin/portal route" — Phase 05 must convert that mandate into a testable constraint and the Anti-copy check must cite this benchmark by date
- Acceptance: Phase 05 §"Performance budgets" contains the line `≤ 1 <Puck.Render> per admin/portal route` and §"Decision log" cites `benchmarks/plan-revision-2026-07-04.md` for anti-copy verification

BP-06
- Phase: 06 (planner inventory + symbol consumer)
- Target section: §"Catalog taxonomy" and a new §"Search parity"
- Proposal: bind `features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts` (per IMPLEMENTATION-DECISIONS architecture snapshot) as the single consumer; declare the search contract using Sketchfab's `search_models` cursor-only pagination with explicit page-cap (≤ 24) and filter facets `category`, `license`, `animated`/state flag, `staffpicked`/`favourite`, `downloadable`/`runtime-available`
- Reason: QUALITY-GATES §"Performance and stability" budgets `p95 ≤ 200 ms at 1,000 records; ≤ 200 ms at 10,000` and Phase 06 must produce a cursor-paginated, faceted consumer that does not depend on offsets-based SQLite/MySQL search; the Sketchfab pattern is the cleanest public reference
- Acceptance: a `## Catalog contract` block lists the contract fields by name and ties the file to the `svgBlockDescriptorLoader.ts` path; an explicit p95 budget line cites QUALITY-GATES

BP-07
- Phase: 09 (3D lazy, export, AI)
- Target section: §"Inputs to read", §"Performance budgets", and §"Forbidden actions"
- Proposal: assert `three ^0.185.1` + `@react-three/fiber` are the only 3D paths, `@vercel-labs/json-render` is inactive until a binding path-projection brief, and `drei` remains Tier-2 reserved until re-evaluated (per PACKAGES.md §"Tier-1 deferred")
- Reason: Phase 09 is the only phase that activates 3D. A silent introduction of `drei` or `@react-three/drei` would bypass PACKAGES.md Tier-2 reservation at Phase 06. The Benchmarker already accepts the original PACKAGES rationale and re-challenges only when evidence updates
- Acceptance: `## 3D engine paths` lists `three ^0.185.1` and `@react-three/fiber`; `drei` is explicitly marked Tier-2 reserved with `revisit date: TBD`

## 5. Rejections — patterns the plans must NOT adopt

REJ-01 Floorplanner-style left-to-right mega-tab sidebar with collapsed icon column. Reason: Orooloo's 2021 retrospective (`blog-new-redesign-for-floorplanner-2021`, accessed 2026-07-04) documented that collapsing grown features into a hamburger/tab system hides capability. The OOFPLWeb plan must use a resizable + minimizable panel grammar (Figma's UI3 model) rather than a tab-collapsed sidebar.

REJ-02 Planner 5D-style sunset-gradient brand palette or any sub-orange/interior-warm trade dress. Reason: per DESIGN-BENCHMARK-PROTOCOL.md §"Anti-copy rule", color copying is forbidden. Use semantic tokens in `site/app/css/`, never donor visual debt.

REJ-03 AutoCAD Web's Mechanical / Drafting & Annotation ribbon+tabs look. Reason: ribbon panel grammar learned from AutoCAD is acceptable (BP-03 notes pipeline order); copying the chrome arrangement, command ribbon motifs, or workspace icons is not.

REJ-04 Sketchfab's Explore dense grid with deep-zoom-into-card overlays. Reason: 8K+ models in a grid is a marketing/catalog page idiom, not a working tool idiom. The planner consumer in Phase 06 must keep the row density worker-oriented (icon + label + facet on each row) and reserve marketing-grid for the public portal route only (if any), behind a separate brief.

REJ-05 Figma's exact UI3 left/right sidebar pixel sizing. Reason: interaction principles borrowable, exact geometry is not. The portal Phase 05 may borrow the minimizable sidebar semantic but not the 296 px / 240 px widths, gradient backgrounds, or specific icon set.

REJ-06 Mantine chrome options. Reason: PACKAGES.md §"Tier-1 deferred" flagged Mantine as deferred pending PostCSS namespace split. Adopting Mantine panels in Phase 04 chrome violates the lock; if a future phase proves Mantine indispensable, the change must come through IMPLEMENTATION-DECISIONS amendment, not Phase 04 silent introduction.

## 6. Anti-copy check

Confirmed absent in the on-disk plan package:
- Floorplanner 2021 mega-sidebar composition — not present; Phase 04 likely uses Ark UI primitives, not a tab-collapsed sidebar.
- Planner 5D sunset/warm brand palette — absent; IMPLEMENTATION-DECISIONS requires semantic tokens in `site/app/css/`, no parallel palette.
- AutoCAD Web ribbon-and-workspaces trade dress — absent; the planner is canvas-first, no ribbon chrome planned.
- SketchUp / 3D Warehouse marketing-grid listings — absent; no marketing grid idiom in current plan files.
- Figma UI3 pixel geometry — absent; no fixed-width sidebar claim in current files.

No leak detected across IMPLEMENTATION-DECISIONS, QUALITY-GATES, DESIGN-BENCHMARK-PROTOCOL, FAILURESPLAN, HANDOVER, or Phase 01. The Re-check required when Phases 02–10 land: see §7 below.

## 7. Cross-phase coherence (locked package set honored)

Per PACKAGES.md and the orchestrator ownership map:

| Phase | Expected package anchor | Status |
| --- | --- | --- |
| 01 | `fabric` 7.4.0 + `three` ^0.185.1 + `@react-three/fiber` (engines) | PRESENT in `01-INST-01 / 02 / 03`; needs BP-01 to anchor pin source |
| 02 | `zod` (BlockDescriptor schema) | PENDING — Phase 02 not on disk |
| 03 | `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js` | PENDING — Phase 03 not on disk |
| 04 | `@puckeditor/core`, `@ark-ui/react`, `react-aria-components`, `zod`, `@phosphor-icons/react`, (`@vercel-labs/json-render` inactive) | Phase 01 §"Install" lists the panel set; Phase 04 gating pending |
| 06 | `BlockDescriptor` registry via `svgBlockDescriptorLoader.ts` | PENDING — Phase 06 not on disk |
| 09 | `three ^0.185.1` + `@react-three/fiber`; drei Tier-2 reserved | PENDING — Phase 09 not on disk |

Action: when the 3 execution agents land their revisions, re-run this benchmark pass with the file list resolved. Until then, this benchmark reports `partial-coverage: governance + phase 01 only`.

## 8. Date stamp and access date

- Date authored: 2026-07-04 (tied to planner revision window 2026-07-04).
- Source URLs accessed: 2026-07-04.

Stale-evidence policy: per DESIGN-BENCHMARK-PROTOCOL.md §"Stale-evidence policy", this file is dated and will not be edited in place. If acceptance decisions depend on stale findings, a new dated benchmark report is authored under `plannnerplan/benchmarks/phase-NN-...md`. No correction notes needed at this time.
