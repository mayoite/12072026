import { describe, expect, it } from "vitest";
import {
  renderBlock2DCentered,
  renderBlock2DToCanvas,
} from "@/lib/catalog/renderBlock2DToCanvas";
import type { Block2D } from "@/lib/catalog/blocks2d";
import { furnitureBlock2DFromItem } from "@/features/planner/open3d/catalog/furnitureBlock2D";

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
  });

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
});
