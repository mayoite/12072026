/**
 * P05 / W2 — cabinet-v0 Block2D plan symbol quality (not empty-box bar).
 */
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
    save: () => {
      calls.push("save");
    },
    restore: () => {
      calls.push("restore");
    },
    translate: () => {
      calls.push("translate");
    },
    rotate: () => {
      calls.push("rotate");
    },
    scale: () => {
      calls.push("scale");
    },
    beginPath: () => {
      calls.push("beginPath");
    },
    rect: () => {
      calls.push("rect");
    },
    roundRect: () => {
      calls.push("roundRect");
    },
    arc: () => {
      calls.push("arc");
    },
    moveTo: () => {
      calls.push("moveTo");
    },
    lineTo: () => {
      calls.push("lineTo");
    },
    fill: () => {
      calls.push("fill");
    },
    stroke: () => {
      calls.push("stroke");
    },
    setLineDash: () => {
      calls.push("setLineDash");
    },
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

/** Small filled rects (handles) — exclude outer/inner carcass. */
function handleRectCount(prims: Prim[]): number {
  return prims.filter((p) => {
    if (p.kind !== "rect") return false;
    if (p.fill === "none" || p.fill === undefined) return false;
    // Carcass outer is large (≥ half footprint either axis when typical).
    return p.w < 80 && p.h < 40;
  }).length;
}

function horizontalLineYs(prims: Prim[]): number[] {
  const ys: number[] = [];
  for (const p of prims) {
    if (p.kind !== "line" || p.points.length < 4) continue;
    const y0 = p.points[1]!;
    const y1 = p.points[3]!;
    if (Math.abs(y0 - y1) < 2) ys.push(y0);
  }
  return ys;
}

describe("cabinet-v0 Block2D plan symbol (W2)", () => {
  it("uses placed modular dimensions for footprint", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.footprint.L).toBe(800);
    expect(block.footprint.D).toBe(400);
    expect(block.footprint.H).toBe(900);
  });

  it("prefers modularOptions dims over item width/depth/height when set", () => {
    const block = furnitureBlock2DFromItem(
      cabinetItem({
        width: 1200,
        depth: 600,
        height: 700,
        modularOptions: {
          widthMm: 900,
          depthMm: 350,
          heightMm: 880,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );
    expect(block.footprint.L).toBe(900);
    expect(block.footprint.D).toBe(350);
    expect(block.footprint.H).toBe(880);
  });

  it("is not an empty-box symbol: ≥4 prims with carcass + front + door cue", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    expect(countByKind(block.prims, "rect")).toBeGreaterThanOrEqual(1);
    expect(countByKind(block.prims, "line")).toBeGreaterThanOrEqual(2);
  });

  it("draws outer carcass covering full footprint origin (0,0)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const { L, D } = block.footprint;
    const outer = block.prims.find(
      (p) =>
        p.kind === "rect" &&
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - L) < 1 &&
        Math.abs(p.h - D) < 1,
    );
    expect(outer).toBeDefined();
    expect(outer?.kind).toBe("rect");
    if (outer?.kind === "rect") {
      expect(outer.fill).not.toBe("none");
    }
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

  it("front edge is deeper (+Y) than back edge (readable door face)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const hs = horizontalLineYs(block.prims);
    expect(hs.length).toBeGreaterThanOrEqual(2);
    const backY = Math.min(...hs);
    const frontY = Math.max(...hs);
    expect(frontY).toBeGreaterThan(backY);
    // Front sits near depth face, not mid-carcass only
    expect(frontY).toBeGreaterThan(block.footprint.D * 0.7);
  });

  it("pair doors get a center stile; slab does not", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "pair",
          material: "oak",
        },
      }),
    );
    expect(midVerticalStileCount(pair.prims, midX)).toBeGreaterThanOrEqual(1);

    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);
  });

  it("pair has dual handle cues; slab has single offset handle (no mid stile)", () => {
    const midX = 400;
    const pair = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "pair",
          material: "oak",
        },
      }),
    );
    const slab = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );

    expect(pair.prims.length).toBeGreaterThanOrEqual(4);
    expect(slab.prims.length).toBeGreaterThanOrEqual(4);
    // doorStyle geometry must actually differ (S2)
    expect(JSON.stringify(pair.prims)).not.toEqual(JSON.stringify(slab.prims));

    expect(handleRectCount(pair.prims)).toBe(2);
    expect(handleRectCount(slab.prims)).toBe(1);
    expect(midVerticalStileCount(slab.prims, midX)).toBe(0);

    // Slab handle offset to one side — not centered on mid-X
    const slabHandle = slab.prims.find(
      (p) => p.kind === "rect" && p.w < 80 && p.h < 40 && p.fill !== "none",
    );
    expect(slabHandle?.kind).toBe("rect");
    if (slabHandle?.kind === "rect") {
      const handleCx = slabHandle.x + slabHandle.w / 2;
      expect(Math.abs(handleCx - midX)).toBeGreaterThan(40);
    }
  });

  it("doorStyle none has open-shelf cues and zero mid stile", () => {
    const midX = 400;
    const open = furnitureBlock2DFromItem(
      cabinetItem({
        modularOptions: {
          widthMm: 800,
          depthMm: 400,
          heightMm: 900,
          doorStyle: "none",
          material: "white",
        },
      }),
    );
    expect(open.prims.length).toBeGreaterThanOrEqual(4);
    expect(midVerticalStileCount(open.prims, midX)).toBe(0);
    expect(handleRectCount(open.prims)).toBe(0);

    const dashedHoriz = open.prims.filter((p) => {
      if (p.kind !== "line" || p.points.length < 4) return false;
      const y0 = p.points[1]!;
      const y1 = p.points[3]!;
      const isHoriz = Math.abs(y0 - y1) < 2;
      return isHoriz && Array.isArray(p.dash) && p.dash.length > 0;
    });
    // Open shelves: at least two dashed horizontal shelf lines
    expect(dashedHoriz.length).toBeGreaterThanOrEqual(2);
  });

  it("reports top-left prim authorship (centeredPath helper is false)", () => {
    expect(furnitureBlockUsesCenteredPath(cabinetItem())).toBe(false);
    expect(
      furnitureBlockUsesCenteredPath(
        cabinetItem({
          modularOptions: {
            widthMm: 800,
            depthMm: 400,
            heightMm: 900,
            doorStyle: "pair",
            material: "oak",
          },
        }),
      ),
    ).toBe(false);
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
