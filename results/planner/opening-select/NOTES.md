# Slice: select doors/windows on FeasibilityCanvas

**Date:** 2026-07-09  
**Evidence:** `vitest-raw.log` (23/23 canvasPicking)

## Why

Doors/windows were drawn and placeable, but select only hit furniture → walls → rooms. Openings were not pickable → delete/properties on openings blocked.

## Fix

- `pickOpeningAtPoint` (pure) — nearest door/window on wall by mm proximity  
- Select order: **furniture → opening → wall → room**  
- Real unit tests for door pick, nearest window, miss far

## Files

- `lib/geometry/canvasPicking.ts`  
- `canvas-feasibility/FeasibilityCanvas.tsx`  
- `tests/.../geometry/canvasPicking.test.ts`
