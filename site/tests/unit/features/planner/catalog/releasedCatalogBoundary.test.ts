/**
 * Phase 2 — Planner catalog boundary (released product → place → plan paint → BOQ).
 * Isolated fixture only; never mutates released catalog rows or disk catalog files.
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  boqIdentityFromPlacement,
  furnitureStampFromPlacement,
  loadReleasedProductFixture,
  loadReleasedProductFromCatalogPayload,
  placementFromReleasedProduct,
  resolvePlanSymbolPaintMode,
} from "@/features/planner/catalog/releasedCatalogBoundary";
import { RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION } from "@/features/planner/catalog/releasedCatalogContract";
import { RELEASED_CATALOG_PRODUCT_FIXTURE_RAW } from "@/features/planner/catalog/fixtures/releasedCatalogProduct.fixture";

describe("Planner catalog boundary — released product (Phase 2)", () => {
  it("loads published product through catalog boundary (fixture payload)", () => {
    const product = loadReleasedProductFixture();
    expect(product.schemaVersion).toBe(RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION);
    expect(product.slug).toBe("side-table-001");
    expect(product.productId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("rejects incomplete catalog payloads (no silent partial product)", () => {
    expect(() =>
      loadReleasedProductFromCatalogPayload({
        schemaVersion: 1,
        productId: RELEASED_CATALOG_PRODUCT_FIXTURE_RAW.productId,
        slug: "side-table-001",
        // missing boq / svg / dimensions
      }),
    ).toThrow();
  });

  it("places identity and dimensions matching Admin released record", () => {
    const product = loadReleasedProductFixture();
    const placement = placementFromReleasedProduct(product);
    expect(placement.productId).toBe(product.productId);
    expect(placement.slug).toBe(product.slug);
    expect(placement.widthMm).toBe(product.dimensionsMm.width);
    expect(placement.depthMm).toBe(product.dimensionsMm.depth);
    expect(placement.heightMm).toBe(product.dimensionsMm.height);
    expect(placement.widthMm).toBe(600);
    expect(placement.depthMm).toBe(600);
  });

  it("uses published SVG as primary 2D plan symbol URL", () => {
    const product = loadReleasedProductFixture();
    const placement = placementFromReleasedProduct(product);
    expect(placement.planSvgUrl).toBe(product.svg.resourceUrl);
    expect(placement.planSvgUrl).toMatch(/\.svg$/i);
    expect(placement.svgRevisionId).toBe(product.svg.revisionId);
    expect(placement.svgChecksum).toBe(product.svg.checksum);
  });

  it("Block2D only while loading or when SVG unavailable; SVG when ready", () => {
    const url = "/svg-catalog/side-table-001.svg";
    expect(
      resolvePlanSymbolPaintMode({
        planSvgUrl: url,
        svgImageReady: false,
        svgLoadFailed: false,
      }),
    ).toBe("block2d");
    expect(
      resolvePlanSymbolPaintMode({
        planSvgUrl: url,
        svgImageReady: false,
        svgLoadFailed: true,
      }),
    ).toBe("block2d");
    expect(
      resolvePlanSymbolPaintMode({
        planSvgUrl: null,
        svgImageReady: false,
        svgLoadFailed: false,
      }),
    ).toBe("block2d");
    expect(
      resolvePlanSymbolPaintMode({
        planSvgUrl: url,
        svgImageReady: true,
        svgLoadFailed: false,
      }),
    ).toBe("svg");
  });

  it("BOQ identity survives placement stamp", () => {
    const product = loadReleasedProductFixture();
    const placement = placementFromReleasedProduct(product);
    const stamp = furnitureStampFromPlacement(placement);
    expect(boqIdentityFromPlacement(placement)).toBe(product.boqIdentity);
    expect(stamp.boqIdentity).toBe("OFL-TBL-001");
    expect(stamp.sourceSku).toBe(product.sku);
    expect(stamp.sourceCatalogId).toBe(product.productId);
    expect(stamp.sourceSlug).toBe(product.slug);
    expect(stamp.width).toBe(product.dimensionsMm.width);
    expect(stamp.depth).toBe(product.dimensionsMm.depth);
    expect(stamp.previewImageUrl).toBe(product.svg.resourceUrl);
  });

  it("fabric plan paint documents SVG primary and Block2D fallback", () => {
    const src = fs.readFileSync(
      path.join(
        process.cwd(),
        "features/planner/canvas/fabricBlock2D.ts",
      ),
      "utf8",
    );
    expect(src).toMatch(/Primary plan paint.*published.*svg/i);
    expect(src).toMatch(/Block2D while loading or on miss/i);
    expect(src).toMatch(/createFabricFurnitureSymbol/);
    expect(src).toMatch(/furniturePlanSvgUrl/);
  });

  it("fixture is isolated (no disk catalog I/O in boundary module)", () => {
    const boundarySrc = fs.readFileSync(
      path.join(
        process.cwd(),
        "features/planner/catalog/releasedCatalogBoundary.ts",
      ),
      "utf8",
    );
    expect(boundarySrc).not.toMatch(/block-descriptors/);
    expect(boundarySrc).not.toMatch(/readFileSync|writeFileSync/);
    expect(boundarySrc).not.toMatch(/supabase|drizzle/i);
  });
});
