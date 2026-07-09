# Fix: furniture plan degrees → scene radians

**Date:** 2026-07-09  
**HEAD after:** (see commit)  
**Evidence:** `vitest-raw.log`

## Bug (code truth)

| Layer | Unit |
|-------|------|
| Document / 2D canvas / properties | **degrees** (`normalizeDegrees`, FeasibilityCanvas `* Math.PI/180`) |
| Wall scene nodes | **radians** (`Math.atan2`) |
| Furniture scene nodes (before) | passed `item.rotation` **unchanged** (wrong) |
| Three (`createSceneObjectFromNode`) | treats `node.rotation` as **radians** |

Default place at 0° looked fine; rotated furniture wrong in 3D.

## Fix

- `degreesToRadians` in `model/units.ts`
- `buildOpen3dSceneNodes` furniture: `rotation: degreesToRadians(item.rotation)`
- Walls unchanged

## Tests

```
pnpm exec vitest run buildOpen3dSceneNodes.test.ts createSceneObjectFromNode.test.ts
# 2 files, 22 tests, exit 0
```
