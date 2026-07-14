import { afterEach, describe, expect, it } from "vitest";
import {
  clearSvgPlanSymbolCacheForTests,
  isPublishedSvgPlanUrl,
} from "@/features/planner/project/catalog/svg/svgPlanSymbolCache";

afterEach(() => {
  clearSvgPlanSymbolCacheForTests();
});

describe("svgPlanSymbolCache", () => {
  it("accepts .svg plan urls and rejects empty/non-svg", () => {
    expect(isPublishedSvgPlanUrl("/catalog/blocks/chair.plan.svg")).toBe(true);
    expect(isPublishedSvgPlanUrl("https://cdn.example/x.svg")).toBe(true);
    expect(isPublishedSvgPlanUrl("/random/path.png")).toBe(false);
    expect(isPublishedSvgPlanUrl("")).toBe(false);
    expect(isPublishedSvgPlanUrl(null)).toBe(false);
  });
});
