import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TopBar } from "@/features/planner/open3d/editor/TopBar";

afterEach(() => {
  cleanup();
});

/**
 * WCAG 2.5.3 Label in Name: accessible name must contain the visible label text.
 * Focus / Prefs buttons use aria-label that includes the visible word so
 * speech control and SR users match what they see on the control.
 */
describe("TopBar a11y — label-in-name (Focus / Prefs)", () => {
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
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("Focus");
    expect(focusBtn).toHaveTextContent("Focus");
  });

  it('Prefs button aria-label includes visible word "Prefs"', () => {
    render(<TopBar {...baseProps} />);

    const prefsBtn = screen.getByRole("button", { name: /Prefs/i });
    const ariaLabel = prefsBtn.getAttribute("aria-label");

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("Prefs");
    expect(prefsBtn).toHaveTextContent("Prefs");
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

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("Restore");
    expect(restoreBtn).toHaveTextContent("Restore");
    expect(screen.queryByRole("button", { name: /Focus/i })).not.toBeInTheDocument();
  });
});
