import { describe, expect, it } from "vitest";

import {
  isCatalogItemSiteProductMatch,
  matchCatalogItemBySiteProduct,
} from "@/features/planner/catalog/matchCatalogItemBySiteProduct";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function item(overrides: Partial<PlannerCatalogItem> & Pick<PlannerCatalogItem, "id" | "slug">): PlannerCatalogItem {
  return {
    sku: overrides.sku ?? overrides.slug,
    name: overrides.name ?? overrides.slug,
    shortName: overrides.shortName ?? overrides.slug.slice(0, 30),
    description: "",
    category: "Furniture",
    subCategory: "Desks",
    taxonomyPath: "Furniture > Desks",
    dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: { marketingMaterial: "Oak", normalizedMaterial: "wood" },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [],
    variants: [],
    provenance: { source: "unit_test" },
    symbolOnly: false,
    ...overrides,
  };
}

describe("matchCatalogItemBySiteProduct", () => {
  const catalog = [
    item({ id: "desk-a", slug: "oando-fluid-desk-1400", name: "Fluid Desk 1400" }),
    item({ id: "desk-b", slug: "oando-fluid-desk-1600", name: "Fluid Desk 1600" }),
    item({
      id: "chair-1",
      slug: "task-chair-650-001",
      sku: "TC-650",
      name: "Task Chair",
      provenance: { source: "unit_test", plannerSourceSlug: "breeze-task" },
    }),
    item({ id: "sample-sofa-1", slug: "sample-sofa-1", name: "Sample Sofa" }),
  ];

  it("returns null for empty query or catalog", () => {
    expect(matchCatalogItemBySiteProduct(catalog, "")).toBeNull();
    expect(matchCatalogItemBySiteProduct(catalog, "   ")).toBeNull();
    expect(matchCatalogItemBySiteProduct([], "oando-fluid-desk-1400")).toBeNull();
  });

  it("matches exact slug (case-insensitive)", () => {
    const match = matchCatalogItemBySiteProduct(catalog, "Oando-Fluid-Desk-1400");
    expect(match?.matchKind).toBe("exact-slug");
    expect(match?.item.id).toBe("desk-a");
  });

  it("matches exact id and sku", () => {
    expect(matchCatalogItemBySiteProduct(catalog, "chair-1")?.matchKind).toBe(
      "exact-id",
    );
    expect(matchCatalogItemBySiteProduct(catalog, "TC-650")?.matchKind).toBe(
      "exact-sku",
    );
  });

  it("matches plannerSourceSlug", () => {
    const match = matchCatalogItemBySiteProduct(catalog, "breeze-task");
    expect(match?.matchKind).toBe("exact-source-slug");
    expect(match?.item.slug).toBe("task-chair-650-001");
  });

  it("prefix-matches size variants and prefers shorter slug", () => {
    const match = matchCatalogItemBySiteProduct(catalog, "oando-fluid-desk");
    expect(match?.matchKind).toBe("prefix-slug");
    expect(match?.item.slug).toBe("oando-fluid-desk-1400");
  });

  it("does not weak-match unrelated tokens", () => {
    expect(matchCatalogItemBySiteProduct(catalog, "fluid")).toBeNull();
    expect(matchCatalogItemBySiteProduct(catalog, "super-chair")).toBeNull();
  });

  it("isCatalogItemSiteProductMatch is true only for matching item", () => {
    expect(
      isCatalogItemSiteProductMatch(catalog[0]!, "oando-fluid-desk-1400"),
    ).toBe(true);
    expect(
      isCatalogItemSiteProductMatch(catalog[0]!, "sample-sofa-1"),
    ).toBe(false);
  });
});
