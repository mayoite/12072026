import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/catalogMapping";

describe("project/catalog/catalogMapping.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["mapAdminCategoryToCanonical","inferRoomTags","inferStyleTags","resolveSubCategory","resolveAvailabilityStatus","mapPlannerManagedProductToCatalogItem","mapConfiguratorProductToCatalogItem"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
