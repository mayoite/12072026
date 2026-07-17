import { describe, expect, it } from "vitest";

import {
  assertDescriptorPublishable,
  buildReleasedProductFromPublish,
} from "@/features/admin/svg-editor/publish/releasedCatalogPublishGate";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { BLOCK_DESCRIPTOR_SCHEMA_VERSION } from "@/features/planner/catalog/svg/svgTypes";

const base = {
  schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  id: "11111111-1111-4111-8111-111111111111",
  slug: "test-block",
  sku: "SKU-1",
  sourceProvenance: "native" as const,
  geometry: { widthMm: 100, depthMm: 100, heightMm: 100 },
  viewBox: { x: 0, y: 0, width: 100, height: 100 },
  mounting: ["floor"] as const,
  themeTokens: { currentColor: "currentColor" },
  rovingFocus: [],
  liveAnnouncementCategories: ["status"] as const,
  variant: "fixed" as const,
  fixed: { sizingType: "fixed" as const },
  checksum: "a".repeat(64),
  generatedAt: 1_700_000_000,
} satisfies BlockDescriptor;

describe("releasedCatalogPublishGate — incomplete cannot publish", () => {
  it("accepts a complete descriptor footprint", () => {
    const result = assertDescriptorPublishable(base);
    expect(result.ok).toBe(true);
  });

  it("rejects missing identity, non-positive geometry, and viewBox mismatch", () => {
    expect(assertDescriptorPublishable({ ...base, slug: "" }).ok).toBe(false);
    expect(
      assertDescriptorPublishable({
        ...base,
        geometry: { ...base.geometry, widthMm: 0 },
      }).ok,
    ).toBe(false);
    expect(
      assertDescriptorPublishable({
        ...base,
        viewBox: { ...base.viewBox, width: 200 },
      }).ok,
    ).toBe(false);
  });

  it("rejects bad UUID, empty mounting, non-positive depth/height, and empty BOQ", () => {
    const badId = assertDescriptorPublishable({
      ...base,
      id: "not-a-uuid" as BlockDescriptor["id"],
    });
    expect(badId.ok).toBe(false);
    if (!badId.ok) expect(badId.issues.some((i) => /UUID/i.test(i))).toBe(true);

    const noMount = assertDescriptorPublishable({
      ...base,
      mounting: [] as unknown as BlockDescriptor["mounting"],
    });
    expect(noMount.ok).toBe(false);
    if (!noMount.ok) {
      expect(noMount.issues.some((i) => /mounting/i.test(i))).toBe(true);
    }

    expect(
      assertDescriptorPublishable({
        ...base,
        geometry: { ...base.geometry, depthMm: -1 },
      }).ok,
    ).toBe(false);
    expect(
      assertDescriptorPublishable({
        ...base,
        geometry: { ...base.geometry, heightMm: 0 },
      }).ok,
    ).toBe(false);

    // slug is also BOQ fallback; empty slug already fails slug regex first.
    const noSkuUsesSlug = assertDescriptorPublishable({
      ...base,
      sku: "  ",
    });
    expect(noSkuUsesSlug.ok).toBe(true);
  });

  it("builds a ReleasedCatalogProductV1 only when svg artifacts are complete", () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
    const ok = buildReleasedProductFromPublish({
      descriptor: base,
      svgMarkup: svg,
      revisionId: "test-block-r1",
      publishedAt: "2026-07-13T12:00:00.000Z",
      availability: "available",
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.product.schemaVersion).toBe(1);
      expect(ok.product.boqIdentity).toBe("SKU-1");
      expect(ok.product.svg.checksum).toHaveLength(64);
      expect(ok.product.svg.resourceUrl).toContain("test-block-r1");
    }

    const usesSlugForBoq = buildReleasedProductFromPublish({
      descriptor: { ...base, sku: undefined },
      svgMarkup: svg,
      revisionId: "test-block-r1",
      publishedAt: "2026-07-13T12:00:00.000Z",
      availability: "available",
    });
    expect(usesSlugForBoq.ok).toBe(true);
    if (usesSlugForBoq.ok) {
      expect(usesSlugForBoq.product.boqIdentity).toBe("test-block");
    }

    const preGate = buildReleasedProductFromPublish({
      descriptor: {
        ...base,
        geometry: { ...base.geometry, widthMm: 0 },
      },
      svgMarkup: svg,
      revisionId: "x",
      publishedAt: "2026-07-13T12:00:00.000Z",
      availability: "available",
    });
    expect(preGate.ok).toBe(false);
    if (!preGate.ok) expect(preGate.error).toMatch(/released_contract/);

    const bad = buildReleasedProductFromPublish({
      descriptor: { ...base, slug: "Bad_Slug" as BlockDescriptor["slug"] },
      svgMarkup: svg,
      revisionId: "x",
      publishedAt: "not-a-date",
      availability: "available",
    });
    expect(bad.ok).toBe(false);
  });
});
