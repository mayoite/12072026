import { describe, expect, it } from "vitest";

import type { Product } from "@/lib/catalog/types";
import { productToCatalogItem } from "@/features/planner/catalog/configuratorProductCatalogBridge";

const parametricProduct: Product = {
  id: "oando-ws-linear",
  slug: "oando-ws-linear",
  name: "Linear Workstation",
  category_id: "workstations",
  series: "linear",
  series_id: "workstations-linear",
  series_name: "Linear",
  family: "Linear",
  description: "Parametric desk",
  images: [],
  sizingType: "parametric",
  workstation: {
    shape: "straight",
    system: "leg",
    wireManagement: [],
    sharing: "non-sharing",
    seaterOptions: [2, 4],
    lengthOptions: [1200, 1500],
    depthOptions: [600, 750],
    heightMm: 750,
  },
  specs: { dimensions: "", materials: ["Laminate"], features: [] },
  created_at: "2024-01-01",
};

describe("productToCatalogItem", () => {
  it("maps fixed footprint mm to catalog cm fields", () => {
    const item = productToCatalogItem({
      ...parametricProduct,
      id: "pedestal-fixed",
      slug: "pedestal-fixed",
      name: "Pedestal",
      sizingType: "fixed",
      workstation: undefined,
      defaultFootprint: { L: 1500, D: 750, H: 750 },
    });
    expect(item).toMatchObject({
      id: "pedestal-fixed",
      sku: "pedestal-fixed",
      widthMm: 150,
      heightMm: 75,
      depthMm: 75,
      tags: expect.arrayContaining(["configurator"]),
    });
  });

  it("picks smallest discrete size option by area", () => {
    const item = productToCatalogItem({
      ...parametricProduct,
      id: "storage-unit",
      slug: "storage-unit",
      name: "Storage",
      category_id: "storage",
      sizingType: "discrete",
      workstation: undefined,
      sizeOptions: [
        { sku: "large", label: "Large", dim: { L: 1200, D: 600 } },
        { sku: "small", label: "Small", dim: { L: 400, D: 500 } },
      ],
    });
    expect(item?.widthMm).toBe(40);
    expect(item?.heightMm).toBe(50);
    expect(item?.category).toBe("storage");
  });

  it("uses smallest parametric straight footprint", () => {
    const item = productToCatalogItem(parametricProduct);
    expect(item).toMatchObject({
      id: "oando-ws-linear",
      sku: "oando-ws-linear",
      widthMm: 240,
      heightMm: 60,
      category: "desks",
    });
  });

  it("uses min arm lengths for parametric l-shape", () => {
    const item = productToCatalogItem({
      ...parametricProduct,
      slug: "l-desk",
      workstation: {
        ...parametricProduct.workstation!,
        shape: "l-shape",
      },
    });
    expect(item?.widthMm).toBe(120);
    expect(item?.heightMm).toBe(120);
  });

  it("returns null for invalid products", () => {
    expect(productToCatalogItem({ ...parametricProduct, sizingType: undefined })).toBeNull();
    expect(
      productToCatalogItem({
        ...parametricProduct,
        sizingType: "parametric",
        workstation: undefined,
      }),
    ).toBeNull();
  });
});
