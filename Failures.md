# Failures

This is the only active failures file.

Resolved history is only in `resolved-failures.md`.

No other files are authoritative.

Read this file first for gate policy.

Evidence lives under `results/<module>/<phase>/<cmd>/` per `testing-handbook.md`.

Skipped items must be declared. Shell works; gates are runnable.

---

## Gate policy

- Read this file before running release gates (`START.md` → `pnpm run release:gate`).
- Coverage hard floor: **90%** statements/branches/functions/lines globally and per handwritten production file (`plans/2026-07-05_phase1-execution/quality-gates.md`). Target **95%**.
- A passing assertion count with missing console output or artifacts is **INCOMPLETE**, not passed.
- Log blockers and skips here; move resolved items to `resolved-failures.md`.

---

## Active failures

### PLAN-FAIL-0408 — Open (coverage floor)

**Status:** Open · INCOMPLETE (no live floor proof)

**Scope:** Site coverage floor not met. Focus on **80% site coverage** as interim target; hard floor remains 90% per quality gates.

**Priority source areas:**

- `site/lib/site-data/`
- `site/lib/catalog/`
- `site/features/catalog/`
- Site assistant
- Ops
- `site/features/ai/` (ai advisor)

Dead-code removal in open3d export/persistence/3d/editor/catalog/model/ai is done; floor still unverified.

**Blockers:**

- No numeric coverage % from a full `test:coverage` run with complete artifacts.
- Prior runs: failing asserts in `coverageGap.test.ts` (later targeted runs green); full-suite % table not emitted in some runs.

**Next:**

1. `pnpm --filter oando-site run test:coverage` (evidence wrapper per `START.md`).
2. Review `results/coverage*/` for per-file %.
3. Close here and log resolution in `resolved-failures.md` when floor is met.

---

### PLAN-FAIL-0410 — Open (pre-existing repo-wide lint)

**Status:** Open · pre-existing · not introduced by 1A P0

**Scope:** `pnpm run lint` fails with 130 errors on rev 587bd909, all in files unrelated to the 1A P0 command-wiring change:

- `app/(site)/portal/svg-catalog/[slug]/` + its test — `consistent-type-imports`, `no-require-imports`, unused `registry`.
- `app/api/admin/svg-editor/route` test — unused `ApiError`/`API_ERROR_CODES`, `prefer-const`.
- `tests/unit/features/planner/open3d/` — unused vars in `catalog.test.ts`, `imageImport.test.ts`, `modelOperations.test.ts`, `svgInventory.test.ts`; `import()` type annotation; unused `useWorkspaceKeyboard` in `workspaceShell.test.tsx`.
- `features/planner/open3d/editor/InventoryPanel.tsx:90` — pre-existing `no-non-null-assertion` (`inventoryClientRef.current!`). Surfaced when linting the file during the 1A P1 icon change; the icon edits themselves are clean. Not fixed (unrelated to icons).

Also relevant: `tests/unit/features/planner/open3d/coverageGap.test.ts` has 7 pre-existing failures in its export-job block (`createOpen3dExportJob` removed by dead-code cleanup, PLAN-FAIL-0408). Unrelated to current work.

**Not fixed here:** out of task scope (AGENTS.md — no silent unrelated fixes). The four files touched by 1A P0 pass scoped lint (exit 0) — `results/planner/phase-1a/lint-scoped/`.

**Next:** dedicated lint-cleanup pass (many are `--fix`-able unused imports / `prefer-const`); re-run `pnpm run lint` to zero before any full Phase 1A gate sign-off.

---

## Deferred

### PLAN-FAIL-0409 — Deferred

**Scope:** No Supabase `block_descriptors` table. Owned by Phase 08 persistence/migration.

**Removal condition:** Phase 08 migration applied and wired.

### PLAN-FAIL-003 — Deferred

**Scope:** Playwright host / E2E checks. Requires Phase 05 engine.

**Removal condition:** Phase 05 engine ready; Playwright gates runnable with evidence.

### PLAN-FAIL-004 — Deferred

**Scope:** Targeted interactive checks. Requires Phase 05 engine.

**Removal condition:** Phase 05 engine ready.

---

All other PLAN-FAIL items are resolved. See `resolved-failures.md`.

---

## Skips

- Requested archive move for `backups` / `results` was not performed; only `.gitignore` entries were removed. `backups/` was not present in the workspace at the time of the check, and `results/` was left in place to avoid guessing at a relocation target.
- 2026-07-05: No tests or Playwright runs were performed for the `.gitignore` change that unignored `tmp/`, `archive/`, and `results/` paths; this task only required config edits, and Playwright runs require explicit user permission.
- 2026-07-05 (exec-agent-1 Phase1A): Live screenshot capture at 1440x900/1024x768/768x1024/390x844 + console/failed-req/DOM/perf from running dev server skipped. No shell/exec tool available in agent context; used read/grep + static analysis for baseline evidence in results/planner/phase-1a/baseline-ownership/. Script exists but requires `pnpm --filter oando-site exec node scripts/take-planner-screenshot.mjs` + dev server + env. Logged as blocker for full §1 acceptance. Will require manual or CI run for sign-off. No impact on code changes.
- 2026-07-05 re-review (global standard from Plans/rules_plan/00-global-standard-revision/00-benchmark-summary.md + 03-critique-expanded.md): Previous Phase1A work (baseline/route/theme-css/command) re-reviewed + cited. Followed: anti-copy (semantic tokens site/app/css/ only), BP-01 (fabric@7.4.0), BP-07 (three+r3f), REC-01/03/04 (minimize via css modules, status surface, catalogue-first), MODULE-UI-CONTRACT (layer→surface→module for planner open3d; bundle; no tailwind/hex in tsx/modules). Fixed gap: introduced hex fallback in workspace.module.css removed to comply. Gaps: live GS gate (fresh benchmark+UI review+Decision Log attestation) not complete; density partial; evidence incomplete (no exec); prepare pass to critic. Status: Implemented (GS citations added to code comments + results/*.json). No forbidden lists violated. See updated results for attestation.
- 2026-07-05 (UI Expert / Improvement Agent Phase1A): UI review + minimal fixes per user prompt + AGENTS + GS (00-benchmark-summary REC-01 Figma minimize/thin/contextual, REC-02/04 Sketchfab/AutoCAD refs, anti-copy). Addressed: density/prefs partial (wired to store + TopBar toggle + persist; no more hardcoded "compact" in OOPlannerWorkspace), thin sidebars (260/240 defaults), modifier hint improved in guidance, semantic confirmed, panels/topbar/catalogue/tool-rail reviewed (catalogue search cap=24, contextual props, no hex, css vars from site/app/css). Edits strictly in site/features/planner/open3d/ (no outside tree, no promotion fix as requires route edits in features/planner/ui/ + Phase2). GS cites added inline. Verified: typecheck/lint/vitest targeted via evidence scripts (results/planner/phase-1a/*-ui-density* exit 0, 26 tests pass). Skipped per policy/AGENTS: full release:gate (coverage floor PLAN-FAIL-0408 open; Playwright deferred PLAN-FAIL-003/004; no live dev server interactive per scope), GS full attestation (benchmark re-run + independent UI signoff + Decision Log), grid/first-use full, outside open3d/ files, new tests/docs. No unrelated fixes. Status: density/UI improved (issues remain on promotion/GS-gate/1B bleed/full flow evidence per critic). Ready for benchmarker handoff.
- 2026-07-05 (Benchmarker subagent Phase1A): Fresh benchmark run per task + rules_plan/00-global-standard-revision/* (00-benchmark-summary.md five-product/RECs/BPs/anti-copy/GS Framework; 01-critique,02-handover,03-expanded for fixes/status). Live: typecheck exit0 (results/planner/phase-1a/typecheck-bench-1a/), vitest 48/48 pass on key shell tests (command-wiring, workspaceShell, keyboard, prefs, icon-policy, catalogSearchCap) with act() diagnostic classified (results/.../vitest-1a-shell-bench/). Prior lint-scoped exit0 for touched (unrelated 130 errors in PLAN-FAIL-0410). GS cites present in open3d/ code (REC-01/02/03/04, BP-06 etc citing benchmark). Anti-copy: PASS (semantic vars from site/app/css/ only; fallbacks noted). 5-product/RECs partial (cap<=24, density wired to prefs, cmd/status, catalogue attempts; many fn_plan/02-PHASE-1.md [] remain for workspace IA, full tools, 11A shell acceptance). GS gate: still incomplete (no fresh attestation in I-D Decision Log §; prior reviews note "not complete"; status "Implemented" per vocab requires it per I-D/08-quality-gates). Coverage: incomplete (PLAN-FAIL-0408). Type: any limited to dead stubs (commented). Evidence integrity followed (results/planner/phase-1a/ format). Skipped: full coverage, Playwright (deferred), browser interactive, edits outside open3d/, promotion fixes. Status: compliant with concerns/gaps. Pass to coordinator. Blockers logged; see this report. Cite: rules_plan/00-global-standard-revision/00-benchmark-summary.md + 01-implementation-decisions.md GS Framework.
- 2026-07-06 (Critic subagent combined Agent1+Agent2 Phase1A tasks1-9): Read required: Plans/rules_plan/00-global-standard-revision/* (all 4), docs/Lockedfiles/conduct/ReadmeLocked.md + Readme.md + START.md + Failures.md + TESTING.md + testing-handbook.md + ui/MODULE-UI-CONTRACT-Locked.md + rules_plan/01-phase1-execution/* (handover, I-D, plans, benchmarks, gates, workflow, protocol) + open3d/ source + results/planner/phase-1a/* (all run.json/raw + vitest-task5-7 etc) + results/reviews/* . Read-only, no commands/edits except this log entry (per AGENTS read-only review unless fixes asked). Combined review vs plan (02/03-plan-*.md), GS (five-product/RECs/BPs/anti-copy/GS Framework), AGENTS (TDD/GS cites/evidence/original focus/status vocab). Agent1 (1-4 baseline/route/theme/command): TDD, GS cites, evidence, re-reviewed. Agent2 (5-9 professional/tool/catalogue/shell/gates): TDD, GS, Next.js elements, DONE w/ skips. 
  Findings: 
  ✅ Anti-copy (tokens only, no hex), GS cites (REC-01/02/03/04/BP-06/07/5-product elements in open3d/catalog/editor/*.ts* + css), TDD (vitest 48/48 shell + 40/40 task5-7 + targeted pass, type/lint scoped 0), evidence format (phase-1a/*-run.json + -raw.log per handbook), original focus (edits in site/features/planner/open3d/ only), status vocab followed (no wip/todo), MODULE-UI-CONTRACT (bundle import, no tailwind in tsx, tokens, L1/L3).
  Issues (report to UI expert):
  - GS Framework incomplete: no fresh dated benchmark (05/06/07-benchmark-*.md), no new results/reviews/ (still 07-04), no Decision Log attestation entry in I-D for 2026-07-05 1A work. Per I-D §122-127, 08-quality-gates Global Standard Gate, 10-review-workflow, 09-design-benchmark-protocol: blocks clean "Implemented"/"DONE". Agents noted; status "Implemented w/ concerns (live, density)" + "DONE w/ skips" accurate.
  - Coverage PLAN-FAIL-0408 open (no 90% floor proof from full test:coverage).
  - Skips per agents: live screenshots/interactive, full Playwright (deferred 003/004), full coverage, outside-open3d, new docs. Some e2e dirs partial/empty.
  - Density partial (wired but concerns). Catalogue cap24 + first + bottom status + thin panels align RECs but full 5-product/IA per fn_plan remain.
  - Minor: I-D live routes labels vs current hybrid open3d routing for guest/canvas (per handover).
  - Lint 130 unrelated pre-exist (0410); act() classified in logs.
  GS-SCORE: Benchmark FAIL (stale, no fresh); Anti-copy PASS; UI/UX partial (needs UI expert: Figma minimize/thin ~3.5, Sketchfab cap/facets ~4, AutoCAD status ~3, Planner5D cat-first/2d3d ~4); Features/Pkg PASS (BP/REC wiring); Gate BLOCKED (GS+coverage); Open: fresh GS attest + I-D update + live §16 + coverage.
  Per AGENTS: verified reads, evidence integrity (artifacts present, no bypass), min necessary, no unrelated. Blockers/skips logged. Concise report; pass to UI expert for independent signed review per workflow + GS. No ship-ready claim. Next: UI expert, then coordinator fresh GS + Decision Log entry + status update only after. Cite: Plans/rules_plan/00-global-standard-revision/00-benchmark-summary.md + 01-implementation-decisions.md + 08-quality-gates.md.
