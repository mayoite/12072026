import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerFeatureDemo } from "@/features/planner/landing/PlannerFeatureDemo";

describe("PlannerFeatureDemo", () => {
  const slugs = ["measure", "catalog", "3d-view", "ai-assist", "export"] as const;

  slugs.forEach((slug) => {
    it(`renders demo for slug: ${slug}`, () => {
      const { container } = render(<PlannerFeatureDemo slug={slug} />);

      // Step indicator should render
      expect(screen.getByText("Step 02 of 3")).toBeInTheDocument();
      expect(screen.getByText("Draw floor outline")).toBeInTheDocument();
      expect(screen.getByText("Place furniture")).toBeInTheDocument();
      expect(screen.getByText("Export PDF & quote")).toBeInTheDocument();

      // Stat bar should render
      expect(
        screen.getByText(
          "1,200+ layouts created · 43 cities across India · Export to PDF or Quote in 1 click."
        )
      ).toBeInTheDocument();

      // SVG should render
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("returns null for unknown slugs", () => {
    const { container } = render(<PlannerFeatureDemo slug={"unknown-slug" as any} />);
    expect(container.firstChild).toBeNull();
  });
});
