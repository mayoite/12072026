import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ProjectSetupGate,
  tryCompleteGuestSetupWithDefaults,
} from "@/features/planner/onboarding/ProjectSetupGate";
import { projectSetupStorageKey } from "@/features/planner/onboarding/projectSetup";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

describe("ProjectSetupGate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    usePlannerWorkspaceStore.setState({
      projectMetadata: null,
      pendingBootstrapLayout: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("skips the setup form for guests and opens canvas with defaults", () => {
    render(
      <ProjectSetupGate guestMode planId="guest-plan">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId("canvas-child")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Set up your space|Open the canvas/i })).not.toBeInTheDocument();
    expect(localStorage.getItem(projectSetupStorageKey(true, "guest-plan"))).toBe("true");
    expect(usePlannerWorkspaceStore.getState().projectMetadata?.projectName).toBe("Guest plan");
  });

  it("renders children for guests when setup is already complete in storage", () => {
    localStorage.setItem(projectSetupStorageKey(true, "guest-plan"), "true");

    render(
      <ProjectSetupGate guestMode planId="guest-plan">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByTestId("canvas-child")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Set up your space|Open the canvas/i })).not.toBeInTheDocument();
  });

  it("shows full project setup for members until completion", () => {
    render(
      <ProjectSetupGate guestMode={false} planId="member-plan">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole("heading", { name: /Set up your space/i })).toBeInTheDocument();
    expect(screen.queryByTestId("canvas-child")).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Starter layout/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Blank canvas/i })).toBeInTheDocument();
  });

  it("member path still requires completing setup before canvas", () => {
    render(
      <ProjectSetupGate guestMode={false} planId="member-one-step">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.runAllTimers();
    });
    act(() => {
      vi.runAllTimers();
    });

    fireEvent.change(screen.getByLabelText("Project name"), {
      target: { value: "Member HQ" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Open planner" }));

    expect(screen.getByTestId("canvas-child")).toBeInTheDocument();
    expect(localStorage.getItem(projectSetupStorageKey(false, "member-one-step"))).toBe("true");
  });

  it("tryCompleteGuestSetupWithDefaults marks storage and seeds Guest plan metadata", () => {
    const ok = tryCompleteGuestSetupWithDefaults("defaults-plan");
    expect(ok).toBe(true);
    expect(localStorage.getItem(projectSetupStorageKey(true, "defaults-plan"))).toBe("true");
    expect(usePlannerWorkspaceStore.getState().projectMetadata).toMatchObject({
      projectName: "Guest plan",
      floorAreaSqFt: 1000,
      seatTarget: 50,
    });
    expect(usePlannerWorkspaceStore.getState().pendingBootstrapLayout).not.toBeNull();
  });
});
