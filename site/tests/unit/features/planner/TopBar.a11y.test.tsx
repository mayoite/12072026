import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TopBar } from "@/features/planner/editor/TopBar";

afterEach(() => {
  cleanup();
});

/**
 * WCAG 2.5.3 Label in Name: accessible name must contain the visible label text.
 * Focus / Density buttons use aria-label that includes the visible word so
 * speech control and SR users match what they see on the control.
 */
describe("TopBar a11y — label-in-name (Focus / Density)", () => {
  const baseProps = {
    projectName: "A11y Plan",
    viewMode: "2d" as const,
  };

  it('aria-label includes "Focus" when canvas is not maximized', () => {
    render(
      <TopBar
        {...baseProps}
        isCanvasMaximized={false}
        onToggleCanvasMaximized={vi.fn()}
      />,
    );

    const focusBtn = screen.getByRole("button", { name: /Focus/i });
    const ariaLabel = focusBtn.getAttribute("aria-label");

    // Accessible name must contain the visible word (WCAG 2.5.3 label-in-name)
    expect(ariaLabel).toBeDefined();
    expect(ariaLabel).toContain("Focus");
    expect(focusBtn).toHaveTextContent("Focus");
  });

  it('Density button aria-label includes visible word "Density"', () => {
    render(<TopBar {...baseProps} onToggleDensity={vi.fn()} />);

    const densityBtn = screen.getByRole("button", { name: /Density/i });
    const ariaLabel = densityBtn.getAttribute("aria-label");

    expect(ariaLabel).toBeDefined();
    expect(ariaLabel).toContain("Density");
    expect(densityBtn).toHaveTextContent("Density");
  });

  it('aria-label includes "Restore" when canvas is maximized (pair of Focus)', () => {
    render(
      <TopBar
        {...baseProps}
        isCanvasMaximized
        onToggleCanvasMaximized={vi.fn()}
      />,
    );

    const restoreBtn = screen.getByRole("button", { name: /Restore/i });
    const ariaLabel = restoreBtn.getAttribute("aria-label");

    expect(ariaLabel).toBeDefined();
    expect(ariaLabel).toContain("Restore");
    expect(restoreBtn).toHaveTextContent("Restore");
    expect(screen.queryByRole("button", { name: /Focus/i })).not.toBeInTheDocument();
  });
});
