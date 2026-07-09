import { describe, expect, it } from "vitest";

import {
  WORKSTATION_V0_SIZE_GRID,
  createWorkstationConfigV0,
  expandWorkstationV0Matrix,
  layoutWorkstationInstances,
  workstationConfigKey,
  workstationFootprintMm,
  workstationPlanPrims,
} from "@/features/planner/open3d/catalog/workstationSystemV0";

describe("workstationSystemV0", () => {
  it("exposes the product size grid (900×600, 900×750, 1200×600, 1500×600)", () => {
    expect(WORKSTATION_V0_SIZE_GRID).toEqual([
      { lengthMm: 900, depthMm: 600 },
      { lengthMm: 900, depthMm: 750 },
      { lengthMm: 1200, depthMm: 600 },
      { lengthMm: 1500, depthMm: 600 },
    ]);
  });

  it("linear footprint is L × D", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
    });
    expect(workstationFootprintMm(config)).toEqual({
      widthMm: 1500,
      depthMm: 600,
    });
  });

  it("l-shape footprint expands depth by return wing", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
    });
    expect(workstationFootprintMm(config)).toEqual({
      widthMm: 1500,
      depthMm: 1200,
    });
  });

  it("normalizeModules ensures desk; strips return on linear; adds return on L", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 900, depthMm: 600 },
      modules: ["panel"],
    });
    expect(linear.modules).toContain("desk");
    expect(linear.modules).not.toContain("return");

    const lShape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 900, depthMm: 600 },
      modules: ["desk"],
    });
    expect(lShape.modules).toContain("return");
  });

  it("expands matrix: 4 sizes × 2 shapes = 8 configs", () => {
    const matrix = expandWorkstationV0Matrix();
    expect(matrix).toHaveLength(8);
    const keys = new Set(matrix.map(workstationConfigKey));
    expect(keys.size).toBe(8);
  });

  it("layoutWorkstationInstances scales to thousands without unique assets", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const instances = layoutWorkstationInstances(config, 5000, { columns: 50 });
    expect(instances).toHaveLength(5000);
    expect(instances[0]?.key).toContain("ws-v0-linear-1200x600");
    expect(instances[4999]?.index).toBe(4999);
    // Grid places last cell off origin
    expect(instances[4999]?.xMm).toBeGreaterThan(0);
    expect(instances[4999]?.yMm).toBeGreaterThan(0);
  });

  it("plan prims: linear desk; L adds return; modules add pedestal/panel", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const linearPrims = workstationPlanPrims(linear);
    expect(linearPrims.prims.some((p) => p.role === "desk")).toBe(true);
    expect(linearPrims.prims.some((p) => p.role === "return")).toBe(false);
    expect(linearPrims.prims.some((p) => p.role === "pedestal")).toBe(true);
    expect(linearPrims.prims.some((p) => p.role === "panel")).toBe(true);

    const lShape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return"],
    });
    const lPrims = workstationPlanPrims(lShape);
    expect(lPrims.prims.some((p) => p.role === "return")).toBe(true);
  });
});
