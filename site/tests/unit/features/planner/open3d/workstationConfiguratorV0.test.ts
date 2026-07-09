import { describe, expect, it } from "vitest";

import {
  WORKSTATION_V0_BATCH_PLACE_COUNTS,
  batchPlaceButtonLabel,
  configuratorPreview,
  defaultWorkstationConfiguratorDraftV0,
  isWorkstationV0BatchPlaceCount,
  resolveWorkstationConfigFromDraft,
  setConfiguratorShape,
  setConfiguratorSize,
  takePendingWorkstationConfig,
  toggleConfiguratorModule,
  type WorkstationConfiguratorDraftV0,
} from "@/features/planner/open3d/catalog/workstationConfiguratorV0";
import {
  WORKSTATION_V0_SIZE_GRID,
  createWorkstationConfigV0,
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

  it("ignores direct desk/return toggles (shape-controlled)", () => {
    const base = defaultWorkstationConfiguratorDraftV0();
    const afterDesk = toggleConfiguratorModule(base, "desk");
    const afterReturn = toggleConfiguratorModule(base, "return");
    expect(afterDesk).toBe(base);
    expect(afterReturn).toBe(base);
    expect(afterDesk.toggledModules).not.toContain("desk");
    expect(afterReturn.toggledModules).not.toContain("return");
  });

  it("toggle is idempotent: off then on restores module", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    expect(draft.toggledModules).toContain("panel");
    draft = toggleConfiguratorModule(draft, "panel");
    expect(draft.toggledModules).not.toContain("panel");
    draft = toggleConfiguratorModule(draft, "panel");
    expect(draft.toggledModules).toContain("panel");
  });

  it("linear after L-shape strips return from resolved config", () => {
    let draft = defaultWorkstationConfiguratorDraftV0();
    draft = setConfiguratorShape(draft, "l-shape");
    expect(resolveWorkstationConfigFromDraft(draft).modules).toContain("return");
    draft = setConfiguratorShape(draft, "linear");
    expect(resolveWorkstationConfigFromDraft(draft).modules).not.toContain(
      "return",
    );
  });

  it("resolve ignores non-toggle modules and duplicates in draft", () => {
    const dirty: WorkstationConfiguratorDraftV0 = {
      ...defaultWorkstationConfiguratorDraftV0(),
      toggledModules: ["desk", "pedestal", "pedestal", "return", "panel"],
    };
    const config = resolveWorkstationConfigFromDraft(dirty);
    const pedestalHits = config.modules.filter((m) => m === "pedestal").length;
    expect(pedestalHits).toBe(1);
    expect(config.modules.filter((m) => m === "desk")).toHaveLength(1);
    // return not allowed on linear via draft junk
    expect(config.modules).not.toContain("return");
  });

  it("takePendingWorkstationConfig is consume-once (no double place)", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "panel"],
    });
    const bag = { current: config };
    const first = takePendingWorkstationConfig(bag);
    const second = takePendingWorkstationConfig(bag);
    expect(first).toEqual(config);
    expect(second).toBeNull();
    expect(bag.current).toBeNull();
  });

  it("batch place counts are 2, 4, 10 with labels", () => {
    expect([...WORKSTATION_V0_BATCH_PLACE_COUNTS]).toEqual([2, 4, 10]);
    expect(isWorkstationV0BatchPlaceCount(2)).toBe(true);
    expect(isWorkstationV0BatchPlaceCount(4)).toBe(true);
    expect(isWorkstationV0BatchPlaceCount(10)).toBe(true);
    expect(isWorkstationV0BatchPlaceCount(3)).toBe(false);
    expect(isWorkstationV0BatchPlaceCount(50)).toBe(false);
    expect(batchPlaceButtonLabel(2)).toBe("Place 2 seats");
    expect(batchPlaceButtonLabel(10)).toBe("Place 10 seats");
  });
});
