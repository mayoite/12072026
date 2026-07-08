"use client";

import { OnboardingCoach } from "@/features/planner/onboarding/OnboardingCoach";
import { PLANNER_ONBOARDING_STEPS } from "../onboarding/steps";

interface PlannerCanvasEnhancementsProps {
  guestMode?: boolean;
}

export function PlannerCanvasEnhancements({ guestMode = false }: PlannerCanvasEnhancementsProps) {
  // Note: Open3D native bootstrap logic is now handled entirely within OOPlannerWorkspace.tsx

  return (
    <>
      <OnboardingCoach
        plannerType={guestMode ? "planner-guest" : "planner"}
        steps={PLANNER_ONBOARDING_STEPS}
      />
    </>
  );
}
