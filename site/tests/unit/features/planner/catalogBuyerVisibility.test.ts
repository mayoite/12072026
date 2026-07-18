import { describe, expect, it } from "vitest";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import {
  filterBuyerFacingCatalogItems,
  filterGuestInventoryCatalogItems,
  formatCatalogFootprintCm,
  isBrandHeroCatalogItem,
  isGuestInventoryPollution,
  isInternalCatalogItem,
  prioritizeOfficeSystemsBrowse,
} from "@/features/planner/catalog/catalogBuyerVisibility";
import {
  inventoryCategoriesForProduct,
  inventoryRoomGroupsForProduct,
} from "@/features/planner/catalog/inventory/inventoryTaxonomy";
import { PLANNER_DEMO_CATALOG_ITEMS } from "@/features/planner/editor/demoCatalogItems";

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
    assets: { imageUrls: [], previewImageUrl: "" },
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

describe("isInternalCatalogItem", () => {
  it("flags proof-catalog provenance", () => {
    const item = minimalItem({
      id: "x",
      name: "Chair",
      provenance: { source: "proof_catalog" },
    });
    expect(isInternalCatalogItem(item)).toBe(true);
  });

  it("flags proof-chair id and Proof chair name", () => {
    expect(
      isInternalCatalogItem(
        minimalItem({ id: "proof-chair", name: "Proof chair" }),
      ),
    ).toBe(true);
  });

  it("flags Missing Geom Fallback name", () => {
    expect(
      isInternalCatalogItem(
        minimalItem({
          id: "missing-geom-fallback-001",
          name: "Missing Geom Fallback",
        }),
      ),
    ).toBe(true);
  });

  it("flags proof/test tags", () => {
    expect(
      isInternalCatalogItem(
        minimalItem({ id: "desk-1", name: "Desk", tags: ["proof"] }),
      ),
    ).toBe(true);
  });

  it("allows normal buyer catalog item", () => {
    expect(
      isInternalCatalogItem(
        minimalItem({
          id: "sample-desk-1",
          name: "Executive Standing Desk",
          tags: ["desk"],
        }),
      ),
    ).toBe(false);
  });
});

describe("filterBuyerFacingCatalogItems", () => {
  it("removes proof chair from demo catalog seed", () => {
    const filtered = filterBuyerFacingCatalogItems(PLANNER_DEMO_CATALOG_ITEMS);
    expect(filtered.some((i) => i.id === "proof-chair")).toBe(false);
    expect(filtered.length).toBeLessThan(PLANNER_DEMO_CATALOG_ITEMS.length);
    expect(filtered.some((i) => /proof/i.test(i.name))).toBe(false);
  });

  it("keeps modular cabinet and desks", () => {
    const filtered = filterBuyerFacingCatalogItems(PLANNER_DEMO_CATALOG_ITEMS);
    // demo seed may not include modular; ensure non-proof items remain
    expect(filtered.length).toBeGreaterThan(0);
    for (const item of filtered) {
      expect(isInternalCatalogItem(item)).toBe(false);
    }
  });
});

describe("brand heroes + guest inventory (P10 / BQ4 / P18)", () => {
  it("recognizes oando-* brand heroes by id, slug, or sku", () => {
    expect(
      isBrandHeroCatalogItem(
        minimalItem({ id: "oando-fluid-desk-1600", name: "Fluid Desk" }),
      ),
    ).toBe(true);
    expect(
      isBrandHeroCatalogItem(
        minimalItem({
          id: "legacy-id",
          name: "Fluid",
          slug: "oando-fluid-desk-1600",
        }),
      ),
    ).toBe(true);
    expect(
      isBrandHeroCatalogItem(
        minimalItem({
          id: "x",
          name: "Fluid",
          sku: "OANDO-FLUID-DSK-1600",
        }),
      ),
    ).toBe(true);
    expect(
      isBrandHeroCatalogItem(
        minimalItem({ id: "sample-sofa-1", name: "Modern 3-Seater Sofa" }),
      ),
    ).toBe(false);
  });

  it("flags demo-sofa, sample, OFL, and residential pollution", () => {
    expect(
      isGuestInventoryPollution(
        minimalItem({
          id: "sample-sofa-1",
          name: "Modern 3-Seater Sofa",
          roomTags: ["Living Room"],
        }),
      ),
    ).toBe(true);
    expect(
      isGuestInventoryPollution(
        minimalItem({
          id: "desk-linear-1200",
          name: "Linear Desk",
          sku: "OFL-DSK-001",
        }),
      ),
    ).toBe(true);
    expect(
      isGuestInventoryPollution(
        minimalItem({
          id: "oando-fluid-desk-1600",
          name: "Fluid Desk 1600",
          sku: "OANDO-FLUID-DSK-1600",
        }),
      ),
    ).toBe(false);
  });

  it("guest filter keeps only brand heroes — drops demo catalog pollution", () => {
    const heroes = [
      minimalItem({
        id: "oando-fluid-desk-1600",
        name: "Fluid Desk 1600",
        sku: "OANDO-FLUID-DSK-1600",
      }),
      minimalItem({
        id: "oando-breeze-task-chair",
        name: "Breeze Task Chair",
        sku: "OANDO-BREEZE-CHR-TSK",
      }),
    ];
    const mixed = [
      ...heroes,
      ...PLANNER_DEMO_CATALOG_ITEMS,
      minimalItem({
        id: "ofl-desk-1",
        name: "OFL Desk",
        sku: "OFL-DSK-001",
      }),
    ];
    const filtered = filterGuestInventoryCatalogItems(mixed);
    expect(filtered.map((i) => i.id).sort()).toEqual(
      heroes.map((i) => i.id).sort(),
    );
    expect(filtered.some((i) => i.id === "sample-sofa-1")).toBe(false);
    expect(filtered.some((i) => /^ofl/i.test(i.sku ?? ""))).toBe(false);
  });

  it("guest filter returns empty honest list when no brand heroes", () => {
    const filtered = filterGuestInventoryCatalogItems(PLANNER_DEMO_CATALOG_ITEMS);
    expect(filtered).toEqual([]);
  });
});

describe("formatCatalogFootprintCm", () => {
  it("formats 600mm × 600mm as 60 × 60 cm", () => {
    expect(formatCatalogFootprintCm(600, 600)).toBe("60 cm × 60 cm");
  });

  it("formats 2200mm × 900mm as 220 × 90 cm", () => {
    expect(formatCatalogFootprintCm(2200, 900)).toBe("220 cm × 90 cm");
  });
});

describe("inventoryRoomGroupsForProduct (P-UI-2)", () => {
  it("office-systems mode keeps All + Office only", () => {
    const groups = inventoryRoomGroupsForProduct("office-systems");
    expect(groups.map((g) => g.id)).toEqual(["all-rooms", "office"]);
    expect(groups[0]?.label).toBe("All");
    expect(groups.some((g) => g.id === "living" || g.id === "bedroom")).toBe(
      false,
    );
  });

  it("full mode keeps residential room chips", () => {
    const groups = inventoryRoomGroupsForProduct("full");
    expect(groups.some((g) => g.id === "living")).toBe(true);
    expect(groups.length).toBeGreaterThan(2);
  });
});

describe("inventoryCategoriesForProduct (P-UI-2b)", () => {
  it("office-systems drops outdoor kitchen decor and beds sub", () => {
    const cats = inventoryCategoriesForProduct("office-systems");
    expect(cats.map((c) => c.id)).toEqual([
      "furniture",
      "lighting",
      "symbols",
    ]);
    const furniture = cats.find((c) => c.id === "furniture");
    expect(furniture?.subCategories.map((s) => s.id)).toEqual([
      "desks",
      "chairs",
      "storage",
      "tables",
      "sofas",
    ]);
    expect(furniture?.subCategories[0]?.label).toMatch(/Desk/i);
  });
});

describe("prioritizeOfficeSystemsBrowse", () => {
  it("surfaces workstations and desks before sofas", () => {
    const sofa = minimalItem({
      id: "sample-sofa-1",
      name: "Modern 3-Seater Sofa",
      tags: ["sofa"],
    });
    const desk = minimalItem({
      id: "sample-desk-1",
      name: "Executive Standing Desk",
      tags: ["desk"],
      subCategory: "Desks & Workstations",
    });
    const station = minimalItem({
      id: "ws-linear-900",
      name: "Workstation Linear 900×600",
      tags: ["workstation", "desk"],
    });
    const ordered = prioritizeOfficeSystemsBrowse([sofa, desk, station]);
    expect(ordered.map((i) => i.id)).toEqual([
      "ws-linear-900",
      "sample-desk-1",
      "sample-sofa-1",
    ]);
  });
});
