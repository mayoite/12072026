# Open3d world-standard e2e **gate** (CI-callable)

**Date:** 2026-07-09  
**Why:** W-gate browser proof lived only under evidence folders. This pack is a **named script** agents and CI can run.

## Commands (repo root)

```powershell
pnpm test:e2e:open3d-world   # pack only
pnpm gate:open3d             # typecheck + pack
```

Prefer `PLAYWRIGHT_BASE_URL=http://localhost:3000` against `pnpm dev` (faster). Without it, Playwright starts `build && start` (slow; build may hit `/contact` issues).

## Specs (workers=1)

| Spec | Gate |
|------|------|
| `open3d-world-standard-journey.spec.ts` | W1–W2 journey |
| `open3d-w3-select-delete.spec.ts` | W3 |
| `open3d-w4-orbit-continuity.spec.ts` | W4 |
| `open3d-save-honesty.spec.ts` | W5–W6 |
| `open3d-systems-v0-batch-place.spec.ts` | systems v0 batch |

Source of truth: `site/config/build/playwright-open3d-world-specs.json`  
Runner: `site/scripts/run-open3d-world-e2e.mjs`  
Contract unit: `site/tests/unit/config/playwrightOpen3dWorldSpecs.test.ts`

## Not in default `pnpm gate` (fast)

Full pack is slow. Use **`gate:open3d`** or full release intentionally — do not pretend fast gate includes W-browser.

## Artifacts

| File | Role |
|------|------|
| `run.json` | exitCode + status + specs |
| `playwright-raw.log` | full console |
| `vitest-contract.log` | unit contract for manifest |
