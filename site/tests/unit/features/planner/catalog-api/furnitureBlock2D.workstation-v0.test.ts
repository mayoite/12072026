/**
 * Systems v0 — workstation plan Block2D (desk/return/pedestal/panel prims).
 */
import { describe, expect, it } from "vitest";
import {
  furnitureBlock2DFromItem,
  workstationBlock2DFromItem,
} from "@/features/planner/catalog/furnitureBlock2D";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
  workstationFootprintMm,
  workstationPlanPrims,
} from "@/features/planner/catalog/workstationSystemV0";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";

function wsItem(
  partial?: Partial<PlannerFurnitureItem>,
): PlannerFurnitureItem {
  const config = createWorkstationConfigV0({
    shape: "linear",
    size: { lengthMm: 1500, depthMm: 600 },
    modules: ["desk", "pedestal", "panel"],
  });
  const key = workstationConfigKey(config);
  const fp = workstationFootprintMm(config);
  return {
    id: "ws-1",
    catalogId: key,
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    width: fp.widthMm,
    depth: fp.depthMm,
    height: config.heightMm,
    geometryMode: "workstation-v0",
    sourceCatalogId: key,
    ...partial,
  };
}

describe("workstationBlock2DFromItem", () => {
  it("builds multi-prim symbol for linear 1500×600 (desk+pedestal+panel)", () => {
    const item = wsItem();
    const block = workstationBlock2DFromItem(item);
    expect(block).not.toBeNull();
    expect(block!.footprint.L).toBe(1500);
    expect(block!.footprint.D).toBe(600);
    // desk + pedestal + panel = at least 3 rects
    expect(block!.prims.length).toBeGreaterThanOrEqual(3);
    expect(block!.prims.every((p) => p.kind === "rect")).toBe(true);
  });

  it("L-shape includes return wing prim", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel"],
    });
    const key = workstationConfigKey(config);
    const fp = workstationFootprintMm(config);
    const plan = workstationPlanPrims(config);
    expect(plan.prims.some((p) => p.role === "return")).toBe(true);

    const block = furnitureBlock2DFromItem({
      id: "ws-l",
      catalogId: key,
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1, z: 1 },
      width: fp.widthMm,
      depth: fp.depthMm,
      height: config.heightMm,
      geometryMode: "workstation-v0",
    });
    expect(block.prims.length).toBeGreaterThanOrEqual(plan.prims.length);
    expect(block.footprint.L).toBe(fp.widthMm);
    expect(block.footprint.D).toBe(fp.depthMm);
  });

  it("returns null for non-workstation catalog ids", () => {
    expect(
      workstationBlock2DFromItem({
        id: "x",
        catalogId: "cabinet-v0",
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1, z: 1 },
        width: 600,
        depth: 400,
        height: 720,
      }),
    ).toBeNull();
  });

  it("furnitureBlock2DFromItem routes ws-v0 ids to workstation symbol (not empty box)", () => {
    const block = furnitureBlock2DFromItem(wsItem());
    expect(block.prims.length).toBeGreaterThan(1);
    expect(block.label).toMatch(/^ws-v0-/);
  });
});
