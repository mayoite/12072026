import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { PlannerFeaturePageView } from "@/features/planner/landing/PlannerFeaturePageView";

vi.mock("@/features/planner/landing/PlannerFeatureDemo", () => ({
  PlannerFeatureDemo: ({ slug }: { slug: string }) => (
    <div data-testid="feature-demo">{slug}</div>
  ),
}));

vi.mock("@/features/planner/landing/PlannerBreadcrumbs", () => ({
  PlannerBreadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

describe("PlannerFeaturePageView", () => {
  it("renders feature detail page correctly for measure feature", () => {
    render(<PlannerFeaturePageView slug="measure" />);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.getByTestId("home-section")).toBeInTheDocument();

    // Breadcrumbs should render
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();

    // Tagline and title
    expect(screen.getByText("Dimensions and area totals")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Check room sizes before you commit to furniture orders",
      })
    ).toBeInTheDocument();

    // Summary
    expect(
      screen.getByText(
        "Measure walls, check room areas, and confirm everything fits — so you can walk into procurement meetings with numbers, not guesses."
      )
    ).toBeInTheDocument();

    // CTA links
    const startFreeLink = screen.getAllByRole("link", { name: "Start free" })[0];
    expect(startFreeLink).toHaveAttribute("href", "/planner/guest/");

    // Help article link
    const helpLink = screen.getByRole("link", { name: "Read the help article" });
    expect(helpLink).toHaveAttribute("href", "/planner/help/#measurements");

    // Bullets list
    expect(
      screen.getByText("Click any wall or span to see its length in millimetres")
    ).toBeInTheDocument();

    // Related features section
    expect(screen.getByRole("heading", { name: /Works well with/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Send a PDF layout and quote request to your vendor in one click",
      })
    ).toBeInTheDocument();

    // Previous / Next Nav
    // measure is the first, so no previous link, but there should be a next link
    const nextLink = within(screen.getByRole("navigation", { name: "Feature pages" })).getByRole("link", {
      name: /Drag and drop desks and cabinets to see your floor instantly/i,
    });
    expect(nextLink).toHaveAttribute("href", "/planner/features/catalog/");
  });

  it("renders next and previous links correctly for middle feature", () => {
    render(<PlannerFeaturePageView slug="catalog" />);

    // Previous link
    const prevLink = screen.getByRole("link", {
      name: /Check room sizes before you commit to furniture orders/i,
    });
    expect(prevLink).toHaveAttribute("href", "/planner/features/measure/");

    // Next link
    const nextLink = within(screen.getByRole("navigation", { name: "Feature pages" })).getByRole("link", {
      name: /Walk through your layout in 3D before anything gets delivered/i,
    });
    expect(nextLink).toHaveAttribute("href", "/planner/features/3d-view/");
  });
});
