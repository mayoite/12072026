# Elon re-proof — TEST WRITER 1/2 (cabinet-v0 Block2D)

**Date:** 2026-07-09  
**File:** `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`  
**Impl:** `modularCabinetBlock` in `site/features/planner/open3d/catalog/furnitureBlock2D.ts`  
**Log:** `elon-reproof/test-writer-1.log`

## P05 bar checklist

| Bar | Before re-proof | After |
|-----|-----------------|-------|
| ≥4 prims (carcass + front + door cue) | Covered | Kept |
| pair mid stile | Covered | Kept |
| slab none (zero mid stile) | Covered | Kept + tightened (handle offset) |
| `centeredPath` false | Covered | Kept + pair path too |
| footprint | Covered (opts only) | + modularOptions wins over item dims |

## What was missing (gaps)

1. **modularOptions vs item dims** — footprint always asserted with matching dims; never proved `opts.widthMm/depthMm/heightMm` override `item.width/depth/height`.
2. **Outer carcass** — no assert that a filled rect covers `(0,0)→(L,D)` (empty-box escape hatch).
3. **Front ≠ back** — visual criterion existed in SUMMARY/05-visual only; no unit assert that front edge Y > back edge Y near depth face.
4. **doorStyle geometry differ (S2 full)** — mid stile only; **pair dual handles / slab single offset handle** not asserted.
5. **doorStyle `"none"`** — open-shelf dashed horizontals + zero stile + zero handles untested (third branch of `modularCabinetBlock`).

## What was added (real cases)

| Case | Asserts |
|------|---------|
| `prefers modularOptions dims…` | L/D/H from opts when item dims disagree |
| `draws outer carcass covering full footprint` | filled rect 0,0,L,D |
| `front edge is deeper (+Y) than back edge` | min/max horizontal line Y; front > 0.7D |
| `pair has dual handle cues; slab has single offset handle` | handle rect counts 2 vs 1; prim JSON differ; slab handle not mid-X; slab mid stile 0 |
| `doorStyle none has open-shelf cues…` | ≥4 prims, mid stile 0, handles 0, ≥2 dashed horizontal lines |
| `centeredPath` pair variant | false for pair doorStyle as well as default slab |

Helpers added: `handleRectCount`, `horizontalLineYs` (no `any`).

## Not hollow

Each case fails if `modularCabinetBlock` regresses to empty-box, shared geometry for pair/slab, centered authorship flag flip, or drops the `none` shelf branch.

## Result

```
Tests  12 passed (12)
```

Exit 0. See `test-writer-1.log`.
