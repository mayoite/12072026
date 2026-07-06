# QA Review — Planner Work vs Governance (2026-07-04)

**Reviewer role:** QA  
**Review date:** 2026-07-04  
**Branch context:** orchestrator/hotfixes-2026-07-04  
**Mandatory inputs fully read (multiple passes):**  
- `plans/2026-07-04/benchmark.md` (full)  
- `plannnerplan/2026-07-05_implementation-decisions.md` (full)  
- `plannnerplan/2026-07-05_quality-gates.md` (full)  

**Additional inspected (read_file, grep, list_dir):**  
- `plannnerplan/FAILURESPLAN.md` (full), `plans/2026-07-04/HANDOVER.md` (full; note plannnerplan/HANDOVER.md is redirect stub), `plannnerplan/phases/*.md` (all 11), `results/reviews/critic-review.md`  
- New test: `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` (full, 1022 lines)  
- Core impl: `site/features/planner/open3d/catalog/svg/{blocksResolver.ts, svgTypes.ts, svgBlockDescriptorLoader.ts}`  
- Evidence dirs: `results/` (root), `results/planner/*`, `results/tests/`, `results/reviews/` (absence of `results/qa/`), `site/block-descriptors/` (empty)  
- Cross-refs: `Failures.md`, `testing-handbook.md`, `AGENTS.md`, `Readme.md`, `START.md`, `docs/Lockedfiles/ReadmeLocked.md`, `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md`, `plannnerplan/benchmarks/INDEX.md` + phase-00-precheck.md  
- Phase evidence: `results/planner/phase-01/typecheck/typecheck-run.json`, `results/planner/phase-02/tests/vitest-output.txt`, `results/planner/phase-02-qa/tests/vitest-stdout.log`, `results/tests/vitest-results.json`  
**Method:** Read-only per AGENTS.md (re-read AGENTS/ReadmeLocked/START/Failures/testing-handbook first; no terminal commands, no code edits, no runs). All claims checked against live FS state via list_dir/read/grep. Falsifiable assertions prioritized. 

## Summary

The QA review identifies systemic non-compliance with `plannnerplan/2026-07-05_quality-gates.md` (source-quality, test layers, Global Standard Gate, phase exit rules, 95%/90% coverage floors, zero-bypass) and `plannnerplan/2026-07-05_implementation-decisions.md` (status vocabulary "Planned/Implemented/Verified...", "lack of permission" rule). Key falsifiable gaps: claimed evidence artifacts at `results/qa/resolver/test-planner/` (and sub files) do not exist (list_dir fails; only `results/planner/phase-*/` and root `results/tests/` present); Phase 02 "Implemented + Verified-at-unit (25/25)" in `plans/2026-07-04/HANDOVER.md:22` and `FAILURESPLAN.md:59` directly contradicts phase file header `plannnerplan/phases/02-*.md:4` ("Status: Planned") and broader baseline failures (e.g. `results/planner/phase-02/tests/vitest-output.txt` shows 8 failures in blockDescriptor.test.ts). The `blocksResolver.test.ts` (new, many >25 its) relies on schema seam (cast at `blocksResolver.ts:82`, absent `blocks` field in `svgTypes.ts:329` BlockDescriptorCommonBaseSchema) tracked as open `PLAN-FAIL-0413`; pre-existing type debt `PLAN-FAIL-0412` (27 errors in phase-01 typecheck-run.json) and missing Global Standard Gate artifacts persist. Alignment of `plans/2026-07-04/benchmark.md` FACTs/BPs/RECs with actual evidence and phase checklists is partial (e.g. loader uses flat .json, no versioned pointer; GS checklist items incomplete in phases 03-06/10). High risk of premature claims; no proof of 90%+ floor, mandated run.json+raw.log format, or live validation.

## Issues

### Issue 1 -- Severity: bug
- File: plans/2026-07-04/HANDOVER.md:22 (and 34-49), plannnerplan/FAILURESPLAN.md:59 (resolution history)
- Description: Asserts "Phase 02 — Implemented — `resolveBlocks()` unit-verified" + "Verified-at-unit 2026-07-04 (resolver-test-author)" + "25/25 cases pass" + evidence at `results/qa/resolver/test-planner/` (test-planner-run.json, test-planner-raw.log, blocksResolver-focused-raw.log, 128553 bytes). `list_dir results/qa` returns "does not exist". No files matching the pattern anywhere under results/. `testing-handbook.md:28-35` and `2026-07-05_quality-gates.md:47-49` + `AGENTS.md` require `results/<module>/<phase>/<cmd>/` with `<cmd>-run.json + <cmd>-raw.log`. Actual partial evidence (e.g. `results/planner/phase-02/tests/vitest-output.txt`, `results/tests/vitest-results.json`) shows unrelated pre-existing failures and does not contain resolver-focused artifacts. Broader `pnpm --filter oando-site run test:planner` baseline failures (8 in blockDescriptor.test.ts per phase-02 logs) are mentioned but not isolated.
- Suggestion: Remove "Implemented/Verified-at-unit" claims until a compliant run (with preserved run.json/raw.log under correct results/planner/phase-02/... or equivalent) is executed and reviewed. Update all cross-refs (HANDOVER, FAILURESPLAN, design spec) to actual paths or note "no artifact generated — file-tools only". Reconcile with phase file "Planned".
- Status: open

### Issue 2 -- Severity: bug
- File: plannnerplan/phases/02-catalog-source-of-truth-and-blockdescriptor.md:4 (header), plannnerplan/phases/02-*.md:81 (exit gate), plans/2026-07-04/HANDOVER.md:22, plannnerplan/FAILURESPLAN.md:59, plannnerplan/2026-07-05_implementation-decisions.md:26-29
- Description: Phase 02 file declares `Status: Planned`. Exit gate says "`Planned → Implemented` after schema + loader + tests green". But HANDOVER/FAILURESPLAN assert advancement to Implemented/Verified-at-unit solely on the new resolver test (without Phase 03 integration or Phase 06 loader consumption). This violates `2026-07-05_implementation-decisions.md:26-29` ("use only these words"; "Lack of permission to run a check allows `Implemented`, never `Verified`/`Accepted`") and `2026-07-05_quality-gates.md:124` ("If checks lack permission, code may be reported `Implemented, verification pending`; the phase is not accepted.") + phase exit rule (Q-G:110-120 requires applicable gates + evidence + no unexplained skips + coverage floor).
- Suggestion: Keep phase file at "Planned". Remove "Implemented/Verified" language from HANDOVER/FAILURESPLAN until full Phase 02 exit gate + integration evidence + Global Standard Gate (if applicable) are met with preserved artifacts. Add explicit "verification pending" qualifier per I-D rule.
- Status: open

### Issue 3 -- Severity: bug
- File: site/features/planner/open3d/catalog/svg/blocksResolver.ts:82 (`const explicitBlocks = (descriptor as { blocks?: unknown }).blocks;`), site/features/planner/open3d/catalog/svg/svgTypes.ts:329 (BlockDescriptorCommonBaseSchema ends without `blocks`), site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts:120-129 (attachBlocks + `as BlockDescriptor & { blocks: unknown }`), plannnerplan/FAILURESPLAN.md:39 (PLAN-FAIL-0413), plans/2026-07-04/HANDOVER.md:48-49
- Description: `BlockDescriptor` (and CommonBase) has no `blocks?: ...` field per schema (grep confirms zero "blocks" matches in svgTypes.ts). Resolver and test use cast/extension at boundary. PLAN-FAIL-0413 correctly tracks "Schema-extension is the cleanest seam so the cast ... can be removed" with handoff 02→06 and removal condition. Benchmark BP-02 (benchmark.md:76-81) and Phase 02 §02-CAT-01-11 assume single contract consumed by Phase 03/04/06, but seam means contract is incomplete. Test header claims "honours AGENTS.md Type Safety" but production cast remains.
- Suggestion: Extend `BlockDescriptorCommonBaseSchema` (and variants) with optional typed `blocks` array (per PLAN-FAIL-0413 removal condition). Remove cast from resolver. Update Phase 02/06 checklists, FAILURESPLAN, and re-verify round-trips before any verification claim. Do not cite resolver as "unit-verified" while seam open.
- Status: open

### Issue 4 -- Severity: bug
- File: plannnerplan/2026-07-05_quality-gates.md:59-69 (Global Standard Gate (Binding) + "Applies to Phases 03, 04, 05, 06, 10"), plannnerplan/2026-07-05_implementation-decisions.md:113-119 + 129-130 ("Phases 04/05/06/10 must add 'UI Global Standards Gate' checklist items"), plannnerplan/phases/03-*.md:133, 04-*.md:152, 06-*.md (Decision logs cite "UI/GS gates added" + benchmark), results/ (no dedicated GS review artifacts)
- Description: Gate is release-blocking: requires "Fresh dated benchmark report exists. Independent UI review (REVIEW-WORKFLOW) signed off. Anti-copy + pattern attestation in Decision Log." Before "Implemented". Phases contain provisional notes and BP cites (benchmark.md §4 BP-01..07) but no explicit `## UI Global Standards Gate` subsection or full checklist items (Figma minimize-UI, Sketchfab cursor, AutoCAD command, catalogue-first, anti-copy attestation citing specific benchmark §). `results/reviews/` has only critic-review.md; no signed GS/UI artifacts. PLAN-FAIL-0415/0416 remain Open in FAILURESPLAN. `plans/2026-07-04/benchmark.md:136-139` anti-copy check and §7 table incomplete for later phases.
- Suggestion: Add explicit dedicated `## UI Global Standards Gate` + `## Global Standard Gate` subsections with traceable items to phases 03/04/05/06/10 before any status advance. Produce independent review artifacts under results/ per REVIEW-WORKFLOW. Treat as blocker per Q-G; cite benchmark date + § sections in Decision logs.
- Status: open

### Issue 5 -- Severity: bug
- File: site/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader.ts:80 (BLOCK_DESCRIPTORS_DIR_DEFAULT), :134 (`path.resolve(dir, `${slug}.json`)`), readDescriptorFile and guards, plannnerplan/phases/08-*.md:24 (08-PERS-02), 42, 48 (pointer + atomic rename `{slug}.{n}.json` + latest), plannnerplan/phases/02-*.md:40 (loader claims Phase 02/06)
- Description: Loader hardcodes flat `${slug}.json` + simple exists/read (no version rotation, no .latest.json pointer, no atomic rename handling). Contradicts Phase 08 persistence contract (JSON-on-disk v1 with rotation per I-D:70 and FAILURESPLAN). Phase 02 loader checklist (02-LOAD-01-03) and re-exports assume contract but do not match persisted shape. `site/block-descriptors/` is empty (no fixtures). Phase 08 deferred per PLAN-FAIL-0409 but loader already claims reader role.
- Suggestion: Align loader (and tests) to pointer/rotation semantics owned by Phase 08; add explicit seam note + traceability ID in Phase 02/06/08 checklists. Do not claim loader complete until dual contract verified.
- Status: open

### Issue 6 -- Severity: bug
- File: results/planner/phase-01/typecheck/typecheck-run.json (27 errors listed: TS2724 _Open3d* private re-exports, TS18048 undefined, etc.), plannnerplan/FAILURESPLAN.md:37 (PLAN-FAIL-0412 full), plannnerplan/phases/01-*.md:4 ("Status: Planned"), results/planner/phase-02-qa/typecheck/ (similar errors in stdout)
- Description: Phase 01 typecheck debt (pre-existing, not caused by install) blocks per FAILURESPLAN. `results/planner/phase-01/typecheck/typecheck-run.json` + stdout capture the exact errors (e.g. advisorTypes, aiAdvisor, catalogClient, ThreeLazyViewer). Phase 01 exit gate and benchmark BP-01/FACT-01 require clean engine lock + typecheck. No resolution evidence; phase remains Planned but HANDOVER claims parallel progress.
- Suggestion: Resolve or explicitly scope the 27 errors (per AGENTS type-safety + narrow exemption rules) before Phase 01 Implemented claim. Preserve the typecheck-run.json + raw as gate evidence. Update rollback criteria cross-refs.
- Status: open

### Issue 7 -- Severity: bug
- File: results/planner/phase-02/tests/vitest-output.txt:1- (blockDescriptor.test.ts 34 tests | 8 failed), results/planner/phase-02-qa/tests/vitest-stdout.log (identical 8 fails on parse/freeze paths), site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts (claims 25/25 across 5 describes but file contains >>25 its; uses freezeFreshDescriptor + attach), plannnerplan/FAILURESPLAN.md:59 (attributes broader exit 1 to pre-existing)
- Description: New resolver test (25/25 focused claim) sits atop pre-existing failures in related Phase 02 catalog tests (parse fixed/configurable/parametric, freeze, hash, etc.). The focused `blocksResolver-focused-raw.log` is missing; general vitest-results.json reports 17 failed overall. Test layers in Q-G (unit + integration round-trip) require green baselines, not isolated new-test pass. BlockDescriptorLoader.test also shows failures in logs.
- Suggestion: Fix baseline failures in blockDescriptor*.test.ts + loader.test.ts before claiming resolver "unit-verified". Rerun full Phase 02 slice under mandated results/planner/phase-02/... harness (run.json + raw.log) and attribute all skips/failures. Do not cite 25/25 in isolation.
- Status: open

### Issue 8 -- Severity: bug
- File: plans/2026-07-04/benchmark.md:29-48 (FACT-02,03,04,06,08,10), plannnerplan/2026-07-05_quality-gates.md:20-30 (mandatory source-quality: 95% target/90% hard floor, zero any/@ts-ignore/ESLint-disable/coverage-ignore/skipped-test in converted-planner), plannnerplan/2026-07-05_implementation-decisions.md:99-101 + 120, AGENTS.md + testing-handbook.md (no broad any exemption)
- Description: No coverage evidence (run.json + reports) under results/ for the resolver work or Phase 02 at 90% floor (global or per-file). Historical notes in Failures.md show ~57-59% OOPlanner; recent scoped runs fail thresholds. Benchmark FACT-03/Q-G explicitly require floor + "Missing console/report artifacts make coverage incomplete". No per-file reports for blocksResolver/svgTypes. Casts + test fixtures noted but production impact unmeasured.
- Suggestion: Execute compliant coverage run (per testing-handbook + Q-G) scoped to Phase 02 catalog + resolver; preserve artifacts. Report target vs floor status separately. Do not advance phases without it.
- Status: open

### Issue 9 -- Severity: bug
- File: plannnerplan/phases/02-*.md:70 (02-TEST-01/02 round-trip + irregularity), site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts:1- (covers explicit/synth/empty/invalidShape/default-id but relies on attachBlocks cast), plannnerplan/FAILURESPLAN.md:48 (outstanding handoff to Phase 03 for synth semantics + Phase 06 for blocks field)
- Description: Phase 02 test layer (Q-G:33-40) requires generator round-trip + Zod → loader. Resolver test is unit-only; no integration with scripts/generate-svg (Phase 03 not present per PLAN-FAIL-0402), no fixture files in site/block-descriptors/, no end-to-end with loader (which hardcodes flat .json). Test uses `freezeFreshDescriptor` + schema but does not exercise full parseBlockDescriptor + checksum + generatedAt freeze paths (some covered in separate failing blockDescriptor.test).
- Suggestion: Add true round-trip tests exercising loader + resolver + (once Phase 03 exists) generator. Ensure fixtures present before claiming 02-TEST gates. Update exit gate language.
- Status: open

### Issue 10 -- Severity: suggestion
- File: plans/2026-07-04/benchmark.md:70-81 (BP-02 schema anchoring + Phase 02/03/04/06 traceability), plannnerplan/phases/02-*.md:17 (Schema anchoring cites BP-02), plannnerplan/phases/* (partial BP cites in 01/03/04/05/06/10), plannnerplan/FAILURESPLAN.md:70 (2026-07-04 Global Standard Intensification)
- Description: BP cites and benchmark cross-refs present in several phases and governance, but incomplete vs benchmark §7 table (e.g. Phase 03/05/06 lack full pipeline/anti-copy/search parity enforcement in code). Phase 02/04 Decision logs note "Global Standard Gate applies" but no execution evidence or re-benchmark. Anti-copy (benchmark §6) and RECs/REJs not yet falsifiably verified in catalog/inventory impl.
- Suggestion: Complete BP traceability matrix in benchmark §7 + each phase. Re-run dated benchmark (per its stale-evidence policy) after phase stabilization. Add explicit "BP-XX verified: <evidence path>" lines.
- Status: open

### Issue 11 -- Severity: nit
- File: plannnerplan/phases/00-*.md (YAML frontmatter + Status table), plannnerplan/phases/01-*.md:4 (uniform "Date: ... Status: Planned"), benchmark.md:FACT-07, critic-review.md
- Description: Phase 00 deviates from the plain-Markdown template used by 01-10. Phase files are the binding layer per I-D. Minor inconsistency affects machine parse + audit.
- Suggestion: Normalize Phase 00 header to match siblings (no functional impact on gates).
- Status: open

### Issue 12 -- Severity: bug
- File: site/features/planner/open3d/catalog/svg/blocksResolver.test.ts:29- (test header claims "No `: any`, no `as any`..." + "unknown casts are confined to the test fixture boundary"), blocksResolver.ts:82 (production cast), AGENTS.md (Type Safety), testing-handbook.md:80-90
- Description: Test narrowly complies (exempt per handbook for tests/mocks), but production resolver cast + schema mismatch is not a test-only concern. Broader type debt (0412) and any/eslint in scripts/components noted in FAILURESPLAN 0411 (handed off to QA reviewers). No adjacent reason/owner/removal for production cast.
- Suggestion: Remove production cast once schema extended (per Issue 3). Audit all planner production code for remaining any/casts; document narrow exceptions only.
- Status: open

### Issue 13 -- Severity: bug
- File: plannnerplan/2026-07-05_quality-gates.md:110-120 (phase exit rule: automated gates + visual/interaction evidence + no unexplained warnings/skips + coverage >=90% + blockers in HANDOVER/FAILURES + staging verified + moved production verified), plannnerplan/phases/02-*.md:80 (exit gate), Failures.md (multiple "Skipped: typecheck, build, Playwright..." entries)
- Description: No evidence of full exit gates passed for any phase (e.g. Phase 02 lacks integration, coverage, loader alignment, GS gate). Recent Failures entries explicitly note skipped broader gates. Claims of "unit-verified" do not satisfy "phase exits only when...". No promotion manifest or dual-read evidence.
- Suggestion: Before any "Implemented" (let alone Verified), execute full applicable gates per Q-G table + exit rule on one revision; preserve all artifacts. Log exact skips in HANDOVER/FAILURES.
- Status: open

### Issue 14 -- Severity: suggestion
- File: plans/2026-07-04/benchmark.md:140-160 (date stamp + stale-evidence policy), plannnerplan/benchmarks/INDEX.md + docs/superpowers/specs/... (cross-refs), results/ (no new dated artifacts for this review)
- Description: Benchmark is dated 2026-07-04 and additive per its §8. Multiple docs reference it (or archived copy). This QA review produces new dated artifact under results/reviews/ but no re-benchmark run or updated benchmark report. Cross-phase coherence table (§7) remains partial.
- Suggestion: After fixes, author dated follow-up benchmark or note "QA review 2026-07-04 applied; see results/reviews/qa-review.md". Update INDEX + design progress.
- Status: open

## Evidence Locations Checked (selected)

- Claimed: results/qa/resolver/... → does not exist (list_dir).
- Present: results/planner/phase-01/typecheck/typecheck-run.json (27 errors, PLAN-FAIL-0412), results/planner/phase-02/tests/vitest-output.txt (8 fails in blockDescriptor.test), results/planner/phase-02-qa/* (logs), results/tests/vitest-*.json (17 fails overall), results/reviews/critic-review.md.
- Sources: blocksResolver.ts:82 (cast), svgTypes.ts (no blocks field, full schema 329-420), loader.ts:134 (flat .json), blocksResolver.test.ts (full coverage of cases but seam-dependent).
- Governance: benchmark.md:FACT-02/03/04/08 (vocab, coverage, HANDOVER Planned, rollback cross-link gaps), I-D:26-29/67/113-119/129 (vocab, registry path, GS), Q-G:20-30/59-69/110-124 (floors, GS gate, exit, test layers).
- Phase status: all plannnerplan/phases/*:4 = "Status: Planned" (grep); only HANDOVER/FAILURES override Phase 02.

## Risks and Next

- Premature "Implemented" + missing artifacts risks violating honesty/evidence rules (AGENTS) and blocking later promotion.
- Handoff gaps (0413 schema, loader vs Phase 08, GS checklist) will surface at Phase 03/06 integration.
- Pre-existing baseline failures + type debt mean isolated 25/25 does not prove layer health.
- No permission exercised for runs (per task scope + AGENTS read-only review); relied on pre-existing results/ state.
- Sensible next: fix schema seam + evidence paths, run compliant Phase 02 slice (test + coverage) under results/planner/phase-02/... with full logs, add GS subsections to affected phases, reconcile status to "Planned" everywhere, re-verify with fresh dated artifacts before any gate claim.

**Verdict (one-sentence):** Evidence integrity, status vocabulary, Global Standard Gate, and phase-exit compliance are not met; multiple claims are falsified by missing artifacts and contradictions between governance, phase files, and live results/.

---

*This file written per task (results/reviews/qa-review.md). No other files modified. Per AGENTS: re-read docs, evidence-first, skips declared (no runs/commands), minimum necessary (only this review file), correctness before style. Blockers/skips noted here and should be logged to Failures.md by owner if required for ship.*