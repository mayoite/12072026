import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "lucide-react";
import { render } from "@testing-library/react";
import { OnboardingCoach, OANDO_ONBOARDING_STEPS, BUDDY_ONBOARDING_STEPS } from "@/features/planner/onboarding/OnboardingCoach";

vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  return {
    ...actual,
    X: (props: Record<string, unknown>) => <span data-testid="icon-x" {...props} />,
    ChevronRight: (props: Record<string, unknown>) => <span data-testid="icon-chevron" {...props} />,
  };
});

describe("OnboardingCoach", () => {
  it("renders OnboardingCoach shell", () => {
    const { container } = render(
      <OnboardingCoach plannerType="oando" steps={OANDO_ONBOARDING_STEPS} respectDismissal={false} />,
    );
    expect(container).toBeDefined();
  });
  it("exposes OANDO_ONBOARDING_STEPS", () => {
    expect(Array.isArray(OANDO_ONBOARDING_STEPS)).toBe(true);
    expect(OANDO_ONBOARDING_STEPS.length).toBeGreaterThan(0);
  });
  it("exposes BUDDY_ONBOARDING_STEPS", () => {
    expect(Array.isArray(BUDDY_ONBOARDING_STEPS)).toBe(true);
    expect(BUDDY_ONBOARDING_STEPS.length).toBeGreaterThan(0);
  });
  it("should have function OnboardingCoach defined", () => {
    expect(OnboardingCoach).toBeTypeOf("function");
  });
});
