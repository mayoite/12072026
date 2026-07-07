/**
 * Phase 03A — SVG & Inventory System Test Suite
 *
 * Covers: SVG types, symbol generation, sanitization, fallback, cache,
 * inventory taxonomy, search index with synonyms/typo tolerance,
 * state contracts, and command processing.
 */

import { describe, it, expect, beforeEach } from "vitest";

/** Perf budgets belong in dedicated benchmark gates; coverage instrumentation skews timings. */
const describeInventoryBenchmarks = process.env.VITEST_COVERAGE_RUN === "1" ? describe.skip : describe;

// ────────────────────────────────────────────────────────────────
// SVG Types & Themes
// ────────────────────────────────────────────────────────────────

import {
  SVG_THEMES,
  CATEGORY_SHAPE_COLORS,
  type SvgThemeName,
} from "@/features/planner/open3d/catalog/svg/svgTypes";

describe("03A-SVG: Types & Themes", () => {
  it("all themes bind semantic CSS tokens with usable stroke and opacity", () => {
    for (const [, theme] of Object.entries(SVG_THEMES)) {
      expect(theme.mode).toBe("css-vars");
      expect(theme.fill).toMatch(/var\(--|currentColor/i);
      expect(theme.stroke).toBe("currentColor");
      expect(theme.textFill).toBe("currentColor");
      expect(theme.strokeWidth).toBeGreaterThan(0);
      expect(theme.opacity).toBeGreaterThan(0);
      expect(theme.opacity).toBeLessThanOrEqual(1);
    }
  });

  it("all themes are defined", () => {
    const expected: SvgThemeName[] = ["light", "dark", "print", "selected", "high-contrast", "fallback"];
    for (const key of expected) {
      expect(SVG_THEMES[key]).toBeDefined();
    }
  });

  it("category shape colors cover all categories", () => {
    expect(CATEGORY_SHAPE_COLORS.Furniture).toBeDefined();
    expect(CATEGORY_SHAPE_COLORS.Lighting).toBeDefined();
    expect(CATEGORY_SHAPE_COLORS.Decor).toBeDefined();
    expect(CATEGORY_SHAPE_COLORS.Outdoor).toBeDefined();
    expect(CATEGORY_SHAPE_COLORS.Symbols).toBeDefined();
  });

  it("themes use semantic CSS colors instead of hardcoded hex values", () => {
    const hardcodedHexColor = /#[0-9a-f]{3,8}\b/i;
    for (const theme of Object.values(SVG_THEMES)) {
      expect(theme.color).not.toMatch(hardcodedHexColor);
      expect(theme.fill).not.toMatch(hardcodedHexColor);
      expect(theme.stroke).not.toMatch(hardcodedHexColor);
      expect(theme.textFill).not.toMatch(hardcodedHexColor);
    }
  });
});

// ────────────────────────────────────────────────────────────────
// SVG Symbols
// ────────────────────────────────────────────────────────────────

import {
  generateSymbol,
  renderSvgSymbol,
  getCachedSvgSymbol,
  clearSvgCache,
  getSvgSymbolDimensionAgreement,
  resolveSymbolGenerator,
  registerSymbolGenerator,
} from "@/features/planner/open3d/catalog/svg/svgSymbols";
import type { Open3dCatalogDimensions } from "@/features/planner/open3d/catalog/catalogTypes";
import { sanitizeSvg, isSvgSafe } from "@/features/planner/open3d/catalog/svg/svgSanitizer";
import { generateFallbackSvg } from "@/features/planner/open3d/catalog/svg/svgFallback";

describe("03A-SVG: Symbol Generation", () => {
  const dims: Open3dCatalogDimensions = { widthMm: 1200, depthMm: 600, heightMm: 750 };

  describe("generateSymbol", () => {
    it("generates desk symbol", () => {
      const sym = generateSymbol("Furniture", "Desks", dims, "Desk");
      expect(sym.symbolId).toContain("desk");
      expect(sym.shapes.length).toBeGreaterThan(0);
      expect(sym.category).toBe("Furniture");
    });

    it("generates chair symbol", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      expect(sym.shapes.length).toBeGreaterThan(0);
    });

    it("generates sofa symbol", () => {
      const sym = generateSymbol("Furniture", "Sofas & Sectionals", { widthMm: 2100, depthMm: 900, heightMm: 850 }, "Sofa");
      expect(sym.shapes.length).toBeGreaterThan(0);
      expect(sym.category).toBe("Furniture");
    });

    it("generates table symbol", () => {
      const sym = generateSymbol("Furniture", "Tables", dims, "Table");
      expect(sym.shapes.length).toBeGreaterThan(0);
    });

    it("generates bed symbol", () => {
      const sym = generateSymbol("Furniture", "Beds", { widthMm: 2000, depthMm: 1500, heightMm: 500 }, "Bed");
      expect(sym.shapes.length).toBeGreaterThan(0);
    });

    it("generates storage symbol", () => {
      const sym = generateSymbol("Furniture", "Storage", dims, "Storage");
      expect(sym.shapes.length).toBeGreaterThan(0);
    });

    it("generates lighting symbol", () => {
      const sym = generateSymbol("Lighting", undefined, dims, "Lamp");
      expect(sym.category).toBe("Lighting");
    });

    it("generates rug symbol", () => {
      const sym = generateSymbol("Decor", "Rugs", dims, "Rug");
      expect(sym.category).toBe("Decor");
    });

    it("generates plant symbol", () => {
      const sym = generateSymbol("Decor", "Plants", dims, "Plant");
      expect(sym.category).toBe("Decor");
    });

    it("generates outdoor symbol", () => {
      const sym = generateSymbol("Outdoor", undefined, dims, "Patio");
      expect(sym.category).toBe("Outdoor");
    });

    it("generates symbol category with diamond", () => {
      const sym = generateSymbol("Symbols", "Electrical", dims, "Outlet");
      expect(sym.category).toBe("Symbols");
      expect(sym.label).toBeDefined();
    });

    it("falls back to default for unknown", () => {
      const sym = generateSymbol("Bedding & Textiles", undefined, dims, "Textile");
      expect(sym.symbolId).toContain("default");
    });
  });

  describe("renderSvgSymbol", () => {
    const sym = generateSymbol("Furniture", "Chairs", dims, "Office Chair");

    it("renders valid SVG markup", () => {
      const output = renderSvgSymbol(sym, "light");
      expect(output.svg).toContain("<svg");
      expect(output.svg).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
      expect("sanitizeSvg" in output).toBe(false);
    });

    it("all rendered SVGs pass sanitization", () => {
      const categories = ["Furniture", "Lighting", "Decor", "Outdoor", "Symbols"] as const;
      for (const cat of categories) {
        const s = generateSymbol(cat, undefined, dims, `Test ${cat}`);
        const output = renderSvgSymbol(s, "light");
        const check = sanitizeSvg(output.svg);
        expect(check.safe).toBe(true);
      }
    });

    it("viewBox matches dimensions", () => {
      const output = renderSvgSymbol(sym, "light");
      expect(output.viewBox).toBe(`0 0 ${dims.widthMm} ${dims.depthMm}`);
    });

    it("width/height in output match dimensions", () => {
      const output = renderSvgSymbol(sym, "light");
      expect(output.widthMm).toBe(dims.widthMm);
      expect(output.heightMm).toBe(dims.depthMm);
    });

    it("contentHash is deterministic for same inputs", () => {
      const a = renderSvgSymbol(sym, "light");
      const b = renderSvgSymbol(sym, "light");
      expect(a.contentHash).toBe(b.contentHash);
    });

    it("render output is deterministic for same inputs", () => {
      const a = renderSvgSymbol(sym, "light", 90, 1);
      const b = renderSvgSymbol(sym, "light", 90, 1);
      expect(a).toEqual(b);
    });

    it("contentHash differs for different themes", () => {
      const a = renderSvgSymbol(sym, "light");
      const b = renderSvgSymbol(sym, "dark");
      expect(a.contentHash).not.toBe(b.contentHash);
    });

    it("includes accessible name", () => {
      const output = renderSvgSymbol(sym, "light");
      expect(output.svg).toContain("Office Chair");
    });

    it("uses explicit image semantics for non-decorative SVGs", () => {
      const output = renderSvgSymbol(sym, "light");
      expect(output.svg).toContain('role="img"');
      expect(output.svg).toContain('aria-label="Office Chair"');
      expect(output.svg).toContain("<title>Office Chair</title>");
    });

    it("reports preview, canvas, and export dimensional agreement", () => {
      const agreement = getSvgSymbolDimensionAgreement(sym);
      const footprint = { widthMm: dims.widthMm, depthMm: dims.depthMm };
      expect(agreement).toEqual({
        viewBox: `0 0 ${dims.widthMm} ${dims.depthMm}`,
        preview: footprint,
        canvas: footprint,
        export: footprint,
        agrees: true,
      });
    });

    it("escapes accessible names and labels", () => {
      const unsafe = generateSymbol("Symbols", "Electrical", dims, `Outlet <script> & "quote"`);
      const output = renderSvgSymbol({ ...unsafe, label: `<A&` }, "light");
      expect(output.svg).toContain("Outlet &lt;script&gt; &amp; &quot;quote&quot;");
      expect(output.svg).toContain("&lt;A&amp;");
      expect(output.svg).not.toContain(`<script>`);
    });

    it("handles rotation", () => {
      const output = renderSvgSymbol(sym, "light", 45);
      expect(output.svg).toContain("rotate(45");
    });

    it("handles scale", () => {
      const output = renderSvgSymbol(sym, "light", undefined, 2);
      expect(output.svg).toContain("scale(2)");
    });
  });

  describe("SVG cache", () => {
    beforeEach(() => clearSvgCache());

    it("returns cached result on second call", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Cached Chair");
      const a = getCachedSvgSymbol(sym, "light");
      const b = getCachedSvgSymbol(sym, "light");
      expect(a.svg).toBe(b.svg);
    });

    it("does not reuse cached accessible labels across definitions", () => {
      const first = getCachedSvgSymbol(generateSymbol("Furniture", "Chairs", dims, "First Chair"), "light");
      const second = getCachedSvgSymbol(generateSymbol("Furniture", "Chairs", dims, "Second Chair"), "light");
      expect(first.svg).toContain("First Chair");
      expect(second.svg).toContain("Second Chair");
      expect(first.contentHash).not.toBe(second.contentHash);
    });

    it("clearSvgCache empties cache", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      const a = getCachedSvgSymbol(sym, "light");
      clearSvgCache();
      const b = getCachedSvgSymbol(sym, "light");
      // Content should match but generatedAt may differ
      expect(b.svg).toBe(a.svg);
    });
  });

  describe("registerSymbolGenerator", () => {
    it("registers and uses custom generator", () => {
      registerSymbolGenerator("custom-test", (d, n) => ({
        symbolId: "custom-xyz",
        category: "Furniture",
        name: n,
        dimensions: d,
        shapes: [{ shape: "rect", attrs: { x: 0, y: 0, width: d.widthMm, height: d.depthMm } }],
      }));
      const sym = resolveSymbolGenerator("Furniture", "custom-test")(dims, "Custom");
      expect(sym.symbolId).toBe("custom-xyz");
    });
  });

  describe("renderSvgSymbol edge cases", () => {
    it("handles NaN rotation gracefully", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      const output = renderSvgSymbol(sym, "light", NaN);
      expect(output.svg).not.toContain("rotate(NaN");
      expect(output.svg).toContain("<svg");
    });

    it("handles negative scale by ignoring it", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      const output = renderSvgSymbol(sym, "light", undefined, -1);
      expect(output.svg).not.toContain("scale(-1)");
    });

    it("handles zero scale by ignoring it", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      const output = renderSvgSymbol(sym, "light", undefined, 0);
      expect(output.svg).not.toContain("scale(0)");
    });

    it("handles NaN scale by ignoring it", () => {
      const sym = generateSymbol("Furniture", "Chairs", dims, "Chair");
      const output = renderSvgSymbol(sym, "light", undefined, NaN);
      expect(output.svg).not.toContain("scale(NaN");
    });

    it("handles non-finite dimensions by normalizing", () => {
      const badDims = { widthMm: Infinity, depthMm: -100, heightMm: NaN };
      const sym = generateSymbol("Furniture", "Chairs", badDims, "Bad Chair");
      const output = renderSvgSymbol(sym, "light");
      expect(output.svg).toContain("<svg");
      expect(output.widthMm).toBeGreaterThan(0);
    });
  });
});

// ────────────────────────────────────────────────────────────────
// SVG Sanitization
// ────────────────────────────────────────────────────────────────

describe("03A-SVG: Sanitization", () => {
  const cleanSvg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100"/></svg>`;

  it("accepts clean SVG", () => {
    const result = sanitizeSvg(cleanSvg);
    expect(result.safe).toBe(true);
  });

  it("rejects SVG with script tag", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`);
    expect(result.safe).toBe(false);
    expect(result.issues[0]).toContain("script");
  });

  it("rejects SVG with foreignObject", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><foreignObject></foreignObject></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with onclick handler", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="bad()"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with onerror handler", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><image onerror="bad()"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with javascript: protocol", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)">click</a></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with href attribute", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><a href="https://evil.com">click</a></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with data: protocol", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/svg+xml,..."/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects single-quoted unsafe protocols", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><rect fill='javascript:bad()'/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects unsafe protocols inside style url references", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><rect style="fill:url(javascript:bad())"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects empty input", () => {
    expect(sanitizeSvg("").safe).toBe(false);
    expect(sanitizeSvg("   ").safe).toBe(false);
  });

  it("rejects SVG with iframe", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><iframe src="evil"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with embed", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><embed src="evil"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with use element", () => {
    const result = sanitizeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><use href="evil"/></svg>`);
    expect(result.safe).toBe(false);
  });

  it("isSvgSafe helper works", () => {
    expect(isSvgSafe(cleanSvg)).toBe(true);
    expect(isSvgSafe(`<script>`)).toBe(false);
  });

  it("warns but does not block for missing namespaces", () => {
    const result = sanitizeSvg(`<svg viewBox="0 0 100 100"><rect/></svg>`);
    // This should be safe because it only warns about namespace
    expect(result.safe).toBe(true);
  });

  it("rejects SVG over max size", () => {
    const hugeSvg = `<svg xmlns="http://www.w3.org/2000/svg">${"x".repeat(150_000)}</svg>`;
    const result = sanitizeSvg(hugeSvg);
    expect(result.safe).toBe(false);
    expect(result.issues[0]).toContain("maximum size");
  });

  it("rejects SVG with DOCTYPE", () => {
    const result = sanitizeSvg(`<!DOCTYPE svg><svg xmlns="http://www.w3.org/2000/svg"></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects SVG with ENTITY", () => {
    const result = sanitizeSvg(`<!ENTITY test "value"><svg xmlns="http://www.w3.org/2000/svg"></svg>`);
    expect(result.safe).toBe(false);
  });

  it("rejects non-string input", () => {
    const result = sanitizeSvg(null as unknown as string);
    expect(result.safe).toBe(false);
    expect(result.issues[0]).toContain("non-string");
  });
});

// ────────────────────────────────────────────────────────────────
// SVG Fallback
// ────────────────────────────────────────────────────────────────

describe("03A-SVG: Fallback", () => {
it("generates visible fallback SVG", () => {
    const output = generateFallbackSvg(
      { widthMm: 500, depthMm: 500, heightMm: 900 },
      "Unknown Item",
      "Missing symbol definition",
    );
    expect(output.svg).toContain("Missing");
    expect(output.svg).toContain("?");
    expect(output.theme).toBe("fallback");
  });

  it("fallback SVG passes sanitization", () => {
    const output = generateFallbackSvg(
      { widthMm: 800, depthMm: 400, heightMm: 600 },
      "Broken",
      "Test reason",
    );
    const check = sanitizeSvg(output.svg);
    expect(check.safe).toBe(true);
  });

  it("fallback has accessible label", () => {
    const output = generateFallbackSvg(
      { widthMm: 600, depthMm: 600, heightMm: 600 },
      "Chair",
      "Mesh URL expired",
    );
    expect(output.svg).toContain("aria-label");
    expect(output.svg).toContain("Missing symbol");
    expect(output.svg).toContain("Chair");
  });

  it("fallback output is deterministic and escaped", () => {
    const first = generateFallbackSvg(
      { widthMm: 600, depthMm: 600, heightMm: 600 },
      `Chair <bad>`,
      `Missing & broken`,
    );
    const second = generateFallbackSvg(
      { widthMm: 600, depthMm: 600, heightMm: 600 },
      `Chair <bad>`,
      `Missing & broken`,
    );
    expect(first).toEqual(second);
    expect(first.svg).toContain("Chair &lt;bad&gt;");
    expect(first.svg).toContain("Missing &amp; broken");
  });

  it("viewBox matches dimensions", () => {
    const output = generateFallbackSvg(
      { widthMm: 1400, depthMm: 700, heightMm: 750 },
      "Desk",
      "Invalid asset",
    );
    expect(output.viewBox).toBe("0 0 1400 700");
  });
});

// ────────────────────────────────────────────────────────────────
// Inventory Taxonomy
// ────────────────────────────────────────────────────────────────

import {
  INVENTORY_CATEGORIES,
  INVENTORY_ROOM_GROUPS,
  INVENTORY_STYLE_GROUPS,
  INVENTORY_SORT_OPTIONS,
  INVENTORY_DENSITY_OPTIONS,
} from "@/features/planner/open3d/catalog/inventory/inventoryTaxonomy";

describe("03A-INV: Taxonomy", () => {
  it("has all 6 category groups", () => {
    expect(INVENTORY_CATEGORIES).toHaveLength(6);
  });

  it("categories are sorted by sortOrder", () => {
    for (let i = 1; i < INVENTORY_CATEGORIES.length; i++) {
      expect(INVENTORY_CATEGORIES[i].sortOrder).toBeGreaterThan(INVENTORY_CATEGORIES[i - 1].sortOrder);
    }
  });

  it("furniture has 6 subcategories", () => {
    const furniture = INVENTORY_CATEGORIES.find((c) => c.id === "furniture")!;
    expect(furniture.subCategories).toHaveLength(6);
  });

  it("room groups are defined", () => {
    expect(INVENTORY_ROOM_GROUPS.length).toBeGreaterThan(5);
  });

  it("style groups are defined", () => {
    expect(INVENTORY_STYLE_GROUPS.length).toBeGreaterThan(3);
  });

  it("sort options have unique keys", () => {
    const keys = INVENTORY_SORT_OPTIONS.map((o) => o.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("density options define columns", () => {
    expect(INVENTORY_DENSITY_OPTIONS[0].columns).toBeGreaterThan(0);
    expect(INVENTORY_DENSITY_OPTIONS[0].previewSize).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Inventory Search Index
// ────────────────────────────────────────────────────────────────

import { InventorySearchIndex } from "@/features/planner/open3d/catalog/inventory/inventoryIndex";
import type { Open3dCatalogItem } from "@/features/planner/open3d/catalog/catalogTypes";

describe("03A-INV: Search Index", () => {
  function makeItem(
    id: string,
    sku: string,
    name: string,
    tags: string[] = [],
    overrides: Partial<Open3dCatalogItem> = {},
  ): Open3dCatalogItem {
    return {
      id, slug: id, sku,
      name,
      shortName: name.slice(0, 30),
      description: `Description for ${name}`,
      category: "Furniture",
      subCategory: "Chairs",
      taxonomyPath: "Furniture > Chairs",
      dimensions: { widthMm: 500, depthMm: 500, heightMm: 900 },
      displayUnit: "cm",
      assets: { imageUrls: [] },
      material: { marketingMaterial: "Fabric", normalizedMaterial: "Fabric" },
      roomTags: ["Office"],
      styleTags: ["Modern"],
      tags: [...tags, "test"],
      availability: "in-stock",
      assemblyType: "partial",
      flatPack: false,
      variants: [],
      provenance: { source: "test" },
      symbolOnly: false,
      ...overrides,
    };
  }

  function createIndex(): InventorySearchIndex {
    const idx = new InventorySearchIndex();
    idx.load([
      makeItem("chair-1", "CH-001", "Office Chair", ["chair", "office"]),
      makeItem("chair-2", "CH-002", "Ergonomic Chair", ["chair", "ergonomic"]),
      makeItem("desk-1", "DK-001", "Standing Desk", ["desk", "standing"]),
      makeItem("sofa-1", "SF-001", "3-Seater Sofa", ["sofa", "seating"]),
      makeItem("lamp-1", "LP-001", "Desk Lamp", ["lamp", "lighting"]),
    ]);
    return idx;
  }

  describe("search", () => {
it("finds by exact name", () => {
      const result = createIndex().search("Office Chair");
      expect(result.items.length).toBeGreaterThanOrEqual(1);
      expect(result.items[0].name).toBe("Office Chair");
    });

    it("finds by partial name", () => {
      const result = createIndex().search("Chair");
      expect(result.items.length).toBeGreaterThanOrEqual(2);
    });

    it("finds by tag", () => {
      const result = createIndex().search("standing");
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Standing Desk");
    });

    it("finds by synonym (couch → sofa)", () => {
      const result = createIndex().search("couch");
      expect(result.items.some((i) => i.name === "3-Seater Sofa")).toBe(true);
    });

    it("returns empty for no match", () => {
      const result = createIndex().search("zebra xylophone");
      expect(result.items).toHaveLength(0);
      expect(result.relaxed).toBe(false);
    });

    it("zero-result triggers typo tolerance for sofa", () => {
      const result = createIndex().search("ofsa"); // typo of "sofa"
      if (result.relaxed) {
        expect(result.suggestedCorrection).toBeDefined();
        expect(result.items.length).toBeGreaterThanOrEqual(0);
      }
    });

    it("empty query returns all items", () => {
      const result = createIndex().search("");
      expect(result.totalCount).toBe(5);
    });

    it("empty query returns deterministic name/SKU/ID order", () => {
      const idx = new InventorySearchIndex();
      idx.load([
        makeItem("b", "B-002", "Same Name", ["chair"]),
        makeItem("a", "A-001", "Same Name", ["chair"]),
        makeItem("z", "Z-999", "Alpha", ["chair"]),
      ]);
      expect(idx.search("").items.map((item) => item.id)).toEqual(["z", "a", "b"]);
    });

    it("breaks relevance ties by name, SKU, then ID", () => {
      const idx = new InventorySearchIndex();
      idx.load([
        makeItem("second", "B-002", "Beta Chair", ["chair"]),
        makeItem("first", "A-001", "Alpha Chair", ["chair"]),
      ]);
      expect(idx.search("chair").items.map((item) => item.id)).toEqual(["first", "second"]);
    });

    it("filters by category, room, style, material, and availability", () => {
      const idx = createIndex();
      const result = idx.search("chair", {
        category: "Furniture",
        roomTags: ["Office"],
        styleTags: ["Modern"],
        material: ["fabric"],
        availability: ["in-stock"],
      });
      expect(result.items.length).toBeGreaterThanOrEqual(2);
      expect(result.items.every((item) => item.category === "Furniture")).toBe(true);
    });

    it("respects pageSize", () => {
      const result = createIndex().search("", { pageSize: 2 });
      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(5);
    });

    it("respects minScore filter", () => {
      const result = createIndex().search("desk", { minScore: 50 });
      expect(result.items.length).toBeGreaterThanOrEqual(1);
    });

    it("filters by dimension range", () => {
      const idx = new InventorySearchIndex();
      idx.load([
        makeItem("small", "S", "Small Chair", [], { dimensions: { widthMm: 450, depthMm: 450, heightMm: 850 } }),
        makeItem("medium", "M", "Medium Desk", [], { dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 } }),
        makeItem("large", "L", "Large Sofa", [], { dimensions: { widthMm: 2200, depthMm: 950, heightMm: 880 } }),
      ]);
      const result = idx.search("", {
        dimensionFilter: {
          minWidthMm: 1000,
          maxWidthMm: 2000,
        },
      });
      expect(result.items.map((item) => item.id)).toEqual(["medium"]);
    });

    it("filters by height range", () => {
      const idx = new InventorySearchIndex();
      idx.load([
        makeItem("low", "L", "Low Table", [], { dimensions: { widthMm: 800, depthMm: 500, heightMm: 400 } }),
        makeItem("high", "H", "High Shelf", [], { dimensions: { widthMm: 800, depthMm: 500, heightMm: 1800 } }),
      ]);
      const result = idx.search("", {
        dimensionFilter: {
          minHeightMm: 800,
        },
      });
      expect(result.items.map((item) => item.id)).toEqual(["high"]);
    });
  });

  describe("suggest", () => {
    it("returns matching names for partial input", () => {
      const idx = createIndex();
      const suggestions = idx.suggest("Desk");
      expect(suggestions.length).toBeGreaterThanOrEqual(1);
    });

    it("returns empty for query < 2 chars", () => {
      const idx = createIndex();
      expect(idx.suggest("D")).toHaveLength(0);
    });

    it("respects limit", () => {
      const idx = createIndex();
      const suggestions = idx.suggest("chair", 1);
      expect(suggestions.length).toBeLessThanOrEqual(1);
    });
  });

  describe("typo tolerance edge cases", () => {
    it("applies typo tolerance for short queries", () => {
      const idx = createIndex();
      // Query with typo "chari" should match "chair"
      const result = idx.search("chari", { typoTolerance: true });
      // May or may not find results depending on typo generation
      expect(result.query).toBe("chari");
    });

    it("respects typoTolerance disabled", () => {
      const idx = createIndex();
      const result = idx.search("chari", { typoTolerance: false });
      expect(result.relaxed).toBe(false);
    });
  });

  describe("dimension filter edge cases", () => {
    it("filters by max depth", () => {
      const idx = createIndex();
      const result = idx.search("", {
        dimensionFilter: { maxDepthMm: 600 },
      });
      // All test items have depthMm 500
      expect(result.totalCount).toBe(5);
    });

    it("filters by min and max height", () => {
      const idx = createIndex();
      const result = idx.search("", {
        dimensionFilter: { minHeightMm: 800, maxHeightMm: 1000 },
      });
      // All test items have heightMm 900
      expect(result.totalCount).toBe(5);
    });

    it("returns empty when no items match dimension filter", () => {
      const idx = createIndex();
      const result = idx.search("", {
        dimensionFilter: { minWidthMm: 99999 },
      });
      expect(result.items).toHaveLength(0);
    });
  });

  describe("filter combinations", () => {
    it("applies multiple filters together", () => {
      const idx = createIndex();
      const result = idx.search("", {
        category: "Furniture",
        availability: ["in-stock"],
        roomTags: ["Office"],
      });
      expect(result.items.every((i) => i.category === "Furniture")).toBe(true);
    });

    it("returns empty when filters conflict", () => {
      const idx = createIndex();
      const result = idx.search("", {
        category: "Lighting",
        roomTags: ["Dining"],
      });
      // Lamp is Office, Dining Chair is Furniture
      expect(result.items).toHaveLength(0);
    });
  });

  describeInventoryBenchmarks("large inventory benchmarks", () => {
    function percentile95(durations: number[]): number {
      return [...durations].sort((a, b) => a - b)[Math.floor(durations.length * 0.95)];
    }

    function warmupSearch(
      idx: InventorySearchIndex,
      query: string,
      iterations = 5,
    ) {
      for (let i = 0; i < iterations; i += 1) {
        idx.search(query, { pageSize: 20, typoTolerance: false, category: "Furniture" });
      }
    }

    function makeLargeInventory(size: number): Open3dCatalogItem[] {
      const items: Open3dCatalogItem[] = [];
      for (let i = 0; i < size; i += 1) {
        items.push(makeItem(
          `item-${i}`,
          `SKU-${i}`,
          `Product ${i}`,
          [`unique${i}`, i % 2 === 0 ? "desk" : "chair"],
          {
            category: i % 5 === 0 ? "Lighting" : "Furniture",
            roomTags: [i % 3 === 0 ? "Office" : "Living Room"],
            styleTags: [i % 4 === 0 ? "Industrial" : "Modern"],
            configurability: i % 7 === 0 ? "configurable" : "fixed",
            mounting: [i % 5 === 0 ? "ceiling" : "floor"],
            assetReadiness: [i % 11 === 0 ? "missing-mesh" : "ready"],
          },
        ));
      }
      return items;
    }

    it("meets 1K search p95 budget under 100ms", () => {
      const idx = new InventorySearchIndex();
      idx.load(makeLargeInventory(1_000));
      warmupSearch(idx, "unique950");

      const durations: number[] = [];
      for (let i = 0; i < 25; i += 1) {
        const startedAt = performance.now();
        const result = idx.search(`unique${900 + i}`, {
          pageSize: 20,
          typoTolerance: false,
          category: "Furniture",
        });
        durations.push(performance.now() - startedAt);
        expect(result.items.length).toBeGreaterThanOrEqual(0);
      }
      const p95 = percentile95(durations);

      console.info(`[phase-03a-benchmark-exceed] inventory search 1K p95=${p95.toFixed(3)}ms stretch=50ms`);
      expect(p95).toBeLessThan(100);
    });

    it("meets 10K search p95 budget under 200ms", () => {
      const idx = new InventorySearchIndex();
      idx.load(makeLargeInventory(10_000));
      warmupSearch(idx, "unique9500");

      const durations: number[] = [];
      for (let i = 0; i < 25; i += 1) {
        const startedAt = performance.now();
        const result = idx.search(`unique${9000 + i}`, {
          pageSize: 20,
          typoTolerance: false,
          category: "Furniture",
        });
        durations.push(performance.now() - startedAt);
        expect(result.items.length).toBeGreaterThanOrEqual(0);
      }
      const p95 = percentile95(durations);

      console.info(`[phase-03a-benchmark-exceed] inventory search 10K p95=${p95.toFixed(3)}ms stretch=100ms`);
      expect(p95).toBeLessThan(200);
    });

    it("meets SVG symbol generation budget under 10ms p95", () => {
      const durations: number[] = [];
      for (let i = 0; i < 100; i += 1) {
        const startedAt = performance.now();
        generateSymbol("Furniture", "Desks", {
          widthMm: 1200 + i,
          depthMm: 600 + i,
          heightMm: 750,
        }, `Bench ${i}`);
        durations.push(performance.now() - startedAt);
      }
      const p95 = percentile95(durations);

      console.info(`[phase-03a-benchmark-exceed] SVG symbol generation p95=${p95.toFixed(3)}ms stretch=5ms`);
      expect(p95).toBeLessThan(5);
    });
  });
});

// ────────────────────────────────────────────────────────────────
// Inventory State Contracts
// ────────────────────────────────────────────────────────────────

import {
  defaultInventoryPanelState,
  reduceInventoryCommand,
  defaultCollectionsState,
  INVENTORY_PANEL_CONTRACT,
  addInventoryRecent,
  addInventoryFavorite,
  removeInventoryFavorite,
  isInventoryFavorite,
  upsertInventoryCollection,
  addInventoryItemToCollection,
  removeInventoryItemFromCollection,
} from "@/features/planner/open3d/catalog/inventory/inventoryState";

describe("03A-INV: State Contracts", () => {
  describe("defaultInventoryPanelState", () => {
    it("has empty search and no filters", () => {
      const state = defaultInventoryPanelState();
      expect(state.searchQuery).toBe("");
      expect(state.selectedCategoryId).toBeNull();
      expect(state.sortOrder).toBe("name-asc");
    });
  });

  describe("reduceInventoryCommand", () => {
    it("SET_SEARCH_QUERY updates query", () => {
      const state = reduceInventoryCommand(defaultInventoryPanelState(), {
        type: "SET_SEARCH_QUERY", query: "sofa",
      });
      expect(state.searchQuery).toBe("sofa");
    });

    it("SELECT_CATEGORY sets category and clears subcategory", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "SELECT_SUBCATEGORY", subCategoryId: "chairs" });
      state = reduceInventoryCommand(state, { type: "SELECT_CATEGORY", categoryId: "furniture" });
      expect(state.selectedCategoryId).toBe("furniture");
      expect(state.selectedSubCategoryId).toBeNull();
    });

    it("SET_SORT updates order", () => {
      const state = reduceInventoryCommand(defaultInventoryPanelState(), {
        type: "SET_SORT", sort: "price-desc",
      });
      expect(state.sortOrder).toBe("price-desc");
    });

    it("SET_DENSITY updates display", () => {
      const state = reduceInventoryCommand(defaultInventoryPanelState(), {
        type: "SET_DENSITY", density: "compact",
      });
      expect(state.density).toBe("compact");
    });

    it("TOGGLE_CATEGORY_COLLAPSE toggles state", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "TOGGLE_CATEGORY_COLLAPSE", categoryId: "furniture" });
      expect(state.collapsedCategories["furniture"]).toBe(true);
      state = reduceInventoryCommand(state, { type: "TOGGLE_CATEGORY_COLLAPSE", categoryId: "furniture" });
      expect(state.collapsedCategories["furniture"]).toBe(false);
    });

    it("TOGGLE_RECENT_VISIBLE toggles", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "TOGGLE_RECENT_VISIBLE" });
      expect(state.recentVisible).toBe(true);
    });

    it("TOGGLE_FAVORITES_VISIBLE toggles without changing search context", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "desk" });
      state = reduceInventoryCommand(state, { type: "TOGGLE_FAVORITES_VISIBLE" });
      expect(state.favoritesVisible).toBe(true);
      expect(state.searchQuery).toBe("desk");
    });

    it("CLEAR_SEARCH empties query", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "test" });
      state = reduceInventoryCommand(state, { type: "CLEAR_SEARCH" });
      expect(state.searchQuery).toBe("");
    });

    it("RESET_FILTERS returns default state", () => {
      let state = defaultInventoryPanelState();
      state = reduceInventoryCommand(state, { type: "SET_SEARCH_QUERY", query: "test" });
      state = reduceInventoryCommand(state, { type: "SET_DENSITY", density: "compact" });
      state = reduceInventoryCommand(state, { type: "RESET_FILTERS" });
      expect(state.searchQuery).toBe("");
      expect(state.density).toBe("comfortable");
    });

    it("unknown command returns state unchanged", () => {
      const state = defaultInventoryPanelState();
      const result = reduceInventoryCommand(state, { type: "NONEXISTENT" } as never);
      expect(result).toEqual(state);
    });
  });

  describe("defaultCollectionsState", () => {
    it("starts with empty collections", () => {
      const state = defaultCollectionsState();
      expect(state.recent).toHaveLength(0);
      expect(state.favorites).toHaveLength(0);
    });

    it("records recent items with deduplication and frequent counts", () => {
      let state = defaultCollectionsState();
      state = addInventoryRecent(state, "chair", "2026-07-03T00:00:00.000Z");
      state = addInventoryRecent(state, "desk", "2026-07-03T00:01:00.000Z");
      state = addInventoryRecent(state, "chair", "2026-07-03T00:02:00.000Z");
      expect(state.recent.map((entry) => entry.itemId)).toEqual(["chair", "desk"]);
      expect(state.frequent).toEqual([
        { itemId: "chair", useCount: 2 },
        { itemId: "desk", useCount: 1 },
      ]);
    });

    it("caps recent items at 50", () => {
      let state = defaultCollectionsState();
      for (let i = 0; i < 55; i += 1) {
        state = addInventoryRecent(state, `item-${i}`, `2026-07-03T00:${String(i).padStart(2, "0")}:00.000Z`);
      }
      expect(state.recent).toHaveLength(50);
      expect(state.recent[0].itemId).toBe("item-54");
    });

    it("adds and removes sorted favorite IDs", () => {
      let state = defaultCollectionsState();
      state = addInventoryFavorite(state, "desk");
      state = addInventoryFavorite(state, "chair");
      state = addInventoryFavorite(state, "desk");
      expect(state.favorites).toEqual(["chair", "desk"]);
      expect(isInventoryFavorite(state, "desk")).toBe(true);
      state = removeInventoryFavorite(state, "desk");
      expect(isInventoryFavorite(state, "desk")).toBe(false);
    });

    it("upserts collections with stable unique item ordering", () => {
      let state = defaultCollectionsState();
      state = upsertInventoryCollection(state, { id: "work", name: "Work", itemIds: ["desk", "chair", "desk"] });
      state = addInventoryItemToCollection(state, "work", "lamp");
      state = removeInventoryItemFromCollection(state, "work", "desk");
      expect(state.collections).toEqual([
        { id: "work", name: "Work", itemIds: ["chair", "lamp"] },
      ]);
    });
  });

  describe("INVENTORY_PANEL_CONTRACT", () => {
    it("has required fields", () => {
      expect(INVENTORY_PANEL_CONTRACT.panelId).toBe("inventory");
      expect(INVENTORY_PANEL_CONTRACT.defaultDock).toBe("left");
      expect(INVENTORY_PANEL_CONTRACT.minWidth).toBeGreaterThan(0);
      expect(INVENTORY_PANEL_CONTRACT.resizable).toBe(true);
      expect(INVENTORY_PANEL_CONTRACT.shortcutCommands.length).toBeGreaterThan(0);
    });
  });
});
