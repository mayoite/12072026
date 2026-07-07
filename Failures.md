# Failures

This is the only active failures file.

Resolved history is only in `resolved-failures.md`.

No other files are authoritative.

Read this file first for gate policy.

Evidence lives under `results/<module>/<phase>/<cmd>/` per `testing-handbook.md`. Historical evidence in `archive/results/` is kept (archive over delete; no bulk removal).

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

### Transient — 2026-07-07 impl c034b9c7 (planner open audit fixes)
**Status:** Completed in-session (no new persistent PLAN-FAIL opened)
**What ran (evidence in results/planner/impl-fix/):**
- eslint scoped (targets only; exit 0)
- tsc check (targets; exit 0)
- prettier --check/--write (exit 0)
**Skipped (per AGENTS min necessary + scope):** full root lint/type (pre-existing unrelated per PLAN-FAIL-0410), playwright/e2e, coverage, dev server, release:gate. Only files required for "planner opens" fixes + fmt/lint/type per explicit task. No archive/layout/catalog refactors.
**Logged for honesty.** (Move to resolved-failures only if permanent.)

### Transient — 2026-07-07 planner/svg/mobile rescue (subagent-assisted)
**Status:** Completed in-session (no new persistent PLAN-FAIL opened)
**Root cause fixed:** `site/app/planner/open3d/page.tsx` used `next/dynamic({ ssr: false })` inside a Server Component → 500 on `/planner/open3d/` and poisoned planner chunk graph. Reverted to direct `Open3dPlannerHost` import.
**Also fixed:** portal `srcSet` on `next/image` (typecheck fail) → native `<img>` for retina R2 thumbs; SVG pipeline now renders 512w + 1024w `@2x` via Resvg (no Sharp downscale); mobile CSS for workspace + admin Puck.
**What ran:** `pnpm run typecheck` (exit 0); vitest admin svg-editor 68/68; portal svg-catalog 9/9; HTTP `/planner/guest/` + `/planner/open3d/` 200; `/admin/svg-editor/` 307 auth (expected).
**Skipped:** full root lint (PLAN-FAIL-0410 pre-existing), playwright e2e, coverage, release:gate.
**Follow-up for user:** log in at `/access` then open `/admin/svg-editor/`; re-publish SVG blocks to regenerate R2 thumbs at new resolution.

### Transient — 2026-07-07 planner catalog + SVG a11y rescue
**Status:** Completed in-session (no new persistent PLAN-FAIL opened)
**Root causes fixed:**
- `InventoryPanel` treated `catalogStatus === "fallback"` as a full-panel blocker → demo/offline catalog never rendered (search, Add buttons, empty state all broken).
- Catalog browser used `role="list"` while E2E contract expects `region` named "Catalog browser"; `listitem` on `<article>` without a list parent triggered critical axe violations.
- E2E canvas helper queried `navigation` named "Drawing tools" but rail exposes `group` inside `nav` labeled "Canvas tools".
- Top bar `brandSub` / `saveStatus` success text failed WCAG AA contrast on small type.
**What ran:** `pnpm run typecheck` (exit 0); vitest svg-preview + svgPhase1Completion + portal svg-catalog 20/20; playwright `planner-catalog.spec.ts` 2/2 + `planner-guest-workspace.spec.ts` 11/11 (chromium, localhost:3000).
**Skipped:** full root lint (PLAN-FAIL-0410 pre-existing), coverage, release:gate, remaining planner e2e suites (chrome, canvas-trust, j3–j6, etc.).
