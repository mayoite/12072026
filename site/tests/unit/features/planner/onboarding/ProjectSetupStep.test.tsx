import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectSetupStep } from "@/features/planner/onboarding/ProjectSetupStep";
import * as projectSetupMod from "@/features/planner/onboarding/projectSetup";
import {
  GUEST_DEFAULT_PROJECT_NAME,
  resolveGuestSetupSubmit,
} from "@/features/planner/onboarding/projectSetup";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

describe("resolveGuestSetupSubmit", () => {
  it("defaults empty name to Guest plan and clamps invalid size/seats", () => {
    expect(
      resolveGuestSetupSubmit({
        projectName: "   ",
        city: "Patna",
        floorAreaSqFt: Number.NaN,
        primaryPurpose: "workstations",
        seatTarget: 0,
      }),
    ).toEqual({
      projectName: GUEST_DEFAULT_PROJECT_NAME,
      floorAreaSqFt: 1000,
      seatTarget: 50,
    });
  });

  it("keeps a custom guest name and valid numbers", () => {
    expect(
      resolveGuestSetupSubmit({
        projectName: "Beach HQ",
        city: "Mumbai",
        floorAreaSqFt: 2000,
        primaryPurpose: "mixed",
        seatTarget: 12,
      }),
    ).toEqual({
      projectName: "Beach HQ",
      floorAreaSqFt: 2000,
      seatTarget: 12,
    });
  });
});

describe("ProjectSetupStep", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    localStorage.clear();
    vi.spyOn(projectSetupMod, "applyProjectSetup").mockImplementation(vi.fn());
    usePlannerWorkspaceStore.setState({
      projectMetadata: null,
      pendingBootstrapLayout: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("pre-fills guest draft with Guest plan and hides multi-field essay until customize", async () => {
    render(<ProjectSetupStep guestMode onComplete={vi.fn()} />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByLabelText(/Project name/i)).toHaveValue(GUEST_DEFAULT_PROJECT_NAME);
    expect(screen.getByRole("heading", { name: /Open the canvas in one tap/i })).toBeInTheDocument();
    expect(screen.queryByLabelText("City")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Floor area (sq ft)")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Customize city, size, and start mode/i })).toBeInTheDocument();
  });

  it("guest one-tap Open planner without filling fields", async () => {
    const onComplete = vi.fn();
    render(<ProjectSetupStep guestMode onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    const submit = screen.getByRole("button", { name: /open planner/i });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(projectSetupMod.applyProjectSetup).toHaveBeenCalledWith(
      expect.objectContaining({
        projectName: GUEST_DEFAULT_PROJECT_NAME,
        floorAreaSqFt: 1000,
        seatTarget: 50,
      }),
    );
    expect(onComplete.mock.calls[0]?.[0]).toMatchObject({
      projectName: GUEST_DEFAULT_PROJECT_NAME,
    });
  });

  it("guest empty name still submits as Guest plan", async () => {
    const onComplete = vi.fn();
    render(<ProjectSetupStep guestMode onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    fireEvent.change(screen.getByLabelText(/Project name/i), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /open planner/i }));

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
    expect(projectSetupMod.applyProjectSetup).toHaveBeenCalledWith(
      expect.objectContaining({ projectName: GUEST_DEFAULT_PROJECT_NAME }),
    );
  });

  it("member still requires a project name before continue", async () => {
    const onComplete = vi.fn();
    render(<ProjectSetupStep guestMode={false} onComplete={onComplete} />);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByRole("button", { name: /open planner/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/project name/i);
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Floor area (sq ft)")).toBeInTheDocument();
  });

  it("should have function ProjectSetupStep defined", () => {
    expect(ProjectSetupStep).toBeTypeOf("function");
  });
});
