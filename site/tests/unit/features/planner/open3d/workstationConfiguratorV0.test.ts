import { describe, expect, it } from "vitest";

import {
  configuratorPreview,
  defaultWorkstationConfiguratorDraftV0,
  resolveWorkstationConfigFromDraft,
  setConfiguratorShape,
  setConfiguratorSize,
  toggleConfiguratorModule,
} from "@/features/planner/open3d/catalog/workstationConfiguratorV0";
import {
  WORKSTATION_V0_SIZE_GRID,
  workstationConfigKey,
} from "@/features/planner/open3d/catalog/workstationSystemV0";

describe("workstationConfiguratorV0", () => {
  it("default draft resolves to linear with desk+pedestal+panel", () => {
    const draft = defaultWorkstationConfiguratorDraftV0();
    const config = resolveWorkstationConfigFromDraft(draft);
    expect(config.shape).toBe("linear");
    expect(config.modules).toContain("desk");
    expect(config.modules).toContain("pedestal");
    expect(config.modules).toContain("panel");
    expect(config.modules).not.toContain("return");
  });

  it("L-shape forces return module", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = setConfiguratorShape(draft, "l-shape");
    const config = resolveWorkstationConfigFromDraft(draft);
    expect(config.shape).toBe("l-shape");
    expect(config.modules).toContain("return");
  });

  it("size pick uses grid entry", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    const size = WORKSTATION_V0_SIZE_GRID[3]!; // 1500×600
    draft = setConfiguratorSize(draft, size);
    const config = resolveWorkstationConfigFromDraft(draft);
    expect(config.size).toEqual({ lengthMm: 1500, depthMm: 600 });
  });

  it("toggle pedestal off produces a non-matrix-default combo key", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = setConfiguratorSize(draft, WORKSTATION_V0_SIZE_GRID[3]!);
    draft = toggleConfiguratorModule(draft, "pedestal"); // off
    draft = toggleConfiguratorModule(draft, "overhead"); // on
    const config = resolveWorkstationConfigFromDraft(draft);
    expect(config.modules).not.toContain("pedestal");
    expect(config.modules).toContain("overhead");
    expect(config.modules).toContain("panel");
    // Not the fixed matrix linear-1500 default (desk+pedestal+panel)
    expect(workstationConfigKey(config)).toBe(
      "ws-v0-linear-1500x600-desk+overhead+panel",
    );
  });

  it("preview exposes footprint and labels", () => {
    const preview = configuratorPreview(defaultWorkstationConfiguratorDraftV0());
    expect(preview.footprint.widthMm).toBeGreaterThan(0);
    expect(preview.shapeLabel).toBe("Linear");
    expect(preview.catalogId).toMatch(/^ws-v0-linear-/);
  });
});
