# Implement — workstation-v0 visual smoke (legs + stretchers)

**Seat:** implementer  
**Phase:** `full-workflow-demo-2026-07-10`  
**Date:** 2026-07-10  

## What landed

| Item | Path |
|------|------|
| Headless smoke script | `site/scripts/ws-v0-visual-smoke.mjs` |
| Three-quarter PNG | `results/planner/full-workflow-demo-2026-07-10/01-workstation-v0-three-quarter.png` |
| Side PNG (extra) | `results/planner/full-workflow-demo-2026-07-10/02-workstation-v0-side.png` |
| Meta (part names) | `results/planner/full-workflow-demo-2026-07-10/visual-smoke-meta.json` |
| Vitest log | `results/planner/full-workflow-demo-2026-07-10/vitest-mesh.log` |

## Approach

Patterned on `site/scripts/p08-cabinet-v0-visual-smoke.mjs`: pure plan box formulas → SVG → sharp PNG. No browser, no GLB, no photoreal.

Locked constants duplicated from `workstationMeshV0.ts` (must match):

- `WORKTOP_THICKNESS_MM = 30`
- `LEG_SECTION_MM = 50`, `LEG_INSET_MM = 40`
- `STRETCHER_SECTION_MM = 40`, `STRETCHER_HEIGHT_FRAC = 0.28`

Default config: linear **1500×600×750**, modules `desk+pedestal` (same as mesh unit suites).

Part order produced:

```text
desk → leg-desk-0 → leg-desk-1 → leg-desk-2 → leg-desk-3 → stretcher-desk-front → stretcher-desk-back → pedestal
```

## Smoke command (exit 0)

```powershell
cd D:\OandO07072026\site
node scripts/ws-v0-visual-smoke.mjs
```

```text
wrote D:\OandO07072026\results\planner\full-workflow-demo-2026-07-10\01-workstation-v0-three-quarter.png
wrote D:\OandO07072026\results\planner\full-workflow-demo-2026-07-10\02-workstation-v0-side.png
parts desk → leg-desk-0 → leg-desk-1 → leg-desk-2 → leg-desk-3 → stretcher-desk-front → stretcher-desk-back → pedestal
legs leg-desk-0, leg-desk-1, leg-desk-2, leg-desk-3
stretchers stretcher-desk-front, stretcher-desk-back
SMOKE_EXIT=0
```

Optional out override:

```powershell
node scripts/ws-v0-visual-smoke.mjs --out D:/OandO07072026/results/planner/full-workflow-demo-2026-07-10
```

## Vitest mesh suites (exit 0)

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/workstationMeshV0.test.ts `
  tests/unit/features/planner/open3d/workstationMeshV0.legs.test.ts `
  tests/unit/features/planner/open3d/workstationMeshV0.stretchers.test.ts
```

```text
Test Files  3 passed (3)
     Tests  21 passed (21)
VITEST_EXIT=0
```

Log: `vitest-mesh.log` in this folder.

## Out of scope (honored)

No photoreal, no browser e2e, no Fabric, no multi-package thrash.

## Status

**IMPLEMENT DONE** — ready for code-review / verifier seats.
