import { describe, expect, it } from "vitest";
import {
  buildPublishedSvgApiUrl,
  isPublishedSvgApiUrl,
  isSvgAssetUrl,
  parsePublishedSvgRevisionId,
} from "@/features/planner/catalog/svg/svgPreviewAssets";

describe("svgPreviewAssets", () => {
  it("detects svg asset urls", () => {
    expect(isSvgAssetUrl("/x.svg")).toBe(true);
    expect(isSvgAssetUrl("/x.SVG")).toBe(true);
    expect(isSvgAssetUrl("/x.png")).toBe(false);
    expect(isSvgAssetUrl("")).toBe(false);
  });

  it("builds and detects published revision API urls", () => {
    const url = buildPublishedSvgApiUrl("oando-linear-desk-1600-r-abc123");
    expect(url).toBe(
      "/api/planner/catalog/svg/oando-linear-desk-1600-r-abc123",
    );
    expect(isPublishedSvgApiUrl(url)).toBe(true);
    expect(isPublishedSvgApiUrl("/svg-catalog/oando-linear-desk-1600.svg")).toBe(
      false,
    );
  });

  it("parses revision id for place pin (AF-15)", () => {
    expect(
      parsePublishedSvgRevisionId(
        "/api/planner/catalog/svg/oando-linear-desk-1600-r-abc123",
      ),
    ).toBe("oando-linear-desk-1600-r-abc123");
    expect(
      parsePublishedSvgRevisionId(
        "/api/planner/catalog/svg/oando-linear-desk-1600-r-abc123?x=1",
      ),
    ).toBe("oando-linear-desk-1600-r-abc123");
    expect(
      parsePublishedSvgRevisionId("/svg-catalog/oando-linear-desk-1600.svg"),
    ).toBeNull();
    expect(parsePublishedSvgRevisionId(null)).toBeNull();
  });
});
