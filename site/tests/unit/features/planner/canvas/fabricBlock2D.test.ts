/**
 * P05 — Fabric multiprim paint honesty.
 * Literal hex must not be destroyed by theme token resolution.
 */
import { describe, expect, it, vi } from "vitest";
import {
  createFabricFurnitureBlock,
  createFabricFurnitureSymbol,
  furniturePlanSvgUrl,
  PLAN_PAINT_MODE_PROP,
  resolveFabricPrimPaint,
} from "@/features/planner/canvas/fabricBlock2D";
import { clearSvgPlanSymbolCacheForTests } from "@/features/planner/catalog/svg/svgPlanSymbolCache";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";

function cabinetItem(): PlannerFurnitureItem {
  return {
    id: "cab-fabric-1",
    catalogId: "cabinet-v0",
    position: { x: 1000, y: 1000 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: 600,
    depth: 580,
    height: 720,
    geometryMode: "modular-cabinet-v0",
    modularOptions: {
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    },
  };
}

describe("fabricBlock2D paint", () => {
  it("passes literal hex through without theme resolve", () => {
    const resolve = vi.fn((_token: string, fallback: string) => fallback);
    expect(resolveFabricPrimPaint("#e8d9c0", "#e2e8f0", resolve)).toBe("#e8d9c0");
    expect(resolveFabricPrimPaint("#4a4034", "#334155", resolve)).toBe("#4a4034");
    expect(resolve).not.toHaveBeenCalled();
  });

  it("maps none → transparent and skips resolve", () => {
    const resolve = vi.fn((_token: string, fallback: string) => fallback);
    expect(resolveFabricPrimPaint("none", "#e2e8f0", resolve)).toBe("transparent");
    expect(resolveFabricPrimPaint(undefined, "#e2e8f0", resolve)).toBe("transparent");
    expect(resolve).not.toHaveBeenCalled();
  });

  it("delegates CSS var tokens to resolveColor", () => {
    const resolve = vi.fn((token: string, fallback: string) =>
      token.startsWith("var(") ? "#aabbcc" : fallback,
    );
    expect(resolveFabricPrimPaint("var(--block-surface)", "#e2e8f0", resolve)).toBe(
      "#aabbcc",
    );
    expect(resolve).toHaveBeenCalled();
  });

  it("createFabricFurnitureBlock builds multiprim group for cabinet-v0", () => {
    const group = createFabricFurnitureBlock(
      cabinetItem(),
      {
        entityId: "cab-fabric-1",
        left: 200,
        top: 150,
        width: 60,
        height: 58,
        angle: 0,
        widthMm: 600,
        depthMm: 580,
        locked: false,
      },
      {
        interactive: true,
        resolveColor: (_t, fb) => fb,
      },
    );
    const children = group.getObjects();
    // carcass + inner + door band + front/back lines + handle + mid stile ≥ 6
    expect(children.length).toBeGreaterThanOrEqual(6);
    const fills = new Set(
      children
        .map((c) => String(c.fill ?? ""))
        .filter((f) => f && f !== "transparent" && f !== "none"),
    );
    expect(fills.size).toBeGreaterThanOrEqual(2);
  });

  it("furniturePlanSvgUrl accepts published /svg-catalog/ URLs and slug fallback", () => {
    expect(
      furniturePlanSvgUrl({
        ...cabinetItem(),
        previewImageUrl: "/svg-catalog/chaise-lounge-001.svg",
      }),
    ).toBe("/svg-catalog/chaise-lounge-001.svg");
    // Raster preview is not plan SVG; fall back to disk catalog slug path when present.
    expect(
      furniturePlanSvgUrl({
        ...cabinetItem(),
        previewImageUrl: "/images/cabinet-thumb.png",
      }),
    ).toBe("/svg-catalog/cabinet-v0.svg");
    expect(
      furniturePlanSvgUrl({
        ...cabinetItem(),
        catalogId: "",
        sourceSlug: "",
        previewImageUrl: "/images/cabinet-thumb.png",
      }),
    ).toBeNull();
  });

  it("createFabricFurnitureSymbol falls back to Block2D when SVG is absent", () => {
    clearSvgPlanSymbolCacheForTests();
    const symbol = createFabricFurnitureSymbol(
      cabinetItem(),
      {
        entityId: "cab-fabric-1",
        left: 200,
        top: 150,
        width: 60,
        height: 58,
        angle: 0,
        widthMm: 600,
        depthMm: 580,
        locked: false,
      },
      {
        interactive: true,
        resolveColor: (_t, fb) => fb,
      },
    );
    expect(
      (symbol as unknown as { [PLAN_PAINT_MODE_PROP]?: string })[PLAN_PAINT_MODE_PROP],
    ).toBe("block2d");
    expect(symbol.type).toBe("group");
  });
});
