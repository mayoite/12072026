import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/workstationConfiguratorV0";

describe("project/catalog/workstationConfiguratorV0.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["WORKSTATION_V0_TOGGLE_MODULES","WORKSTATION_V0_BATCH_PLACE_COUNTS","isWorkstationV0BatchPlaceCount","batchPlaceButtonLabel","defaultWorkstationConfiguratorDraftV0","setConfiguratorShape","setConfiguratorSize","toggleConfiguratorModule","resolveWorkstationConfigFromDraft","configuratorPreview","sizeGridLabel","isSameSize"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
