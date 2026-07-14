import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/features/planner/ui/Tooltip";

vi.mock("react-aria-components", () => ({
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
  Tooltip: ({
    children,
    placement,
  }: {
    children: React.ReactNode;
    placement?: string;
  }) => (
    <div data-testid="rac-tooltip" data-placement={placement}>
      {children}
    </div>
  ),
}));

describe("Tooltip", () => {
  afterEach(() => cleanup());

  it("renders content and optional shortcut", () => {
    render(
      <Tooltip content="Select tool" shortcut="V" side="top">
        <button type="button">Select</button>
      </Tooltip>,
    );
    expect(screen.getByText("Select tool")).toBeTruthy();
    expect(screen.getByText("V")).toBeTruthy();
    expect(screen.getByTestId("rac-tooltip").getAttribute("data-placement")).toBe(
      "top",
    );
  });
});
