# P05 Code Truth Audit — elon-reproof

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`  
**Verdict:** **PASS**

---

## 1. `furnitureBlockUsesCenteredPath` always returns `false`

### Source (read)

`site/features/planner/open3d/catalog/furnitureBlock2D.ts` lines 392–399:

```ts
/**
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false (was a dead lie when modular returned true with top-left prims).
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
```

- Body is unconditional `return false`.
- Parameter is intentionally unused (`_item`).
- No branch, no geometryMode check, no catalogId special case.

### Call-site inventory (site)

| Location | Role |
|----------|------|
| `furnitureBlock2D.ts` | sole definition |
| `furnitureBlock2D.cabinet-v0.test.ts` | unit asserts `=== false` |
| `asset-engine/README.md` | docs honesty only |

No production consumer imports it for draw path decisions.

### Unit proof

Command:

```text
cd site; pnpm exec vitest run tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts --reporter=verbose
```

Result (2026-07-09): **12/12 passed**  
Log: `elon-reproof/vitest-code-truth.log`

Relevant case:

```text
✓ reports top-left prim authorship (centeredPath helper is false)
```

Assert:

```ts
expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
```

### centeredPath still true anywhere?

**No.** Definition cannot return true. No alternate implementation found under `site/`.  
**Fix required:** none.

---

## 2. `modularCabinetBlock` prim counts — slab vs pair

### Source construction

`modularCabinetBlock` in `furnitureBlock2D.ts` (~L47–164).

**Shared base (always 4 prims):**

| # | Kind | Role |
|---|------|------|
| 1 | `rect` | Outer carcass (0,0 → w×d) |
| 2 | `rect` | Inner carcass / shelf zone (inset) |
| 3 | `line` | Front edge (door face, larger Y) |
| 4 | `line` | Back edge (smaller Y) |

**`doorStyle === "pair"` adds 3 → total 7:**

| # | Kind | Role |
|---|------|------|
| 5 | `line` | Mid stile at `w * 0.5` (dashed) |
| 6 | `rect` | Left handle cue (~0.25w) |
| 7 | `rect` | Right handle cue (~0.75w) |

**`doorStyle === "slab"` adds 1 → total 5:**

| # | Kind | Role |
|---|------|------|
| 5 | `rect` | Single offset handle (near front-right) |

**`doorStyle === "none"` adds 2 → total 6:** two dashed open-shelf lines (not the slab/pair gate).

### Counts (source-derived, default 800×400×900)

| doorStyle | primCount | mid vertical stile at w/2 |
|-----------|-----------|---------------------------|
| **slab**  | **5**     | **0** |
| **pair**  | **7**     | **≥1** (dashed center line) |

Cross-check dump (prior visual): `05-visual/cabinet-v0-prims.json` — slab `primCount: 5`, pair `primCount: 7`.

Units that lock this:

- `pair doors get a center stile; slab does not`
- `pair has dual handle cues; slab has single offset handle (no mid stile)`
- `is not an empty-box symbol: ≥4 prims…`

---

## 3. Feasibility draw path = Block2D, not `/svg-catalog`

### Import graph

`site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`:

```ts
import { furnitureBlock2DFromItem } from "../catalog/furnitureBlock2D";
import {
  createCanvasBlockColorResolver,
  renderBlock2DCentered,
} from "@/lib/catalog/renderBlock2DToCanvas";
```

### Draw loop (~L583–610)

```ts
if (layerVisibility.furniture) {
  // Procedural Block2D … No external GLBs/SVG downloads — our blocks2d symbols only.
  const colorResolve = createCanvasBlockColorResolver(canvas);
  try {
    for (const item of activeFloor.furniture) {
      const center = projectToScreen(item.position, transform);
      const block = furnitureBlock2DFromItem(item);
      // … translate / rotate / scale …
      renderBlock2DCentered(context, block, {
        resolve: colorResolve,
        skipShadow: transform.scale < 0.05,
      });
```

### Negative greps on `canvas-feasibility/`

| Pattern | Matches |
|---------|---------|
| `svg-catalog` | **0** |
| `compileSvgForPublish` | **0** |
| `loadSVG` | **0** |
| `fetch(` for catalog SVG | **0** |

### Authority split (honesty)

| Path | Authority | Not authority for |
|------|-----------|-------------------|
| Feasibility plan furniture | `furnitureBlock2DFromItem` → `renderBlock2DCentered` | published SVG files |
| Admin/CLI publish | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` | plan canvas symbols |
| Portal preview | `/portal/svg-catalog` | planner place marks |

Modular cabinet route inside `furnitureBlock2DFromItem`:

```ts
if (item.geometryMode === "modular-cabinet-v0") {
  return modularCabinetBlock(item);
}
```

→ procedural prims only; no URL / SVG / GLB.

---

## 4. Gate matrix

| Check | Result |
|-------|--------|
| `furnitureBlockUsesCenteredPath` always false (source) | **PASS** |
| Unit: centeredPath false | **PASS** (12/12 suite) |
| slab prim count from source | **5** |
| pair prim count from source | **7** |
| slab ≠ pair (mid stile) | **PASS** |
| Feasibility uses `furnitureBlock2DFromItem` | **PASS** |
| Feasibility does not draw via `/svg-catalog` | **PASS** |
| centeredPath true anywhere → fail/fix | **N/A — already false** |

---

## 5. Evidence files

| Artifact | Path |
|----------|------|
| This report | `results/planner/world-standard-wave/05-symbols-svg/elon-reproof/CODE-TRUTH.md` |
| Vitest log | `results/planner/world-standard-wave/05-symbols-svg/elon-reproof/vitest-code-truth.log` |
| Prim dump | `results/planner/world-standard-wave/05-symbols-svg/05-visual/cabinet-v0-prims.json` |
| Prior CP summary | `results/planner/world-standard-wave/05-symbols-svg/SUMMARY.md` |

**Overall: PASS**
