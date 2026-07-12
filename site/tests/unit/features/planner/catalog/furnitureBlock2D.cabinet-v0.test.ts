/**
 * P05 / W2 — cabinet-v0 Block2D plan symbol quality (not empty-box bar).
 * Geometry is fraction-of-footprint so multiprim stays legible at plan zoom.
 */
import { describe, expect, it } from "vitest";
import {
  furnitureBlock2DFromItem,
  furnitureBlockUsesCenteredPath,
} from "@/features/planner/project/catalog/furnitureBlock2D";
import type { PlannerFurnitureItem } from "@/features/planner/project/model/types";
import { renderBlock2DToCanvas } from "@/lib/catalog/renderBlock2DToCanvas";
import type { Prim } from "@/lib/catalog/blocks2d";

function cabinetItem(
  partial?: Partial<PlannerFurnitureItem>,
): PlannerFurnitureItem {
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

/**
 * Small filled hardware rects (handles) — not outer carcass, door band, or shelf strips.
 * Door band spans most of width; handles stay under ~25% of each side.
 */
function handleRectCount(prims: Prim[], L: number, D: number): number {
  return prims.filter((p) => {
    if (p.kind !== "rect") return false;
    if (p.fill === "none" || p.fill === undefined) return false;
    const isOuter =
      Math.abs(p.x) < 1 &&
      Math.abs(p.y) < 1 &&
      Math.abs(p.w - L) < 1 &&
      Math.abs(p.h - D) < 1;
    if (isOuter) return false;
    // Exclude full-width door face / shelf strips
    if (p.w >= L * 0.5) return false;
    return p.w < L * 0.25 && p.h < D * 0.25;
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

/** Inner carcass rect (fill none, inset from outer). */
function innerCarcassRect(prims: Prim[]): Extract<Prim, { kind: "rect" }> | undefined {
  return prims.find(
    (p): p is Extract<Prim, { kind: "rect" }> =>
      p.kind === "rect" && p.fill === "none",
  );
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

  it("outer fill is light surface token, not block-storage; multi-prim lines present", () => {
    // Root-cause lock: opaque var(--block-storage)/inverse-body carcass → solid plan blob.
    // Cabinet plan symbol must use light surface + dark detail lines so multi-prim reads.
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
    if (!outer || outer.kind !== "rect") throw new Error("outer carcass missing");

    // Literal light fill required on canvas (CSS vars often fail → black blob).
    expect(outer.fill).toMatch(/^#|^rgb/i);
    expect(outer.fill?.toLowerCase()).not.toBe("#000");
    expect(outer.fill?.toLowerCase()).not.toBe("#000000");
    expect(outer.fill).not.toMatch(/block-storage/);
    expect(outer.fill).not.toMatch(/text-inverse-body/);
    expect(outer.stroke).not.toMatch(/block-storage/);

    // Multi-prim: carcass + inner + front/back lines (+ door cues)
    expect(block.prims.length).toBeGreaterThanOrEqual(4);
    const lines = block.prims.filter((p) => p.kind === "line");
    expect(lines.length).toBeGreaterThanOrEqual(2);
    for (const line of lines) {
      if (line.kind === "line") {
        expect(line.stroke).toBeDefined();
        expect(line.stroke).not.toMatch(/block-storage/);
        expect(String(line.stroke)).not.toMatch(/text-inverse-body/);
      }
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

  it("pair and slab differ; pair has dual handles, slab single offset (slab may have mid line)", () => {
    // Fractional multiprim: slab may include a mid vertical cue so it is not an empty tile.
    // Pair/slab must still differ; pair dual handles vs slab single offset handle.
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

    expect(pair.prims.length).toBeGreaterThanOrEqual(5);
    expect(slab.prims.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(pair.prims)).not.toEqual(JSON.stringify(slab.prims));

    // Pair always has a center stile; slab may also have a mid cue (allowed).
    expect(midVerticalStileCount(pair.prims, midX)).toBeGreaterThanOrEqual(1);

    expect(handleRectCount(pair.prims, 800, 400)).toBe(2);
    expect(handleRectCount(slab.prims, 800, 400)).toBe(1);

    // Slab handle offset to one side — not centered on mid-X (exclude door band by size)
    const slabHandle = slab.prims.find((p) => {
      if (p.kind !== "rect" || p.fill === "none" || p.fill === undefined) return false;
      const isOuter =
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - 800) < 1 &&
        Math.abs(p.h - 400) < 1;
      if (isOuter) return false;
      return p.w < 800 * 0.25 && p.h < 400 * 0.25;
    });
    expect(slabHandle?.kind).toBe("rect");
    if (slabHandle?.kind === "rect") {
      const handleCx = slabHandle.x + slabHandle.w / 2;
      expect(Math.abs(handleCx - midX)).toBeGreaterThan(40);
    }
  });

  it("doorStyle none has open-shelf cues and zero handles", () => {
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
    expect(handleRectCount(open.prims, 800, 400)).toBe(0);

    // Open shelves: filled horizontal shelf strips (readable at plan zoom, not hairlines only)
    const shelfStrips = open.prims.filter((p) => {
      if (p.kind !== "rect" || p.fill === "none" || p.fill === undefined) return false;
      const isOuter =
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - 800) < 1 &&
        Math.abs(p.h - 400) < 1;
      if (isOuter) return false;
      return p.w >= 800 * 0.5 && p.h < 400 * 0.15;
    });
    expect(shelfStrips.length).toBeGreaterThanOrEqual(2);
  });

  it("has distinct body + door fills (not single cream tile)", () => {
    const block = furnitureBlock2DFromItem(cabinetItem());
    const fills = new Set(
      block.prims
        .filter((p): p is Extract<Prim, { kind: "rect" }> => p.kind === "rect")
        .map((p) => p.fill)
        .filter((f): f is string => typeof f === "string" && f !== "none"),
    );
    // body, door band, handle — at least 2 distinct non-none fills
    expect(fills.size).toBeGreaterThanOrEqual(2);
    const outer = block.prims.find(
      (p) =>
        p.kind === "rect" &&
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - 800) < 1,
    );
    expect(outer?.kind).toBe("rect");
    if (outer?.kind === "rect") {
      expect(String(outer.fill).toLowerCase()).not.toBe("#f7f2e8");
    }
    // Filled door band near front (not stroke-only multiprim)
    const doorBand = block.prims.find((p) => {
      if (p.kind !== "rect" || p.fill === "none" || !p.fill) return false;
      return p.y > 400 * 0.55 && p.w > 800 * 0.5;
    });
    expect(doorBand).toBeDefined();
    if (doorBand?.kind === "rect" && outer?.kind === "rect") {
      expect(doorBand.fill).not.toBe(outer.fill);
    }
  });

  it("600×580 footprint uses fractional inset/handle/strokes (plan-zoom lock)", () => {
    // Absolute 6–16mm insets collapse at ~0.1 plan scale. Fractions keep multiprim legible.
    const w = 600;
    const d = 580;
    const block = furnitureBlock2DFromItem(
      cabinetItem({
        width: w,
        depth: d,
        modularOptions: {
          widthMm: w,
          depthMm: d,
          heightMm: 900,
          doorStyle: "slab",
          material: "white",
        },
      }),
    );

    expect(block.footprint.L).toBe(w);
    expect(block.footprint.D).toBe(d);

    const minSide = Math.min(w, d);
    const inner = innerCarcassRect(block.prims);
    expect(inner).toBeDefined();
    if (!inner) throw new Error("inner carcass missing");

    // inset ≥ 10% of min side (fraction-of-footprint, not 6–16mm absolute)
    expect(inner.x).toBeGreaterThanOrEqual(minSide * 0.1);
    expect(inner.y).toBeGreaterThanOrEqual(minSide * 0.1);
    expect(w - (inner.x + inner.w)).toBeGreaterThanOrEqual(minSide * 0.1 - 0.01);
    expect(d - (inner.y + inner.h)).toBeGreaterThanOrEqual(minSide * 0.1 - 0.01);

    // Hardware handle: small filled rect (door band excluded by width)
    const handles = block.prims.filter((p) => {
      if (p.kind !== "rect" || p.fill === "none" || p.fill === undefined) return false;
      const isOuter =
        Math.abs(p.x) < 1 &&
        Math.abs(p.y) < 1 &&
        Math.abs(p.w - w) < 1 &&
        Math.abs(p.h - d) < 1;
      if (isOuter) return false;
      return p.w < w * 0.25 && p.h < d * 0.25;
    });
    expect(handles.length).toBeGreaterThanOrEqual(1);
    const footprintArea = w * d;
    for (const h of handles) {
      if (h.kind !== "rect") continue;
      const area = h.w * h.h;
      const areaOk = area >= footprintArea * 0.005;
      const widthOk = h.w >= w * 0.08;
      expect(areaOk || widthOk).toBe(true);
    }
    // Door face band must exist as filled multiprim (not cream-only tile)
    const doorBand = block.prims.find(
      (p) =>
        p.kind === "rect" &&
        p.fill !== "none" &&
        p.fill !== undefined &&
        p.w >= w * 0.5 &&
        p.y > d * 0.55,
    );
    expect(doorBand).toBeDefined();

    // Detail stroke widths ≥ 6mm (outer excluded — detail lines + inner rect)
    for (const p of block.prims) {
      if (p.kind === "line" && p.strokeWidth !== null && p.strokeWidth !== undefined) {
        expect(p.strokeWidth).toBeGreaterThanOrEqual(6);
      }
      if (
        p.kind === "rect" &&
        p.fill === "none" &&
        p.strokeWidth !== null &&
        p.strokeWidth !== undefined
      ) {
        expect(p.strokeWidth).toBeGreaterThanOrEqual(6);
      }
    }
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
