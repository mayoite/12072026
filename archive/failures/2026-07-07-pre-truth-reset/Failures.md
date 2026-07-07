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
- Coverage hard floor: **90%** statements/branches/functions/lines globally and per handwritten production file (`plans/2026-07-05_phase1-execution/quality-gates.md`). Target **95%**.
- A passing assertion count with missing console output or artifacts is **INCOMPLETE**, not passed.
- Log blockers and skips here; move resolved items to `resolved-failures.md`.

---

## Truth snapshot (2026-07-07, rev `76f39a5`)

**Verified this session (live):**

| Check | Result |
|-------|--------|
| `pnpm --filter oando-site run typecheck` | pass |
| `seed-block-descriptors.ts` | 4 descriptors written + `loadAll` OK |
| `blockDescriptorLoader.test.ts` + `svgPreviewAssets.test.ts` | 27/27 pass |
| `coverageGap.test.ts` | 254/254 pass (was stale in prior Failures.md) |
| `validate-launch-env.mjs` | required public/server env present |
| Planner/SVG code on `main` | merged (`8f4f0fa`, `76f39a5`); block-descriptors on disk |

**Not verified (INCOMPLETE):**

| Check | Result |
|-------|--------|
| Browser: `/planner/guest/`, `/portal/svg-catalog`, `/admin/svg-editor` | no signed-off live UI proof with user |
| `pnpm run lint` | fail — **130** errors (see PLAN-FAIL-0410) |
| Full `test:coverage` + artifacts | not run this session (see PLAN-FAIL-0408) |
| `release:gate` / Playwright E2E | not run this session |

---

## Active failures

### PLAN-FAIL-0408 — Open (coverage floor)

**Status:** Open · INCOMPLETE (no live floor proof on current `main`)

**Scope:** Site coverage floor not met. Interim focus **80%** site coverage; hard floor remains **90%** per quality gates.

**Priority source areas:**

- `site/lib/site-data/`
- `site/lib/catalog/`
- `site/features/catalog/`
- Site assistant
- Ops
- `site/features/ai/` (ai advisor)

**Blockers:**

- No numeric coverage % from a full `pnpm --filter oando-site run test:coverage` with complete artifacts under `results/<module>/<phase>/<cmd>/`.

**Next:**

1. Run coverage with evidence wrapper per `START.md` / `testing-handbook.md`.
2. Review per-file %; close here when floor met; log resolution in `resolved-failures.md`.

---

### PLAN-FAIL-0410 — Open (repo-wide lint)

**Status:** Open · verified 2026-07-07 on `main` @ `76f39a5`

**Scope:** `pnpm run lint` exits **1** with **130** ESLint errors (`site` app/components/features/lib/tests).

**Known hotspots (from prior triage; re-run lint for current file list):**

- `app/(site)/portal/svg-catalog/[slug]/` + tests — type-imports, `no-require-imports`, unused symbols
- `app/api/admin/svg-editor/route` tests — unused imports, `prefer-const`
- `tests/unit/features/planner/open3d/` — unused vars, import annotations
- `features/planner/open3d/editor/InventoryPanel.tsx` — `no-non-null-assertion` on `inventoryClientRef.current!`

**Correction:** `coverageGap.test.ts` is **green** (254/254) on current `main`; do not treat export-job asserts as an active lint/test blocker.

**Next:** dedicated lint-cleanup pass; re-run `pnpm run lint` to zero before Phase 1 / release gate sign-off.

---

### PLAN-FAIL-0412 — Open (runtime / browser proof)

**Status:** Open · INCOMPLETE

**Scope:** Planner catalog, SVG portal, and admin SVG editor **not browser-verified** with the user after merge of PR-3 + standalone patches to `main`.

**Code landed (not the same as UI proof):**

- `site/block-descriptors/` seeded (4 JSON)
- `InventoryPanel` — `fallback` is a badge, not a full-panel blocker
- `/api/planner/catalog/svg-blocks` + cwd-safe descriptor paths
- Standalone SVG: `prepare-standalone.cjs`, `svgPipelineRunner.ts`, `generate-svg.mjs` (`76f39a5`)

**Blockers:**

- No fresh Playwright or manual browser sign-off on:
  - http://localhost:3000/planner/guest/ (catalog cards, search, Add)
  - http://localhost:3000/portal/svg-catalog/ (4 blocks)
  - http://localhost:3000/admin/svg-editor/ (list after `/access` login)
- Admin may need session; R2 thumbs may need re-publish after login.

**Next:**

1. `pnpm run dev` from repo root; hard-refresh routes above.
2. Capture evidence or log specific UI failures here with repro steps.
3. Close when user confirms working or file follow-up defects as new PLAN-FAIL items.

---

### HOUSEKEEPING-2026-07-07 — Staged repo cleanup (non-gate)

**Status:** Open · low priority

**Scope:** `terminals/` removal staged (`git rm`, 44 files) but **not committed**; remote `main` still contains terminal logs from `4fffa51`.

**Next:** commit + push removal, or restore if logs were intentional.