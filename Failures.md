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

### TECH-REV-2026-07-06 (transient — tech-stack-generator revision)

**Status:** Completed in-session (no new failure opened)

**Scope:** site/tech-stack-generator site-workflows support + theme sync to core/tokens/theme.css + utilities (no isolated)

**What ran (evidence captured under results/tech-stack-generator/revision/):**
- emit-renderer-data (populated siteWorkflowRecords)
- typecheck (tech)
- test:tech-stack (exit 0, data-loaders exercised)
- build (Vite, exit 0)
- check-theme-alignment (exit 0)

**Skipped (per AGENTS minimum + scope):** full `docs:gate:tech-stack`, release:gate, playwright (tech has none), coverage (not required for this), root lint (pre-existing unrelated). No heavy gate before ship per Failures read.

**No blockers.** All evidence preserved. Per testing-handbook + START.md. (Logged for honesty; not a persistent PLAN-FAIL)

### PR-VERIFY-c71e7812 (transient — standalone runtime fix for generate-svg)

**Status:** Completed (no new failure; this PR's verification only)

**Scope:** site/scripts/prepare-standalone.cjs + site/features/planner/admin/svg-editor/svgPipelineRunner.ts (copy script/_fixtures + path support for standalone deploys)

**What ran (evidence under results/site/pr-c71e7812/ ):**
- git checkout (branch)
- read required: AGENTS.md, Readme.md, START.md, Failures.md (re-read before gates), TESTING.md, testing-handbook.md, docs/Lockedfiles/...
- read target files + generate-svg.mjs + related for root cause
- edits (prepare + runner) + git diff verify
- prettier --write + --check (exit 0 post)
- lint-scoped (runner: pre-existing 3 unused only, no new from our code; cjs out of eslint scope)
- typecheck (site/scripts + targeted runner: exit 0 for clean build of change; pre-existing in other scripts)
- manual evidence wrappers for all per handbook (no bypass)

**Skipped (per AGENTS min scope + no heavy gate):** full pnpm run lint (pre-existing unrelated), release:gate, build (needs env+heavy, not required for script fix), coverage, playwright, typecheck full without skipLib. No commit/push. No output fetch on other subagents. No extra files created.

**Files changed (final after fmt):** site/scripts/prepare-standalone.cjs , site/features/planner/admin/svg-editor/svgPipelineRunner.ts
**Key decision:** chose copy in prepare + minimal path support in runner (smaller than refactor to static import which wouldn't eliminate side-effect or fixture write path issues without more edits).
**Verification:** git diff; all evidence files present; typecheck exit0; prettier clean; our code adds no new lint/type issues.

**No blockers.** Logged per AGENTS Done + Honesty.
