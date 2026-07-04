import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OnboardingTooltips } from "@/features/planner/editor/OnboardingTooltips";

describe("OnboardingTooltips", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("does not render immediately, but shows after timeout", () => {
    render(<OnboardingTooltips />);

    expect(screen.queryByText("Drag furniture from the catalog")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText("Drag furniture from the catalog")).toBeInTheDocument();
  });

  it("allows clicking next and skip", () => {
    render(<OnboardingTooltips />);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    expect(screen.getByText("Use tools to draw walls")).toBeInTheDocument();

    const skipBtn = screen.getByRole("button", { name: "Skip" });
    fireEvent.click(skipBtn);

    expect(screen.queryByText("Use tools to draw walls")).toBeNull();
  });
});
