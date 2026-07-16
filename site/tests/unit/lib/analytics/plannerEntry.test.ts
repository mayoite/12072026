import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  buildPlannerEntryCampaign,
  buildPlannerEntryHref,
  isPlannerEntryHref,
} from "@/lib/analytics/plannerEntry";

describe("plannerEntry", () => {
  beforeEach(() => {
    document.cookie = "oando_seo_source=google; path=/";
    document.cookie = "oando_seo_medium=cpc; path=/";
    document.cookie = "oando_seo_campaign=spring; path=/";
  });

  afterEach(() => {
    document.cookie = "oando_seo_source=; Max-Age=0; path=/";
    document.cookie = "oando_seo_medium=; Max-Age=0; path=/";
    document.cookie = "oando_seo_campaign=; Max-Age=0; path=/";
  });

  it("detects planner workspace entry hrefs", () => {
    expect(isPlannerEntryHref("/planner")).toBe(true);
    expect(isPlannerEntryHref("/planner/guest")).toBe(true);
    expect(isPlannerEntryHref("/planner/canvas")).toBe(true);
    expect(isPlannerEntryHref("/planner/help")).toBe(false);
    expect(isPlannerEntryHref("/planner/features/measure")).toBe(false);
    expect(isPlannerEntryHref("/products")).toBe(false);
  });

  it("builds campaign strings with product, category, surface, and utm", () => {
    const campaign = buildPlannerEntryCampaign({
      sourcePage: "/products/seating/chair",
      surface: "pdp",
      productSlug: "chair",
      categoryId: "seating",
    });
    expect(campaign).toContain("product:chair");
    expect(campaign).toContain("category:seating");
    expect(campaign).toContain("surface:pdp");
    expect(campaign).toContain("utm:spring");
  });

  it("carries site product identity without cookie utm in default href (SSR-safe)", () => {
    const href = buildPlannerEntryHref("/planner/guest", {
      sourcePage: "/products/seating/chair",
      productSlug: "chair",
      categoryId: "seating",
    });
    expect(href).toContain("siteProduct=chair");
    expect(href).toContain("siteCategory=seating");
    expect(href).toContain("siteSource=%2Fproducts%2Fseating%2Fchair");
    expect(href).not.toContain("utm_source=");
    expect(href).not.toContain("utm_medium=");
  });

  it("adds cookie utm params only when includeAttribution is set", () => {
    const href = buildPlannerEntryHref(
      "/planner/guest",
      { sourcePage: "/", productSlug: "chair", categoryId: "seating" },
      { includeAttribution: true },
    );
    expect(href).toContain("utm_source=google");
    expect(href).toContain("utm_medium=cpc");
    expect(href).toContain("utm_campaign=spring");
  });
});