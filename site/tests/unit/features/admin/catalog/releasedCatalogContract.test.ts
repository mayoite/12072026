import { describe, expect, it } from "vitest";
import * as admin from "@/features/admin/catalog/releasedCatalogContract";
import * as shared from "@/features/shared/catalog/releasedCatalogProductContract";

describe("admin releasedCatalogContract re-export", () => {
  it("mirrors shared schema version", () => {
    expect(admin.RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION).toBe(
      shared.RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION,
    );
    expect(admin.parseReleasedCatalogProductV1).toBe(
      shared.parseReleasedCatalogProductV1,
    );
  });

  it("builds a product from parts", () => {
    const product = admin.releasedCatalogProductFromParts({
      productId: "11111111-1114-4111-8111-111111111111",
      slug: "desk-basic",
      name: "Basic Desk",
      sku: "DESK-001",
      boqIdentity: "BOQ-DESK-001",
      availability: "available",
      dimensionsMm: { width: 1200, depth: 600, height: 750 },
      svgRevisionId: "rev-1",
      svgChecksum: "a".repeat(64),
      svgResourceUrl: "/svg-catalog/desk-basic.svg",
      definitionTypeId: "desk-basic",
      definitionVersion: 1,
      publishedAt: "2026-07-01T00:00:00.000Z",
    });
    const parsed = admin.parseReleasedCatalogProductV1(product);
    expect(parsed.slug).toBe("desk-basic");
    expect(parsed.name).toBe("Basic Desk");
  });
});
