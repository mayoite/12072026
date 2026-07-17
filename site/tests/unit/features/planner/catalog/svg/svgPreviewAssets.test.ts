import { describe, expect, it } from "vitest";
import {
  isSvgAssetUrl,
} from "@/features/planner/catalog/svg/svgPreviewAssets";

describe("svgPreviewAssets", () => {
  it("detects svg asset urls", () => {
    expect(isSvgAssetUrl("/x.svg")).toBe(true);
    expect(isSvgAssetUrl("/x.SVG")).toBe(true);
    expect(isSvgAssetUrl("/x.png")).toBe(false);
    expect(isSvgAssetUrl("")).toBe(false);
  });
});
