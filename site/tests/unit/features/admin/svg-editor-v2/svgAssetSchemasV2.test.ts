import { describe, expect, it } from "vitest";

import {
  SvgAssetManifestV2Schema,
  parseSvgAssetManifestV2,
} from "@/features/admin/svg-editor-v2/model/svgAssetSchemasV2";

const CHECKSUM = "a".repeat(64);

function validManifest() {
  return {
    version: 2 as const,
    assetId: "018f47ca-8131-7e40-9f1d-6b90f37b1290",
    productId: "018f47ca-8131-7e40-9f1d-6b90f37b1291",
    slug: "linear-desk-1200",
    name: "Linear desk 1200",
    assetKind: "fixed" as const,
    dimensionsMm: { width: 1200.5, depth: 600.25, height: 740.75 },
    sourceChecksum: CHECKSUM,
    lifecycle: "live" as const,
    currentVersion: 3,
    capabilities: ["geometry", "transforms"] as const,
    createdAt: "2026-07-15T08:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
  };
}

describe("SvgAssetManifestV2Schema", () => {
  it.each([
    ["fixed", "fixed"],
    ["configurable", "configurable"],
    ["parametric", "parametric"],
  ] as const)("accepts a valid %s asset", (_, assetKind) => {
    const parsed = parseSvgAssetManifestV2({ ...validManifest(), assetKind });
    expect(parsed.assetKind).toBe(assetKind);
    expect(parsed.dimensionsMm.width).toBe(1200.5);
  });

  it("accepts an unlinked draft", () => {
    expect(
      SvgAssetManifestV2Schema.parse({
        ...validManifest(),
        productId: null,
        lifecycle: "draft",
        currentVersion: 0,
      }).productId,
    ).toBeNull();
  });

  it.each([
    ["unknown version", { version: 3 }],
    ["invalid asset id", { assetId: "asset-1" }],
    ["invalid product id", { productId: "product-1" }],
    ["invalid slug", { slug: "Not A Slug" }],
    ["empty name", { name: " " }],
    ["zero width", { dimensionsMm: { width: 0, depth: 600, height: 740 } }],
    ["negative depth", { dimensionsMm: { width: 1200, depth: -1, height: 740 } }],
    ["infinite height", { dimensionsMm: { width: 1200, depth: 600, height: Infinity } }],
    ["invalid checksum", { sourceChecksum: "abc" }],
    ["invalid lifecycle", { lifecycle: "published" }],
    ["negative current version", { currentVersion: -1 }],
    ["fractional current version", { currentVersion: 1.5 }],
    ["empty capabilities", { capabilities: [] }],
    ["duplicate capabilities", { capabilities: ["geometry", "geometry"] }],
    ["unknown capability", { capabilities: ["arbitrary-script"] }],
    ["invalid created timestamp", { createdAt: "today" }],
    ["updated before created", { updatedAt: "2026-07-15T07:59:59.000Z" }],
    ["unknown manifest key", { unexpected: true }],
  ])("rejects %s", (_, change) => {
    const candidate = { ...validManifest(), ...change };
    expect(SvgAssetManifestV2Schema.safeParse(candidate).success).toBe(false);
  });
});
