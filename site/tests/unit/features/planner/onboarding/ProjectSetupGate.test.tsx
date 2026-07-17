import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectSetupGate } from "@/features/planner/onboarding/ProjectSetupGate";
import { projectSetupStorageKey } from "@/features/planner/onboarding/projectSetup";

describe("ProjectSetupGate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("shows project setup for guests until completion flag is set", () => {
    render(
      <ProjectSetupGate guestMode planId="guest-plan">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.getByRole("heading", { name: /Set up your space/i })).toBeInTheDocument();
    expect(screen.queryByTestId("canvas-child")).not.toBeInTheDocument();
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
    expect(screen.queryByRole("heading", { name: /Set up your space/i })).not.toBeInTheDocument();
  });

  it("offers every starting mode in the single blocking setup step", () => {
    render(
      <ProjectSetupGate guestMode planId="one-step-plan">
        <div data-testid="canvas-child">Canvas</div>
      </ProjectSetupGate>,
    );

    act(() => {
      vi.runAllTimers();
    });
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole("radio", { name: /Template/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Scratch/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Import or trace/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open planner" }));

    expect(screen.getByTestId("canvas-child")).toBeInTheDocument();
    expect(localStorage.getItem(projectSetupStorageKey(true, "one-step-plan"))).toBe("true");
  });
});
