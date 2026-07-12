import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  toolAccessibleName,
} from "@/features/planner/editor/canvasTool";

afterEach(() => {
  cleanup();
});

describe("CanvasToolRail RAC upgrade + a11y", () => {
  it("exposes Select with map-owned accessible name and role=radio", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="wall" onToolChange={onToolChange} />);

    const selectName = toolAccessibleName("select");
    expect(selectName).toBe("Select (V)");

    const selectBtn = screen.getByRole("radio", { name: selectName });
    expect(selectBtn).toHaveAttribute("aria-checked", "false");

    fireEvent.click(selectBtn);
    expect(onToolChange).toHaveBeenCalledWith("select");
  });

  it("marks active Opening tool checked", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="opening" onToolChange={onToolChange} />);

    const openingName = toolAccessibleName("opening");
    expect(openingName).toBe("Opening (O)");

    const openingBtn = screen.getByRole("radio", { name: openingName });
    expect(openingBtn).toHaveAttribute("aria-checked", "true");

    const rail = screen.getByRole("navigation", { name: "Canvas tools" });
    expect(rail).toHaveAttribute("data-rac-toolbar", "true");
    expect(within(rail).getByRole("radio", { name: openingName })).toBe(openingBtn);
  });

  it("marks deferred Room tool in accessible name", () => {
    render(<CanvasToolRail activeTool="wall" onToolChange={vi.fn()} />);
    const roomName = toolAccessibleName("room");
    expect(roomName).toMatch(/deferred/i);
    expect(screen.getByRole("radio", { name: roomName })).toHaveAttribute("data-deferred", "true");
  });

  it("exposes Zoom to fit as RAC button without fake 0 key", () => {
    const onZoomReset = vi.fn();
    render(
      <CanvasToolRail activeTool="select" onToolChange={vi.fn()} onZoomReset={onZoomReset} />,
    );
    const zoom = screen.getByRole("button", { name: "Zoom to fit" });
    fireEvent.click(zoom);
    expect(onZoomReset).toHaveBeenCalledTimes(1);
    expect(zoom).not.toHaveAttribute("aria-label", expect.stringContaining("(0)"));
  });

  it("labels still resolve from maps for live tools", () => {
    expect(`${CANVAS_TOOL_LABELS.wall} (${CANVAS_TOOL_SHORTCUTS.wall})`).toBe("Wall (W)");
    expect(toolAccessibleName("wall")).toBe("Wall (W)");
  });
});
