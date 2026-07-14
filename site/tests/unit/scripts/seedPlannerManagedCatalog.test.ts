import { describe, expect, it } from "vitest";

import { MANAGED_CATALOG_SEED } from "@/features/planner/catalog-api/managedCatalogSeed";

describe("seed_planner_managed_catalog", () => {
  it("defines seed rows with planner footprint specs in mm", () => {
    expect(MANAGED_CATALOG_SEED.length).toBeGreaterThanOrEqual(5);
    for (const row of MANAGED_CATALOG_SEED) {
      expect(row.slug).toMatch(/^managed-/);
      expect(row.specs.widthMm).toBeGreaterThan(0);
      expect(row.specs.depthMm).toBeGreaterThan(0);
      expect(row.specs.heightMm).toBeGreaterThan(0);
    }
  });
});
