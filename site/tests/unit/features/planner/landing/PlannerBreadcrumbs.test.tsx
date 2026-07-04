import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerBreadcrumbs } from "@/features/planner/landing/PlannerBreadcrumbs";

describe("PlannerBreadcrumbs", () => {
  it("renders a list of breadcrumbs", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Planner", href: "/planner" },
      { label: "Help" },
    ];
    render(<PlannerBreadcrumbs items={items} />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Planner")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");

    const plannerLink = screen.getByText("Planner").closest("a");
    expect(plannerLink).toHaveAttribute("href", "/planner");

    const helpSpan = screen.getByText("Help");
    expect(helpSpan.tagName.toLowerCase()).toBe("span");
    expect(helpSpan).toHaveAttribute("aria-current", "page");
  });

  it("handles empty items list without crashing", () => {
    const { container } = render(<PlannerBreadcrumbs items={[]} />);
    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
