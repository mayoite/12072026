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

### REACT-BP-CRITICAL-1-3 — 2026-07-06 (scoped fixes applied)
**Status:** Addressed in this task (CRITICAL async-parallel + bundle-dynamic only) · full gate not run
**Scope:** Top 3 CRITICAL from results/react-best-practices-review.md (in worktree):
- async-parallel/defer-await for user+searchParams in planner workspace pages.
- async-parallel in catalogQuery.ts (descriptor+API).
- bundle-dynamic-imports for Open3dPlannerHost on direct /open3d route.

**Files touched (min necessary, production only):** 
- site/app/planner/open3d/page.tsx
- site/app/planner/(workspace)/canvas/page.tsx
- site/app/planner/(workspace)/fabric/canvas/page.tsx
- site/features/planner/open3d/catalog/catalogQuery.ts

**Evidence runs (via scripts/run-evidence-cmd.ps1 per START/AGENTS/testing-handbook):**
- results/site/react-best-practices-fix/typecheck/ (exit 0, tsc --noEmit clean)
- results/site/react-best-practices-fix/lint-scoped/ (exit 0 on exactly the 4 files; used site's eslint.config + --max-warnings=0)

**Skips / notes (per AGENTS.md Honesty + Test Evidence + Scope):**
- Did not run full `pnpm run lint` (pre-existing ~130 unrelated errors per active PLAN-FAIL-0410; would pollute evidence).
- Did not run full `pnpm run typecheck` from root outside filter (scoped used).
- No tests, no build, no coverage, no playwright (out of scope for "quick typecheck/lint via evidence script if possible").
- Overwrote evidence artifacts on re-runs of same <name> (policy prefers distinct names for historical; latest is passing).
- One latent @typescript-eslint/consistent-type-imports surfaced+fixed during scoped lint on catalogQuery (changed value import of Open3dCatalogClient to type-only; pre-existing in original, not caused by parallel logic).
- Review report source was in worktree results/; main D:\oandO04072026 state used for edits (per user).
- No changes to non-listed files, no docs created, no unrelated refactors.
- route segment `export const dynamic` preserved alongside nextDynamic alias import (no scope creep).
- Parallel in catalogQuery always kicks API (tradeoff for no-waterfall on fallback path); client state re-asserted for descriptors to preserve semantics/side-effects.

**Blockers:** None for this scoped task. Full release gate (per Failures) still blocked on coverage floor + pre-existing lint. Next step for test-writer: add unit test for loadOpen3dCatalog parallel paths + e2e timing if needed.

**Log per AGENTS "Done":** Skips and evidence paths recorded here. Work matches ask exactly.
