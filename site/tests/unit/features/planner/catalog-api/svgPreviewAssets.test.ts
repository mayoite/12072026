import { describe, expect, it } from "vitest";

import {
  buildBlockThumbPngUrl,
  buildBlockThumbSrcSet,
  buildSvgCatalogPublicUrl,
  isSvgAssetUrl,
  SVG_THUMBNAIL_WIDTHS,
} from "@/features/planner/catalog/svg/svgPreviewAssets";

describe("svgPreviewAssets", () => {
  it("detects SVG asset URLs", () => {
    expect(isSvgAssetUrl("/placeholder-sofa.svg")).toBe(true);
    expect(isSvgAssetUrl("https://cdn.example.com/chair.svg?v=2")).toBe(true);
    expect(isSvgAssetUrl("/images/chair.png")).toBe(false);
  });

  it("builds catalog SVG public paths", () => {
    expect(buildSvgCatalogPublicUrl("chaise-lounge-001")).toBe(
      "/svg-catalog/chaise-lounge-001.svg",
    );
  });

  it("builds 1x and 2x PNG thumb URLs", () => {
    expect(buildBlockThumbPngUrl("side-table-001")).toMatch(/side-table-001\.png$/);
    expect(buildBlockThumbPngUrl("side-table-001", "2x")).toMatch(/side-table-001@2x\.png$/);
  });

  it("builds retina srcSet for PNG thumbs", () => {
    const srcSet = buildBlockThumbSrcSet("sectional-sofa-001");
    expect(srcSet).toContain("sectional-sofa-001.png 1x");
    expect(srcSet).toContain("sectional-sofa-001@2x.png 2x");
  });

  it("includes 512 in default thumbnail widths", () => {
    expect(SVG_THUMBNAIL_WIDTHS).toContain(512);
  });
});