# P03 Execute 2/5 — pick + select pointer product path

**Date:** 2026-07-10  
**Seat:** Execute 2/5 (Mode A — re-prove only)  
**Checkout:** `.` (main only; no worktrees)  
**HEAD:** `bf212a9a7d0fa8e7867b5f6a803b06ee5a5c43df`  
**Mode:** A — verify product path; **no thrash if green**

---

## Verdict

| Claim | Status |
|-------|--------|
| `pickFurnitureAtPoint` correct (reverse scan, inverse-rot AABB, default 600, padding) | **GREEN** |
| Select tool pointer is **furniture-first** then openings → walls → rooms → none | **GREEN** |
| Select hit → `setSelection({ type: "furniture", ids: [id] })` | **GREEN** |
| Empty click → `setSelection({ type: "none", ids: [] })` | **GREEN** |
| Product code thrash this seat | **NONE** |
| **Execute 2/5** | **OK** |

**Return: OK** — product path landed and re-proved. FeasibilityCanvas select pointer not edited (not RED).

---

## Product path (live code)

### 1. `pickFurnitureAtPoint`

**File:** `site/features/planner/open3d/lib/geometry/canvasPicking.ts` (L145–164)

| Behavior | Live |
|----------|------|
| Reverse array scan (top-most = last drawn) | Yes — `for (index = length-1; …)` |
| Inverse-rotation AABB (degrees → rad) | Yes — `rad = (-(rotation\|\|0)*π)/180` |
| Default footprint when width/depth omitted | Yes — `(item.width ?? 600)`, `(item.depth ?? 600)` |
| Optional `paddingMm` expands half extents | Yes — default `0` |
| Empty furniture → `null` | Yes — loop never runs |

### 2. FeasibilityCanvas select pointer (furniture-first)

**File:** `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` (L766–808)

Gate: `event.button === 0 && activeTool === "select" && workspaceCanvas`

Order (comment on L769 matches code):

1. **`pickFurnitureAtPoint(raw, activeFloor.furniture, Math.max(20, 40/scale))`**  
   → hit → `setSelection({ type: "furniture", ids: [furnitureId] })` + **return**
2. **`pickOpeningAtPoint(...)`** → door/window selection + return
3. **`pickWallAtPoint(...)`** / room `pointInPolygon`  
   → wall | room | `{ type: "none", ids: [] }`

Furniture-first is enforced by early return after furniture hit — openings/walls cannot steal a furniture hit.

**No FeasibilityCanvas edit this seat** — path is GREEN, Mode A forbids thrash.

---

## Unit re-prove (this seat)

```text
pnpm exec vitest run \
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts \
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx \
  --reporter=verbose
```

| Suite | Result |
|-------|--------|
| `geometry/canvasPicking.test.ts` | **33 passed** |
| `open3dFeasibilityCanvas.test.tsx` | **9 passed** |
| **Total** | **2 files / 42 tests / exit 0** |

**Raw log:** `results/planner/world-standard-wave/03-select-delete/exec2-pick-select-vitest-raw.log`

### `pickFurnitureAtPoint` cases covered (7)

| Case | Test |
|------|------|
| Hit inside footprint | present |
| Miss outside | present |
| Top-most (last array) wins | present |
| Rotated 90° inverse-rot | present |
| paddingMm expands hit | present |
| Empty array → null (U1) | present |
| Missing W/D → 600mm (U2: hit 290 / miss 310) | present |

### Select tool product cases (U10–U11)

| Case | Test |
|------|------|
| Select pointer on furniture → `{ type: "furniture", ids: [id] }` | `select tool pointer on furniture sets furniture selection` |
| Empty click → `{ type: "none", ids: [] }` | `select tool empty click clears selection to none` |

Both drive real `FeasibilityCanvas` + `useWorkspaceCanvas` (not mocked pick).

---

## Thrash audit

| Action | Done? |
|--------|-------|
| Edit `canvasPicking.ts` | **No** (green) |
| Edit `FeasibilityCanvas.tsx` select pointer | **No** (green) |
| Rewrite pick tests | **No** |
| Fabric dual-surface / store selection thrash | **No** |
| Evidence only | **Yes** — this note + vitest raw log |

---

## Honesty bounds (what this seat does **not** claim)

- Not full W3 / CP-03 browser close (browser is separate seat/evidence).
- Not delete/undo keyboard path (Execute 3+ / other seats).
- Unit select path ≠ browser click-through; browser pack lives under same folder (`browser-w3-raw.log`, PNGs) but is out of this seat’s write charter.

---

## Next

Execute 3/5 (or active P03 chain) — delete/undo path if not already re-proved. This seat: **OK, no fix required.**
