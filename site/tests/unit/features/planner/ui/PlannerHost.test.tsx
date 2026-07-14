import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlannerHost } from "@/features/planner/ui/PlannerHost";

vi.mock("@/features/planner/editor/OOPlannerWorkspace", () => ({
  OOPlannerWorkspace: ({
    guestMode,
    planId,
  }: {
    guestMode?: boolean;
    planId?: string;
  }) => (
    <div
      data-testid="oo-workspace"
      data-guest={String(Boolean(guestMode))}
      data-plan-id={planId ?? ""}
    />
  ),
}));

describe("PlannerHost", () => {
  afterEach(() => cleanup());

  it("wraps OOPlannerWorkspace in host shell classes", () => {
    const { container, getByTestId } = render(
      <PlannerHost planId="plan-1" guestMode />,
    );
    const host = container.querySelector(".planner-route-host.open3d-route-host");
    expect(host).toBeTruthy();
    expect(getByTestId("oo-workspace").getAttribute("data-guest")).toBe("true");
    expect(getByTestId("oo-workspace").getAttribute("data-plan-id")).toBe(
      "plan-1",
    );
  });
});
