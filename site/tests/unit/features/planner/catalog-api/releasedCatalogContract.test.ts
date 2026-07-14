import { describe, expect, it } from "vitest";
import {
  RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION,
  ReleasedAvailabilitySchema,
  parseReleasedCatalogProductV1,
  releasedCatalogProductFromParts,
} from "@/features/planner/catalog-api/releasedCatalogContract";
import { RELEASED_CATALOG_PRODUCT_FIXTURE_RAW } from "@/features/planner/catalog-api/fixtures/releasedCatalogProduct.fixture";

describe("releasedCatalogContract", () => {
  it("pins schema version at 1", () => {
    expect(RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION).toBe(1);
  });

  it("parses valid released product", () => {
    const product = parseReleasedCatalogProductV1(RELEASED_CATALOG_PRODUCT_FIXTURE_RAW);
    expect(product.productId).toBe(RELEASED_CATALOG_PRODUCT_FIXTURE_RAW.productId);
    expect(product.availability).toBe("available");
  });

  it("rejects definitionTypeId that does not match slug", () => {
    expect(() =>
      parseReleasedCatalogProductV1({
        ...RELEASED_CATALOG_PRODUCT_FIXTURE_RAW,
        definitionTypeId: "other-slug",
      }),
    ).toThrow();
  });

  it("builds product from parts", () => {
    const product = releasedCatalogProductFromParts({
      productId: RELEASED_CATALOG_PRODUCT_FIXTURE_RAW.productId,
      slug: "side-table-001",
      name: "Side table 600",
      sku: "OFL-TBL-001",
      boqIdentity: "OFL-TBL-001",
      availability: "available",
      dimensionsMm: { width: 600, depth: 600, height: 450 },
      svgRevisionId: "side-table-001-r1",
      svgChecksum: RELEASED_CATALOG_PRODUCT_FIXTURE_RAW.svg.checksum,
      svgResourceUrl: "/svg-catalog/side-table-001.svg",
      definitionTypeId: "side-table-001",
      definitionVersion: 1,
      publishedAt: "2026-07-13T12:00:00.000Z",
    });
    expect(product.schemaVersion).toBe(1);
    expect(product.svg.revisionId).toBe("side-table-001-r1");
  });

  it("accepts only known availability values", () => {
    expect(ReleasedAvailabilitySchema.parse("available")).toBe("available");
    expect(ReleasedAvailabilitySchema.parse("retired")).toBe("retired");
    expect(() => ReleasedAvailabilitySchema.parse("in-stock")).toThrow();
  });
});
