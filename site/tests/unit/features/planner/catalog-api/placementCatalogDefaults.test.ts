import { describe, it, expect } from "vitest";
import { LEGACY_FALLBACK_PLACEMENT_CATALOG_ID } from "@/features/planner/catalog-api/placementCatalogDefaults";

describe("placementCatalogDefaults", () => {
  it("defines the correct legacy fallback catalog ID", () => {
    expect(LEGACY_FALLBACK_PLACEMENT_CATALOG_ID).toBe("ws-linear-120");
  });
});
