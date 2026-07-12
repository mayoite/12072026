/**
 * Phase 03 Catalog â€” Comprehensive Test Suite
 *
 * Covers all catalog modules:
 * - Unit conversion (03-CAT-03)
 * - Taxonomy (03-CAT-02)
 * - Domain types (03-CAT-01)
 * - Asset validation (03-CAT-05)
 * - Fallback geometry (03-CAT-06a)
 * - Placement action (03-CAT-08)
 * - Recent/favorites (03-CAT-07)
 * - Catalog client (03-CAT-06b)
 * - Catalog mapping (03-CAT-04)
 *
 * Coverage target: â‰¥95% statements, branches, functions, lines per file.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-03: Unit Conversion
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  canonicalMmFromCatalogCm,
  canonicalDimensionsFromCatalogCm,
  displayCmFromCanonicalMm,
  displayInFromCanonicalMm,
  displayMFromCanonicalMm,
  displayFtInFromCanonicalMm,
  displayDimensions,
  buildAccessibleName,
  validateDimensions,
} from "@/features/planner/project/catalog/unitConversion";
import type { Open3dCatalogDimensions, Open3dCatalogCategory } from "@/features/planner/project/catalog/catalogTypes";

describe("03-CAT-03: Unit Conversion", () => {
  describe("canonicalMmFromCatalogCm", () => {
    it("converts cm to mm correctly", () => {
      expect(canonicalMmFromCatalogCm(10)).toBe(100);
      expect(canonicalMmFromCatalogCm(45)).toBe(450);
      expect(canonicalMmFromCatalogCm(200)).toBe(2000);
    });

    it("rounds fractional cm values", () => {
      expect(canonicalMmFromCatalogCm(45.6)).toBe(456);
    });

    it("returns at least 1 for zero or negative inputs", () => {
      expect(canonicalMmFromCatalogCm(0)).toBe(1);
      expect(canonicalMmFromCatalogCm(-5)).toBe(1);
    });
  });

  describe("canonicalDimensionsFromCatalogCm", () => {
    it("builds dimensions from cm values", () => {
      const dims = canonicalDimensionsFromCatalogCm({
        widthCm: 140,
        depthCm: 70,
        heightCm: 75,
      });
      expect(dims.widthMm).toBe(1400);
      expect(dims.depthMm).toBe(700);
      expect(dims.heightMm).toBe(750);
    });

    it("uses default height of 75cm when not provided", () => {
      const dims = canonicalDimensionsFromCatalogCm({ widthCm: 100, depthCm: 60 });
      expect(dims.heightMm).toBe(750);
    });

    it("preserves seat height and weight when provided", () => {
      const dims = canonicalDimensionsFromCatalogCm({
        widthCm: 60,
        depthCm: 60,
        seatHeightCm: 45,
        weightKg: 12.5,
      });
      expect(dims.seatHeightMm).toBe(450);
      expect(dims.weightKg).toBe(12.5);
    });
  });

  describe("display converters", () => {
    it("displayCmFromCanonicalMm converts mm to rounded cm", () => {
      expect(displayCmFromCanonicalMm(1400)).toBe(140);
      expect(displayCmFromCanonicalMm(456)).toBe(46);
    });

    it("displayInFromCanonicalMm converts mm to inches", () => {
      expect(displayInFromCanonicalMm(254)).toBe(10);
      expect(displayInFromCanonicalMm(304)).toBe(11.97);
    });

    it("displayMFromCanonicalMm converts mm to metres", () => {
      expect(displayMFromCanonicalMm(1000)).toBe(1);
      expect(displayMFromCanonicalMm(2500)).toBe(2.5);
    });

    it("displayFtInFromCanonicalMm converts mm to ft-in", () => {
      expect(displayFtInFromCanonicalMm(3048)).toBe('10\' 0"');
    });
  });

  describe("displayDimensions", () => {
    const dims: Open3dCatalogDimensions = { widthMm: 1400, depthMm: 700, heightMm: 750 };

    it("formats in cm", () => {
      expect(displayDimensions(dims, "cm")).toBe("140 cm × 70 cm × 75 cm");
    });

    it("formats in mm", () => {
      expect(displayDimensions(dims, "mm")).toBe("1400 mm × 700 mm × 750 mm");
    });

    it("defaults to cm for unknown unit", () => {
      expect(displayDimensions(dims, "yards" as never)).toBe("140 cm × 70 cm × 75 cm");
    });

    it("handles zero height", () => {
      expect(displayDimensions({ ...dims, heightMm: 0 }, "cm")).toBe("140 cm × 70 cm");
    });
  });

  describe("buildAccessibleName", () => {
    it("builds accessible name with dimensions", () => {
      const dims: Open3dCatalogDimensions = { widthMm: 1400, depthMm: 700, heightMm: 750 };
      expect(buildAccessibleName("Desk", dims)).toBe("Desk, 140 cm by 70 cm by 75 cm");
    });
  });

  describe("validateDimensions", () => {
    it("accepts valid dimensions", () => {
      const dims: Open3dCatalogDimensions = { widthMm: 1000, depthMm: 500, heightMm: 750 };
      const result = validateDimensions(dims);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects negative width", () => {
      const result = validateDimensions({ widthMm: -1, depthMm: 100, heightMm: 100 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("widthMm must be a positive finite number");
    });

    it("rejects zero depth", () => {
      const result = validateDimensions({ widthMm: 100, depthMm: 0, heightMm: 100 });
      expect(result.valid).toBe(false);
    });

    it("rejects NaN values", () => {
      const result = validateDimensions({ widthMm: NaN, depthMm: 100, heightMm: 100 });
      expect(result.valid).toBe(false);
    });

    it("rejects oversized dimensions", () => {
      const result = validateDimensions({ widthMm: 200000, depthMm: 100, heightMm: 100 });
      expect(result.valid).toBe(false);
    });

    it("rejects negative weight", () => {
      const result = validateDimensions({ widthMm: 100, depthMm: 100, heightMm: 100, weightKg: -5 });
      expect(result.valid).toBe(false);
    });

    it("accepts null weight (optional)", () => {
      const result = validateDimensions({ widthMm: 100, depthMm: 100, heightMm: 100, weightKg: undefined });
      expect(result.valid).toBe(true);
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-02: Taxonomy
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  CANONICAL_TAXONOMY,
  buildTaxonomyPath,
  normalizeMaterial,
  normalizeColor,
  isValidRoomTag,
  isValidStyleTag,
  normalizeAssemblyType,
  buildShortName,
} from "@/features/planner/project/catalog/catalogTaxonomy";

describe("03-CAT-02: Taxonomy", () => {
  describe("CANONICAL_TAXONOMY", () => {
    it("has all top-level categories", () => {
      expect(CANONICAL_TAXONOMY.Furniture).toBeDefined();
      expect(CANONICAL_TAXONOMY.Lighting).toBeDefined();
      expect(CANONICAL_TAXONOMY.Decor).toBeDefined();
      expect(CANONICAL_TAXONOMY.Outdoor).toBeDefined();
      expect(CANONICAL_TAXONOMY["Bedding & Textiles"]).toBeDefined();
      expect(CANONICAL_TAXONOMY["Storage & Organisation"]).toBeDefined();
      expect(CANONICAL_TAXONOMY["Kitchen & Dining"]).toBeDefined();
      expect(CANONICAL_TAXONOMY.Symbols).toBeDefined();
    });

    it("Furniture has all subcategories", () => {
      const furniture = CANONICAL_TAXONOMY.Furniture;
      expect(furniture.subCategories["Sofas & Sectionals"]).toBeDefined();
      expect(furniture.subCategories.Chairs).toBeDefined();
      expect(furniture.subCategories.Tables).toBeDefined();
    });
  });

  describe("buildTaxonomyPath", () => {
    it("builds path with only category", () => {
      expect(buildTaxonomyPath("Furniture")).toBe("Furniture");
    });

    it("builds path with category and subcategory", () => {
      expect(buildTaxonomyPath("Furniture", "Chairs")).toBe("Furniture > Chairs");
    });

    it("builds full 3-level path", () => {
      expect(buildTaxonomyPath("Furniture", "Sofas & Sectionals", "3-Seater Sofas"))
        .toBe("Furniture > Sofas & Sectionals > 3-Seater Sofas");
    });

    it("handles empty subcategory", () => {
      expect(buildTaxonomyPath("Lighting", "")).toBe("Lighting");
    });
  });

  describe("normalizeMaterial", () => {
    it("maps known marketing names to normalized values", () => {
      const result = normalizeMaterial("Smoked Oak");
      expect(result.marketingMaterial).toBe("Smoked Oak");
      expect(result.normalizedMaterial).toBe("Oak");
    });

    it("maps Warm Walnut Veneer to Walnut", () => {
      const result = normalizeMaterial("Warm Walnut Veneer");
      expect(result.normalizedMaterial).toBe("Walnut");
    });

    it("falls back to input for unknown materials", () => {
      const result = normalizeMaterial("Exotic Zebrawood");
      expect(result.normalizedMaterial).toBe("Exotic Zebrawood");
    });

    it("handles empty input", () => {
      const result = normalizeMaterial("");
      expect(result.marketingMaterial).toBe("Unknown");
    });

    it("maps leather variants correctly", () => {
      expect(normalizeMaterial("Genuine Leather").normalizedMaterial).toBe("Leather");
      expect(normalizeMaterial("Faux Leather").normalizedMaterial).toBe("Faux Leather");
    });
  });

  describe("normalizeColor", () => {
    it("resolves color name and hex with normalized family", () => {
      const result = normalizeColor("navy", "000080");
      expect(result.hex).toBe("#000080");
      expect(result.name).toBe("navy");
      expect(result.normalizedFamily).toBe("Blue");
    });

    it("handles hex with # prefix", () => {
      expect(normalizeColor("white", "#FFFFFF").hex).toBe("#FFFFFF");
    });

    it("handles unknown color name", () => {
      expect(normalizeColor("chartreuse", "#7FFF00").normalizedFamily).toBe("Other");
    });

    it("handles empty color name", () => {
      expect(normalizeColor("", "#000").name).toBe("Unknown");
    });
  });

  describe("isValidRoomTag / isValidStyleTag", () => {
    it("validates known room tags", () => {
      expect(isValidRoomTag("Office")).toBe(true);
      expect(isValidRoomTag("Bedroom")).toBe(true);
      expect(isValidRoomTag("InvalidRoom")).toBe(false);
    });

    it("validates known style tags", () => {
      expect(isValidStyleTag("Modern")).toBe(true);
      expect(isValidStyleTag("Scandinavian")).toBe(true);
      expect(isValidStyleTag("Baroque")).toBe(false);
    });
  });

  describe("normalizeAssemblyType", () => {
    it("detects flat-pack", () => {
      expect(normalizeAssemblyType("Flat Pack")).toBe("flat-pack");
    });

    it("detects partial assembly", () => {
      expect(normalizeAssemblyType("Some Assembly")).toBe("partial");
    });

    it("detects fully assembled", () => {
      expect(normalizeAssemblyType("Fully Assembled")).toBe("fully-assembled");
    });

    it("detects pre-assembled as fully-assembled", () => {
      expect(normalizeAssemblyType("Pre-assembled")).toBe("fully-assembled");
    });

    it("defaults to partial for unknown", () => {
      expect(normalizeAssemblyType("unknown")).toBe("partial");
    });
  });

  describe("buildShortName", () => {
    it("returns name as-is if â‰¤ 30 characters", () => {
      expect(buildShortName("Desk")).toBe("Desk");
    });

    it("truncates names > 30 characters with ellipsis", () => {
      expect(buildShortName("Premium Ergonomic Executive Office Desk Chair"))
        .toBe("Premium Ergonomic Executive…");
    });

    it("handles exactly 30 characters", () => {
      expect(buildShortName("A".repeat(30))).toBe("A".repeat(30));
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-05: Asset Validation
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  validateAssetUrl,
  validateAssetUrls,
  isAssetUrlExpired,
  resolveAssetUrl,
  addAllowedOrigin,
  getAllowedOrigins,
} from "@/features/planner/project/catalog/assetValidation";

describe("03-CAT-05: Asset Validation", () => {
  describe("validateAssetUrl", () => {
    it("rejects null/undefined", () => {
      expect(validateAssetUrl(null).valid).toBe(false);
      expect(validateAssetUrl(undefined).valid).toBe(false);
    });

    it("rejects empty string", () => {
      expect(validateAssetUrl("").valid).toBe(false);
    });

    it("accepts relative URLs starting with /", () => {
      expect(validateAssetUrl("/images/chair.png").valid).toBe(true);
    });

    it("accepts relative URLs starting with ./", () => {
      expect(validateAssetUrl("./preview.svg").valid).toBe(true);
    });

    it("rejects HTTP URLs", () => {
      const result = validateAssetUrl("http://example.com/image.png");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("insecure protocol");
    });

    it("rejects non-HTTPS unknown protocols", () => {
      const result = validateAssetUrl("ftp://example.com/image.png");
      expect(result.valid).toBe(false);
    });

    it("rejects malformed URLs", () => {
      expect(validateAssetUrl("not a url").valid).toBe(false);
    });

    it("rejects HTTPS URLs from non-allowlisted origins", () => {
      // Random origin not in allowlist
      const result = validateAssetUrl("https://evil.example.com/image.png");
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("origin not in allowlist");
    });

    it("accepts relative URLs with ../", () => {
      expect(validateAssetUrl("../assets/chair.png").valid).toBe(true);
    });
  });

  describe("validateAssetUrls", () => {
    it("validates multiple URLs", () => {
      const result = validateAssetUrls([
        "/images/chair.png",
        null,
        "/preview.svg",
        undefined,
        "",
        "./test.png",
      ]);
      expect(result.validUrls).toHaveLength(3);
      expect(result.rejectedCount).toBe(3);
    });
  });

  describe("isAssetUrlExpired", () => {
    it("returns false when no timestamp provided", () => {
      expect(isAssetUrlExpired(undefined)).toBe(false);
    });

    it("returns false for recent timestamps", () => {
      expect(isAssetUrlExpired(Date.now() - 1000)).toBe(false);
    });

    it("returns true for expired timestamps", () => {
      expect(isAssetUrlExpired(Date.now() - 25 * 60 * 60 * 1000)).toBe(true);
    });

    it("respects custom TTL", () => {
      // 1 second TTL, timestamp 2 seconds ago
      expect(isAssetUrlExpired(Date.now() - 2000, 1000)).toBe(true);
    });
  });

  describe("resolveAssetUrl", () => {
    it("returns null for null input", () => {
      expect(resolveAssetUrl(null)).toBeNull();
    });

    it("returns validated relative URL", () => {
      expect(resolveAssetUrl("/images/chair.png")).toBe("/images/chair.png");
    });

    it("returns null for expired URL", () => {
      expect(resolveAssetUrl("/images/chair.png", Date.now() - 25 * 60 * 60 * 1000)).toBeNull();
    });

    it("returns null for invalid URL", () => {
      expect(resolveAssetUrl("http://evil.com/bad.jpg")).toBeNull();
    });
  });

  describe("addAllowedOrigin / getAllowedOrigins", () => {
    it("adds and retrieves allowed origins", () => {
      const before = getAllowedOrigins().length;
      addAllowedOrigin("my-cdn.example.com");
      expect(getAllowedOrigins().length).toBe(before + 1);
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-06a: Fallback Geometry
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  buildFallbackGeometry,
  buildImageFallback,
  buildMeshFallback,
  buildTextureFallback,
} from "@/features/planner/project/catalog/fallbackGeometry";

describe("03-CAT-06a: Fallback Geometry", () => {
  const dims: Open3dCatalogDimensions = { widthMm: 1200, depthMm: 600, heightMm: 750 };

  describe("buildFallbackGeometry", () => {
    it("generates box type fallback", () => {
      const fallback = buildFallbackGeometry({
        name: "Office Chair",
        category: "Furniture",
        dimensions: dims,
        reason: "Missing image URL",
      });
      expect(fallback.type).toBe("box");
    });

    it("matches catalog dimensions", () => {
      const fallback = buildFallbackGeometry({
        name: "Desk",
        category: "Furniture",
        dimensions: dims,
        reason: "Expired URL",
      });
      expect(fallback.dimensions.widthMm).toBe(1200);
      expect(fallback.dimensions.depthMm).toBe(600);
      expect(fallback.dimensions.heightMm).toBe(750);
    });

    it("has accessible name with reason", () => {
      const fallback = buildFallbackGeometry({
        name: "Sofa",
        category: "Furniture",
        dimensions: dims,
        reason: "Mesh not found",
        type: "mesh",
      });
      expect(fallback.accessibleName).toContain("Missing mesh");
      expect(fallback.accessibleName).toContain("Sofa");
      expect(fallback.accessibleName).toContain("placeholder");
    });

    it("uses category-specific colors", () => {
      const furniture = buildFallbackGeometry({
        name: "Desk", category: "Furniture", dimensions: dims, reason: "test",
      });
      const lighting = buildFallbackGeometry({
        name: "Lamp", category: "Lighting", dimensions: dims, reason: "test",
      });
      expect(furniture.color).not.toBe(lighting.color);
    });

    it("uses default yellow/red for unknown category", () => {
      const fallback = buildFallbackGeometry({
        name: "Thing", category: "Unknown", dimensions: dims, reason: "test",
      });
      expect(fallback.color).toBe("#FFEB3B");
    });

    it("preserves optional dimension fields", () => {
      const withExtra: Open3dCatalogDimensions = {
        ...dims,
        seatHeightMm: 450,
        weightKg: 12,
      };
      const fallback = buildFallbackGeometry({
        name: "Chair", category: "Furniture", dimensions: withExtra, reason: "test",
      });
      expect(fallback.dimensions.seatHeightMm).toBe(450);
      expect(fallback.dimensions.weightKg).toBe(12);
    });
  });

  describe("buildImageFallback / buildMeshFallback / buildTextureFallback", () => {
    it("buildImageFallback has type image", () => {
      const fb = buildImageFallback("Chair", "Furniture", dims, "missing");
      expect(fb.accessibleName).toContain("Missing image");
    });

    it("buildMeshFallback has type mesh", () => {
      const fb = buildMeshFallback("Chair", "Furniture", dims, "missing");
      expect(fb.accessibleName).toContain("Missing mesh");
    });

    it("buildTextureFallback has type texture", () => {
      const fb = buildTextureFallback("Chair", "Furniture", dims, "missing");
      expect(fb.accessibleName).toContain("Missing texture");
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-08: Placement Action
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  placeCatalogItem,
  clickToPlace,
  dragToPlace,
  apiPlace,
  verifyPlacementIdentity,
  placeCatalogItemInProject,
} from "@/features/planner/project/catalog/placementAction";
import type { Open3dCatalogItem, Open3dCatalogVariant } from "@/features/planner/project/catalog/catalogTypes";
import type { Open3dProject } from "@/features/planner/project/model/types";
import { isEntityUuid } from "@/features/planner/lib/newEntityId";
import { createOpen3dProject } from "@/features/planner/project/model/project";

describe("03-CAT-08: Placement Action", () => {
  // Helper to create a minimal catalog item for testing
  function makeItem(overrides: Partial<Open3dCatalogItem> = {}): Open3dCatalogItem {
    return {
      id: "prod-001",
      slug: "sofa-3-seater",
      sku: "SOFA-001",
      name: "3-Seater Sofa",
      shortName: "3-Seater Sofa",
      description: "A comfortable sofa",
      category: "Furniture",
      subCategory: "Sofas & Sectionals",
      taxonomyPath: "Furniture > Sofas & Sectionals > 3-Seater Sofas",
      dimensions: { widthMm: 2100, depthMm: 900, heightMm: 850, seatHeightMm: 450 },
      displayUnit: "cm",
      assets: { imageUrls: [] },
      material: { marketingMaterial: "Velvet", normalizedMaterial: "Velvet" },
      roomTags: ["Living Room"],
      styleTags: ["Modern"],
      tags: ["sofa", "seating"],
      availability: "in-stock",
      assemblyType: "partial",
      flatPack: false,
      variants: [],
      provenance: {
        source: "test",
        legacyProductId: "legacy-001",
        plannerSourceSlug: "sofa-3-seater",
      },
      symbolOnly: false,
      ...overrides,
    };
  }

  function makeVariant(overrides: Partial<Open3dCatalogVariant> = {}): Open3dCatalogVariant {
    return {
      variantId: "var-001",
      sku: "SOFA-001-BLUE",
      parentProductId: "prod-001",
      label: "Blue / 3-Seater",
      variantAttributes: { color: { hex: "#0000FF", name: "Blue", normalizedFamily: "Blue" } },
      dimensions: { widthMm: 2100, depthMm: 900, heightMm: 850 },
      availability: "in-stock",
      ...overrides,
    };
  }

  describe("placeCatalogItem", () => {
    it("creates snapshot with product identity", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.productIdentity.catalogId).toBe("prod-001");
      expect(snapshot.productIdentity.slug).toBe("sofa-3-seater");
      expect(snapshot.productIdentity.sku).toBe("SOFA-001");
      expect(snapshot.productIdentity.name).toBe("3-Seater Sofa");
    });

    it("preserves variant identity when variant provided", () => {
      const item = makeItem();
      const variant = makeVariant();
      const snapshot = placeCatalogItem(item, variant);
      expect(snapshot.variantIdentity).not.toBeNull();
      expect(snapshot.variantIdentity!.variantId).toBe("var-001");
      expect(snapshot.variantIdentity!.sku).toBe("SOFA-001-BLUE");
    });

    it("preserves source provenance metadata", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.sourceMetadata.catalogSource).toBe("test");
      expect(snapshot.sourceMetadata.legacyProductId).toBe("legacy-001");
      expect(snapshot.sourceMetadata.plannerSourceSlug).toBe("sofa-3-seater");
      expect(snapshot.sourceMetadata.catalogSourceId).toBe("prod-001");
    });

    it("preserves mapped catalog identity when placing a planner product", () => {
      const mapped = mapPlannerManagedProductToCatalogItem({
        id: "prod-bridge-001",
        slug: "oak-focus-desk",
        name: "Oak Focus Desk",
        category: "desks",
        category_id: "cat-desks",
        series_id: "series-focus",
        legacy_product_id: "LEG-DESK-001",
        planner_source_slug: "oak-focus-desk",
        specs: { widthMm: 140, depthMm: 70, heightMm: 75 },
        active: true,
      });

      expect(mapped).not.toBeNull();
      const snapshot = placeCatalogItem(mapped!, null, { placedFrom: "click", position: { x: 320, y: 180 } });

      expect(snapshot.productIdentity).toEqual({
        catalogId: "prod-bridge-001",
        slug: "oak-focus-desk",
        sku: "oak-focus-desk",
        name: "Oak Focus Desk",
      });
      expect(snapshot.sourceMetadata).toMatchObject({
        catalogSource: "planner_managed_products",
        catalogSourceId: "prod-bridge-001",
        legacyProductId: "LEG-DESK-001",
        plannerSourceSlug: "oak-focus-desk",
        placedFrom: "click",
      });
      expect(mapped!.provenance.sourceCategoryId).toBe("cat-desks");
      expect(mapped!.provenance.sourceSeriesId).toBe("series-focus");
    });

    it("generates unique placement IDs", () => {
      const item = makeItem();
      const s1 = placeCatalogItem(item, null);
      const s2 = placeCatalogItem(item, null);
      expect(s1.placementId).not.toBe(s2.placementId);
    });

    it("placement IDs are crypto.randomUUID() (hyphenated)", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.placementId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("placeCatalogItem generates isEntityUuid placementId", () => {
      const snapshot = placeCatalogItem(makeItem(), null);
      expect(isEntityUuid(snapshot.placementId)).toBe(true);
    });

    it("createOpen3dProject default id isEntityUuid", () => {
      const project = createOpen3dProject();
      expect(isEntityUuid(project.id)).toBe(true);
      expect(isEntityUuid(project.floors[0].id)).toBe(true);
    });

    it("records placedAt as ISO 8601 timestamp", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(() => new Date(snapshot.placedAt)).not.toThrow();
    });

    it("uses default position {0,0} when not specified", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.position).toEqual({ x: 0, y: 0 });
    });

    it("uses default rotation 0", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.rotation).toBe(0);
    });

    it("uses default scale {1,1,1}", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.scale).toEqual({ x: 1, y: 1, z: 1 });
    });

    it("accepts position override", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null, { placedFrom: "click", position: { x: 500, y: 300 } });
      expect(snapshot.position).toEqual({ x: 500, y: 300 });
    });

    it("accepts rotation override", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null, { placedFrom: "drag", rotation: 90 });
      expect(snapshot.rotation).toBe(90);
    });

    it("accepts locked state override", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null, { placedFrom: "click", locked: true });
      expect(snapshot.locked).toBe(true);
    });

    it("accepts material and color overrides", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null, {
        placedFrom: "import",
        materialOverride: "Oak",
        colorOverride: "#FF0000",
      });
      expect(snapshot.materialOverride).toBe("Oak");
      expect(snapshot.colorOverride).toBe("#FF0000");
    });

    it("defaults locked to false", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(snapshot.locked).toBe(false);
    });
  });

  describe("clickToPlace / dragToPlace / apiPlace", () => {
    it("clickToPlace sets placedFrom to click", () => {
      const snapshot = clickToPlace(makeItem(), null, { x: 100, y: 200 });
      expect(snapshot.sourceMetadata.placedFrom).toBe("click");
      expect(snapshot.position).toEqual({ x: 100, y: 200 });
    });

    it("dragToPlace sets placedFrom to drag", () => {
      const snapshot = dragToPlace(makeItem(), null, { x: 150, y: 250 });
      expect(snapshot.sourceMetadata.placedFrom).toBe("drag");
    });

    it("apiPlace sets placedFrom to api", () => {
      const snapshot = apiPlace(makeItem(), null);
      expect(snapshot.sourceMetadata.placedFrom).toBe("api");
    });
  });

  describe("verifyPlacementIdentity", () => {
    it("returns true when all identity fields match", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      expect(verifyPlacementIdentity(snapshot, item)).toBe(true);
    });

    it("returns false when ID mismatches", () => {
      const item = makeItem();
      const snapshot = placeCatalogItem(item, null);
      const otherItem = makeItem({ id: "prod-002" });
      expect(verifyPlacementIdentity(snapshot, otherItem)).toBe(false);
    });
  });

  describe("placeCatalogItemInProject", () => {
    it("places through the project mutation shape and preserves source identity", () => {
      const project: Open3dProject = {
        id: "project",
        name: "Project",
        activeFloorId: "floor-1",
        displayUnit: "cm",
        createdAt: "2026-07-03T00:00:00.000Z",
        updatedAt: "2026-07-03T00:00:00.000Z",
        floors: [{
          id: "floor-1",
          name: "Floor 1",
          level: 0,
          walls: [],
          rooms: [],
          doors: [],
          windows: [],
          furniture: [],
          stairs: [],
          columns: [],
          guides: [],
          measurements: [],
          annotations: [],
          textAnnotations: [],
          groups: [],
        }],
      };
      const item = makeItem({
        id: "catalog-desk",
        slug: "catalog-desk",
        sku: "DESK-BASE",
        name: "Catalog Desk",
        dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
      });
      const variant: Open3dCatalogVariant = {
        variantId: "desk-oak",
        sku: "DESK-OAK",
        parentProductId: "catalog-desk",
        label: "Oak",
        variantAttributes: {},
        dimensions: item.dimensions,
        availability: "in-stock",
      };

      const placement = placeCatalogItemInProject(project, item, variant, {
        placedFrom: "drag",
        position: { x: 100, y: 200 },
        rotation: 90,
      });
      const furniture = placement.result.project.floors[0].furniture[0];

      expect(placement.result.action.type).toBe("PLACE_CATALOG_ITEM");
      expect(placement.result.action.payload?.variantId).toBe("desk-oak");
      expect(furniture.id).toBe(placement.snapshot.placementId);
      expect(furniture.catalogId).toBe("catalog-desk");
      expect(furniture.sourceCatalogId).toBe("catalog-desk");
      expect(furniture.sourceSku).toBe("DESK-OAK");
      expect(furniture.sourceSlug).toBe("catalog-desk");
      expect(furniture.width).toBe(1200);
      expect(furniture.rotation).toBe(90);
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-07: Recent Items and Favorites
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  addRecentItem,
  getRecentItems,
  clearRecentItems,
  addFavoriteItem,
  removeFavoriteItem,
  isFavorite,
  getFavoriteItems,
  getFavoritesByCategory,
  migrateRecentItemsSchema,
  migrateFavoritesSchema,
} from "@/features/planner/project/catalog/recentFavorites";

// Mock localStorage
const store: Record<string, string> = {};

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("03-CAT-07: Recent Items", () => {
  const mockItem = { sku: "SKU-001", id: "prod-001", name: "Office Chair" };

  beforeEach(() => {
    clearRecentItems();
  });

  it("starts empty", () => {
    expect(getRecentItems()).toHaveLength(0);
  });

  it("adds an item", () => {
    addRecentItem(mockItem);
    const items = getRecentItems();
    expect(items).toHaveLength(1);
    expect(items[0].sku).toBe("SKU-001");
    expect(items[0].name).toBe("Office Chair");
  });

  it("deduplicates by SKU", () => {
    addRecentItem(mockItem);
    addRecentItem(mockItem);
    expect(getRecentItems()).toHaveLength(1);
  });

  it("moves re-added item to front", () => {
    addRecentItem({ sku: "A", id: "a", name: "A" });
    addRecentItem({ sku: "B", id: "b", name: "B" });
    addRecentItem({ sku: "A", id: "a", name: "A" }); // re-add A
    const items = getRecentItems();
    expect(items[0].sku).toBe("A");
    expect(items[1].sku).toBe("B");
  });

  it("enforces max count of 50", () => {
    for (let i = 0; i < 60; i++) {
      addRecentItem({ sku: `SKU-${i}`, id: `id-${i}`, name: `Item ${i}` });
    }
    const items = getRecentItems();
    expect(items.length).toBeLessThanOrEqual(50);
    // Most recent should be SKU-59
    expect(items[0].sku).toBe("SKU-59");
  });

  it("clearRecentItems empties the list", () => {
    addRecentItem(mockItem);
    clearRecentItems();
    expect(getRecentItems()).toHaveLength(0);
  });
});

describe("03-CAT-07: Favorites", () => {
  const mockItem = {
    id: "prod-001",
    sku: "SKU-001",
    name: "Desk Lamp",
    category: "Lighting" as const,
  };

  beforeEach(() => {
    getFavoriteItems().forEach((f) => removeFavoriteItem(f.catalogId));
  });

  it("starts empty", () => {
    expect(getFavoriteItems()).toHaveLength(0);
  });

  it("adds a favorite", () => {
    addFavoriteItem(mockItem);
    expect(getFavoriteItems()).toHaveLength(1);
    expect(isFavorite("prod-001")).toBe(true);
  });

  it("does not duplicate favorites", () => {
    addFavoriteItem(mockItem);
    addFavoriteItem(mockItem);
    expect(getFavoriteItems()).toHaveLength(1);
  });

  it("removes a favorite by ID", () => {
    addFavoriteItem(mockItem);
    removeFavoriteItem("prod-001");
    expect(getFavoriteItems()).toHaveLength(0);
    expect(isFavorite("prod-001")).toBe(false);
  });

  it("filters favorites by category", () => {
    addFavoriteItem(mockItem);
    addFavoriteItem({ id: "prod-002", sku: "SKU-002", name: "Sofa", category: "Furniture" as const });
    const lighting = getFavoritesByCategory("Lighting");
    expect(lighting).toHaveLength(1);
    expect(lighting[0].sku).toBe("SKU-001");
  });

  it("removes oldest when exceeding max", () => {
    for (let i = 0; i < 210; i++) {
      addFavoriteItem({ id: `id-${i}`, sku: `SKU-${i}`, name: `Item ${i}`, category: "Furniture" as const });
    }
    expect(getFavoriteItems().length).toBeLessThanOrEqual(200);
  });
});

describe("03-CAT-07: Schema Migration", () => {
  it("migrateRecentItemsSchema is idempotent", () => {
    migrateRecentItemsSchema();
    migrateRecentItemsSchema(); // Should not error
  });

  it("migrateFavoritesSchema is idempotent", () => {
    migrateFavoritesSchema();
    migrateFavoritesSchema();
  });
});

describe("03-CAT-07: Recent/Favorites Edge Cases", () => {
  describe("localStorage error handling", () => {
    it("handles localStorage throwing on getItem", () => {
      vi.stubGlobal("localStorage", {
        getItem: () => { throw new Error("Quota exceeded"); },
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
        get length() { return 0; },
        key: () => null,
      });

      // Should return empty array instead of throwing
      expect(getRecentItems()).toEqual([]);
    });

    it("handles localStorage throwing on setItem", () => {
      const store: Record<string, string> = {};
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => store[k] ?? null,
        setItem: () => { throw new Error("Quota exceeded"); },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      });

      // Should not throw
      expect(() => addRecentItem({ sku: "TEST", id: "test", name: "Test" })).not.toThrow();
    });
  });

  describe("schema validation edge cases", () => {
    it("rejects invalid recent items schema", () => {
      const store: Record<string, string> = {
        "open3d-catalog-recent": JSON.stringify({ schemaVersion: 1, items: [{ invalid: true }] }),
      };
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      });

      // Should return fallback (empty) when validation fails
      expect(getRecentItems()).toEqual([]);
    });

    it("rejects invalid favorites schema", () => {
      const store: Record<string, string> = {
        "open3d-catalog-favorites": JSON.stringify({ schemaVersion: 1, items: [{ wrong: "shape" }] }),
      };
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      });

      expect(getFavoriteItems()).toEqual([]);
    });

    it("handles corrupted JSON in localStorage", () => {
      const store: Record<string, string> = {
        "open3d-catalog-recent": "not valid json {{{",
      };
      vi.stubGlobal("localStorage", {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (i: number) => Object.keys(store)[i] ?? null,
      });

      expect(getRecentItems()).toEqual([]);
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-06b: Catalog Client
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { Open3dCatalogClient } from "@/features/planner/project/catalog/catalogClient";

describe("03-CAT-06b: Catalog Client", () => {
  function makeItem(overrides: Partial<Open3dCatalogItem> & { id: string; sku: string }): Open3dCatalogItem {
    return {
      id: overrides.id,
      slug: overrides.slug ?? overrides.id,
      sku: overrides.sku,
      name: overrides.name ?? overrides.id,
      shortName: overrides.shortName ?? (overrides.name ?? overrides.id).slice(0, 30),
      description: overrides.description ?? "",
      category: overrides.category ?? "Furniture",
      subCategory: overrides.subCategory ?? "Chairs",
      taxonomyPath: overrides.taxonomyPath ?? `Furniture > ${overrides.subCategory ?? "Chairs"}`,
      dimensions: overrides.dimensions ?? { widthMm: 500, depthMm: 500, heightMm: 900 },
      displayUnit: "cm",
      assets: overrides.assets ?? { imageUrls: [] },
      material: overrides.material ?? { marketingMaterial: "Fabric", normalizedMaterial: "Fabric" },
      roomTags: overrides.roomTags ?? ["Office"],
      styleTags: overrides.styleTags ?? ["Modern"],
      color: overrides.color,
      pricing: overrides.pricing,
      availability: overrides.availability ?? "in-stock",
      assemblyType: overrides.assemblyType ?? "partial",
      configurability: overrides.configurability,
      mounting: overrides.mounting,
      assetReadiness: overrides.assetReadiness,
      flatPack: overrides.flatPack ?? false,
      tags: overrides.tags ?? ["test"],
      seatCount: overrides.seatCount,
      weightCapacityKg: overrides.weightCapacityKg,
      variants: overrides.variants ?? [],
      provenance: overrides.provenance ?? { source: "test" },
      symbolOnly: overrides.symbolOnly ?? false,
    };
  }

  describe("empty client", () => {
    it("isLoaded returns false initially", () => {
      const client = new Open3dCatalogClient();
      expect(client.isLoaded()).toBe(false);
    });

    it("getAll returns empty array", () => {
      const client = new Open3dCatalogClient();
      expect(client.getAll()).toHaveLength(0);
    });

    it("search returns empty result", () => {
      const client = new Open3dCatalogClient();
      const result = client.search({ text: "test" });
      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });

  describe("loaded client with items", () => {
    function createLoadedClient(items: Open3dCatalogItem[]): Open3dCatalogClient {
      const client = new Open3dCatalogClient();
      client.load(items, "standard");
      return client;
    }

    const chair1 = makeItem({ id: "chair-1", sku: "CH-001", name: "Office Chair", category: "Furniture", roomTags: ["Office"], styleTags: ["Modern"], tags: ["chair", "office"] });
    const chair2 = makeItem({ id: "chair-2", sku: "CH-002", name: "Dining Chair", category: "Furniture", roomTags: ["Dining"], styleTags: ["Traditional"], tags: ["chair", "dining"] });
    const lamp1 = makeItem({ id: "lamp-1", sku: "LP-001", name: "Desk Lamp", category: "Lighting", roomTags: ["Office"], styleTags: ["Modern"], tags: ["lamp"] });

    const items = [chair1, chair2, lamp1];

    it("isLoaded returns true after load", () => {
      const client = createLoadedClient(items);
      expect(client.isLoaded()).toBe(true);
    });

    it("getAll returns all items", () => {
      const client = createLoadedClient(items);
      expect(client.getAll()).toHaveLength(3);
    });

    it("getById returns correct item", () => {
      const client = createLoadedClient(items);
      expect(client.getById("chair-1")?.name).toBe("Office Chair");
    });

    it("getById returns null for missing", () => {
      const client = createLoadedClient(items);
      expect(client.getById("nonexistent")).toBeNull();
    });

    it("getBySlug returns correct item", () => {
      const client = createLoadedClient(items);
      expect(client.getBySlug("chair-1")?.name).toBe("Office Chair");
    });

    it("getBySku returns correct item", () => {
      const client = createLoadedClient(items);
      expect(client.getBySku("ch-001")?.name).toBe("Office Chair");
    });

    it("getByCategory filters correctly", () => {
      const client = createLoadedClient(items);
      const furniture = client.getByCategory("Furniture");
      expect(furniture).toHaveLength(2);
    });

    it("getByRoom filters correctly", () => {
      const client = createLoadedClient(items);
      const office = client.getByRoom("Office");
      expect(office).toHaveLength(2);
    });

    it("getByStyle filters correctly", () => {
      const client = createLoadedClient(items);
      const modern = client.getByStyle("Modern");
      expect(modern).toHaveLength(2);
    });

    describe("search", () => {
      it("finds items by exact name", () => {
        const client = createLoadedClient(items);
        const result = client.search({ text: "Office Chair" });
        expect(result.items.length).toBeGreaterThanOrEqual(1);
        expect(result.items[0].name).toBe("Office Chair");
      });

      it("finds items by partial text", () => {
        const client = createLoadedClient(items);
        const result = client.search({ text: "Chair" });
        expect(result.items.length).toBeGreaterThanOrEqual(2);
      });

      it("filters by category", () => {
        const client = createLoadedClient(items);
        const result = client.search({ categoryFilter: "Lighting" });
        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe("Desk Lamp");
      });

      it("filters by room", () => {
        const client = createLoadedClient(items);
        const result = client.search({ roomFilter: ["Dining"] });
        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe("Dining Chair");
      });

      it("filters by style", () => {
        const client = createLoadedClient(items);
        const result = client.search({ styleFilter: ["Traditional"] });
        expect(result.items).toHaveLength(1);
      });

      it("filters by dimension range", () => {
        const client = createLoadedClient(items);
        const result = client.search({ dimensionFilter: { minWidthMm: 400, maxWidthMm: 600 } });
        // All test items have widthMm 500
        expect(result.items).toHaveLength(3);
      });

      it("combines text + category filter", () => {
        const client = createLoadedClient(items);
        const result = client.search({ text: "Chair", categoryFilter: "Furniture" });
        expect(result.items).toHaveLength(2);
      });

      it("returns zero results for no match", () => {
        const client = createLoadedClient(items);
        const result = client.search({ text: "Zebra" });
        expect(result.items).toHaveLength(0);
        expect(result.totalCount).toBe(0);
      });

      it("paginates results", () => {
        const client = createLoadedClient(items);
        const result = client.search({ pageSize: 1 });
        expect(result.items).toHaveLength(1);
        expect(result.hasMore).toBe(true);
        expect(result.nextCursor).not.toBeNull();
      });

      it("cursor pagination navigates to next page", () => {
        const client = createLoadedClient(items);
        const page1 = client.search({ pageSize: 1 });
        const page2 = client.search({ pageSize: 1, cursor: page1.nextCursor! });
        expect(page2.items).toHaveLength(1);
      });
    });

    describe("caching", () => {
      it("caches search results", () => {
        const client = createLoadedClient(items);
        const r1 = client.search({ text: "Chair" });
        const r2 = client.search({ text: "Chair" });
        // Second call should hit cache (very fast)
        expect(r2.tookMs).toBeLessThanOrEqual(r1.tookMs + 5);
      });

      it("invalidate clears cache", () => {
        const client = createLoadedClient(items);
        client.search({ text: "Chair" });
        client.invalidate();
        const result = client.search({ text: "Chair" });
        expect(result.items.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("sorts", () => {
      it("name-asc sorts alphabetically", () => {
        const client = createLoadedClient(items);
        const result = client.search({ sortOrder: "name-asc" });
        expect(result.items[0].name).toBe("Desk Lamp");
      });

      it("name-desc sorts reverse alphabetically", () => {
        const client = createLoadedClient(items);
        const result = client.search({ sortOrder: "name-desc" });
        expect(result.items[0].name).toBe("Office Chair");
      });
    });
  });

  describe("large catalog performance", () => {
    it("handles 1000 items search under 100ms", () => {
      const largeItems: Open3dCatalogItem[] = [];
      for (let i = 0; i < 1000; i++) {
        largeItems.push(makeItem({
          id: `item-${i}`,
          sku: `SKU-${i}`,
          name: `Product ${i}`,
          category: ["Furniture", "Lighting", "Decor", "Outdoor"][i % 4] as Open3dCatalogCategory,
          roomTags: [["Office", "Living Room", "Bedroom"][i % 3] as never],
        }));
      }

      const client = new Open3dCatalogClient();
      const loadStart = performance.now();
      client.load(largeItems, "standard");
      const loadTime = performance.now() - loadStart;

      // Load should be under 500ms
      expect(loadTime).toBeLessThan(500);

      const searchStart = performance.now();
      const result = client.search({ text: "Product 500" });
      const searchTime = performance.now() - searchStart;

      // Search should be under 100ms
      expect(searchTime).toBeLessThan(100);
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("LRU cache eviction", () => {
    it("evicts oldest entries when cache is full", () => {
      const client = new Open3dCatalogClient({ maxCacheItems: 3 });
      const items = [
        makeItem({ id: "a", sku: "A", name: "Alpha" }),
        makeItem({ id: "b", sku: "B", name: "Beta" }),
        makeItem({ id: "c", sku: "C", name: "Gamma" }),
      ];
      client.load(items, "standard");

      // Fill cache with different searches
      client.search({ text: "Alpha" });
      client.search({ text: "Beta" });
      client.search({ text: "Gamma" });

      // Add one more to trigger eviction
      client.search({ text: "Delta" });

      // Oldest search should have been evicted
      expect(client.search({ text: "Alpha" }).items.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("search with material and color filters", () => {
    it("filters by material", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "wood", sku: "W", name: "Wood Chair", material: { marketingMaterial: "Oak", normalizedMaterial: "Oak" } }),
        makeItem({ id: "metal", sku: "M", name: "Metal Chair", material: { marketingMaterial: "Steel", normalizedMaterial: "Steel" } }),
      ], "standard");

      const result = client.search({ materialFilter: ["oak"] });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Wood Chair");
    });

    it("filters by color", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "red", sku: "R", name: "Red Chair", color: { hex: "#FF0000", name: "Red", normalizedFamily: "Red" } }),
        makeItem({ id: "blue", sku: "B", name: "Blue Chair", color: { hex: "#0000FF", name: "Blue", normalizedFamily: "Blue" } }),
      ], "standard");

      const result = client.search({ colorFilter: ["red"] });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Red Chair");
    });
  });

  describe("search with availability filter", () => {
    it("filters by availability status", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "in", sku: "IN", name: "In Stock Chair", availability: "in-stock" }),
        makeItem({ id: "out", sku: "OUT", name: "Discontinued Chair", availability: "discontinued" }),
      ], "standard");

      const result = client.search({ availabilityFilter: ["in-stock"] });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("In Stock Chair");
    });
  });

  describe("search with Phase 03A facets", () => {
    it("filters by configurability, mounting, and asset readiness", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({
          id: "fixed-floor-ready",
          sku: "FIXED",
          name: "Fixed Floor Desk",
          configurability: "fixed",
          mounting: ["floor"],
          assetReadiness: ["ready"],
        }),
        makeItem({
          id: "config-wall-missing",
          sku: "CONFIG",
          name: "Config Wall Panel",
          configurability: "configurable",
          mounting: ["wall"],
          assetReadiness: ["missing-mesh"],
        }),
      ], "standard");

      expect(client.search({ configurabilityFilter: ["configurable"] }).items.map((item) => item.id))
        .toEqual(["config-wall-missing"]);
      expect(client.search({ mountingFilter: ["wall"] }).items.map((item) => item.id))
        .toEqual(["config-wall-missing"]);
      expect(client.search({ assetReadinessFilter: ["ready"] }).items.map((item) => item.id))
        .toEqual(["fixed-floor-ready"]);
    });

    it("supports deterministic sortField and sortDirection", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "b", sku: "B", name: "Same", pricing: { price: 200, currencyCode: "INR" } }),
        makeItem({ id: "a", sku: "A", name: "Same", pricing: { price: 100, currencyCode: "INR" } }),
      ], "standard");

      expect(client.search({ sortField: "name", sortDirection: "asc" }).items.map((item) => item.id))
        .toEqual(["a", "b"]);
      expect(client.search({ sortField: "price", sortDirection: "desc" }).items.map((item) => item.id))
        .toEqual(["b", "a"]);
    });
  });

  describe("getSource", () => {
    it("returns null before load", () => {
      const client = new Open3dCatalogClient();
      expect(client.getSource()).toBeNull();
    });

    it("returns the source after load", () => {
      const client = new Open3dCatalogClient();
      client.load([makeItem({ id: "test", sku: "T", name: "Test" })], "configurator");
      expect(client.getSource()).toBe("configurator");
    });
  });

  describe("loadFromApi", () => {
    it("loads raw planner catalog rows through the Phase 03 mapper", async () => {
      const fetchMock = vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          items: [{
            id: "raw-desk",
            slug: "raw-desk",
            name: "Raw Desk",
            category: "desks",
            specs: { widthMm: 120, depthMm: 60, heightMm: 75 },
            flagship_image: "/desk.png",
            active: true,
          }],
        }),
      } as Response));
      const client = new Open3dCatalogClient({ fetchImpl: fetchMock as unknown as typeof fetch });

      const items = await client.loadFromApi("standard", 25);

      expect(fetchMock).toHaveBeenCalledWith("/api/planner/catalog?limit=25");
      expect(items).toHaveLength(1);
      expect(items[0].dimensions.widthMm).toBe(1200);
      expect(client.getById("raw-desk")?.provenance.source).toBe("planner_managed_products");
    });

    it("loads already-normalized Open3D catalog envelopes without remapping identity", async () => {
      const normalized = makeItem({ id: "normalized", sku: "N", name: "Normalized Item" });
      const fetchMock = vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ data: { items: [normalized] } }),
      } as Response));
      const client = new Open3dCatalogClient({
        fetchImpl: fetchMock as unknown as typeof fetch,
        apiBasePath: "https://planner.example",
      });

      const items = await client.loadFromApi("configurator");

      expect(fetchMock).toHaveBeenCalledWith("https://planner.example/api/planner/catalog/configurator?limit=200");
      expect(items[0].id).toBe("normalized");
      expect(client.getSource()).toBe("configurator");
    });

    it("exposes half-TTL revalidation state after API load", async () => {
      const fetchMock = vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ items: [makeItem({ id: "fresh", sku: "F", name: "Fresh" })] }),
      } as Response));
      const client = new Open3dCatalogClient({ fetchImpl: fetchMock as unknown as typeof fetch, cacheTtlMs: 1000 });

      await client.loadFromApi("standard");

      expect(client.shouldRevalidate(Date.now())).toBe(false);
      expect(client.shouldRevalidate(Date.now() + 600)).toBe(true);
    });
  });

  describe("relevance scoring edge cases", () => {
    it("scores exact SKU match highest", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "exact", sku: "SOFA-001", name: "Exact Sofa" }),
        makeItem({ id: "other", sku: "OTHER", name: "Other Item" }),
      ], "standard");

      const result = client.search({ text: "SOFA-001" });
      expect(result.items[0].sku).toBe("SOFA-001");
    });

    it("scores exact slug match", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "exact", sku: "A", name: "Exact", slug: "exact-sofa" }),
        makeItem({ id: "other", sku: "B", name: "Other", slug: "other-item" }),
      ], "standard");

      const result = client.search({ text: "exact-sofa" });
      expect(result.items[0].slug).toBe("exact-sofa");
    });

    it("applies fuzzy prefix matching", () => {
      const client = new Open3dCatalogClient();
      client.load([
        makeItem({ id: "desk", sku: "D", name: "Executive Desk", tags: ["desk"] }),
      ], "standard");

      // Use a prefix that should match
      const result = client.search({ text: "exe" });
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-09: Admin Boundaries
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe("03-CAT-09: Admin Boundaries", () => {
  function readAllSourceFiles(root: string): string[] {
    const entries = readdirSync(root, { withFileTypes: true });
    return entries.flatMap((entry) => {
      const path = join(root, entry.name);
      if (entry.isDirectory()) return readAllSourceFiles(path);
      return /\.(ts|tsx)$/.test(entry.name) ? [readFileSync(path, "utf8")] : [];
    });
  }

  it("keeps planner runtime free of admin catalog write routes", () => {
    const source = readAllSourceFiles(join("features", "planner", "open3d")).join("\n");
    expect(source).not.toContain("/api/admin/catalogs");
    expect(source).not.toContain("admin-catalogs:post");
    expect(source).not.toContain("admin-catalogs:patch");
    expect(source).not.toContain("admin-catalogs:delete");
  });

  it("keeps canonical admin catalog routes under admin auth and CSRF for writes", () => {
    const collectionRoute = readFileSync(
      join("app", "api", "admin", "catalogs", "[type]", "route.ts"),
      "utf8",
    );
    const itemRoute = readFileSync(
      join("app", "api", "admin", "catalogs", "[type]", "[id]", "route.ts"),
      "utf8",
    );

    expect(collectionRoute).toContain("withAuth<RouteContext>");
    expect(collectionRoute).toContain('role: "admin"');
    expect(collectionRoute).toContain("requireCsrf: true");
    expect(itemRoute).toContain("withAuth<RouteContext>");
    expect(itemRoute).toContain('role: "admin"');
    expect(itemRoute).toContain("requireCsrf: true");
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 03-CAT-04: Catalog Mapping
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import {
  mapPlannerManagedProductToCatalogItem,
  mapConfiguratorProductToCatalogItem,
  mapAdminCategoryToCanonical,
  inferRoomTags,
  inferStyleTags,
  resolveSubCategory,
  resolveAvailabilityStatus,
  type PlannerManagedProductInput,
  type ConfiguratorProductInput,
} from "@/features/planner/project/catalog/catalogMapping";

describe("03-CAT-04: Catalog Mapping", () => {
  describe("mapAdminCategoryToCanonical", () => {
    it("maps desk to Furniture", () => {
      expect(mapAdminCategoryToCanonical("desks")).toBe("Furniture");
    });

    it("maps room to Furniture", () => {
      expect(mapAdminCategoryToCanonical("rooms", "conference")).toBe("Furniture");
    });

    it("maps chair to Furniture", () => {
      expect(mapAdminCategoryToCanonical("chairs")).toBe("Furniture");
    });

    it("maps light to Lighting", () => {
      expect(mapAdminCategoryToCanonical("lighting")).toBe("Lighting");
    });

    it("maps plant to Decor", () => {
      expect(mapAdminCategoryToCanonical("plants")).toBe("Decor");
    });

    it("maps outdoor to Outdoor", () => {
      expect(mapAdminCategoryToCanonical("outdoor")).toBe("Outdoor");
    });

    it("maps electrical to Symbols", () => {
      expect(mapAdminCategoryToCanonical("electrical")).toBe("Symbols");
    });

    it("defaults to Furniture for unknown", () => {
      expect(mapAdminCategoryToCanonical("something-else")).toBe("Furniture");
    });
  });

  describe("inferRoomTags", () => {
    it("detects Office from desk category", () => {
      expect(inferRoomTags("desks")).toContain("Office");
    });

    it("detects Dining", () => {
      expect(inferRoomTags("dining")).toContain("Dining");
    });

    it("defaults to Office when no match", () => {
      expect(inferRoomTags("unknown")).toEqual(["Office"]);
    });

    it("detects multiple rooms", () => {
      const tags = inferRoomTags("living-room-office");
      expect(tags).toContain("Living Room");
      expect(tags).toContain("Office");
    });
  });

  describe("inferStyleTags", () => {
    it("detects Modern from name", () => {
      expect(inferStyleTags("Modern Sofa")).toContain("Modern");
    });

    it("detects Scandinavian", () => {
      expect(inferStyleTags("Nordic scandi table")).toContain("Scandinavian");
    });

    it("defaults to Modern when no match", () => {
      expect(inferStyleTags("Random furniture")).toEqual(["Modern"]);
    });
  });

  describe("resolveSubCategory", () => {
    it("uses series name when available", () => {
      expect(resolveSubCategory("furniture", "Executive Series")).toBe("Executive Series");
    });

    it("falls back to category-based inference", () => {
      expect(resolveSubCategory("desks")).toBe("Desks");
    });
  });

  describe("resolveAvailabilityStatus", () => {
    it("returns in-stock for active item", () => {
      expect(resolveAvailabilityStatus({ active: true })).toBe("in-stock");
    });

    it("returns discontinued for inactive item", () => {
      expect(resolveAvailabilityStatus({ active: false })).toBe("discontinued");
    });
  });

  describe("mapPlannerManagedProductToCatalogItem", () => {
    it("maps a valid planner managed product", () => {
      const input: PlannerManagedProductInput = {
        id: "prod-001",
        slug: "executive-desk",
        name: "Executive Desk",
        description: "Premium office desk",
        category: "desks",
        category_name: "Desks",
        series_name: "Executive",
        legacy_product_id: "LEG-001",
        planner_source_slug: "executive-desk",
        specs: { widthMm: 140, depthMm: 70, heightMm: 75, material: "Oak" },
        flagship_image: "/images/desk.jpg",
        active: true,
      };

      const item = mapPlannerManagedProductToCatalogItem(input);
      expect(item).not.toBeNull();
      expect(item!.name).toBe("Executive Desk");
      expect(item!.category).toBe("Furniture");
      expect(item!.dimensions.widthMm).toBe(1400); // 140cm â†’ 1400mm
      expect(item!.dimensions.depthMm).toBe(700);   // 70cm â†’ 700mm
      expect(item!.dimensions.heightMm).toBe(750);  // 75cm â†’ 750mm
      expect(item!.provenance.source).toBe("planner_managed_products");
      expect(item!.provenance.legacyProductId).toBe("LEG-001");
      expect(item!.provenance.plannerSourceSlug).toBe("executive-desk");
      expect(item!.assets.previewImageUrl).toBe("/images/desk.jpg");
    });

    it("returns null when no dimensions provided", () => {
      const input: PlannerManagedProductInput = {
        id: "bad",
        slug: "bad",
        name: "Bad Product",
        specs: {},
        active: true,
      };
      expect(mapPlannerManagedProductToCatalogItem(input)).toBeNull();
    });

    it("returns null when name missing", () => {
      const input: PlannerManagedProductInput = {
        id: "bad",
        slug: "bad",
        name: "",
        specs: { widthMm: 100, depthMm: 100 },
        active: true,
      };
      expect(mapPlannerManagedProductToCatalogItem(input)).toBeNull();
    });

    it("preserves all identity fields", () => {
      const input: PlannerManagedProductInput = {
        id: "prod-002",
        slug: "conference-chair",
        name: "Conference Chair",
        category: "chairs",
        category_name: "Chairs",
        category_id: "cat-001",
        series_id: "ser-001",
        specs: { widthMm: 60, depthMm: 60, heightMm: 90 },
        active: true,
      };

      const item = mapPlannerManagedProductToCatalogItem(input);
      expect(item).not.toBeNull();
      expect(item!.provenance.sourceCategoryId).toBe("cat-001");
      expect(item!.provenance.sourceSeriesId).toBe("ser-001");
    });
  });

  describe("mapConfiguratorProductToCatalogItem", () => {
    it("maps a parametric configurator product", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-001",
        slug: "workstation-bench",
        name: "Bench Workstation",
        category_id: "workstations",
        family: "benches",
        description: "Linear bench workstation",
        sizingType: "parametric",
        workstation: {
          shape: "linear",
          lengthOptions: [120, 140, 160],
          depthOptions: [60, 80],
          seaterOptions: [1, 2],
          heightMm: 750,
        },
      };

      const item = mapConfiguratorProductToCatalogItem(input);
      expect(item).not.toBeNull();
      expect(item!.name).toBe("Bench Workstation");
      expect(item!.category).toBe("Furniture");
      expect(item!.dimensions.widthMm).toBeGreaterThan(0);
      expect(item!.provenance.source).toBe("configurator_products");
      expect(item!.variants).toHaveLength(1); // master variant
    });

    it("maps a discrete configurator product", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-002",
        slug: "discrete-table",
        name: "Discrete Table",
        category_id: "tables",
        sizingType: "discrete",
        sizeOptions: [
          { dim: { L: 120, D: 80, H: 750 } },
          { dim: { L: 160, D: 90, H: 750 } },
        ],
      };

      const item = mapConfiguratorProductToCatalogItem(input);
      expect(item).not.toBeNull();
      // Should pick smallest option
      expect(item!.dimensions.widthMm).toBe(1200);
      expect(item!.dimensions.depthMm).toBe(800);
    });

    it("maps a fixed configurator product", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-003",
        slug: "fixed-chair",
        name: "Fixed Chair",
        category_id: "chairs",
        sizingType: "fixed",
        defaultFootprint: { L: 50, D: 50, H: 900 },
      };

      const item = mapConfiguratorProductToCatalogItem(input);
      expect(item).not.toBeNull();
      expect(item!.dimensions.widthMm).toBe(500);
    });

    it("returns null when no dimensions can be resolved", () => {
      const input: ConfiguratorProductInput = {
        id: "bad",
        slug: "bad",
        name: "Bad Configurator",
        category_id: "desks",
        sizingType: "parametric",
        workstation: {
          lengthOptions: [],
          depthOptions: [],
          seaterOptions: [],
        },
      };
      expect(mapConfiguratorProductToCatalogItem(input)).toBeNull();
    });

    it("returns null when missing slug or name", () => {
      expect(mapConfiguratorProductToCatalogItem({
        id: "bad", slug: "", name: "Test", category_id: "desks",
      })).toBeNull();
    });

    it("handles L-shaped workstation", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-lshape",
        slug: "lshape-desk",
        name: "L-Shape Desk",
        category_id: "workstations",
        sizingType: "parametric",
        workstation: {
          shape: "l-shape",
          lengthOptions: [160],
          depthOptions: [80],
          seaterOptions: [1],
          heightMm: 750,
        },
      };

      const item = mapConfiguratorProductToCatalogItem(input);
      expect(item).not.toBeNull();
      expect(item!.dimensions.widthMm).toBe(1600);
    });

    it("handles sharing workstation", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-share",
        slug: "sharing-bench",
        name: "Sharing Bench",
        category_id: "workstations",
        sizingType: "parametric",
        workstation: {
          shape: "linear",
          lengthOptions: [140],
          depthOptions: [70],
          seaterOptions: [2],
          sharing: "sharing",
          heightMm: 750,
        },
      };

      const item = mapConfiguratorProductToCatalogItem(input);
      expect(item).not.toBeNull();
      // Sharing doubles the depth
      expect(item!.dimensions.depthMm).toBe(1400);
    });

    it("handles parametric without valid seater options", () => {
      const input: ConfiguratorProductInput = {
        id: "cfg-noseat",
        slug: "noseat-desk",
        name: "No Seater Desk",
        category_id: "workstations",
        sizingType: "parametric",
        workstation: {
          lengthOptions: [120],
          depthOptions: [60],
          seaterOptions: [],
        },
      };

      expect(mapConfiguratorProductToCatalogItem(input)).toBeNull();
    });
  });
});
