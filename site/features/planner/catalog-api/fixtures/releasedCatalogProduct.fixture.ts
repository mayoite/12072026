/**
 * Isolated released-product fixture for Planner Phase 2 catalog boundary tests.
 *
 * In-memory only. Never reads or writes site/inventory/descriptors, public/svg-catalog,
 * or released database rows.
 */

import type { ReleasedCatalogProductV1 } from "@/features/planner/catalog-api/releasedCatalogContract";

/** Canonical fixture matching ReleasedCatalogProductV1 (schemaVersion 1). */
export const RELEASED_CATALOG_PRODUCT_FIXTURE_RAW = {
  schemaVersion: 1 as const,
  productId: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
  slug: "side-table-001",
  name: "Side table 600",
  sku: "OFL-TBL-001",
  boqIdentity: "OFL-TBL-001",
  availability: "available" as const,
  dimensionsMm: {
    width: 600,
    depth: 600,
    height: 450,
  },
  svg: {
    revisionId: "side-table-001-r1",
    checksum:
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    /** Planner catalog SVG resource (same path Admin publish advertises). */
    resourceUrl: "/svg-catalog/side-table-001.svg",
  },
  definitionTypeId: "side-table-001",
  definitionVersion: 1,
  publishedAt: "2026-07-13T12:00:00.000Z",
} satisfies Omit<ReleasedCatalogProductV1, never>;

export function cloneReleasedCatalogProductFixture(): ReleasedCatalogProductV1 {
  return structuredClone(RELEASED_CATALOG_PRODUCT_FIXTURE_RAW);
}
