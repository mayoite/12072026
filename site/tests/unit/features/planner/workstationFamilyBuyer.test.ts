import { describe, expect, it } from "vitest";

import {
  emitWorkstationFamilyContract,
  WORKSTATION_FAMILY_V0_FIXTURE,
} from "@/features/admin/workstation/workstationFamilyContract";
import { buyerNeedsMigrationChoice } from "@/features/planner/catalog/workstationFamilyBuyer";
import {
  assessBuyerPlacement,
  buyerConfiguratorPreview,
  draftToFamilySelection,
  topologyIdForShape,
} from "@/features/planner/catalog/workstationFamilyBuyer";
import {
  defaultWorkstationConfiguratorDraftV0,
  setConfiguratorShape,
  setConfiguratorSize,
  toggleConfiguratorModule,
} from "@/features/planner/catalog/workstationConfiguratorV0";
import { WORKSTATION_V0_SIZE_GRID } from "@/features/planner/catalog/workstationSystemV0";

describe("workstationFamilyBuyer", () => {
  it("maps linear draft to 2-seat topology and drives 2D/3D/BOQ from contract", () => {
    const draft = defaultWorkstationConfiguratorDraftV0();
    const version = WORKSTATION_FAMILY_V0_FIXTURE.versions[0]!;
    const selection = draftToFamilySelection(version, draft);

    expect(topologyIdForShape("linear")).toBe("linear-2");
    expect(selection.topologyId).toBe("linear-2");
    expect(selection.optionIds).toEqual(["pedestal", "panel"]);

    const assessment = assessBuyerPlacement(WORKSTATION_FAMILY_V0_FIXTURE, draft);
    expect(assessment.placeable).toBe(true);
    expect(assessment.drive?.versionId).toBe("v1");
    expect(assessment.drive?.footprint2d.widthMm).toBeGreaterThan(0);
    expect(assessment.drive?.boqUnitPriceInr).toBeGreaterThan(0);
    expect(assessment.drive?.meshPlan.footprint).toEqual(assessment.drive?.footprint2d);
  });

  it("maps L-shape draft to 4-seat topology", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = setConfiguratorShape(draft, "l-shape");
    const version = WORKSTATION_FAMILY_V0_FIXTURE.versions[0]!;
    const selection = draftToFamilySelection(version, draft);

    expect(topologyIdForShape("l-shape")).toBe("l-4");
    expect(selection.topologyId).toBe("l-4");

    const assessment = assessBuyerPlacement(WORKSTATION_FAMILY_V0_FIXTURE, draft);
    expect(assessment.placeable).toBe(true);
    expect(assessment.drive?.config.shape).toBe("l-shape");
  });

  it("allows overhead when active family version offers it", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = toggleConfiguratorModule(draft, "pedestal");
    draft = toggleConfiguratorModule(draft, "panel");
    draft = toggleConfiguratorModule(draft, "overhead");

    const assessment = assessBuyerPlacement(WORKSTATION_FAMILY_V0_FIXTURE, draft);
    expect(assessment.placeable).toBe(true);
    expect(assessment.drive?.config.modules).toContain("overhead");
  });

  it("rejects unknown modules when contract omits them", () => {
    const contract = emitWorkstationFamilyContract({
      familySlug: "premium-linear",
      familyId: "ws-premium-v0",
      activeVersionId: "v1",
      versions: [
        {
          ...WORKSTATION_FAMILY_V0_FIXTURE.versions[0]!,
          options: [{ optionId: "panel", label: "Panel", module: "panel" }],
        },
      ],
    });
    const draft = defaultWorkstationConfiguratorDraftV0();

    const assessment = assessBuyerPlacement(contract, draft);
    expect(assessment.placeable).toBe(false);
    expect(assessment.reason).toMatch(/pedestal/i);
  });

  it("rejects size outside the released version grid", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = setConfiguratorSize(draft, { lengthMm: 9999, depthMm: 600 });

    const assessment = assessBuyerPlacement(WORKSTATION_FAMILY_V0_FIXTURE, draft);
    expect(assessment.placeable).toBe(false);
    expect(assessment.reason).toMatch(/9999/);
  });

  it("requires explicit migration when replacing a released active version", () => {
    const contract = emitWorkstationFamilyContract({
      familySlug: "premium-linear",
      familyId: "ws-premium-v0",
      activeVersionId: "v1",
      versions: WORKSTATION_FAMILY_V0_FIXTURE.versions,
    });
    expect(buyerNeedsMigrationChoice(contract, "v2")).toBe(true);
    expect(buyerNeedsMigrationChoice(contract, "v1")).toBe(false);
  });

  it("preview uses contract grid size labels", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    const size = WORKSTATION_V0_SIZE_GRID[3]!;
    draft = setConfiguratorSize(draft, size);
    const preview = buyerConfiguratorPreview(WORKSTATION_FAMILY_V0_FIXTURE, draft);
    expect(preview.sizeLabel).toBe("1500×600");
    expect(preview.placeable).toBe(true);
    expect(preview.familyVersionId).toBe("v1");
  });
});