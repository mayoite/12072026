import { describe, expect, it } from "vitest";
import {
  normalizePlannerManagedProductRow,
  plannerManagedProductRowToCatalogProduct,
} from "@/features/planner/cloud-store/plannerManagedProductsShared";

const ISO = "2026-07-13T12:00:00.000Z";
const UUID = "a1b2c3d4-e5f6-4789-a012-3456789abcde";

function baseRow(overrides: Record<string, unknown> = {}) {
  return {
    id: UUID,
    slug: "managed-desk",
    planner_source_slug: "alpha-desk",
    name: "Alpha Desk",
    category: "desk",
    category_id: "workstations",
    category_name: "Workstations",
    series_id: "executive",
    series_name: "Executive",
    price: 85000,
    created_at: ISO,
    updated_at: ISO,
    ...overrides,
  };
}

describe("plannerManagedProductsShared (cloud-store)", () => {
  it("normalizes row with defaults for missing optional fields", () => {
    const row = normalizePlannerManagedProductRow(baseRow());
    expect(row.id).toBe(UUID);
    expect(row.description).toBe("");
    expect(row.active).toBe(true);
    expect(row.images).toEqual([]);
    expect(row.flagship_image).toBe("");
    expect(row.legacy_product_id).toBeNull();
  });

  it("maps planner_visible and planner_status into active", () => {
    const hidden = normalizePlannerManagedProductRow(
      baseRow({ active: undefined, planner_visible: false }),
    );
    expect(hidden.active).toBe(false);

    const approved = normalizePlannerManagedProductRow(
      baseRow({ active: undefined, planner_status: "approved" }),
    );
    expect(approved.active).toBe(true);

    const draft = normalizePlannerManagedProductRow(
      baseRow({ active: undefined, planner_status: "draft" }),
    );
    expect(draft.active).toBe(false);
  });

  it("pulls legacy product id and description from metadata when missing", () => {
    const row = normalizePlannerManagedProductRow(
      baseRow({
        metadata: {
          legacyProductId: "legacy-99",
          description: "From metadata",
        },
      }),
    );
    expect(row.legacy_product_id).toBe("legacy-99");
    expect(row.description).toBe("From metadata");
  });

  it("never invents list prices from metadata tags", () => {
    const row = normalizePlannerManagedProductRow(
      baseRow({
        price: 0,
        metadata: { listPriceInr: 99999, price: 99999 },
      }),
    );
    const product = plannerManagedProductRowToCatalogProduct(row);
    expect(product.price).toBe(0);
  });

  it("maps row to planner catalog product with managed metadata", () => {
    const row = normalizePlannerManagedProductRow(
      baseRow({
        description: "Exec desk",
        specs: { widthMm: 1600, depthMm: 800, heightMm: 750 },
      }),
    );
    const product = plannerManagedProductRowToCatalogProduct(row);
    expect(product.id).toBe(UUID);
    expect(product.slug).toBe("managed-desk");
    expect(product.plannerSourceSlug).toBe("alpha-desk");
    expect(product.price).toBe(85000);
    expect(product.metadata.plannerManaged).toBe(true);
    expect(product.metadata.plannerCatalogProductId).toBe(UUID);
    expect(product.detailedInfo?.overview).toBe("Exec desk");
  });
});
