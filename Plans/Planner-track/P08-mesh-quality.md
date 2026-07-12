# P08 — Mesh quality (W7)

**Status:** **PASS** (agent 2026-07-12) — units 43/43 + NOTES bar + headless plan visual; residual named (no WebGL browser shot; handles/materials simple).

**Gate:** **W7** / CP-08 — modular **cabinet-v0** readable as **toe / carcass / door** (not apology box).  
**Evidence:** `results/planner/world-standard-wave/08-mesh-quality/` only.  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** Freeze bar in NOTES; prove with units + headless visual smoke; plan === mesh part list.

**Out of scope:** Photoreal · full kitchens/hardware · 2D host thrash · adding a second plan host · cloud catalog · designer static GLB · non–cabinet-v0 · writes under `site/public/**`. Stay imperative Three — no R3F rewrite for pretty PNGs.

**Depends:** P01 path truth only. **Not blocked by P05 or P07** — headless/unit mesh is the default smoke; browser place is optional convenience, not a gate.

---

## Current truth (this HEAD)

`generateCabinetV0Mesh` creates `toe → carcass → door(s)`. Counts **2 / 3 / 4**. `TOE_HEIGHT_MM = 100`. GlbExport imports shared constants and mirrors the part plan 1:1. Fresh vitest + headless PNGs on `0bc58eb5…`.

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

Prefix: `site/features/planner/project/` (and live 3D under `features/planner/3d/`).

---

## Kill order

- [x] Evidence dir + baseline vitest log (`vitest-unit.json` · `run.json`)
- [x] NOTES bar frozen (`agents-work/…/08-mesh-quality/NOTES.md` + dump mirror)
- [x] Units: slab names `toe,carcass,door-slab`; counts 2/3/4; height span; toe geometry — **43/43 green**
- [x] GREEN mesh + GlbExport mirror; blast tests (createSceneObjectFromNode) green
- [x] Headless three-quarter (+ side) PNG; `visual-smoke.md` yes/no per criterion
- [x] Non-regression scoped vitest; `run.json` (gate W7)
- [x] Residual honesty (handles/materials simple; headless = plan SVG not WebGL) — no world-standard ship claim

**W7 / CP-08:** **PASS** (agent) — units + NOTES; visual residual named in `visual-smoke.md`.  
**Next (sequence):** [P09](./P09-shortcuts-chrome.md).
