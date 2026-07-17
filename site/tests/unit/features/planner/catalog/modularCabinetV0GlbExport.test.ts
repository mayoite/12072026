import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/modularCabinetV0GlbExport";

describe("catalog/modularCabinetV0GlbExport.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["modularCabinetV0GeneratedSlug","modularCabinetV0GeneratedRelativePath","buildModularCabinetV0PartPlans","buildModularCabinetV0GlbPlan","exportModularCabinetV0ToGeneratedAssetPath","countCabinetV0Parts"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
