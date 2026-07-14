import { cleanup, render } from "@testing-library/react";
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
});
