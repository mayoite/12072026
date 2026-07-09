# Canvas picking — Test Agent 1 notes (2026-07-09)

## Scope

Strengthen unit tests for open3d canvas picking in:

`site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts`

Production: `site/features/planner/open3d/lib/geometry/canvasPicking.ts`  
No production changes required — `pickOpeningAtPoint` already skips missing `wallId` and uses strict `<` for nearest.

## Tests added

### `pickOpeningAtPoint`

1. **Door wins when closer than window**  
   Door at `position: 0.25`, window at `0.75` on a 4000mm wall; click near door → `{ type: "door", id: "d1" }`. Complements existing window-nearer case.

2. **Missing `wallId` → skip without throw**  
   Orphan door/window with non-existent wall ids mixed with a valid door; asserts `not.toThrow` and that the valid door is still picked. Orphans-only → `null` (still no throw).

3. **Equal distance is deterministic (first registered)**  
   - Door + window same position → door wins (doors registered before windows; update only when `distance < bestDistance`).  
   - Two doors same position → first array entry (`d-a`).  
   - Two windows same position → first window (`win-a`).

### `pickFurnitureAtPoint`

4. **Rotation 90° inverse-rotation footprint**  
   Item 800×400 at origin, `rotation: 90`. Asserts hit along world axes that map into local halfW/halfD after `-90°` transform, and miss beyond rotated depth.

5. **Padding edge (gap fill)**  
   200×200 item: point at 120mm outside without padding, inside with `paddingMm: 30`.

## Result

| Metric | Value |
|--------|--------|
| File | 1 passed |
| Tests | **28 passed / 28** |
| Duration | ~1s |
| Log | `results/planner/quality-2026-07-09/canvas-picking/vitest-test-agent-1.log` |

Command (from `site/`):

```text
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts
```

## Counts (this agent)

| Category | New cases (approx) |
|----------|--------------------|
| Opening: door closer | 1 it |
| Opening: missing wallId | 1 it |
| Opening: equal-distance deterministic | 1 it (3 assertions) |
| Furniture: rotation 90° | 1 it |
| Furniture: padding | 1 it |
| **New `it` blocks** | **5** |
| Prior tests in file | 23 |
| **Total after** | **28** |

## Quality notes

- No `any`, no unused vars, no skips.
- Real geometry (positions on wall, inverse rotation math), not mocks.
- Asserts documented production rule: nearest within tolerance; ties keep first registered candidate.
