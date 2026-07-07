# Failures

This is the only active failures file.

Resolved history is only in `resolved-failures.md`.

Archived snapshots live under `archive/failures/`.

No other files are authoritative.

Read this file first for gate policy.

Evidence lives under `results/<module>/<phase>/<cmd>/` per `testing-handbook.md`.

Skipped items must be declared. Shell works; gates are runnable.

---

## Gate policy

- Read this file before running release gates (`START.md` → `pnpm run release:gate`).
- **Agent default:** do not run Playwright, browser automation, or full E2E on every task; prefer targeted Vitest, typecheck, and HTTP/API probes (`AGENTS.md` §Browser / E2E). Full browser/E2E is for explicit user request, release gate, or closing `PLAN-FAIL-0412` — not routine slice work.
- Coverage hard floor: **90%** statements/branches/functions/lines globally and per handwritten production file (`plans/2026-07-05_phase1-execution/quality-gates.md`). Target **95%**.
- A passing assertion count with missing console output or artifacts is **INCOMPLETE**, not passed.
- Log blockers and skips here; move resolved items to `resolved-failures.md`.

---

## Truth snapshot (2026-07-07, rev `8264d25`)

**Verified (live evidence):**

| Check | Result | Evidence |
|-------|--------|----------|
| `pnpm --filter oando-site run typecheck` | pass | `results/site/truth-reset-2026-07-07/typecheck/typecheck-raw.log` |
| `.env.local` via `loadEnvLocal.cjs` | loads | `SUPABASE_URL`, `PRODUCTS_DATABASE_URL` set |
| `seed-block-descriptors.ts` | 4 descriptors + `loadAll` OK | prior session |
| Targeted vitest (catalog/svg) | 27/27 + `coverageGap` 254/254 | prior session |
| Planner/SVG on `main` | merged + standalone patches | `8f4f0fa`, `76f39a5`; docs `8264d25` |
| `terminals/` agent logs | removed from repo | commit `8264d25` (local; **not pushed**) |

**INCOMPLETE / failed:**

| Check | Result |
|-------|--------|
| `pnpm run test` with `.env.local` | **INCOMPLETE** — run interrupted; no final Vitest summary line |
| Failures observed before interrupt | **≥115** failed tests across **≥22** files (persistence, jsonExport, guestPromotion, memberPlanRepository, marketing pages, Three.js lazy paths) |
| `pnpm run lint` | fail — **130** errors |
| Full `test:coverage` | not run |
| Browser UI proof | not user-verified |
| `release:gate` / Playwright E2E | not run |

**Local git:** `main` **ahead 1** of `origin/main` (`8264d25` Failures archive + terminal removal).

---

## Active failures

### PLAN-FAIL-0408 — Open (coverage floor)

**Status:** Open · INCOMPLETE (no live floor proof on `8264d25`)

**Scope:** Site coverage floor not met. Interim focus **80%** site coverage; hard floor remains **90%**.

**Next:** `pnpm --filter oando-site run test:coverage` with full artifacts under `results/<module>/<phase>/<cmd>/`.

---

### PLAN-FAIL-0410 — Open (repo-wide lint)

**Status:** Open · verified 2026-07-07

**Scope:** `pnpm run lint` exits **1** with **130** ESLint errors.

**Next:** dedicated lint-cleanup pass; re-run to zero before release gate sign-off.

---

### PLAN-FAIL-0412 — Open (runtime / browser proof)

**Status:** Open · INCOMPLETE

**Scope:** Planner guest, SVG portal, admin SVG editor **not browser-verified** with user after merge to `main`.

**Code on `main`:** block-descriptors, catalog panel fix, svg-blocks API, standalone SVG scripts.

**Next:** `pnpm run dev` + hard-refresh the three routes; log repro or close on user sign-off.

---

### PLAN-FAIL-0413 — Open (full Vitest suite)

**Status:** Open · INCOMPLETE (2026-07-07, `.env.local` loaded via `loadEnvLocal.cjs`)

**Scope:** Full `pnpm run test` did not complete to a final summary; partial log shows widespread failures.

**Hotspot files (partial log):**

- `tests/integration/planner-store-plannerPersistence.test.ts` (12/15 failed)
- `tests/unit/features/planner/open3d/persistence/memberPlanRepository.test.ts` (32/39 failed)
- `tests/unit/features/planner/open3d/jsonExport.test.ts` (22/25 failed)
- `tests/unit/features/planner/open3d/persistence/guestPromotion.test.ts` (13/15 failed)
- `tests/unit/features/planner/open3d/uploadUtils.test.ts` (11/18 failed)
- Marketing page tests: showrooms, portfolio, solutions
- Three.js lazy/viewer tests

**Prior signal:** `ECONNREFUSED :3000` in earlier run (dev server not up during unit suite).

**Evidence:** `results/site/truth-reset-2026-07-07/vitest/vitest-raw.log` (truncated; no exit summary).

**Next:**

1. Re-run full suite with `.env.local` to completion; capture `vitest-run.json` + raw log per handbook.
2. Triage persistence/DB vs marketing vs Three.js buckets.
3. Close or split into owned PLAN-FAIL items per root cause.