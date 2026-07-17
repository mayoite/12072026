import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerHost } from "@/features/planner/ui/PlannerHost";

vi.mock("@/features/planner/editor/OOPlannerWorkspace", () => ({
  OOPlannerWorkspace: ({
    guestMode,
    planId,
    ownerId,
  }: {
    guestMode?: boolean;
    planId?: string;
    ownerId?: string;
  }) => (
    <div
      data-testid="oo-workspace"
      data-guest={String(Boolean(guestMode))}
      data-plan-id={planId ?? ""}
      data-owner-id={ownerId ?? ""}
    />
  ),
}));

describe("PlannerHost", () => {
  afterEach(() => cleanup());

  it("wraps OOPlannerWorkspace in host shell classes", () => {
    const { container, getByTestId } = render(
      <PlannerHost planId="plan-1" ownerId="owner-1" guestMode />,
    );
    const host = container.querySelector(".planner-route-host.open3d-route-host");
    expect(host).toBeDefined();
    expect(getByTestId("oo-workspace").getAttribute("data-guest")).toBe("true");
    expect(getByTestId("oo-workspace").getAttribute("data-plan-id")).toBe(
      "plan-1",
    );
    expect(getByTestId("oo-workspace").getAttribute("data-owner-id")).toBe(
      "owner-1",
    );
  });
});
