// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { MANAGED_CATALOG_SEED } from "@/features/planner/catalog-api/managedCatalogSeed";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed_planner_managed_catalog.ts");

describe("seed_planner_managed_catalog (name-mirror)", () => {
  it("upserts MANAGED_CATALOG_SEED into planner_managed_products", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("MANAGED_CATALOG_SEED");
    expect(src).toContain("planner_managed_products");
    expect(src).toContain("on conflict (slug)");
    expect(src).toContain("--verify-only");
    expect(src).toContain("PRODUCTS_DATABASE_URL");
  });

  it("defines seed rows with planner footprint specs in mm", () => {
    expect(MANAGED_CATALOG_SEED.length).toBeGreaterThanOrEqual(5);
    const slugs = new Set<string>();
    for (const row of MANAGED_CATALOG_SEED) {
      expect(row.slug).toMatch(/^managed-/);
      expect(row.planner_source_slug.length).toBeGreaterThan(0);
      expect(row.specs.widthMm).toBeGreaterThan(0);
      expect(row.specs.depthMm).toBeGreaterThan(0);
      expect(row.specs.heightMm).toBeGreaterThan(0);
      expect(row.price).toBeGreaterThan(0);
      slugs.add(row.slug);
    }
    expect(slugs.size).toBe(MANAGED_CATALOG_SEED.length);
  });
});
