import { describe, expect, it } from "vitest";

import {
  WORKSTATION_FAMILY_V0_FIXTURE,
  emitWorkstationFamilyContract,
  footprintForConfig,
} from "@/features/planner/admin/workstation/workstationFamilyContract";

describe("workstationFamilyContract", () => {
  it("emits the documented contract shape", () => {
    expect(WORKSTATION_FAMILY_V0_FIXTURE.type).toBe("oando-workstation-family");
    expect(WORKSTATION_FAMILY_V0_FIXTURE.versions[0]?.topologies).toHaveLength(2);
    expect(WORKSTATION_FAMILY_V0_FIXTURE.versions[0]?.sizeGrid.length).toBeGreaterThan(0);
  });

  it("footprint helper matches workstationSystemV0", () => {
    const footprint = footprintForConfig({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk"],
      heightMm: 750,
    });
    expect(footprint.widthMm).toBe(1200);
    expect(footprint.depthMm).toBe(600);
  });

  it("round-trips through emit", () => {
    const emitted = emitWorkstationFamilyContract({
      familySlug: "premium-linear",
      familyId: "ws-premium-v0",
      activeVersionId: "v1",
      versions: WORKSTATION_FAMILY_V0_FIXTURE.versions,
    });
    expect(emitted).toEqual(WORKSTATION_FAMILY_V0_FIXTURE);
  });
});