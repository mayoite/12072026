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

  it("returns null without usable identity", () => {
    expect(resolvePlanSvgUrl({})).toBeNull();
  });
});
