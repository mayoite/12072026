import { describe, expect, it } from "vitest";

import {
  DeskAssemblyFieldsSchema,
  linearDeskFieldsToDeskAssembly,
} from "@/features/planner/asset-engine/svg/parametric/deskAssemblyFields";
import { deskAssemblyDrawer } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyDrawer";
import { linearDeskDrawer } from "@/features/planner/asset-engine/svg/parametric/linearDeskDrawer";

describe("deskAssemblyDrawer", () => {
  it("renders a linear assembly with one Maker part per workstation", () => {
    const fields = deskAssemblyDrawer.defaults();
    const preview = deskAssemblyDrawer.render(fields);

    expect(preview.parts.filter((part) => part.role === "workstation")).toHaveLength(
      fields.workstationCount,
    );
    expect(preview.widthMm).toBe(fields.runLengthMm);
    expect(preview.depthMm).toBe(fields.deskDepthMm + fields.aisleMm);
    expect(preview.svg).toContain('data-product-type="desk-assembly"');
    expect(preview.svg).not.toContain("currentColor");
    expect(preview.svg).not.toContain("var(");
  });

  it("renders a U assembly with aisle and option parts", () => {
    const preview = deskAssemblyDrawer.render({
      ...deskAssemblyDrawer.defaults(),
      layout: "u",
      workstationCount: 12,
      runLengthMm: 9600,
      returnLengthMm: 3200,
      aisleMm: 1200,
      powerRail: true,
      cableManagement: true,
      modesty: true,
      partitions: true,
    });

    expect(preview.parts.filter((part) => part.role === "workstation")).toHaveLength(
      12,
    );
    expect(preview.parts.map((part) => part.id)).toEqual(
      expect.arrayContaining([
        "aisle-clearance",
        "shared-run",
        "return-left",
        "return-right",
        "power-rail",
        "cable-management",
        "modesty",
      ]),
    );
    expect(preview.parts.some((part) => part.id.startsWith("partition-"))).toBe(
      true,
    );
    expect(
      preview.parts.every((part) =>
        part.paths.every((makerPath) => makerPath.d.length > 0),
      ),
    ).toBe(true);
  });

  it("rejects impossible U distributions and aisle clearance", () => {
    const defaults = deskAssemblyDrawer.defaults();
    expect(
      DeskAssemblyFieldsSchema.safeParse({
        ...defaults,
        layout: "u",
        workstationCount: 3,
      }).success,
    ).toBe(false);
    expect(
      DeskAssemblyFieldsSchema.safeParse({
        ...defaults,
        layout: "u",
        runLengthMm: 2400,
        deskDepthMm: 800,
        aisleMm: 1200,
      }).success,
    ).toBe(false);
  });

  it("maps the legacy linear desk into a one-run assembly", () => {
    const legacy = linearDeskDrawer.defaults();
    expect(linearDeskFieldsToDeskAssembly(legacy)).toMatchObject({
      type: "desk-assembly",
      layout: "linear",
      workstationCount: 1,
      runLengthMm: legacy.widthMm,
      deskDepthMm: legacy.depthMm,
      deskHeightMm: legacy.heightMm,
    });
  });
});
