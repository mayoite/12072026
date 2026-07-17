/**
 * Name-mirror: features/site/data/marketing
 */

import { describe, expect, it } from "vitest";
import {
  NEWS_PAGE_CONTENT,
  PRODUCT_CATEGORY_SECTION,
  SOCIAL_PAGE_CONTENT,
} from "@/features/site/data/marketing";

describe("PRODUCT_CATEGORY_SECTION", () => {
  it("defines table guide and catalog category cards", () => {
    expect(PRODUCT_CATEGORY_SECTION.eyebrow).toBe("Our range");
    expect(PRODUCT_CATEGORY_SECTION.tableRows).toHaveLength(4);
    expect(PRODUCT_CATEGORY_SECTION.items.length).toBeGreaterThanOrEqual(6);
    expect(PRODUCT_CATEGORY_SECTION.cta.href).toBe("/products");
    for (const item of PRODUCT_CATEGORY_SECTION.items) {
      expect(item.href).toMatch(/^\/products/);
      expect(item.image).toMatch(/^\//);
    }
  });
});

describe("NEWS_PAGE_CONTENT", () => {
  it("lists dated coverage items with a social CTA", () => {
    expect(NEWS_PAGE_CONTENT.items).toHaveLength(3);
    // /social permanently redirects — CTA must target a live indexable route.
    expect(NEWS_PAGE_CONTENT.cta.href).toBe("/portfolio");
    for (const item of NEWS_PAGE_CONTENT.items) {
      expect(item.date.trim().length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(10);
      expect(item.summary.length).toBeGreaterThan(10);
    }
  });
});

describe("SOCIAL_PAGE_CONTENT", () => {
  it("maps shoppable posts to product slugs", () => {
    expect(SOCIAL_PAGE_CONTENT.handle).toMatch(/^@/);
    expect(SOCIAL_PAGE_CONTENT.posts).toHaveLength(6);
    for (const post of SOCIAL_PAGE_CONTENT.posts) {
      expect(post.productSlug).toMatch(/^oando-/);
      expect(post.image).toMatch(/^\//);
      expect(post.caption.length).toBeGreaterThan(0);
    }
  });
});
