import { describe, it, expect, vi } from "vitest";
import {
  buildFAQJsonLd,
  buildItemListJsonLd,
  buildOpenGraph,
  buildOrganizationJsonLd,
  buildProductJsonLd,
} from "@/lib/helpers/seo";

vi.mock("@/lib/site-data/seo", () => ({
  buildBreadcrumbJsonLd: vi.fn(),
  buildCanonicalUrl: vi.fn(),
  buildGlobalJsonLd: vi.fn(),
  buildPageJsonLd: vi.fn(),
  buildPageMetadata: vi.fn(),
  buildSiteMetadata: vi.fn(),
  canonicalPath: vi.fn(),
}));

describe("seo helpers", () => {
  describe("buildFAQJsonLd", () => {
    it("should build structured data for FAQ page", () => {
      const items = [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
      ];
      const result = buildFAQJsonLd(items);
      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Q1",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A1",
            },
          },
          {
            "@type": "Question",
            name: "Q2",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A2",
            },
          },
        ],
      });
    });
  });

  describe("buildItemListJsonLd", () => {
    it("should build structured data for item list", () => {
      const items = [
        { name: "Item 1", item: "http://example.com/1" },
        { name: "Item 2", item: "http://example.com/2" },
      ];
      const result = buildItemListJsonLd(items);
      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Item 1",
            item: "http://example.com/1",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Item 2",
            item: "http://example.com/2",
          },
        ],
      });
    });
  });

  describe("buildOpenGraph", () => {
    it("should return formatted OpenGraph tags config", () => {
      const data = {
        title: "Test Page",
        description: "Test Desc",
        url: "http://example.com",
        image: "http://example.com/img.jpg",
      };
      const result = buildOpenGraph(data);
      expect(result).toEqual({
        title: "Test Page",
        description: "Test Desc",
        url: "http://example.com",
        images: ["http://example.com/img.jpg"],
      });
    });
  });

  describe("buildOrganizationJsonLd", () => {
    it("should return Organization structured data", () => {
      const data = {
        name: "Test Org",
        url: "http://example.com",
        logo: "http://example.com/logo.jpg",
      };
      const result = buildOrganizationJsonLd(data);
      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Test Org",
        url: "http://example.com",
        logo: "http://example.com/logo.jpg",
      });
    });
  });

  describe("buildProductJsonLd", () => {
    it("should return Product structured data", () => {
      const data = {
        name: "Test Product",
        description: "Best Product",
        url: "http://example.com/product",
        image: "http://example.com/product.jpg",
      };
      const result = buildProductJsonLd(data);
      expect(result).toEqual({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Test Product",
        description: "Best Product",
        url: "http://example.com/product",
        image: "http://example.com/product.jpg",
      });
    });
  });
});
