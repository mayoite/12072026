# P05 Appendix — TypeScript / honesty skeletons

## Structure rewrite 2026-07-09

Companion to **[P05-symbols-svg.md](./P05-symbols-svg.md)**. Full test + impl source moved out of the execute card. **Not a second CP.** Evidence remains `results/planner/world-standard-wave/05-symbols-svg/`.

---

## Baseline NOTES template

```markdown
# P05 baseline

- Date: (ISO)
- Canvas draw path: FeasibilityCanvas → furnitureBlock2DFromItem → renderBlock2DCentered
- cabinet-v0 modular symbol today: **2 prims** (rect + dashed center line) — not product-readable yet
- furnitureBlockUsesCenteredPath: returns true but modular prims are top-left; unused — fix in Task 2
- SVG catalog path: compileSvgForPublish → public/svg-catalog (not canvas authority)
- generateCabinetV0Footprint: centered path string helper — not Feasibility draw authority
- Ethics: no competitor SVG
- Baseline vitest log: vitest-raw.log
```

`00-baseline/run.json`: phase P05, slice 00-baseline, real exitCode, timestamp, HEAD.

---

## Task 1 full test skeleton

Create `site/tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/open3d/catalog/furnitureBlock2D";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";
import { renderBlock2DToCanvas } from "@/lib/catalog/renderBlock2DToCanvas";
import type { Prim } from "@/lib/catalog/blocks2d";

function cabinetItem(
  partial?: Partial<Open3dFurnitureItem>,
): Open3dFurnitureItem {
  return {
    id: "cab-1",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 800,
    depth: 400,
    height: 900,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 800,
      depthMm: 400,
      heightMm: 900,
      doorStyle: "slab",
      material: "white",
    },
    ...partial,
  };
}

function mockContext(): CanvasRenderingContext2D {
  const calls: string[] = [];
  const ctx = {
    calls,
    save: () => { calls.push("save"); },
    restore: () => { calls.push("restore"); },
    translate: () => { calls.push("translate"); },
    rotate: () => { calls.push("rotate"); },
    scale: () => { calls.push("scale"); },
    beginPath: () => { calls.push("beginPath"); },
    rect: () => { calls.push("rect"); },
    roundRect: () => { calls.push("roundRect"); },
    arc: () => { calls.push("arc"); },
    moveTo: () => { calls.push("moveTo"); },
    lineTo: () => { calls.push("lineTo"); },
    fill: () => { calls.push("fill"); },
    stroke: () => { calls.push("stroke"); },
    setLineDash: () => { calls.push("setLineDash"); },
    createLinearGradient: () => ({ addColorStop: () => undefined }),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    shadowColor: "",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  };
  return ctx as unknown as CanvasRenderingContext2D;
}

function countByKind(prims: Prim[], kind: Prim["kind"]): number {
  return prims.filter((p) => p.kind === kind).length;
}

function midVerticalStileCount(prims: Prim[], midX: number): number {
  return prims.filter((p) => {
    if (p.kind !== "line" || p.points.length < 4) return false;
    const x0 = p.points[0]!;
    const x1 = p.points[2]!;
    return Math.abs(x0 - midX) < 2 && Math.abs(x1 - midX) < 2;
  }).length;
}

describe("cabinet-v0 Block2D plan symbol (W2)", () => {
  it("uses placed modular dimensions for footprint", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.footprint.L).toBe(800);
    expect(block.footprint.D).toBe(400);
    expect(block.footprint.H).toBe(900);
  });

  it("is not an empty-box symbol: ≥4 prims with carcass + front + door cue", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    expect(countByKind(block.prims, "rect")).toBeGreaterThanOrEqual(1);
    expect(countByKind(block.prims, "line")).toBeGreaterThanOrEqual(2);
  });

  it("keeps all prim geometry inside footprint (no runaway coords)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    for (const p of block.prims) {
      if (p.kind === "rect") {
        expect(p.x).toBeGreaterThanOrEqual(-1);
        expect(p.y).toBeGreaterThanOrEqual(-1);
        expect(p.x + p.w).toBeLessThanOrEqual(L + 1);
        expect(p.y + p.h).toBeLessThanOrEqual(D + 1);
      }
      if (p.kind === "line") {
        for (let i = 0; i < p.points.length; i += 2) {
          expect(p.points[i]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i]).toBeLessThanOrEqual(L + 1);
          expect(p.points[i + 1]).toBeGreaterThanOrEqual(-1);
          expect(p.points[i + 1]).toBeLessThanOrEqual(D + 1);
        }
      }
    }
  });

  it("pair doors get a center stile; slab does not", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800, depthMm: 400, heightMm: 900,
          doorStyle: "pair", material: "oak",
        },
      }),
    );
    expect(midVerticalStileCount(pair.prims, midX)).toBeGreaterThanOrEqual(1);

    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800, depthMm: 400, heightMm: 900,
          doorStyle: "slab", material: "white",
        },
      }),
    );
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);
  });

  it("reports top-left prim authorship (centeredPath helper is false)", () => {
    expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
  });

  it("renders to canvas without throwing and issues fill+stroke", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const ctx = mockContext();
    renderBlock2DToCanvas(ctx, block, {
      resolve: (t) => (t && t !== "none" ? String(t) : "#ccc"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls).toContain("fill");
    expect(calls).toContain("stroke");
    expect(calls.filter((c) => c === "beginPath").length).toBeGreaterThanOrEqual(2);
  });

  it("never depends on external SVG/GLB URLs for plan symbol", () => {
    const src = furnitureBlock2DFromItem.toString();
    expect(src).not.toMatch(/https?:\/\//);
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(JSON.stringify(block)).not.toMatch(/\.glb|\.svg|svg-catalog/);
  });
});
```

---

## Task 2 `modularCabinetBlock` skeleton

In `furnitureBlock2D.ts` — top-left origin; original geometry only; read `item.modularOptions` as `Open3dModularCabinetV0Options | undefined` (no mesh cast):

```typescript
function modularCabinetBlock(item: Open3dFurnitureItem): Block2D {
  const opts = item.modularOptions;
  const w = opts?.widthMm ?? item.width ?? DEFAULT_MM;
  const d = opts?.depthMm ?? item.depth ?? DEFAULT_MM;
  const h = opts?.heightMm ?? item.height ?? 900;
  const doorStyle = opts?.doorStyle ?? "slab";
  const inset = Math.min(16, Math.max(6, Math.min(w, d) * 0.04));
  const frontY = d - inset; // plan: +Y depth; front at larger Y
  const stroke = BLOCK_STYLE.storageStroke;
  const strokeW = BLOCK_STYLE.surfaceStrokeWidth;

  const prims: Prim[] = [
    { kind: "rect", x: 0, y: 0, w, h: d, fill: BLOCK_STYLE.storage, stroke, strokeWidth: strokeW, radius: 4 },
    { kind: "rect", x: inset, y: inset, w: Math.max(1, w - inset * 2), h: Math.max(1, d - inset * 2), fill: "none", stroke, strokeWidth: 1, radius: 2 },
    { kind: "line", points: [inset, frontY, w - inset, frontY], stroke, strokeWidth: 2 },
    { kind: "line", points: [inset, inset, w - inset, inset], stroke, strokeWidth: 1.5 },
  ];

  if (doorStyle === "pair") {
    prims.push({ kind: "line", points: [w * 0.5, inset, w * 0.5, frontY], stroke, strokeWidth: 1.5, dash: [6, 4] });
    const handleW = Math.min(28, w * 0.06);
    const handleH = Math.min(10, d * 0.06);
    const handleY = frontY - handleH - 4;
    prims.push({ kind: "rect", x: w * 0.25 - handleW / 2, y: handleY, w: handleW, h: handleH, fill: stroke, radius: 2 });
    prims.push({ kind: "rect", x: w * 0.75 - handleW / 2, y: handleY, w: handleW, h: handleH, fill: stroke, radius: 2 });
  } else if (doorStyle === "slab") {
    const handleW = Math.min(36, w * 0.08);
    const handleH = Math.min(12, d * 0.07);
    prims.push({ kind: "rect", x: w - inset - handleW - 8, y: frontY - handleH - 4, w: handleW, h: handleH, fill: stroke, radius: 2 });
  } else {
    prims.push({ kind: "line", points: [inset, d * 0.33, w - inset, d * 0.33], stroke, strokeWidth: 1, dash: [8, 4] });
    prims.push({ kind: "line", points: [inset, d * 0.66, w - inset, d * 0.66], stroke, strokeWidth: 1, dash: [8, 4] });
  }

  return {
    footprint: { L: w, D: d, H: h },
    prims,
    label: item.catalogId || "cabinet-v0",
  };
}

/**
 * Historical name. All furnitureBlock2D prims are authored top-left (0..L, 0..D).
 * Canvas centers via renderBlock2DCentered — never via centered prim authorship.
 * Always false.
 */
export function furnitureBlockUsesCenteredPath(_item: Open3dFurnitureItem): boolean {
  return false;
}
```

**Rules:** top-left only · slab ≠ pair · no competitor path data · no `/svg-catalog` · no P08 mesh · no `generateCabinetV0Footprint` into canvas.

---

## Task 3 unknown SKU

Append inside `describe("furnitureBlock2DFromItem")` in `renderBlock2DToCanvas.test.ts`:

```typescript
  it("box fallback still draws a rect when bridge returns nothing", () => {
    const block = furnitureBlock2DFromItem({
      id: "unknown-1",
      catalogId: "zz-unknown-sku-no-bridge",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 500,
      depth: 500,
      height: 500,
    });
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.prims.some((p) => p.kind === "rect")).toBe(true);
  });
```

---

## SVG honesty NOTES

```markdown
# SVG path honesty (P05)

## What is true
1. Publish compile authority = compileSvgForPublish → pipelineCore+normalize
2. Admin publish wire = publishDescriptorWithPipeline → public/svg-catalog/{slug}.svg
3. CLI fixtures: pnpm run scripts:smoke:svg / scripts:smoke:svg:batch
4. V1 svgCompiler.server.ts = v1-reference-only
5. Open3d plan canvas does not draw from /svg-catalog/*.svg today (Block2D)
6. generateCabinetV0Footprint is mesh/helper — not canvas Block2D

## What is not true
1. “SVG is the FeasibilityCanvas authority.”
2. “cabinet-v0 plan mark is published SVG.”
3. “Portal svg-catalog proves planner place symbols.”
4. “furnitureBlockUsesCenteredPath means modular prims are centered.” (fixed false)

## Smoke result this run
- scripts:smoke:svg:batch exit: (code)
```

---

## README canvas vs publish

Append to `site/features/planner/asset-engine/README.md`:

```markdown
## Canvas vs publish SVG (P05 honesty)

| Surface | Authority today | Entry |
|---------|-----------------|-------|
| open3d plan furniture symbols | **Block2D prims** (top-left; canvas centers) | `furnitureBlock2DFromItem` → `renderBlock2DToCanvas` / `renderBlock2DCentered` |
| Admin/CLI published SVG files | **pipelineCore+normalize** | `compileSvgForPublish` → `public/svg-catalog/{slug}.svg` |
| Portal preview | Published SVG URL | `/portal/svg-catalog` |

W2 acceptance is **Block2D readable**, not “SVG loaded onto FeasibilityCanvas.”
Do not mark S7 implemented until inventory place consumes published SVG with evidence.
```

---

## Visual prim dump

```typescript
const block = furnitureBlock2DFromItem({
  id: "vis",
  catalogId: "cabinet-v0",
  position: { x: 0, y: 0 },
  rotation: 0,
  scale: { x: 1, y: 1, z: 1 },
  width: 800, depth: 400, height: 900,
  geometryMode: "modular-cabinet-v0",
  modularOptions: {
    widthMm: 800, depthMm: 400, heightMm: 900,
    doorStyle: "pair", material: "white",
  },
});
// expect prims.length >= 4; write JSON to 05-visual/; also dump slab for stile contrast
```

---

## CP-05.json shape

```json
{
  "checkpoint": "CP-05",
  "phase": "P05-symbols-svg",
  "gate": "W2-symbol-quality",
  "status": "pass-or-fail",
  "claims": {
    "cabinetV0Block2DReadable": true,
    "notEmptyBox": true,
    "doorStyleGeometryDiffers": true,
    "canvasAuthorityIsBlock2D": true,
    "furnitureBlockUsesCenteredPathIsFalse": true,
    "svgCatalogIsPublishNotCanvas": true,
    "svgHonestySmoke": "pass-or-fail-or-skipped-with-notes",
    "noCompetitorSvg": true,
    "browserPlaceJourney": "deferred-to-P07"
  },
  "evidence": [
    "results/planner/world-standard-wave/05-symbols-svg/02-green/vitest-raw.log",
    "results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md",
    "results/planner/world-standard-wave/05-symbols-svg/05-visual/"
  ]
}
```

**SUMMARY.md:** Done = ≥4 prims · pair/slab differ · centeredPath false · honesty · ethics. Not done = P07 place · P08 mesh · SVG as canvas draw.
