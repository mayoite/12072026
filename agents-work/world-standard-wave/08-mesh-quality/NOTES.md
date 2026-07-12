# P08 / W7 mesh quality — NOTES

**When:** 2026-07-12  
**HEAD:** `0bc58eb5f5a90195c5bc888ee3c44b6ff8b7415d`  
**Bar:** toe → carcass → door(s); `TOE_HEIGHT_MM=100`, `TOE_INSET_MM=50`, `DOOR_THICKNESS_MM=18`

## Quality bar (frozen)

| Item | Law |
|------|-----|
| Child order (slab) | `toe` → `carcass` → `door-slab` (pair: `door-left` / `door-right`) |
| Name | exact **`toe`** (not plinth / toe-kick) |
| Counts | none=2 · slab=3 · pair=4 (always includes toe) |
| Toe | height 100 mm; depth `d - 50`; back-aligned `z ≈ -inset/2` |
| Carcass | height `h - toeH`; sits on toe (not additive overshoot) |
| Doors | height ≈ `carcassH * 0.92`; y = carcass center |
| Height integrity | Box3 Y span ≤ / ≈ `heightMm` (units: equal to SKU H) |
| plan === mesh | GlbExport parts match mesh names/sizes/positions (metres) |
| 2D footprint | outer W×D unchanged |

## Unit (this checkout — re-run)

Command (from `site/`):

```
npx vitest run \
  tests/unit/features/planner/modularCabinetV0.test.ts \
  tests/unit/features/planner/modularCabinetV0GlbExport.test.ts \
  tests/unit/features/planner/modularPlaceMesh.test.ts \
  tests/unit/features/planner/createSceneObjectFromNode.test.ts
```

| Pack | Result |
|------|--------|
| modularCabinetV0 | **43/43 pack green** — names, counts 2/3/4, TOE_HEIGHT_MM 100, height span, toe geometry |
| modularCabinetV0GlbExport | green — plan mirrors mesh 1:1 |
| modularPlaceMesh | green — place stamps modular-cabinet-v0 options |
| createSceneObjectFromNode | green — blast names/counts (slab 3, pair 4) |

Dump: `results/planner/world-standard-wave/08-mesh-quality/vitest-unit.json` · `run.json`

**Product fix this seat:** none (units already green).

## Visual smoke

Headless plan-formula render (not browser ThreeViewer):

```
node site/scripts/p08-cabinet-v0-visual-smoke.mjs --out results/planner/world-standard-wave/08-mesh-quality
```

| File | View |
|------|------|
| `01-cabinet-v0-three-quarter.png` | toe band + body + door face |
| `02-cabinet-v0-side.png` | toe inset / depth / door thickness |
| `visual-smoke.md` | yes/no criteria |
| `visual-smoke-meta.json` | parts + constants |

**Readable without wireframe only:** side/three-quarter show distinct base band vs body vs door. Script also draws part name labels (diagnostic, not product chrome).

## Residual honesty (named)

- Handles / materials still simple (not photoreal)  
- Headless smoke = plan SVG formulas via `p08-cabinet-v0-visual-smoke.mjs`, not live WebGL mesh screenshot  
- Non–cabinet-v0 not in this gate  
- **No world-standard ship claim** from this card alone  

## CP-08 / W7

**PASS (agent 2026-07-12)** — units + NOTES bar met; headless PNGs written; residual named above.
