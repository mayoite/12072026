import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerWorkspace } from "@/features/planner/editor/PlannerWorkspace";

vi.mock("@/features/planner/canvas-fabric", () => ({
  FloorplanProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="floorplan-provider">{children}</div>
  ),
}));

vi.mock("@/features/planner/editor/plannerWorkspaceFabricBridge", () => ({
  FabricGridBridge: () => <div data-testid="fabric-grid-bridge" />,
}));

vi.mock("@/features/planner/editor/PlannerToolFabricSync", () => ({
  PlannerToolFabricSync: () => <div data-testid="tool-fabric-sync" />,
}));

vi.mock("@/features/planner/editor/PlannerWorkspaceContent", () => ({
  PlannerWorkspaceContent: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div
      data-testid="workspace-content"
      data-guest={String(Boolean(guestMode))}
      data-plan-id={planId ?? ""}
    />
  ),
}));

describe("PlannerWorkspace", () => {
  it("composes fabric shell bridges before workspace content", () => {
    render(<PlannerWorkspace guestMode planId="plan-42" />);

    const provider = screen.getByTestId("floorplan-provider");
    expect(provider).toContainElement(screen.getByTestId("fabric-grid-bridge"));
    expect(provider).toContainElement(screen.getByTestId("tool-fabric-sync"));
    expect(provider).toContainElement(screen.getByTestId("workspace-content"));
  });

  it("forwards guestMode and planId to workspace content", () => {
    render(<PlannerWorkspace guestMode planId="plan-42" />);

    const content = screen.getByTestId("workspace-content");
    expect(content).toHaveAttribute("data-guest", "true");
    expect(content).toHaveAttribute("data-plan-id", "plan-42");
  });
});
