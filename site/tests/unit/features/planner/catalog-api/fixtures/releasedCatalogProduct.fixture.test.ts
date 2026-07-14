import { describe, expect, it } from "vitest";
import {
  RELEASED_CATALOG_PRODUCT_FIXTURE_RAW,
  cloneReleasedCatalogProductFixture,
} from "@/features/planner/catalog-api/fixtures/releasedCatalogProduct.fixture";
import {
  parseReleasedCatalogProductV1,
  RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION,
} from "@/features/planner/catalog-api/releasedCatalogContract";

describe("releasedCatalogProduct.fixture", () => {
  it("matches ReleasedCatalogProductV1 schema", () => {
    const product = parseReleasedCatalogProductV1(RELEASED_CATALOG_PRODUCT_FIXTURE_RAW);
    expect(product.schemaVersion).toBe(RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION);
    expect(product.slug).toBe("side-table-001");
    expect(product.boqIdentity).toBe("OFL-TBL-001");
    expect(product.dimensionsMm.width).toBe(600);
    expect(product.svg.resourceUrl).toMatch(/\.svg$/);
  });

  it("clone returns a deep copy that does not share nested objects", () => {
    const a = cloneReleasedCatalogProductFixture();
    const b = cloneReleasedCatalogProductFixture();
    expect(a).toEqual(b);
    a.name = "mutated";
    a.dimensionsMm.width = 999;
    a.svg.checksum = "0".repeat(64);
    expect(b.name).toBe("Side table 600");
    expect(b.dimensionsMm.width).toBe(600);
    expect(b.svg.checksum).not.toBe("0".repeat(64));
  });
});
