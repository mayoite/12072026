import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
} from "@/features/planner/editor/canvasTool";

afterEach(() => {
  cleanup();
});

describe("CanvasToolRail a11y + shortcut surface", () => {
  it("exposes Select with accessible name Select (V) from label + shortcut maps", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="wall" onToolChange={onToolChange} />);

    const selectName = `${CANVAS_TOOL_LABELS.select} (${CANVAS_TOOL_SHORTCUTS.select})`;
    expect(selectName).toBe("Select (V)");

    const selectBtn = screen.getByRole("button", { name: selectName });
    expect(selectBtn).toHaveAttribute("aria-pressed", "false");
    expect(selectBtn).toHaveAttribute("title", selectName);

    fireEvent.click(selectBtn);
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenCalledWith("select");
  });

  it("exposes Opening with accessible name Opening (O) and marks active tool pressed", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="opening" onToolChange={onToolChange} />);

    expect(CANVAS_TOOL_SHORTCUTS.opening).toBe("O");
    const openingName = `${CANVAS_TOOL_LABELS.opening} (${CANVAS_TOOL_SHORTCUTS.opening})`;
    expect(openingName).toBe("Opening (O)");

    const openingBtn = screen.getByRole("button", { name: openingName });
    expect(openingBtn).toHaveAttribute("aria-pressed", "true");
    expect(openingBtn).toHaveAttribute("title", openingName);

    const rail = screen.getByRole("navigation", { name: "Canvas tools" });
    expect(within(rail).getByRole("button", { name: openingName })).toBe(openingBtn);
  });
});
