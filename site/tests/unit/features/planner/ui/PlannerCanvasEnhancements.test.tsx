import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerCanvasEnhancements } from "@/features/planner/ui/PlannerCanvasEnhancements";

vi.mock("@/features/planner/onboarding/OnboardingCoach", () => ({
  OnboardingCoach: ({
    plannerType,
    steps,
  }: {
    plannerType: string;
    steps: unknown[];
  }) => (
    <div
      data-testid="onboarding-coach"
      data-planner-type={plannerType}
      data-step-count={steps.length}
    />
  ),
}));

vi.mock("@/features/planner/ui/SiteProductContinuityNotice", () => ({
  SiteProductContinuityNotice: () => (
    <div data-testid="site-product-continuity-banner">Designing with Super Chair</div>
  ),
}));

describe("PlannerCanvasEnhancements", () => {
  afterEach(() => cleanup());

  it("mounts onboarding coach for member planner", () => {
    const { getByTestId } = render(<PlannerCanvasEnhancements />);
    const el = getByTestId("onboarding-coach");
    expect(el.getAttribute("data-planner-type")).toBe("planner");
    expect(Number(el.getAttribute("data-step-count"))).toBeGreaterThan(0);
  });

  it("uses guest coach type when guestMode", () => {
    const { getByTestId } = render(<PlannerCanvasEnhancements guestMode />);
    expect(getByTestId("onboarding-coach").getAttribute("data-planner-type")).toBe(
      "planner-guest",
    );
  });

  it("mounts siteProduct continuity notice only in guest mode", () => {
    const { unmount } = render(<PlannerCanvasEnhancements />);
    expect(screen.queryByTestId("site-product-continuity-banner")).toBeNull();
    unmount();

    render(<PlannerCanvasEnhancements guestMode />);
    expect(screen.getByTestId("site-product-continuity-banner")).toBeInTheDocument();
  });
});