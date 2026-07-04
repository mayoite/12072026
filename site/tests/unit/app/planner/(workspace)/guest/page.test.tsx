import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerGuestRoute, { dynamic } from "@/app/planner/(workspace)/guest/page";

vi.mock("@/features/planner/ui/Open3dPlannerWorkspaceRoute", () => ({
  Open3dPlannerWorkspaceRoute: ({ guestMode }: { guestMode?: boolean }) => (
    <div data-testid="open3d-planner-route" data-guest-mode={String(guestMode)} />
  ),
}));

describe("PlannerGuestRoute", () => {
  it("exports dynamic configuration", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("renders Open3dPlannerWorkspaceRoute with guestMode true", () => {
    render(<PlannerGuestRoute />);
    const host = screen.getByTestId("open3d-planner-route");
    expect(host).toBeInTheDocument();
    expect(host).toHaveAttribute("data-guest-mode", "true");
  });
});
