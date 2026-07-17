import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/workstationMeshV0";

describe("catalog/workstationMeshV0.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["WORKTOP_THICKNESS_MM","PANEL_HEIGHT_MM","OVERHEAD_HEIGHT_MM","OVERHEAD_GAP_MM","LEG_SECTION_MM","LEG_INSET_MM","STRETCHER_SECTION_MM","STRETCHER_HEIGHT_FRAC","workstationOptionsFromConfig","workstationConfigFromOptions","generateWorkstationV0MeshPlan","countWorkstationV0Parts"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
