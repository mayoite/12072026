import { describe, expect, it } from "vitest";
import {
  WORKSTATION_V0_SIZE_GRID,
  createWorkstationConfigV0,
  workstationConfigKey,
  workstationFootprintMm,
} from "@/features/planner/catalog/workstationSystemV0";

describe("workstationSystemV0", () => {
  it("exposes the product size grid", () => {
    expect(WORKSTATION_V0_SIZE_GRID).toEqual([
      { lengthMm: 900, depthMm: 600 },
      { lengthMm: 900, depthMm: 750 },
      { lengthMm: 1200, depthMm: 600 },
      { lengthMm: 1500, depthMm: 600 },
    ]);
  });

  it("linear and l-shape footprints", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
    });
    expect(workstationFootprintMm(linear)).toEqual({ widthMm: 1500, depthMm: 600 });
    expect(linear.modules).toContain("desk");
    const lShape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
    });
    expect(workstationFootprintMm(lShape).depthMm).toBe(1200);
    expect(lShape.modules).toContain("return");
    expect(workstationConfigKey(linear)).toMatch(/ws|v0|linear|1500/i);
  });
});
