import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ProjectSetupStep } from "@/features/planner/onboarding/ProjectSetupStep";

import * as projectSetupMod from "@/features/planner/onboarding/projectSetup";
import { suggestLayoutGridPack } from "@/features/planner/ai/spaceSuggest";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

describe("ProjectSetupStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(projectSetupMod, "applyProjectSetup").mockImplementation(vi.fn());
    usePlannerWorkspaceStore.getState().setPendingBootstrapLayout(
      suggestLayoutGridPack({
        seatCount: 6,
        purpose: "workstations",
        floorAreaSqFt: 1000,
      }),
    );
  });

  it("keeps submit disabled until hydration completes", async () => {
    render(<ProjectSetupStep guestMode onComplete={vi.fn()} />);

    const button = screen.getByRole("button", { name: /preparing workspace/i });
    expect(button).toBeDisabled();

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /open planner/i }),
      ).toBeEnabled(),
    );
  });

  it("keeps the streamlined city and floor-area layout", () => {
    render(<ProjectSetupStep guestMode onComplete={vi.fn()} />);

    const city = screen.getByLabelText("City");
    const floorArea = screen.getByLabelText("Floor area (sq ft)");
    const row = city.closest(".grid");

    expect(row).toHaveClass("md:grid-cols-2");
    expect(row).toContainElement(floorArea);
    expect(screen.queryByLabelText(/target seat count/i)).not.toBeInTheDocument();
    expect(screen.getByText("Add the basics once. We size the grid and tailor the planner to this layout.")).toBeInTheDocument();
  });

  it("applies project setup after hydration", async () => {
    const onComplete = vi.fn();
    render(<ProjectSetupStep guestMode onComplete={onComplete} />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /open planner/i }),
      ).toBeEnabled(),
    );

    fireEvent.change(screen.getByLabelText("Project name"), {
      target: { value: "Hydrated planner" },
    });
    fireEvent.click(screen.getByRole("button", { name: /open planner/i }));

    await waitFor(() => expect(projectSetupMod.applyProjectSetup).toHaveBeenCalledTimes(1));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(usePlannerWorkspaceStore.getState().pendingBootstrapLayout).toBeNull();
  });
});
