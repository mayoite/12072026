import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/catalogMapping";

describe("catalog/catalogMapping.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["mapAdminCategoryToCanonical","inferRoomTags","inferStyleTags","resolveSubCategory","resolveAvailabilityStatus","mapPlannerManagedProductToCatalogItem","mapConfiguratorProductToCatalogItem"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
