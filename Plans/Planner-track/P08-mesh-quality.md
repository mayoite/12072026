# P08 — Mesh quality (W7)

**Status:** REPROVE — toe/carcass/door implementation and mirrored GLB part plan are on disk. Visual and current-checkout evidence remain open.

**Gate:** **W7** / CP-08 — modular **cabinet-v0** readable as **toe / carcass / door** (not apology box).  
**Evidence:** `results/planner/world-standard-wave/08-mesh-quality/` only.  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** Freeze bar in `../../results/planner/world-standard-wave/08-mesh-quality/NOTES.md`; prove with units + headless visual smoke; plan === mesh part list.

**Out of scope:** Photoreal · full kitchens/hardware · 2D host thrash · adding a second plan host · cloud catalog · designer static GLB · non–cabinet-v0 · writes under `site/public/**`. Stay imperative Three — no R3F rewrite for pretty PNGs.

**Depends:** P01 path truth. P07 browser place optional — headless mesh PNG is default smoke.

---

## Current truth (re-verify)

`generateCabinetV0Mesh` now creates `toe → carcass → door(s)`. Counts are 2/3/4. `modularCabinetV0GlbExport.ts` imports the shared toe and door constants and mirrors the part plan. What is still missing is fresh visual smoke and full affected-test evidence on this checkout.

---

## Quality bar (normative → NOTES)

Default slab children **exact order:** `toe` → `carcass` → `door-slab` (pair: `door-left` / `door-right`). Name is exactly **`toe`** (not plinth/toe-kick).

| Const | Value |
|-------|------:|
| `TOE_HEIGHT_MM` | 100 |
| `TOE_INSET_MM` | 50 |
| `DOOR_THICKNESS_MM` | 18 |

- **toe:** height toeH; depth `d - inset`; back-aligned (`z ≈ -inset/2`); front recessed  
- **carcass:** height `h - toeH`; sits **on** toe (toe replaces bottom — never additive overshoot)  
- **doors:** height ≈ `carcassH * 0.92`; y centered on carcass; not full `h`  
- **Height integrity:** group Y span ≤ `heightMm`  
- **2D footprint:** outer W×D unchanged (BOQ-true)  
- **plan === mesh:** same names, order, counts, sizes/positions (metres)  
- **No designer static GLB**; generated path only if G5 (`catalog-assets/generated/*`)

**Part counts after change:** none=2 · slab=3 · pair=4 (always includes toe).

**Readable:** three-quarter view — human sees base band, body, door face without wireframe labels.

---

## Touch list

| Path | Role |
|------|------|
| `…/catalog/modularCabinetV0.ts` | Mesh + export constants |
| `…/catalog/modularCabinetV0GlbExport.ts` | Part plan mirror; import consts |
| `…/createSceneObjectFromNode.ts` (+ tests) | Blast names/counts |
| `asset-engine` meshStages tests | Pair count 3→4 |
| `modularCabinetV0*.test.ts` · `modularPlaceMesh.test.ts` | TDD |
| Evidence | NOTES · vitest logs · headless PNGs · `run.json` |

Prefix open3d: `site/features/planner/project/`.

---

## Kill order (unchecked)

- [ ] Evidence dir + baseline vitest log
- [ ] `../../results/planner/world-standard-wave/08-mesh-quality/NOTES.md` = this bar (exact `toe`, formulas, fail modes)
- [ ] RED units: slab names `toe,carcass,door-slab`; counts 2/3/4; height span; toe geometry
- [ ] GREEN mesh + GlbExport mirror; blast tests updated
- [ ] Headless three-quarter (+ side) PNG; `../../results/planner/world-standard-wave/08-mesh-quality/visual-smoke.md` yes/no per criterion
- [ ] Non-regression scoped vitest; `run.json` (gate W7)
- [ ] Residual honesty (handles/materials still simple) — no world-standard ship claim

**W7 red until** NOTES + units + visual smoke agree toe/carcass/door readable.  
**Next (sequence):** [P09](./P09-shortcuts-chrome.md).
