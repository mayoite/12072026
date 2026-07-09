# TW1 — Benchmark quality (unit)

**Agent:** TEST WRITER 1  
**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`

## Results

| Suite | File | Pass | Fail |
|-------|------|------|------|
| catalog preview assets | `site/tests/unit/features/planner/open3d/catalogPreviewAssets.test.ts` | **1** | 0 |
| ThreeViewerInner | `site/tests/unit/features/planner/open3d/threeViewerInner.test.tsx` | **7** | 0 |
| **Total** | | **8** | **0** |

## What was asserted (not hollow)

### catalogPreviewAssets (existing — must pass)
- Required demo SVGs exist under `site/public` (`proof-chair.svg`, `placeholder-cabinet.svg`)
- Non-empty SVG payload (size > 80, starts with `<svg`)

### ThreeViewerInner shadow map contract (added)
- **`enableShadows uses PCFShadowMap (not deprecated PCFSoftShadowMap)`**
  - Captures mock `WebGLRenderer` instances
  - With `enableShadows`: `shadowMap.enabled === true`
  - `shadowMap.type === "PCFShadowMap"`
  - `shadowMap.type !== "PCFSoftShadowMap"` (regression vs console deprecation spam)
- **`does not enable shadow maps when enableShadows is false`**
  - `shadowMap.enabled === false`, type remains undefined

Production source under test: `site/features/planner/open3d/3d/ThreeViewerInner.tsx`  
(`renderer.shadowMap.type = THREE.PCFShadowMap`)

## Artifacts
- `vitest-run.txt` — full verbose console
- `vitest-results.json` — machine-readable report

## Command
```bash
cd site
pnpm exec vitest run \
  tests/unit/features/planner/open3d/catalogPreviewAssets.test.ts \
  tests/unit/features/planner/open3d/threeViewerInner.test.tsx \
  --reporter=verbose
```
