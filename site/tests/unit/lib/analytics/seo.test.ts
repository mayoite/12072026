/**
 * Name-mirror coverage for lib/analytics/seo.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/site/data/seo", () => ({
  buildBreadcrumbJsonLd: vi.fn(() => ({ "@type": "BreadcrumbList" })),
  buildCanonicalUrl: vi.fn((path: string) => `https://oando.co.in${path}`),
  buildGlobalJsonLd: vi.fn(() => ({ "@type": "WebSite" })),
  buildPageJsonLd: vi.fn(() => ({ "@type": "WebPage" })),
  buildPageMetadata: vi.fn(() => ({ title: "page" })),
  buildProductJsonLd: vi.fn(() => ({ "@type": "Product" })),
  buildSiteMetadata: vi.fn(() => ({ title: "site" })),
  canonicalPath: vi.fn((path: string) => path),
}));

import {
  SITE_BRAND,
  buildFAQJsonLd,
  buildOpenGraph,
  buildOrganizationJsonLd,
  buildProductJsonLd,
} from "@/lib/analytics/seo";

describe("SITE_BRAND", () => {
  it("exports stable public brand strings and default OG image", () => {
    expect(SITE_BRAND.companyName).toBe("One&Only");
    expect(SITE_BRAND.titleSuffix).toBe("One&Only");
    expect(SITE_BRAND.siteName).toBe("One&Only");
    expect(SITE_BRAND.defaultTitle).toContain("One&Only");
    expect(SITE_BRAND.description.length).toBeGreaterThan(20);
    expect(SITE_BRAND.ogImage.startsWith("/images/")).toBe(true);
  });
});

describe("analytics/seo re-exports", () => {
  it("re-exports FAQ, OpenGraph, organization, and product builders", () => {
    const faq = buildFAQJsonLd([{ question: "Q?", answer: "A." }]);
    expect(faq["@type"]).toBe("FAQPage");

    const org = buildOrganizationJsonLd({
      name: "One&Only",
      url: "https://oando.co.in",
      logo: "https://oando.co.in/logo.webp",
    });
    expect(org["@type"]).toBe("Organization");

    const og = buildOpenGraph({
      title: "T",
      description: "D",
      url: "https://oando.co.in/",
      image: "https://oando.co.in/images/a.webp",
    });
    expect(og.images).toEqual(["https://oando.co.in/images/a.webp"]);

    const product = buildProductJsonLd({
      name: "Chair",
      description: "Desk chair",
      image: "/images/a.webp",
      url: "https://oando.co.in/products/chair",
    });
    expect(product["@type"]).toBe("Product");
  });
});
