# Slice: wall delete cascades doors/windows

**Date:** 2026-07-09  
**Evidence:** `vitest-raw.log` (5/5)

## Why

Product delete path (`applySelectionDelete`) stripped walls only.  
`pureActions.removeWall` already cascaded openings — keyboard/UI delete did not → orphan doors/windows.

## Fix

- `applySelectionDelete`: when removing walls, filter `doors`/`windows` by `wallId`
- `deleteEntityFromProject`: same cascade for single wall delete

## Tests

`applySelectionDelete.test.ts` — cascade case + prior cases green.
