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
