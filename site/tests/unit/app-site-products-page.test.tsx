import "@/tests/helpers/nextIntlServerEnMock";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsPage from "@/app/(site)/products/page";

vi.mock("@/components/home/CategoryGrid", () => ({
  CategoryGrid: () => <div data-testid="category-grid" />,
}));
vi.mock("@/components/shared/ContactTeaser", () => ({
  ContactTeaser: () => <div data-testid="contact-teaser" />,
}));

vi.mock("@/lib/site-data/seo", () => ({
  buildPageJsonLd: vi.fn(() => ({ "@type": "CollectionPage" })),
  buildPageMetadata: vi.fn(() => ({ title: "Mock Meta" })),
}));
vi.mock("@/lib/security/sanitize", () => ({
  sanitizeJsonForScript: vi.fn((data) => JSON.stringify(data)),
}));
vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://example.com",
}));

describe("ProductsPage", () => {
  it("renders correctly", async () => {
    const page = await ProductsPage();
    const { container } = render(page);

    expect(screen.getByTestId("category-grid")).toBeInTheDocument();
    expect(screen.getByTestId("contact-teaser")).toBeInTheDocument();

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script?.textContent).toContain("CollectionPage");
  });
});
