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
- **Agent default:** do not run the full test suite or `test:coverage` after each planner phase/slice; run only Vitest files/patterns for the changed surface unless the user asks or a release/ship claim requires it (`AGENTS.md` §Test runs; `PLAN-FAIL-0413`, `0408`).
- Coverage (honest dual metrics — 2026-07-09): **do not chase 90% on the planner full-include total**. That total force-includes huge dark surfaces (`coverage.all` + broad include) and is an **inventory**, not a slice ship bar. **Ship floor for PLAN-FAIL-0408** = **site profile** thresholds (scoped include, 90/80/90/90) with live artifacts. Planner: use **per-file** + dual rollup (`node scripts/analyze-coverage-gap.mjs`). Policy: `site/scripts/coverage-policy.mjs`.
- A passing assertion count with missing console output or artifacts is **INCOMPLETE**, not passed.
- Log blockers and skips here; move resolved items to `resolved-failures.md`.

---

## Truth snapshot (2026-07-07, CSS + lint slice)

**Verified (live evidence):**

| Check | Result | Evidence |
|-------|--------|----------|
| `pnpm --filter oando-site run typecheck` | pass | prior: `results/site/truth-reset-2026-07-07/typecheck/` |
| `pnpm run lint` (site) | **pass** (0 errors) | this session — was 130 errors |
| CSS regression tests | 9/9 pass | `results/tests/vitest-results.json` |
| `pnpm run test` (full suite) | **pass** 4812/4812 | `results/site/phase-0413/vitest/vitest-raw.log`, `results/tests/vitest-results.json` |
| `phase0412-runtime-probe.mjs` | **pass** | `results/site/release-gates/runtime-0412/runtime-0412-evidence.json` |

---

## Active failures

### Latest honesty (2026-07-09, hard-path SVG + G8)

**Not open failures** — landings to keep docs/agents honest:

| Topic | Current truth | Evidence / entry |
|-------|---------------|------------------|
| SVG **publish authority** | **`pipelineCore+normalize`** only | `compileSvgForPublish` → S1 normalize + pipelineCore S2/S3; S4 `runSvgPipeline` / `generate-svg.mjs` |
| V1 `svgCompiler.server` | **`v1-reference-only`** (retained; not publish wire) | Not dual live authority; do not treat “unify dual compilers” as open publish blocker |
| **G8** viewer GLB load | **partial** (unit path landed) | `ThreeViewerInner` + `loadGeneratedGlbObject` when `shouldLoadGlb(generatedGlbUrl)`; not full product |
| G8 residuals (open work) | Upload on publish; browser smoke; no shared cache / scale / auto-upload | `task.md` §02 open items |
| SVG residual (open work) | Full admin UI publish browser smoke | `task.md` §01 |

- Do **not** re-open dual-compiler as publish-authority ambiguity.
- Do **not** claim G8 complete (place still procedural default; stamp opt-in).
- Related open gates unchanged: `PLAN-FAIL-0408` (coverage floor). Hard-path browser smokes remain user-owned when claiming Accepted.

### Latest slice note (2026-07-07, CSS hardening + lint)

- Split `core/utilities.css` + `core/components.css` → 16 per-use files via `scripts/split-core-css.mjs` (max 406 lines; 2 in soft zone)
- Replaced 212 raw Tailwind palette classes with semantic utilities via `scripts/fix-raw-palette.mjs`
- Fixed 7 fixed-container mobile guards + 40 `text-left`/`text-right` → `text-start`/`text-end`
- `pnpm run lint` (site): **pass** (0 errors; was 130) — unused imports, hook deps, `import()` types, `any` cast
- Targeted vitest: CSS (9/9), admin svg routes (8/8), feasibility canvas (7/7)
- `tech-stack-generator` CSS sync re-run → `site/tech-stack-generated/css/` (17 imports)
- Skipped by policy: `test:coverage`, Playwright E2E, `release:gate`
  Related open items: `PLAN-FAIL-0408`

### Latest slice note (2026-07-07, 0413 + 0412 gates)

- Full Vitest: **4812/4812 pass** (was 37 failed) — see `PLAN-FAIL-0413`
- Runtime HTTP probe: **pass** — admin, portal, planner guest/open3d, catalog API
  Evidence: `results/site/release-gates/runtime-0412/`
- Stale dev server (pre-CSS-restructure cache) caused initial 500s; fresh `pnpm run dev` required
- Skipped: Playwright browser soak, `release:gate`, `test:coverage` (`PLAN-FAIL-0408`)

### CSS module layout (2026-07-07)

- Three-level locked surfaces: `app/css/core/locked/{site,admin,planner}/*.css` (flat, no subfolders)
- Shared fundamentals: `core/theme.css`, `core/utilities/*.css`, `core/components/*.css`
- Dissolved `core/chrome/shell/`; folded `ooplanner/` into `workspace-*.css`
- Archive at repo root: `archive/site/app/css/_archive/2026-07-07-css-restructure/`
- Browser proof: HTTP runtime probe pass (`PLAN-FAIL-0412`); full Playwright soak still user-owned

### PLAN-FAIL-0410 — Closed (repo-wide lint)

**Status:** Closed · verified 2026-07-07 (this session)

**Was:** `pnpm run lint` exited **1** with **130** ESLint errors.

**Fix:** Unused imports/vars, hook dependency fixes, `import()` type annotations, `any` → typed cast in `rateLimit.ts`, test mock cleanup across 18 files.

**Evidence:** `pnpm run lint` exit **0** (site package).

### PLAN-FAIL-0408 — Open (coverage floor)

**Status:** Open · INCOMPLETE (no live **site-profile** floor proof)

**Honesty (2026-07-09):** Agents/humans who only open the Vitest **TOTAL** after `test:coverage` (planner profile) see a **catastrophically low %**. That is expected: full-include + `all: true` dumps every untouched planner/lib file in as 0%. **Chasing 90% of that number is virtually impossible and is not the job.** It is not proof that unit tests “don't cover anything.”

| Metric | Role |
|--------|------|
| Planner **full-include TOTAL** | Dark-product **inventory** only — not ship gate |
| **Per-file** on modules under change | Slice truth (“did we hit this code?”) |
| Dual **TOUCHED** rollup | How thorough the run was on files it loaded |
| **Site profile** `test:coverage:site` + thresholds | **Ship floor** for this fail id (90/80/90/90 scoped) |

**Scope:** Prove **site** coverage gate with artifacts. Do **not** reopen as “planner total must be 90%.”

**Next:** `pnpm --filter oando-site run test:coverage:site` (or `test:coverage:site` from `site/`) with full artifacts under `results/…`. Optional inventory: `test:coverage` + `node scripts/analyze-coverage-gap.mjs` (dual rollup). Policy code: `site/scripts/coverage-policy.mjs`.

---

### PLAN-FAIL-0412 — Closed (HTTP runtime probe)

**Status:** Closed · VERIFIED (2026-07-07)

**Before:** All probed routes returned **500** — stale `.next` dev cache (missing CSS bundle paths) plus `node:crypto`/`node:fs` pulled into client bundle via `catalogClient.loadDescriptorsFromLoader` SSR branch.

**Fix:** `catalogClient.ts` — always hydrate via `/api/planner/catalog/svg-blocks` fetch (SSR-safe absolute origin); removed dynamic `svgBlockDescriptorLoader` import from client-reachable code. Fresh `pnpm run dev` after clearing `.next/dev`.

**After:** `node scripts/phase0412-runtime-probe.mjs` exit **0** — all routes pass.

| Route | Status |
|-------|--------|
| `/admin/svg-editor` | 200 |
| `/portal/svg-catalog` | 200 |
| `/portal/svg-catalog/{slug}` | 200 |
| `/planner/guest` | 200 |
| `/planner/open3d` | 200 |
| `POST /api/admin/svg-editor` | 403 (auth blocked — expected) |
| `GET /api/planner/catalog/svg-blocks` | 200 |

**Evidence:** `results/site/release-gates/runtime-0412/runtime-0412-evidence.json`

**Note:** Full Playwright browser soak remains user-owned for `Accepted` claims.

---

### PLAN-FAIL-0413 — Closed (full Vitest suite green)

**Status:** Closed · VERIFIED (2026-07-07)

**Before:** 37 failed | 4775 passed (4812), exit code 1.

**After:** 0 failed | 4812 passed (4812), exit code 0 — `pnpm run test` from `site/`.

**Evidence:** `results/site/phase-0413/vitest/vitest-raw.log`, `results/tests/vitest-results.json` (post-fix full run).

**Root-cause buckets fixed:**

1. **Planner route wiring** — async guest/canvas page tests; `Open3dPlannerWorkspaceRoute` mock in autosave identity test.
2. **Three.js** — restored capability exports; viewer container `data-testid`; unique tool shortcuts (`D`→door, `M`→dimension).
3. **pureActions / placement** — `updateDoor`/`updateWindow` throw on missing id; hook guards noop for missing ids in placement helpers.
4. **Marketing shell** — `HomeMarketingLayout` + `getTranslations` on solutions; page tests aligned to editorial layout.
5. **Supabase/catalog** — mock `@/platform/supabase/env`; `isMissingTableError` in adapters; catalogDrizzle rethrows non-relation errors.
6. **Misc** — dashboard `searchParams`; KpiCounter off-screen expectation; admin hub title; SVG phase-1 test timeouts.

**Prior signal (obsolete):** truncated run / `ECONNREFUSED :3000` — superseded by completed full run above.
