import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/workstationCatalogV0";

describe("project/catalog/workstationCatalogV0.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["workstationConfigToCatalogItem","expandWorkstationV0CatalogItems","WORKSTATION_V0_DEMO_CATALOG_ITEMS"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
