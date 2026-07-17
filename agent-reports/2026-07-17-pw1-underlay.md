# P-W1 — Underlay calibrate residual (P5)

**Date:** 2026-07-17  
**Status:** unit DONE · browser OPEN

## Scope
- `underlayCalibrate.ts` — 5 m / 10 m presets, width + 2-point apply, scale normalize, JSON reload revive
- `floorPlanImageImport.ts` — validate gate, `buildLockedUnderlayFromFloorPlan`, decode path
- Properties empty chrome: 5 m / 10 m + 2-point known distance
- Matching unit tests only (no wall grips / inventory / handoff / admin / site)

## Commands
```
pnpm --filter oando-site exec vitest run \
  tests/unit/features/planner/lib/underlayCalibrate.test.ts \
  tests/unit/features/planner/lib/floorPlanImageImport.test.ts \
  tests/unit/features/planner/editor/PropertiesPanel.test.tsx
→ exit 0 · 34 tests PASS

pnpm run check:layout → exit 0
```

## Proof (unit)
- Width calibrate 5 m / 10 m → `mmPerPixel` + `scale: 1`
- 2-point pick session + plan-segment → scale 1 store form
- `underlayScalePersistenceFields` + `reviveUnderlayScaleAfterReload` footprint match after JSON clone
- Import: MIME/size gate; locked draft default 10 m; scale survives clone
- Properties: 5 m / 10 m callbacks; 2-point start/cancel; presets disabled mid-session

## Not proven
- Browser sketch → calibrate → reload
- PDF underlay path
- Host wire of `buildLockedUnderlayFromFloorPlan` into accept (helper ready)
