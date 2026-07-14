import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerCanvasRoute, {
  dynamic,
} from "@/app/planner/(workspace)/canvas/page";
import { getOptionalPlannerUser } from "@/lib/auth/plannerSession";

vi.mock("@/lib/auth/plannerSession", () => ({
  getOptionalPlannerUser: vi.fn(),
}));

vi.mock("@/features/planner/ui/PlannerWorkspaceRoute", () => ({
  PlannerWorkspaceRoute: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div
      data-testid="open3d-planner-route"
      data-guest-mode={String(guestMode)}
      data-plan-id={planId ?? ""}
    />
  ),
}));

describe("PlannerCanvasRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports dynamic configuration", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("renders guestMode true when no planner user", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue(null);
    render(
      await PlannerCanvasRoute({
        searchParams: Promise.resolve({}),
      }),
    );
    const host = screen.getByTestId("open3d-planner-route");
    expect(host).toHaveAttribute("data-guest-mode", "true");
    expect(host).toHaveAttribute("data-plan-id", "");
  });

  it("renders member mode with planId from searchParams", async () => {
    vi.mocked(getOptionalPlannerUser).mockResolvedValue({
      id: "user-1",
      email: "member@test.com",
    } as never);
    render(
      await PlannerCanvasRoute({
        searchParams: Promise.resolve({ id: "plan-99" }),
      }),
    );
    const host = screen.getByTestId("open3d-planner-route");
    expect(host).toHaveAttribute("data-guest-mode", "false");
    expect(host).toHaveAttribute("data-plan-id", "plan-99");
  });
});
