import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessChrome } from "@/features/planner/editor/chrome/widgets/AccessChrome";

describe("AccessChrome", () => {
  it("renders panels buttons and responds to interactions", () => {
    const onToggleLeft = vi.fn();
    const onToggleRight = vi.fn();
    const onToggleLeftCollapsed = vi.fn();
    const onResetLayout = vi.fn();

    const { rerender } = render(
      <AccessChrome
        leftOpen={true}
        rightOpen={false}
        leftCollapsed={false}
        onToggleLeft={onToggleLeft}
        onToggleRight={onToggleRight}
        onToggleLeftCollapsed={onToggleLeftCollapsed}
        onResetLayout={onResetLayout}
      />
    );

    // Verify leftOpen panel button is active and pressed
    const leftBtn = screen.getByLabelText("Close library panel");
    expect(leftBtn.getAttribute("data-active")).toBe("true");
    expect(leftBtn.getAttribute("aria-pressed")).toBe("true");
    leftBtn.click();
    expect(onToggleLeft).toHaveBeenCalled();

    // Verify rightOpen panel button is not active
    const rightBtn = screen.getByLabelText("Open properties panel");
    expect(rightBtn.getAttribute("data-active")).toBeNull();
    expect(rightBtn.getAttribute("aria-pressed")).toBe("false");
    rightBtn.click();
    expect(onToggleRight).toHaveBeenCalled();

    // Verify reset layout button is enabled
    const resetBtn = screen.getByLabelText("Reset planner chrome layout");
    expect(resetBtn).not.toBeDisabled();
    resetBtn.click();
    expect(onResetLayout).toHaveBeenCalled();

    // Verify collapse left panel button
    const collapseBtn = screen.getByLabelText("Collapse left panel rail");
    expect(collapseBtn.getAttribute("data-active")).toBeNull();
    expect(collapseBtn.getAttribute("aria-pressed")).toBe("false");
    collapseBtn.click();
    expect(onToggleLeftCollapsed).toHaveBeenCalled();

    // Rerender with different state
    rerender(
      <AccessChrome
        leftOpen={false}
        rightOpen={true}
        leftCollapsed={true}
        onToggleLeft={onToggleLeft}
        onToggleRight={onToggleRight}
        onToggleLeftCollapsed={onToggleLeftCollapsed}
        onResetLayout={undefined}
      />
    );

    expect(screen.getByLabelText("Open library panel")).toBeInTheDocument();
    expect(screen.getByLabelText("Close properties panel")).toBeInTheDocument();
    expect(screen.getByLabelText("Expand left panel rail")).toBeInTheDocument();
    expect(screen.getByLabelText("Reset planner chrome layout")).toBeDisabled();
  });
});
