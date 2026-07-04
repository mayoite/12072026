import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/site-data/seo", () => ({
  buildPageMetadata: vi.fn((siteUrl, data) => ({
    title: data.title,
    description: data.description,
    canonical: `${siteUrl}${data.path}`,
    keywords: data.keywords,
  })),
}));

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://mock-site-url.com",
}));

import {
  ABOUT_PAGE_METADATA,
  SOLUTIONS_PAGE_METADATA,
  CONTACT_PAGE_METADATA,
  SUSTAINABILITY_PAGE_METADATA,
  SERVICE_PAGE_METADATA,
  PLANNING_PAGE_METADATA,
  DOWNLOADS_PAGE_METADATA,
  PRIVACY_PAGE_METADATA,
  TERMS_PAGE_METADATA,
  COMPARE_PAGE_METADATA,
  QUOTE_CART_PAGE_METADATA,
  SHOWROOMS_PAGE_METADATA,
  PROJECTS_PAGE_METADATA,
  PORTFOLIO_PAGE_METADATA,
  TRUSTED_BY_PAGE_METADATA,
  SOCIAL_PAGE_METADATA,
  NEWS_PAGE_METADATA,
  TRACKING_PAGE_METADATA,
  SUPPORT_IVR_PAGE_METADATA,
  CAREER_PAGE_METADATA,
  PRODUCTS_PAGE_METADATA,
} from "@/lib/site-data/routeMetadata";

describe("routeMetadata site-data", () => {
  it("should have correct metadata build outcomes", () => {
    expect(ABOUT_PAGE_METADATA.title).toContain("Planning-led workspace partner");
    expect(ABOUT_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/about");

    expect(SOLUTIONS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/solutions");
    expect(CONTACT_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/contact");
    expect(SUSTAINABILITY_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/sustainability");
    expect(SERVICE_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/service");
    expect(PLANNING_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/planning");
    expect(DOWNLOADS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/downloads");
    expect(PRIVACY_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/privacy");
    expect(TERMS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/terms");
    expect(COMPARE_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/compare");
    expect(QUOTE_CART_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/quote-cart");
    expect(SHOWROOMS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/showrooms");
    expect(PROJECTS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/projects");
    expect(PORTFOLIO_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/portfolio");
    expect(TRUSTED_BY_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/trusted-by");
    expect(SOCIAL_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/social");
    expect(NEWS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/news");
    expect(TRACKING_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/tracking");
    expect(SUPPORT_IVR_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/support-ivr");
    expect(CAREER_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/career");
    expect(PRODUCTS_PAGE_METADATA.canonical).toBe("https://mock-site-url.com/products");
  });
});
