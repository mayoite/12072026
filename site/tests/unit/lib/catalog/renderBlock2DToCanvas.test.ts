import { describe, expect, it } from "vitest";
import {
  renderBlock2DCentered,
  renderBlock2DToCanvas,
  resolveCanvasStrokeWidthMm,
} from "@/lib/catalog/renderBlock2DToCanvas";
import type { Block2D } from "@/lib/catalog/blocks2d";
import { furnitureBlock2DFromItem } from "@/features/planner/catalog/furnitureBlock2D";

describe("resolveCanvasStrokeWidthMm", () => {
  it("floors thin mm strokes under plan zoom so detail stays visible", () => {
    // scale 0.1 (typical Feasibility zoom) · 1.5mm → need ≥12.5mm user units for 1.25px
    expect(resolveCanvasStrokeWidthMm(1.5, 0.1, 1.25)).toBeCloseTo(12.5, 5);
    expect(resolveCanvasStrokeWidthMm(1.5, 1, 1.25)).toBe(1.5);
  });
});

function mockContext(): CanvasRenderingContext2D {
  const calls: string[] = [];
  const ctx = {
    calls,
    getTransform: () => ({ a: 0.1, b: 0, c: 0, d: 0.1, e: 0, f: 0 }),
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
    createLinearGradient: () => ({
      addColorStop: () => undefined,
    }),
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

describe("renderBlock2DToCanvas", () => {
  it("draws rect prims without throwing", () => {
    const block: Block2D = {
      footprint: { L: 1200, D: 600, H: 750 },
      label: "desk",
      prims: [
        {
          kind: "rect",
          x: 0,
          y: 0,
          w: 1200,
          h: 600,
          fill: "#DED2B6",
          stroke: "#333",
          strokeWidth: 2,
          radius: 8,
        },
      ],
    };
    const ctx = mockContext();
    renderBlock2DToCanvas(ctx, block, {
      resolve: (t) => (t && t !== "none" ? String(t) : "transparent"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls).toContain("save");
    expect(calls).toContain("fill");
    expect(calls).toContain("restore");
  });

  it("centers block via renderBlock2DCentered", () => {
    const block: Block2D = {
      footprint: { L: 100, D: 50, H: 10 },
      label: "box",
      prims: [
        {
          kind: "rect",
          x: 0,
          y: 0,
          w: 100,
          h: 50,
          fill: "#fff",
        },
      ],
    };
    const ctx = mockContext();
    renderBlock2DCentered(ctx, block, {
      resolve: (t) => String(t ?? "transparent"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls.filter((c) => c === "translate").length).toBeGreaterThanOrEqual(1);
  });
});

describe("furnitureBlock2DFromItem", () => {
  it("builds a block with prims from placed furniture dimensions", () => {
    const block = furnitureBlock2DFromItem({
      id: "f1",
      catalogId: "demo-desk",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 1400,
      depth: 700,
      height: 750,
    });
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.footprint.L).toBe(1400);
    expect(block.footprint.D).toBe(700);
  });

  it("builds modular cabinet block without external assets", () => {
    const block = furnitureBlock2DFromItem({
      id: "f2",
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
    });
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.footprint.L).toBe(800);
    // Slab multiprim: carcass + inner + front/back + handle + optional mid line
    expect(block.prims.length).toBeGreaterThanOrEqual(5);
  });

  it("cabinet-v0 plan symbol uses light fill + dark detail (not solid inverse-body blob)", () => {
    // MASTER-CHART mesh_symbol bar: multi-prim must read on plan (contrast, not unit count alone).
    const block = furnitureBlock2DFromItem({
      id: "f2-contrast",
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
    });
    const outer = block.prims.find(
      (p) => p.kind === "rect" && p.x === 0 && p.y === 0 && "w" in p && p.w === 800,
    );
    expect(outer).toBeDefined();
    if (!outer || outer.kind !== "rect") throw new Error("outer carcass missing");
    // Light surface fill — NOT var(--block-storage) / inverse-body solid blob
    expect(outer.fill).toMatch(/^#|^rgb/i);
    expect(outer.fill?.toLowerCase()).not.toBe("#000");
    expect(outer.fill?.toLowerCase()).not.toBe("#000000");
    expect(outer.fill).not.toMatch(/block-storage/);
    // Multi-prim: inner rect + front/back lines + handle; slab may include mid vertical cue
    expect(block.prims.length).toBeGreaterThanOrEqual(5);
    const lines = block.prims.filter((p) => p.kind === "line");
    expect(lines.length).toBeGreaterThanOrEqual(2);
    for (const line of lines) {
      if (line.kind === "line") {
        expect(line.stroke).not.toMatch(/block-storage/);
        // Fractional thick strokes (floor ≥6mm) — not hairline 1–1.5mm
        if (line.strokeWidth !== null && line.strokeWidth !== undefined) {
          expect(line.strokeWidth).toBeGreaterThanOrEqual(6);
        }
      }
    }
    // Inner carcass inset is fraction of min side (≥10%), not absolute 6–16mm
    const inner = block.prims.find((p) => p.kind === "rect" && p.fill === "none");
    expect(inner).toBeDefined();
    if (inner && inner.kind === "rect") {
      const minSide = Math.min(800, 400);
      expect(inner.x).toBeGreaterThanOrEqual(minSide * 0.1);
    }
  });

  it("cabinet-v0 pair and slab door styles produce different multiprim sets", () => {
    const base = {
      id: "f2-door",
      catalogId: "cabinet-v0",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 800,
      depth: 400,
      height: 900,
      geometryMode: "modular-cabinet-v0" as const,
    };
    const pair = furnitureBlock2DFromItem({
      ...base,
      modularOptions: {
        widthMm: 800,
        depthMm: 400,
        heightMm: 900,
        doorStyle: "pair",
        material: "oak",
      },
    });
    const slab = furnitureBlock2DFromItem({
      ...base,
      modularOptions: {
        widthMm: 800,
        depthMm: 400,
        heightMm: 900,
        doorStyle: "slab",
        material: "white",
      },
    });
    expect(JSON.stringify(pair.prims)).not.toEqual(JSON.stringify(slab.prims));
    // Both multiprim (not empty cream tile)
    expect(pair.prims.length).toBeGreaterThanOrEqual(5);
    expect(slab.prims.length).toBeGreaterThanOrEqual(5);
  });

  it("unknown SKU still yields nonempty prims (never empty plan mark)", () => {
    const width = 500;
    const depth = 400;
    const height = 750;
    const block = furnitureBlock2DFromItem({
      id: "unknown-1",
      catalogId: "zz-unknown-sku-no-bridge",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width,
      depth,
      height,
    });

    // Non-empty guard (P05 / W2) — unknown catalog ids must still draw
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.footprint.L).toBe(width);
    expect(block.footprint.D).toBe(depth);
    expect(block.footprint.H).toBe(height);

    const rects = block.prims.filter((p) => p.kind === "rect");
    expect(rects.length).toBeGreaterThan(0);
    for (const p of block.prims) {
      if (p.kind === "rect") {
        expect(Number.isFinite(p.x)).toBe(true);
        expect(Number.isFinite(p.y)).toBe(true);
        expect(Number.isFinite(p.w)).toBe(true);
        expect(Number.isFinite(p.h)).toBe(true);
        expect(p.w).toBeGreaterThan(0);
        expect(p.h).toBeGreaterThan(0);
      }
    }

    // Drawable end-to-end: canvas path must fill (not silent empty geometry)
    const ctx = mockContext();
    renderBlock2DToCanvas(ctx, block, {
      resolve: (t) => (t && t !== "none" ? String(t) : "transparent"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls).toContain("fill");
    expect(calls).toContain("save");
    expect(calls).toContain("restore");
  });

  it("unknown equipment SKU box-like path still has a positive rect footprint", () => {
    // Equipment category tends toward generic rect (box-like), not full desk symbol.
    const block = furnitureBlock2DFromItem(
      {
        id: "unknown-equip-1",
        catalogId: "zz-unknown-equip-sku",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 450,
        height: 900,
      },
      { name: "mystery-equip", category: "equipment" },
    );

    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.footprint.L).toBe(600);
    expect(block.footprint.D).toBe(450);

    const rect = block.prims.find((p) => p.kind === "rect");
    expect(rect).toBeDefined();
    if (rect?.kind === "rect") {
      expect(rect.w).toBeGreaterThan(0);
      expect(rect.h).toBeGreaterThan(0);
    }

    const ctx = mockContext();
    renderBlock2DCentered(ctx, block, {
      resolve: (t) => String(t ?? "transparent"),
    });
    const calls = (ctx as unknown as { calls: string[] }).calls;
    expect(calls.filter((c) => c === "fill").length).toBeGreaterThanOrEqual(1);
  });

  it("clamps degenerate placed dims so unknown SKU stays drawable", () => {
    const block = furnitureBlock2DFromItem({
      id: "unknown-degen",
      catalogId: "zz-unknown-zero-dims",
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: 0,
      depth: 0,
      height: 0,
    });
    expect(block.prims.length).toBeGreaterThan(0);
    expect(block.footprint.L).toBeGreaterThanOrEqual(1);
    expect(block.footprint.D).toBeGreaterThanOrEqual(1);
    expect(block.prims.some((p) => p.kind === "rect")).toBe(true);
  });
});
