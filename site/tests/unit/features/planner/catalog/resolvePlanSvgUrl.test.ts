import { describe, it, expect } from "vitest";
import { resolvePlanSvgUrl } from "@/features/planner/catalog/resolvePlanSvgUrl";

describe("resolvePlanSvgUrl", () => {
  it("prefers explicit preview SVG", () => {
    expect(
      resolvePlanSvgUrl({
        previewImageUrl: "/svg-catalog/desk-linear-1200-001.svg",
        slug: "other",
      }),
    ).toBe("/svg-catalog/desk-linear-1200-001.svg");
  });

  it("falls back to disk catalog path from slug", () => {
    expect(resolvePlanSvgUrl({ slug: "sectional-sofa-001" })).toBe(
      "/svg-catalog/sectional-sofa-001.svg",
    );
  });

  it("prefers published SVG revision API over disk slug", () => {
    expect(
      resolvePlanSvgUrl({
        slug: "sectional-sofa-001",
        publishedSvgRevisionId: "sectional-sofa-001-r-abcdef0123456789abcd",
      }),
    ).toBe(
      "/api/planner/catalog/svg/sectional-sofa-001-r-abcdef0123456789abcd",
    );
  });

  it("accepts revision API preview URLs", () => {
    expect(
      resolvePlanSvgUrl({
        previewImageUrl:
          "/api/planner/catalog/svg/desk-linear-r-0123456789abcdef0123",
      }),
    ).toBe("/api/planner/catalog/svg/desk-linear-r-0123456789abcdef0123");
  });

  it("returns null without usable identity", () => {
    expect(resolvePlanSvgUrl({})).toBeNull();
  });
});
