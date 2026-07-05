# Critic Review — Planner Plan Coherence (2026-07-04)

**Reviewer role:** Critic  
**Review date:** 2026-07-04  
**Branch context:** orchestrator/hotfixes-2026-07-04 (per task)  
**Inputs fully read (per task):**  
- `plans/2026-07-04/benchmark.md` (full)  
- `plannnerplan/2026-07-05_implementation-decisions.md` (full)  
- `plannnerplan/2026-07-05_quality-gates.md` (full)  
**Additional inspected (read_file + grep + list_dir):**  
- `plannnerplan/FAILURESPLAN.md`, `plans/2026-07-04/HANDOVER.md`, `plans/2026-07-04/critique.md`, all `plannnerplan/phases/*.md`  
- `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` (full)  
- Core impl: `site/features/planner/open3d/catalog/svg/{svgTypes.ts, blocksResolver.ts, svgBlockDescriptorLoader.ts}`, `site/features/planner/admin/svg-editor/puckBlockRegistry.tsx`, `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
- Site structure: `site/app/{planner,admin/svg-editor,(site)/portal}`, `site/scripts/generate-svg.mjs` + subdir  
- Evidence locations: `results/planner/phase-01/`, `results/tests/`, absence of `results/qa/`  
- Cross-refs: `Failures.md`, `testing-handbook.md`, `AGENTS.md`, `Readme.md`, `plannnerplan/benchmarks/`, `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`  
**Method:** Read-only analysis per AGENTS.md. No code changes, no commands executed.

## Summary

The governance triple (benchmark report + 2026-07-05_implementation-decisions.md + 2026-07-05_quality-gates.md) is internally coherent on authority, status vocabulary, coverage floors, Option A SVG lock, 5-product model, anti-copy rule, and the new binding Global Standard Gate. However, significant drift exists between the authoritative governance docs, the phase files, FAILURESPLAN/HANDOVER status claims, and live implementation state. Phase 02 "unit-verified Implemented" advancement is premature and non-compliant with vocabulary and evidence rules. Multiple handoff gaps (loader vs persistence, schema vs resolver casts, registry canonical path, evidence locations) and missing explicit checklist items for Global Standard/UI gates in Phases 04/05/06/10 create execution risk. Hybrid Fabric/Open3D state is correctly documented as pilot-only in I-D live routes but not yet reflected in all phase ownership claims. Overall the plan revision shows good BP incorporation on paper for Phase 01-03 but is not yet coherent or ready for next execution phases without fixes to status, evidence, and alignment.

## Issues

### Issue 1 -- Severity: bug
- File: plannnerplan/phases/02-catalog-source-of-truth-and-blockdescriptor.md:4
- Description: Header declares `Status: Planned`. However, `plans/2026-07-04/HANDOVER.md:22` and `plannnerplan/FAILURESPLAN.md:59` (resolution history) assert "Phase 02 — Implemented — unit-verified" + "Verified-at-unit" solely on the new resolver test. This violates `2026-07-05_implementation-decisions.md:24-29` (only allowed vocabulary: Planned, Implemented, Verified in staging, ..., and "Lack of permission to run a check allows `Implemented`, never `Verified`/`Accepted`").
- Suggestion: Update the phase file header + Decision log + exit gate to `Planned` (or `Implemented` only after full checklist + evidence per 2026-07-05_quality-gates.md). Remove premature "Implemented" claims from HANDOVER/FAILURESPLAN until Phase 03 integration + Phase 06 loader use the resolver without casts.
- Status: open

### Issue 2 -- Severity: bug
- File: plannnerplan/FAILURESPLAN.md:59
- Description: Claims evidence at `results/qa/resolver/test-planner/` (test-planner-run.json, -raw.log, blocksResolver-focused-raw.log). `list_dir results/qa` and direct read return "does not exist". `testing-handbook.md:30` + `2026-07-05_quality-gates.md:47-49` + `AGENTS.md` mandate standardized `results/<module>/<phase>/<cmd>/` layout with run.json + raw.log. Actual evidence artifacts appear under `results/planner/phase-01/` and `results/tests/`.
- Suggestion: Correct all references to actual captured locations (e.g. `results/planner/phase-02/resolver/` or per-handbook). Re-run the focused test under proper harness and preserve full artifacts before claiming "Verified-at-unit". Never cite missing paths.
- Status: open

### Issue 3 -- Severity: bug
- File: site/features/planner/open3d/catalog/svg/svgTypes.ts:329 (BlockDescriptorCommonBaseSchema)
- Description: Schema lacks any `blocks` field (or extension). `blocksResolver.ts:82` does `(descriptor as { blocks?: unknown }).blocks` and synthesises fallback. The new `blocksResolver.test.ts:120-129` (and attachBlocks helper) relies on the same cast at fixture boundary. `plannnerplan/FAILURESPLAN.md:39` (PLAN-FAIL-0413) and `plans/2026-07-04/HANDOVER.md:48-49` correctly track this as open handoff (Phase 02→06). Phase 02 checklist (§02-CAT-01..11) and BP-02 (benchmark.md:76-81) assume single contract but do not declare `blocks`.
- Suggestion: Extend `BlockDescriptorCommonBaseSchema` (and variants) with optional `blocks` per the removal condition in PLAN-FAIL-0413. Update resolver to remove cast. Re-pin Phase 02 + Phase 06. Do not claim resolver verification until schema surface matches.
- Status: open

### Issue 4 -- Severity: bug
- File: site/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts:78,134 (BLOCK_DESCRIPTORS_DIR_DEFAULT + readDescriptorFile)
- Description: Hardcodes resolution to `${slug}.json` (and .json extension guard). Contradicts Phase 08 persistence contract: `{slug}.{n}.json` + `{slug}.latest.json` pointer (plannnerplan/phases/08-persistence-and-migration.md:24 (08-PERS-02), 42 (08-PERS-06), 48). `svgBlockDescriptorLoader.ts` comment and re-exports claim Phase 02/06 single source. No handling of pointer or rotation.
- Suggestion: Align loader (and tests) to the pointer + atomic-rename semantics owned by Phase 08. Add explicit seam in Phase 02/06/08 checklists. Update FAILURESPLAN cross-refs.
- Status: open

### Issue 5 -- Severity: bug
- File: plannnerplan/2026-07-05_implementation-decisions.md:67 (Module paths section)
- Description: Declares canonical `puckBlockRegistry.ts` at `features/planner/admin/puckBlockRegistry.ts` with one-line alias at `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts`. Actual file lives at `site/features/planner/admin/svg-editor/puckBlockRegistry.tsx` (see also site/app/admin/svg-editor/[id]/ and tests). Portal svg-catalog dir does not exist (`list_dir` confirms). `plannnerplan/FAILURESPLAN.md:83` (PLAN-FAIL-0417) still lists as Open. Phases 04/05 cite the documented (wrong) path.
- Suggestion: Either move/rename to documented canonical path or amend I-D + all cross-refs (phases, HANDOVER, benchmark BP-05) to actual location + .tsx. Ensure alias is a single-line re-export with tsc gate. Create portal alias only when Phase 05 routes land.
- Status: open

### Issue 6 -- Severity: bug
- File: plannnerplan/phases/04-admin-portal-svg-editor.md (and 05,06,10); cross-ref plannnerplan/2026-07-05_implementation-decisions.md:129-130
- Description: I-D ("Phases 04/05/06/10 must add 'UI Global Standards Gate' checklist items") and 2026-07-05_quality-gates.md:66-69 (Global Standard Gate is release-blocking; requires fresh dated benchmark + independent UI review + anti-copy attestation). Phases contain BP-0x cites, Decision log notes ("UI/GS gates added", "Global Standard Gate applies"), and some 03-SVG-UI-01 style items, but no dedicated "UI Global Standards Gate" checklist section or explicit items matching the mandated wording. Portal route absent; no independent UI review artifacts.
- Suggestion: Add explicit `## UI Global Standards Gate` subsection (with items for Figma minimize-UI, Sketchfab cursor pagination, AutoCAD command surface, Planner5D catalogue-first, anti-copy attestation, benchmark citation) to the four phases. Gate must precede "Implemented". Update benchmark §7 table and HANDOVER.
- Status: open

### Issue 7 -- Severity: bug
- File: plannnerplan/phases/00-governance-baseline-and-precheck.md:1-10 (frontmatter)
- Description: Uses YAML frontmatter + `---` + `# Title` + "Owner/Status/Created/Phase" fields. All other phases (01-10) use uniform plain-Markdown `# Phase N — ...` + `Date: ...` + `Status: Planned` + standard sections. Benchmark (FACT-07) and critique already flagged Phase 01 architecture/header inconsistency; Phase 00 deviates further from the established template used by governance docs.
- Suggestion: Normalize Phase 00 header/structure to match 01-10 for machine-parseability and consistency with "phase files bind to this file" (2026-07-05_implementation-decisions.md:3-4).
- Status: open

### Issue 8 -- Severity: bug
- File: plannnerplan/phases/01-engine-lock-and-workspace-bootstrap.md:4 (and 12-18)
- Description: Status `Planned`. Contains BP-01 alignment (01-INST-00 fabric pin + PLAN-FAIL-0401 cross-link). However, PLAN-FAIL-0412 (FAILURESPLAN.md:37) marks Phase 01 BLOCKED on pre-existing type debt (27 errors in results/planner/phase-01/typecheck/typecheck-run.json). Benchmark FACT-01/08 and BP-01 expected explicit pin + rollback cross-ref (now present). No "Implemented" advance yet.
- Suggestion: Keep Planned until typecheck debt resolved (or explicitly scoped out per AGENTS type-safety). Ensure rollback criteria + FAILURESPLAN IDs are asserted in evidence (not just prose).
- Status: open

### Issue 9 -- Severity: suggestion
- File: plans/2026-07-04/benchmark.md:29-48 (FACT-07, FACT-01, BP-01); plannnerplan/phases/01-*.md
- Description: Benchmark noted Phase 01 "§'Architecture' is absent — leans entirely on 'Inputs...Checklist' path" and no cross-link to FAILURESPLAN IDs in rollback. Phase 01 now has 01-INST-00 + BP cite and rollback references PLAN-FAIL-0401, but still lacks a top-level `## Architecture` section (unlike Phase 02/03/08 which have one). Cross-phase coherence table in benchmark §7 is now partially satisfied for Phase 01.
- Suggestion: Add minimal `## Architecture` subsection (or note that Checklist path is intentional for bootstrap phase). Re-run benchmark per its own §7 once Phases 02-10 stabilize.
- Status: open

### Issue 10 -- Severity: bug
- File: plannnerplan/2026-07-05_quality-gates.md:59-69 (Global Standard Gate); plannnerplan/2026-07-05_implementation-decisions.md:113-119
- Description: Gate requires "Fresh dated benchmark report exists. Independent UI review (REVIEW-WORKFLOW) signed off. Anti-copy + pattern attestation in Decision Log." Applies to 03/04/05/06/10. Recent phase Decision logs cite `plans/2026-07-04/benchmark.md` and design spec (provisional). No evidence of independent critic/QA/UI review execution or signed artifacts under results/ for global standard. `plannnerplan/FAILURESPLAN.md:71-82` (PLAN-FAIL-0415/0416) still open.
- Suggestion: Treat as blocking per QUALITY-GATES. Produce dated benchmark re-run + REVIEW-WORKFLOW output before any "Implemented" on affected phases. Cite specific benchmark §4 BP-0x + §6 anti-copy in logs.
- Status: open

### Issue 11 -- Severity: nit
- File: plannnerplan/phases/02-*.md:17 (Schema anchoring); plans/2026-07-04/benchmark.md:76 (BP-02)
- Description: Phase 02 adds BP-02 cite and `@zod-schema: ...` anchor. However, the `blocks` seam (Issue 3) and loader mismatch (Issue 4) mean the "single contract consumed by Phase 03/04/06" claim is not yet true in implementation. Phase 02 exit gate references Phase 03/06 integration that has not occurred.
- Suggestion: Add explicit traceability IDs (e.g. 02-CAT-BLOCKS-01) and "pending Phase 06 schema extension" note in checklist until PLAN-FAIL-0413 closed.
- Status: open

### Issue 12 -- Severity: suggestion
- File: site/features/planner/open3d/catalog/svg/blocksResolver.ts:82; test file + loader re-exports
- Description: Cast usage is narrowly confined and documented (per test header and PLAN-FAIL-0413), satisfying AGENTS.md narrow exemption for tests. But production resolver still casts. Benchmark RECs (e.g. search parity Sketchfab) and UI/UX mandates (Figma minimize, catalogue-first) appear in phase Decision logs but not yet in catalog/inventory code (useOpen3dWorkspaceCatalog etc. still pre-global-standard).
- Suggestion: Remove cast from resolver once schema extended. Add catalogue-first + cursor search contract stubs in Phase 06 per BP-06.
- Status: open

### Issue 13 -- Severity: nit
- File: plannnerplan/2026-07-05_implementation-decisions.md:35-42 (Live routes table)
- Description: Correctly states `/planner/guest + /planner/canvas = Fabric (deployable)`, `/planner/open3d = Pilot only`. Matches Failures.md recent corrections and OOPlannerWorkspace hybrid (imports FeasibilityCanvas from canvas-fabric). Some phase files and older docs still carry "native Open3D" language that was cleaned in root Failures.md.
- Suggestion: Audit all phase "Architecture" sections for "native" vs "hybrid" wording. Keep I-D as source of truth.
- Status: open

### Issue 14 -- Severity: bug
- File: plannnerplan/phases/08-persistence-and-migration.md:48 (08-PERS-10) + Phase 02 error mapper
- Description: Version mismatch correctly mapped to 422 (fixed from critique). However, loader (Phase 02/06) currently has no versioned read path, so the 422 path cannot be exercised against the pointer files described in same phase.
- Suggestion: Implement pointer read in loader before claiming Phase 08 tests pass the taxonomy.
- Status: open

### Issue 15 -- Severity: suggestion
- File: plans/2026-07-04/benchmark.md:140-160 (Anti-copy check + cross-phase); plannnerplan/2026-07-05_quality-gates.md:100-110 (SVG tests)
- Description: Anti-copy and 5-product (Planner5D, Floorplanner, AutoCAD Web, Figma UI3, Sketchfab) are cited in I-D §Global Standard Framework and phase Decision logs. No generated assets yet from Phase 03 (script exists with goldens, but per Failures.md fixture execution was skipped in recent restores). Current public/svg-catalog/ has some SVGs but no live Puck.Render portal.
- Suggestion: Before Phase 03/05 "Implemented", run visual anti-copy review + document against benchmark §6. Capture in results/ per handbook.
- Status: open

## Additional Observations (no new issues)

- BP-01..BP-07 alignments and REC/REJ references from benchmark are present in the relevant phase files (01-INST-00, 02 schema anchor, 03 pipeline order verbatim, 04 allowed/disallowed packages, 05 Puck limit + anti-copy, 06 catalog contract, 09 3D paths).
- Option A pipeline order in Phase 03 exactly matches benchmark BP-03 and I-D.
- GeneratedAt freeze rule updated in Phase 02 Decision log + schema (freezeFresh vs freezeRewrite) + Phase 08 §08-PERS-05.
- 409 sticky suffixes now documented (lock_busy, hash_mismatch, save_conflict).
- Coverage floor 90% hard / 95% target and zero-bypass rules match exactly between I-D:99-102 and 2026-07-05_quality-gates.md:24-29.
- No `wip/todo/drafting` status literals (per critique hygiene).
- Registry alias rule + no-fork documented in I-D (even if path drifted).
- Hybrid state + pilot-only correctly captured in I-D live routes and recent Failures.md entries.
- Phase 09 mixes 3D/export/AI (scope creep flagged in critique) remains; fenced by Tier-3 reservation.

## Verdict Inputs for Other Reviewers

- **Coherent?** Partial. Governance sources agree; execution artifacts and status claims do not.
- **Ready for next phases?** No. Resolve status hygiene (Issue 1), evidence paths (2), schema/ loader / registry handoffs (3-5), and explicit Global Standard Gate items (6) first. Run fresh benchmark + full gate evidence after.
- **Risks:** Premature "Implemented" claims block rollback discipline. Casts + path mismatches will surface at Phase 03/06 integration. Missing portal + UI gates risk anti-copy / benchmark violations at promotion time. Coverage debt (PLAN-FAIL-0408/0412) + type debt remain Phase 01 blockers.
- **Next sensible step (per AGENTS):** Coordinator agent coordinates fixes to the 5 high-signal gaps (status + evidence + 3 handoff seams), then re-author dated benchmark under `plannnerplan/benchmarks/`. Do not advance Phase 02/03/04 without independent review sign-off.

---

**End of Critic review.** All citations are to lines/sections in the three mandatory inputs or directly inspected files listed above. No fixes applied.