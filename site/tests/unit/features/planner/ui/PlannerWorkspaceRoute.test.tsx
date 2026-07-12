import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { PlannerWorkspaceRoute } from "@/features/planner/ui/PlannerWorkspaceRoute";

vi.mock("next/dynamic", () => {
  return {
    default: () => {
      return function MockWorkspace() {
        return <div data-testid="workspace" />;
      };
    },
  };
});

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

describe("PlannerWorkspaceRoute", () => {
  it("mounts Providers → ProjectSetupGate → PlannerHost shell", () => {
    render(<PlannerWorkspaceRoute guestMode={true} planId="123" />);

    expect(screen.getByTestId("providers")).toBeDefined();
    expect(screen.getByTestId("setup-gate")).toBeDefined();
    expect(screen.getByTestId("workspace")).toBeDefined();
  });
});
