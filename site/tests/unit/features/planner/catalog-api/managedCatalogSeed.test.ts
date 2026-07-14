import { describe, expect, it } from "vitest";
import { MANAGED_CATALOG_SEED } from "@/features/planner/catalog-api/managedCatalogSeed";

describe("managedCatalogSeed", () => {
  it("exports curated seed rows with unique slugs", () => {
    expect(MANAGED_CATALOG_SEED.length).toBeGreaterThanOrEqual(4);
    const slugs = MANAGED_CATALOG_SEED.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("stores real-world millimetre footprints (not catalog cm)", () => {
    for (const row of MANAGED_CATALOG_SEED) {
      expect(row.specs.widthMm).toBeGreaterThanOrEqual(500);
      expect(row.specs.depthMm).toBeGreaterThanOrEqual(400);
      expect(row.specs.heightMm).toBeGreaterThanOrEqual(400);
      expect(row.name.length).toBeGreaterThan(0);
      expect(row.planner_source_slug.length).toBeGreaterThan(0);
      expect(row.price).toBeGreaterThanOrEqual(0);
    }
  });

  it("includes expected product families", () => {
    const names = MANAGED_CATALOG_SEED.map((r) => r.name);
    expect(names.some((n) => /desk/i.test(n))).toBe(true);
    expect(names.some((n) => /chair/i.test(n))).toBe(true);
    expect(names.some((n) => /locker|storage/i.test(n))).toBe(true);
  });
});
