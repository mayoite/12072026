import { describe, expect, it } from "vitest";

import {
  CATALOG_FAMILY_OTHER,
  PLANNER_CATALOG_COMPARE_MAX,
  buildCatalogCompareTable,
  buildCatalogListMetadata,
  catalogFacetsFromPanelFields,
  filterCatalogByFacets,
  groupCatalogItemsByFamily,
  hasActiveCatalogFacets,
  listCatalogAvailabilityOptions,
  listCatalogFamilyOptions,
  listCatalogMaterialOptions,
  listCatalogSeatOptions,
  resolveCatalogFamilyKey,
  resolveCatalogFamilyLabel,
  resolveCatalogVariantLabel,
  toggleCatalogCompareSelection,
} from "@/features/planner/catalog/catalogFamilyBrowse";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function item(
  partial: Partial<PlannerCatalogItem> & { id: string; name: string },
): PlannerCatalogItem {
  return {
    slug: partial.id,
    sku: partial.sku ?? partial.id.toUpperCase(),
    shortName: partial.shortName ?? partial.name,
    description: "",
    category: "Furniture",
    subCategory: "Desks",
    taxonomyPath: "Furniture > Desks",
    dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: [],
    variants: [],
    provenance: { source: "test" },
    symbolOnly: false,
    ...partial,
  };
}

describe("catalogFamilyBrowse", () => {
  it("resolves family from explicit field, then subCategory", () => {
    expect(
      resolveCatalogFamilyLabel(
        item({ id: "a", name: "A", family: "Linear WS", subCategory: "Desks" }),
      ),
    ).toBe("Linear WS");
    expect(
      resolveCatalogFamilyKey(item({ id: "b", name: "B", subCategory: "Chairs" })),
    ).toBe("chairs");
  });

  it("lists family options and groups preserving order", () => {
    const items = [
      item({ id: "d1", name: "Desk 1", subCategory: "Desks" }),
      item({ id: "c1", name: "Chair 1", subCategory: "Chairs" }),
      item({ id: "d2", name: "Desk 2", subCategory: "Desks" }),
    ];
    const families = listCatalogFamilyOptions(items);
    expect(families.map((f) => f.key).sort()).toEqual(["chairs", "desks"]);
    const groups = groupCatalogItemsByFamily(items);
    expect(groups.map((g) => g.familyKey)).toEqual(["desks", "chairs"]);
    expect(groups[0]!.items.map((i) => i.id)).toEqual(["d1", "d2"]);
  });

  it("filters by family, material, availability, seats, and width", () => {
    const items = [
      item({
        id: "a",
        name: "A",
        family: "WS",
        material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
        availability: "in-stock",
        seatCount: 2,
        dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
      }),
      item({
        id: "b",
        name: "B",
        family: "WS",
        material: { marketingMaterial: "Mesh", normalizedMaterial: "mesh" },
        availability: "backorder",
        seatCount: 1,
        dimensions: { widthMm: 600, depthMm: 600, heightMm: 1000 },
      }),
      item({
        id: "c",
        name: "C",
        family: "Storage",
        material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
        availability: "in-stock",
        dimensions: { widthMm: 800, depthMm: 400, heightMm: 720 },
      }),
    ];

    expect(
      filterCatalogByFacets(items, { familyKey: "ws" }).map((i) => i.id),
    ).toEqual(["a", "b"]);
    expect(
      filterCatalogByFacets(items, { material: "oak" }).map((i) => i.id),
    ).toEqual(["a", "c"]);
    expect(
      filterCatalogByFacets(items, { availability: "backorder" }).map((i) => i.id),
    ).toEqual(["b"]);
    expect(
      filterCatalogByFacets(items, { seatCount: 2 }).map((i) => i.id),
    ).toEqual(["a"]);
    expect(
      filterCatalogByFacets(items, { minWidthMm: 1000 }).map((i) => i.id),
    ).toEqual(["a"]);
    expect(
      filterCatalogByFacets(items, { maxWidthMm: 700 }).map((i) => i.id),
    ).toEqual(["b"]);
  });

  it("exposes facet option lists only for present values", () => {
    const items = [
      item({
        id: "a",
        name: "A",
        material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
        availability: "in-stock",
        seatCount: 4,
      }),
      item({
        id: "b",
        name: "B",
        material: { marketingMaterial: "Mesh", normalizedMaterial: "mesh" },
        availability: "preorder",
        seatCount: 2,
      }),
    ];
    expect(listCatalogMaterialOptions(items)).toEqual(["mesh", "oak"]);
    expect(listCatalogAvailabilityOptions(items)).toEqual(["in-stock", "preorder"]);
    expect(listCatalogSeatOptions(items)).toEqual([2, 4]);
    expect(hasActiveCatalogFacets({ familyKey: "desks" })).toBe(true);
    expect(hasActiveCatalogFacets({})).toBe(false);
  });

  it("builds a usable compare table for 2+ items and ignores missing ids", () => {
    const items = [
      item({
        id: "a",
        name: "Desk A",
        sku: "SKU-A",
        family: "Linear",
        variants: [
          {
            variantId: "a-v1",
            sku: "SKU-A-V1",
            parentProductId: "a",
            label: "Oak / 140",
            variantAttributes: {},
            dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
            availability: "in-stock",
          },
        ],
      }),
      item({
        id: "b",
        name: "Desk B",
        sku: "SKU-B",
        family: "L-shape",
        availability: "backorder",
        seatCount: 2,
      }),
    ];
    expect(buildCatalogCompareTable(items, ["a"])).toBeNull();
    const table = buildCatalogCompareTable(items, ["a", "missing", "b"]);
    expect(table).not.toBeNull();
    expect(table!.itemIds).toEqual(["a", "b"]);
    expect(table!.names).toEqual(["Desk A", "Desk B"]);
    const familyRow = table!.attributes.find((r) => r.key === "family");
    expect(familyRow?.values).toEqual(["Linear", "L-shape"]);
    const skuRow = table!.attributes.find((r) => r.key === "sku");
    expect(skuRow?.values).toEqual(["SKU-A", "SKU-B"]);
    const variantRow = table!.attributes.find((r) => r.key === "variant");
    expect(variantRow?.values[0]).toBe("Oak / 140");
  });

  it("toggles compare selection with max cap", () => {
    let selected: string[] = [];
    selected = toggleCatalogCompareSelection(selected, "a");
    selected = toggleCatalogCompareSelection(selected, "b");
    expect(selected).toEqual(["a", "b"]);
    selected = toggleCatalogCompareSelection(selected, "a");
    expect(selected).toEqual(["b"]);

    selected = ["1", "2", "3", "4"];
    const blocked = toggleCatalogCompareSelection(selected, "5", PLANNER_CATALOG_COMPARE_MAX);
    expect(blocked).toEqual(["1", "2", "3", "4"]);
  });

  it("resolves variant label null when only name-redundant master", () => {
    expect(
      resolveCatalogVariantLabel(
        item({
          id: "x",
          name: "Only Name",
          variants: [
            {
              variantId: "x-master",
              sku: "X",
              parentProductId: "x",
              label: "Only Name",
              variantAttributes: {},
              dimensions: { widthMm: 1, depthMm: 1, heightMm: 1 },
              availability: "in-stock",
            },
          ],
        }),
      ),
    ).toBeNull();
  });

  it("buildCatalogListMetadata exposes name, sku, family, variant, and dims when present", () => {
    const row = buildCatalogListMetadata(
      item({
        id: "meta-1",
        name: "Linear Desk 1400",
        shortName: "Desk 1400",
        sku: "LD-1400",
        family: "Linear WS",
        dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
        variants: [
          {
            variantId: "meta-1-v1",
            sku: "LD-1400-OAK",
            parentProductId: "meta-1",
            label: "Oak / 1400",
            variantAttributes: {},
            dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
            availability: "in-stock",
          },
        ],
      }),
    );
    expect(row).toEqual({
      id: "meta-1",
      name: "Desk 1400",
      fullName: "Linear Desk 1400",
      sku: "LD-1400",
      family: "Linear WS",
      variant: "Oak / 1400",
      dimsMm: { widthMm: 1400, depthMm: 700, heightMm: 750 },
      dimsLabel: "1400×700×750 mm",
    });
  });

  it("buildCatalogListMetadata nulls blank sku/variant and dashes empty dims", () => {
    const row = buildCatalogListMetadata(
      item({
        id: "meta-empty",
        name: "Bare",
        shortName: "Bare",
        sku: "   ",
        family: "Storage",
        dimensions: { widthMm: Number.NaN, depthMm: Number.NaN, heightMm: Number.NaN },
        variants: [],
      }),
    );
    expect(row.sku).toBeNull();
    expect(row.variant).toBeNull();
    expect(row.family).toBe("Storage");
    expect(row.dimsLabel).toBe("—");
  });

  it("resolves family from taxonomy leaf, then category, then Other", () => {
    expect(
      resolveCatalogFamilyLabel(
        item({
          id: "t1",
          name: "T",
          family: undefined,
          subCategory: "" as PlannerCatalogItem["subCategory"],
          taxonomyPath: "Furniture > Systems > Linear" as PlannerCatalogItem["taxonomyPath"],
        }),
      ),
    ).toBe("Linear");
    expect(
      resolveCatalogFamilyLabel(
        item({
          id: "t2",
          name: "T2",
          family: "  ",
          subCategory: "" as PlannerCatalogItem["subCategory"],
          taxonomyPath: "" as PlannerCatalogItem["taxonomyPath"],
          category: "Seating",
        }),
      ),
    ).toBe("Seating");
    expect(
      resolveCatalogFamilyLabel(
        item({
          id: "t3",
          name: "T3",
          family: undefined,
          subCategory: "" as PlannerCatalogItem["subCategory"],
          taxonomyPath: "" as PlannerCatalogItem["taxonomyPath"],
          category: "" as PlannerCatalogItem["category"],
        }),
      ),
    ).toBe(CATALOG_FAMILY_OTHER);
  });

  it("filters by depth bounds and reports family option counts", () => {
    const items = [
      item({
        id: "deep",
        name: "Deep",
        family: "WS",
        dimensions: { widthMm: 1200, depthMm: 800, heightMm: 750 },
      }),
      item({
        id: "shallow",
        name: "Shallow",
        family: "WS",
        dimensions: { widthMm: 1200, depthMm: 400, heightMm: 750 },
      }),
      item({
        id: "mid",
        name: "Mid",
        family: "Chair",
        dimensions: { widthMm: 600, depthMm: 600, heightMm: 900 },
      }),
    ];
    expect(
      filterCatalogByFacets(items, { minDepthMm: 700 }).map((i) => i.id),
    ).toEqual(["deep"]);
    expect(
      filterCatalogByFacets(items, { maxDepthMm: 500 }).map((i) => i.id),
    ).toEqual(["shallow"]);
    const families = listCatalogFamilyOptions(items);
    expect(families).toEqual(
      expect.arrayContaining([
        { key: "ws", label: "WS", count: 2 },
        { key: "chair", label: "Chair", count: 1 },
      ]),
    );
  });

  it("compare table includes dims and seats metadata rows", () => {
    const items = [
      item({
        id: "c1",
        name: "A",
        shortName: "A",
        sku: "A1",
        family: "F1",
        seatCount: 2,
        dimensions: { widthMm: 1000, depthMm: 500, heightMm: 720 },
      }),
      item({
        id: "c2",
        name: "B",
        shortName: "B",
        sku: "B1",
        family: "F2",
        dimensions: { widthMm: 800, depthMm: 800, heightMm: 750 },
      }),
    ];
    const table = buildCatalogCompareTable(items, ["c1", "c2"]);
    expect(table).not.toBeNull();
    const dims = table!.attributes.find((r) => r.key === "dims");
    expect(dims?.values).toEqual(["1000×500×720 mm", "800×800×750 mm"]);
    const seats = table!.attributes.find((r) => r.key === "seats");
    expect(seats?.values).toEqual(["2", "—"]);
    const keys = table!.attributes.map((r) => r.key);
    expect(keys).toEqual([
      "sku",
      "family",
      "variant",
      "dims",
      "material",
      "availability",
      "seats",
    ]);
  });

  it("compare table names and sku align with list metadata", () => {
    const items = [
      item({
        id: "align-a",
        name: "Full Name A",
        shortName: "  Compact A  ",
        sku: "  SKU-A  ",
        family: "Family A",
      }),
      item({
        id: "align-b",
        name: "Full Name B",
        shortName: "",
        sku: "SKU-B",
        family: "Family B",
      }),
    ];
    const table = buildCatalogCompareTable(items, ["align-a", "align-b"]);
    expect(table).not.toBeNull();
    const metaA = buildCatalogListMetadata(items[0]!);
    const metaB = buildCatalogListMetadata(items[1]!);
    expect(table!.names).toEqual([metaA.name, metaB.name]);
    const skuRow = table!.attributes.find((r) => r.key === "sku");
    expect(skuRow?.values).toEqual([metaA.sku ?? "—", metaB.sku ?? "—"]);
  });

  it("maps inventory facet fields into CatalogFacetFilters", () => {
    const facets = catalogFacetsFromPanelFields({
      selectedFamilyKey: " Desks ",
      selectedMaterial: "Oak",
      selectedAvailability: "in-stock",
      selectedSeatCount: 4,
      minWidthMm: 1000,
      maxWidthMm: 1600,
      minDepthMm: 500,
      maxDepthMm: 800,
    });
    expect(facets).toEqual({
      familyKey: " Desks ",
      material: "Oak",
      availability: "in-stock",
      seatCount: 4,
      minWidthMm: 1000,
      maxWidthMm: 1600,
      minDepthMm: 500,
      maxDepthMm: 800,
    });
    expect(hasActiveCatalogFacets(facets)).toBe(true);
    expect(
      hasActiveCatalogFacets(
        catalogFacetsFromPanelFields({
          selectedFamilyKey: null,
          selectedMaterial: null,
          selectedAvailability: null,
          selectedSeatCount: null,
          minWidthMm: null,
          maxWidthMm: null,
        }),
      ),
    ).toBe(false);
  });
});
