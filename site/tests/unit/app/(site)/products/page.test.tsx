import "@/tests/helpers/nextIntlServerEnMock";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsPage from "@/app/(site)/products/page";
import { expectHomeMarketingShell } from "@/tests/unit/app/(site)/_template.homepage.test";

vi.mock("@/components/home/CategoryGrid", () => ({
  CategoryGrid: () => (
    <section data-testid="category-grid" className="home-section--soft">
      <div className="home-shell-xl" />
    </section>
  ),
}));

vi.mock("@/components/shared/ContactTeaser", () => ({
  ContactTeaser: () => <div data-testid="contact-teaser" />,
}));

vi.mock("@/features/site/data/seo", () => ({
  buildPageJsonLd: vi.fn(() => ({ "@type": "CollectionPage" })),
}));

vi.mock("@/lib/security/sanitize", () => ({
  sanitizeJsonForScript: vi.fn((data) => JSON.stringify(data)),
}));

describe("ProductsPage", () => {
  it("renders homepage marketing shell with category grid", async () => {
    const jsx = await ProductsPage();
    const { container } = render(jsx);

    expectHomeMarketingShell(container);
    expect(screen.getByTestId("category-grid")).toBeInTheDocument();
    expect(screen.getByTestId("contact-teaser")).toBeInTheDocument();
  });
});
