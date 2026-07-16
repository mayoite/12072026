import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PlannerTooltip,
  PlannerIconButton,
} from "@/features/planner/ui/PlannerTooltip";

vi.mock("@/features/planner/ui/Tooltip", () => ({
  Tooltip: ({
    content,
    shortcut,
    children,
  }: {
    content: string;
    shortcut?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="tooltip" data-content={content} data-shortcut={shortcut ?? ""}>
      {children}
    </div>
  ),
}));

describe("PlannerTooltip", () => {
  afterEach(() => cleanup());

  it("wraps children with label content", () => {
    render(
      <PlannerTooltip label="Undo" hint="last action" shortcut="Ctrl+Z">
        <button type="button">U</button>
      </PlannerTooltip>,
    );
    expect(screen.getByTestId("tooltip").getAttribute("data-content")).toBe(
      "Undo: last action",
    );
  });

  it("returns children only when disabled", () => {
    render(
      <PlannerTooltip label="X" disabled>
        <button type="button">plain</button>
      </PlannerTooltip>,
    );
    expect(screen.queryByTestId("tooltip")).toBeNull();
    expect(screen.getByText("plain")).toBeDefined();
  });

  it("PlannerIconButton sets aria-label", () => {
    render(
      <PlannerIconButton label="Zoom fit" onClick={() => undefined}>
        Z
      </PlannerIconButton>,
    );
    expect(screen.getByRole("button", { name: "Zoom fit" })).toBeDefined();
  });
});
