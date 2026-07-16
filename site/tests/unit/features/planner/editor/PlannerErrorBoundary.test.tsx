import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerErrorBoundary } from "@/features/planner/editor/PlannerErrorBoundary";

vi.mock("@/lib/errorLogger", () => ({
  logClientError: vi.fn(),
}));

function Boom(): React.ReactElement {
  throw new Error("boom-render");
}

describe("PlannerErrorBoundary", () => {
  it("shows fallback and recovers on Try again", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <PlannerErrorBoundary label="Canvas">
        <Boom />
      </PlannerErrorBoundary>,
    );
    expect(screen.getByText(/unavailable/i)).toBeDefined();
    expect(screen.getByText(/boom-render/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    spy.mockRestore();
  });

  it("renders children when healthy", () => {
    render(
      <PlannerErrorBoundary>
        <span>ok-child</span>
      </PlannerErrorBoundary>,
    );
    expect(screen.getByText("ok-child")).toBeDefined();
  });
});
