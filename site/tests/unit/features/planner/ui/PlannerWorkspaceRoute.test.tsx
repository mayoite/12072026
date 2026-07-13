import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockWorkspace() {
      return <div data-testid="workspace" />;
    },
}));

vi.mock("@/features/planner/components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

vi.mock("@/features/planner/onboarding/ProjectSetupGate", () => ({
  ProjectSetupGate: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="setup-gate">{children}</div>
  ),
}));

vi.mock("@/features/planner/ui/PlannerCanvasEnhancements", () => ({
  PlannerCanvasEnhancements: () => <div data-testid="canvas-enhancements" />,
}));

describe("PlannerWorkspaceRoute", () => {
  it("mounts Providers, ProjectSetupGate, PlannerHost, and canvas enhancements", () => {
    render(<PlannerWorkspaceRoute guestMode planId="123" />);

    expect(screen.getByTestId("providers")).toBeDefined();
    expect(screen.getByTestId("setup-gate")).toBeDefined();
    expect(screen.getByTestId("workspace")).toBeDefined();
    expect(screen.getByTestId("canvas-enhancements")).toBeDefined();
  });
});
