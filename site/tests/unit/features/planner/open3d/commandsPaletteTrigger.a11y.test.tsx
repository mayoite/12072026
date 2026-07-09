import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CommandsPaletteTrigger } from "@/features/planner/open3d/editor/CommandsPaletteTrigger";

afterEach(() => {
  cleanup();
});

/**
 * WCAG 2.5.3 Label in Name: Commands palette trigger accessible name must
 * contain the visible word "Commands" (speech control + SR match chrome text).
 * Production surface: OOPlannerWorkspace statusRight → open3d-palette-trigger.
 */
describe("CommandsPaletteTrigger a11y — label-in-name (Commands)", () => {
  it('aria-label contains "Commands" and is the accessible name for the button', () => {
    const onOpen = vi.fn();
    render(<CommandsPaletteTrigger onOpen={onOpen} />);

    const btn = screen.getByRole("button", { name: /Commands/i });
    const ariaLabel = btn.getAttribute("aria-label");

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain("Commands");
    expect(btn).toHaveTextContent("Commands");

    fireEvent.click(btn);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
