import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileStickyCta } from "@/components/home/MobileStickyCta";
import { HOMEPAGE_HERO_CONTENT } from "@/features/site/data/homepage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/lib/analytics/siteEvents", () => ({
  trackSiteCtaClick: vi.fn(),
  handlePlannerEntryNavigation: vi.fn(),
}));

vi.mock("@phosphor-icons/react", () => ({
  ArrowRight: () => <span data-testid="arrow-right" aria-hidden="true" />,
}));

describe("MobileStickyCta", () => {
  it("uses the same primary CTA label and href as HOMEPAGE_HERO_CONTENT", () => {
    const { label, href } = HOMEPAGE_HERO_CONTENT.primaryCta;
    render(<MobileStickyCta />);

    expect(screen.getByTestId("site-mobile-sticky-cta")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: new RegExp(label, "i") });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveTextContent(label);
  });
});
