import { describe, expect, it } from "vitest";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import {
  filterBuyerFacingCatalogItems,
  isInternalCatalogItem,
  prioritizeOfficeSystemsBrowse,
} from "@/features/planner/catalog/catalogBuyerVisibility";

function minimalItem(
  overrides: Partial<PlannerCatalogItem> & Pick<PlannerCatalogItem, "id" | "name">,
): PlannerCatalogItem {
  return {
    slug: overrides.id,
    sku: overrides.sku ?? overrides.id,
    shortName: overrides.shortName ?? overrides.name,
    description: "",
    category: "Furniture",
    subCategory: "Chairs",
    taxonomyPath: "Furniture > Chairs",
    dimensions: { widthMm: 600, depthMm: 600, heightMm: 800 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: { marketingMaterial: "Default", normalizedMaterial: "default" },
    roomTags: [],
    styleTags: [],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [],
    variants: [],
    provenance: { source: "sample_data" },
    symbolOnly: false,
    ...overrides,
  };
}

describe("catalogBuyerVisibility", () => {
  it("hides proof/internal catalog from buyers", () => {
    const proof = minimalItem({
      id: "proof",
      name: "Proof",
      provenance: { source: "proof_catalog" },
    });
    const publicItem = minimalItem({ id: "desk", name: "Desk" });
    expect(isInternalCatalogItem(proof)).toBe(true);
    expect(isInternalCatalogItem(publicItem)).toBe(false);
    const filtered = filterBuyerFacingCatalogItems([proof, publicItem]);
    expect(filtered.map((i) => i.id)).toEqual(["desk"]);
  });

  it("prioritizes office systems when browsing", () => {
    const items = [
      minimalItem({ id: "sofa", name: "Sofa", category: "Furniture", subCategory: "Sofas" }),
      minimalItem({
        id: "ws",
        name: "Workstation",
        category: "Furniture",
        subCategory: "Desks & Workstations",
        tags: ["workstation", "office"],
      }),
    ];
    const ordered = prioritizeOfficeSystemsBrowse(items);
    expect(ordered.length).toBe(2);
    expect(ordered[0]!.id === "ws" || ordered.map((i) => i.id).includes("ws")).toBe(true);
  });
});
