import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerMarketingChrome } from "@/features/planner/components/PlannerMarketingChrome";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@/components/site/RouteChrome", () => ({
  RouteChrome: ({ position }: { position: string }) => <div data-testid="route-chrome">{position}</div>,
}));

describe("PlannerMarketingChrome", () => {
  it("renders RouteChrome when on a marketing route", () => {
    vi.mocked(usePathname).mockReturnValue("/planner");

    render(<PlannerMarketingChrome position="top" />);

    expect(screen.getByTestId("route-chrome")).toBeInTheDocument();
    expect(screen.getByText("top")).toBeInTheDocument();
  });

  it("returns null when on a workspace route", () => {
    vi.mocked(usePathname).mockReturnValue("/planner/canvas/123");

    const { container } = render(<PlannerMarketingChrome position="top" />);

    expect(container.firstChild).toBeNull();
  });
});
