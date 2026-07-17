"use client";

import { PlannerToolsShowcase } from "@/features/planner/landing/PlannerToolsShowcase";
import { HOMEPAGE_PLANNER_SUITE_CONTENT } from "@/features/site/data/homepage";

export function InteractiveTools() {
  return (
    <PlannerToolsShowcase
      testId="home-tools"
      headingLevel="h2"
      kicker="Workspace planning"
      title={{ lead: "Design your ", accent: "workspace" }}
      description="True-scale floor plans with catalog furniture, zones, and dimensions — export layouts before you quote."
      primaryCta={{
        label: HOMEPAGE_PLANNER_SUITE_CONTENT.launchLabel,
        href: HOMEPAGE_PLANNER_SUITE_CONTENT.launchHref,
      }}
      demoHref="/planner/"
      demoTestId="home-tools-floorplan"
      variant="homepage"
      reveal="inView"
    />
  );
}
