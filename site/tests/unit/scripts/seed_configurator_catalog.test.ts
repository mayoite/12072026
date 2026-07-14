// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { productToRow } from "@/lib/catalog/configuratorCatalog";
import { buildOandoSeedProducts } from "@/lib/catalog/seed/oandoCatalog";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/seed_configurator_catalog.ts");

describe("seed_configurator_catalog (name-mirror)", () => {
  it("upserts configurator_products from oando seed with migration guard", () => {
    const src = fs.readFileSync(scriptPath, "utf8");
    expect(src).toContain("buildOandoSeedProducts");
    expect(src).toContain("productToRow");
    expect(src).toContain("configurator_products");
    expect(src).toContain("20260601120000_create_configurator_products.sql");
    expect(src).toContain("--verify-only");
    expect(src).toContain("PRODUCTS_DATABASE_URL");
    expect(src).toContain("on conflict (slug)");
  });

  it("maps every oando seed product to a row with sizing_type", () => {
    const products = buildOandoSeedProducts();
    expect(products.length).toBeGreaterThan(0);
    const rows = products.map(productToRow);
    expect(rows.length).toBe(products.length);
    for (const row of rows) {
      expect(row.slug.length).toBeGreaterThan(0);
      expect(row.name.length).toBeGreaterThan(0);
      expect(row.category.length).toBeGreaterThan(0);
      expect(row.sizing_type).toMatch(/parametric|discrete|fixed|workstation/i);
    }
    const slugs = new Set(rows.map((r) => r.slug));
    expect(slugs.size).toBe(rows.length);
  });
});
