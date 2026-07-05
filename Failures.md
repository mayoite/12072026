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
