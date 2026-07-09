# P08 / W7 — Mesh quality bar (cabinet-v0)

**Gate:** W7 — Mesh quality bar + visual: modular not “apology boxes” for cabinet-v0 (toe / door / carcass readable).  
**Checkpoint:** CP-08  
**Date:** 2026-07-09  
**Authority:** Owner > `Plans/trustdata/phases/P08-mesh-quality.md` > design §W7  

**Success metric:** BOQ/quote path > photoreal. Readable parts beat pretty noise.

---

## Pass criteria (normative)

1. **Named parts on default slab:** exact child names `toe`, `carcass`, `door-slab` (pair → `door-left` + `door-right`).  
   - Locked name: **`toe`** only (not `toe-kick`, not `plinth`).  
   - Locked order: `toe` → `carcass` → door part(s).  
2. **Readable silhouette:** three-quarter front distinguishes base/toe band, body mass, door face.  
3. **Geometry (locked):**  
   - `TOE_HEIGHT_MM = 100`, `TOE_INSET_MM = 50`, `DOOR_THICKNESS_MM = 18` (exported from `modularCabinetV0.ts`; GlbExport imports — no duplicate magic).  
   - `toe`: size `{w, toeH, d-inset}`, pos `{0, toeH/2, -inset/2}` (back-aligned recess).  
   - `carcass`: size `{w, h-toeH, d}`, pos `{0, toeH + carcassH/2, 0}`.  
   - Doors: height ≈ `carcassH * 0.92`; y centered on carcass; not full enclosure height.  
   - **Height integrity:** Box3 maxY−minY ≈ `heightMm * 0.001` (toe replaces bottom; no overshoot).  
4. **2D footprint** outer W×D centered path unchanged (default 600×580 → `M -300 -290 L 300 -290 L 300 290 L -300 290 Z`).  
5. **Part plan === mesh** (names, order, sizes m, positions).  
6. **No designer static GLB**; generated only `catalog-assets/generated/*`.  
7. **Materials:** toe slightly darker same family; oak vs white distinct on carcass/door.

## Fail criteria

- Single apology `BoxGeometry` furniture.  
- Door covering floor-to-top including kick.  
- Carcass full `heightMm` + toe stacked (SKU height overshoot).  
- Plan missing `toe` while mesh has it (or reverse).  
- Hand-made `.glb` under `public/` product trees.  
- Renaming toe to a second alias.

---

## Part name table (exact `name` strings)

| Order | `doorStyle: none` | `slab` | `pair` |
|------:|-------------------|--------|--------|
| 1 | `toe` | `toe` | `toe` |
| 2 | `carcass` | `carcass` | `carcass` |
| 3 | — | `door-slab` | `door-left` |
| 4 | — | — | `door-right` |

## Part-count matrix

| `doorStyle` | Parts |
|-------------|------:|
| `none` | **2** |
| `slab` | **3** |
| `pair` | **4** |

---

## Commands

```powershell
cd D:\OandO07072026\site

# Core + blast unit pack
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  tests/unit/features/planner/open3d/resolveFurniture2DFootprint.test.ts `
  tests/unit/features/planner/open3d/createSceneObjectFromNode.test.ts `
  tests/unit/features/planner/open3d/modularPlaceMesh.test.ts `
  tests/unit/features/planner/asset-engine/meshStages.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality\vitest-raw.log

# Default headless visual smoke (plan formulas → SVG → PNG via sharp)
node scripts/p08-cabinet-v0-visual-smoke.mjs --out D:\OandO07072026\results\planner\world-standard-wave\08-mesh-quality
```

Options for smoke: default slab white **600×580×720**.

---

## Artifacts (this folder)

| File | Role |
|------|------|
| `NOTES.md` | This bar doc |
| `vitest-raw.log` | Primary unit pack |
| `vitest-red-raw.log` | TDD red evidence (pre-green) |
| `vitest-nonreg-raw.log` | Same pack non-reg copy |
| `run.json` | Machine summary |
| `01-cabinet-v0-three-quarter.png` | Toe/door/carcass readable |
| `02-cabinet-v0-side.png` | Toe inset / depth |
| `visual-smoke.md` | Checklist vs NOTES |
| `visual-smoke-meta.json` | Smoke metadata |
| `p08-cabinet-v0-visual-smoke.mjs` | Lives under `site/scripts/` (source of PNGs) |

---

## Honest residual

Still boxy / not photoreal:

- No handles, hinges, or side reveals.  
- Simple flat materials (oak/white hex only).  
- Toe is a single recessed box, not a full plinth assembly.  
- Headless smoke is plan-projected SVG (same formulas as mesh), not a WebGL beauty pass.  
- No photoreal lighting/AO.

**Does not claim world-standard product complete** — only W7 mesh bar for cabinet-v0.
