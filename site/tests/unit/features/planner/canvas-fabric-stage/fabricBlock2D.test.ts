/**
 * P05 — Fabric multiprim paint honesty.
 * Literal hex must not be destroyed by theme token resolution.
 */
import { describe, expect, it, vi } from "vitest";
import {
  createFabricFurnitureBlock,
  resolveFabricPrimPaint,
} from "@/features/planner/canvas-fabric-stage/fabricBlock2D";
import type { Open3dFurnitureItem } from "@/features/planner/open3d/model/types";

function cabinetItem(): Open3dFurnitureItem {
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
});
