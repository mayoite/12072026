import { describe, expect, it } from "vitest";
import {
  PLANNER_FEATURE_PAGES,
  PLANNER_FEATURE_BY_SLUG,
  isPlannerFeatureSlug,
} from "@/features/planner/landing/plannerFeaturePages";

describe("plannerFeaturePages configuration", () => {
  it("should define feature pages with correct keys", () => {
    expect(PLANNER_FEATURE_PAGES).toBeInstanceOf(Array);
    expect(PLANNER_FEATURE_PAGES.length).toBe(5);

    for (const page of PLANNER_FEATURE_PAGES) {
      expect(page.slug).toBeDefined();
      expect(page.title).toBeDefined();
      expect(page.tagline).toBeDefined();
      expect(page.icon).toBeDefined();
      expect(page.summary).toBeDefined();
      expect(page.bullets).toBeInstanceOf(Array);
      expect(page.helpSectionId).toBeDefined();
      expect(page.tryPath).toBeDefined();
      expect(page.memberPath).toBeDefined();
      expect(page.relatedSlugs).toBeInstanceOf(Array);
    }
  });

  it("should index features by slug correctly", () => {
    expect(PLANNER_FEATURE_BY_SLUG["measure"]).toBe(PLANNER_FEATURE_PAGES[0]);
    expect(PLANNER_FEATURE_BY_SLUG["catalog"]).toBe(PLANNER_FEATURE_PAGES[1]);
  });

  it("isPlannerFeatureSlug verifies slug correctly", () => {
    expect(isPlannerFeatureSlug("measure")).toBe(true);
    expect(isPlannerFeatureSlug("catalog")).toBe(true);
    expect(isPlannerFeatureSlug("3d-view")).toBe(true);
    expect(isPlannerFeatureSlug("ai-assist")).toBe(true);
    expect(isPlannerFeatureSlug("export")).toBe(true);
    expect(isPlannerFeatureSlug("non-existent")).toBe(false);
  });
});
