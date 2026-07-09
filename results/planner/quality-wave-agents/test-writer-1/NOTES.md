# Test Writer 1 — opening pick / select unit quality

**Date:** 2026-07-09  
**Agent:** TEST WRITER 1 of 2  
**Scope:** `pickOpeningAtPoint` in `site/features/planner/open3d/lib/geometry/canvasPicking.ts`  
**Test file:** `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts`

## Gap analysis

| Requested case | Status before | Action |
|----------------|---------------|--------|
| position 0 and 1 (wall endpoints) | **Missing** for openings | **Added** |
| diagonal wall opening | **Missing** for openings | **Added** |
| equal-distance first-wins | Already covered (`when distances are equal…`) | **Skipped** (no duplicate) |
| Extra meaningful edge | tolerance inclusive boundary not covered for openings | **Added** |

## Tests added (3)

1. **`picks openings at wall endpoints (position 0 and position 1)`**  
   - Door at `position: 0` → hit at wall start `(0, 0)`  
   - Door at `position: 1` → hit at wall end `(4000, 0)`  
   - Window at `position: 1` → hit at end  
   Proves linear interpolation clamps correctly at segment ends.

2. **`picks an opening on a diagonal wall via interpolated segment position`**  
   - Wall `(0,0)→(4000,4000)`, door at `position: 0.25` → `(1000,1000)`  
   - Hit on exact point and small perpendicular offset within tolerance  
   - Miss when click is far along the same diagonal  
   Proves opening world position is not axis-aligned-only.

3. **`includes hits exactly at tolerance and misses just beyond`**  
   - `distance === toleranceMm` → pick (inclusive, matches `distance > toleranceMm` skip)  
   - `distance === 50.1` with tolerance 50 → null  
   Mirrors wall-pick boundary contract for openings.

## Vitest result

```
File: tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts
Tests: 31 passed (31)
Test Files: 1 passed
```

Evidence log: `results/planner/quality-wave-agents/test-writer-1/vitest.log`

## Notes

- Did **not** change production code — coverage of existing behavior only.
- Equal-distance first-wins already asserted for door-vs-window, two doors, and two windows; left untouched.
- Local `const wall` in the `pickOpeningAtPoint` describe block shadows the top-level `wall()` helper; diagonal fixture built inline.
