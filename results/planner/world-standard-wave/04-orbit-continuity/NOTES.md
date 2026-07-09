# P04 / W4 — Orbit three-layer (open3d)

## Goal
Orbit enabled by default on open3d 3D view with **three-layer** proof (defaults alone ≠ green).

## Layers closed

| Layer | Status | Proof |
|-------|--------|-------|
| 1. Code defaults ON | Done | `OPEN3D_ORBIT_DEFAULT_ENABLED` used by Lazy + Inner |
| 2. Workspace explicit | Done | `OOPlannerWorkspace` spreads `getOpen3dViewerControlProps()` → `{ enableControls: true }` |
| 3. DOM + unit construct | Done | `data-orbit-enabled` on `three-viewer-container`; `orbitControlsDefault.test.tsx` spies OrbitControls |

## Rotation
Furniture **document** rotation stays **degrees** (`normalizeDegrees`). No conversion to radians in document model.

## Commands
```powershell
cd D:\OandO07072026\site
npx vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx tests/unit/features/planner/open3d/threeViewerInner.test.tsx tests/unit/features/planner/open3d/threeLazy.test.tsx --reporter=verbose
```

## Result
**PASS** — 13/13 unit tests (orbit contract + viewer regression).

## Out of scope this land
- Full Playwright left-drag journey (later / shared journey)
- R3F rewrite (forbidden)
