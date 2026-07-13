import { describe, expect, it } from "vitest";

import { WORKSTATION_FAMILY_V0_FIXTURE } from "@/features/planner/admin/workstation/workstationFamilyContract";
import { driveWorkstationFamily } from "@/features/planner/admin/workstation/workstationFamilyDrive";

describe("workstationFamilyDrive", () => {
  it("one released version drives 2D footprint, 3D mesh, and BOQ unit price", () => {
    const result = driveWorkstationFamily(WORKSTATION_FAMILY_V0_FIXTURE, {
      topologyId: "linear-2",
      lengthMm: 1200,
      depthMm: 600,
      optionIds: ["panel", "pedestal"],
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;

    expect(result.versionId).toBe("v1");
    expect(result.footprint2d).toEqual({ widthMm: 1200, depthMm: 600 });
    expect(result.meshPlan.footprint).toEqual(result.footprint2d);
    expect(result.boqUnitPriceInr).toBeGreaterThan(0);
    expect(result.boqModuleSkus).toEqual([
      "ws-premium-linear-v1-panel",
      "ws-premium-linear-v1-pedestal",
    ]);
  });

  it("L-shape topology uses the same version for mesh and footprint", () => {
    const result = driveWorkstationFamily(WORKSTATION_FAMILY_V0_FIXTURE, {
      topologyId: "l-4",
      lengthMm: 1200,
      depthMm: 600,
      optionIds: [],
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.footprint2d.depthMm).toBe(1200);
    expect(result.meshPlan.footprint.depthMm).toBe(1200);
  });
});