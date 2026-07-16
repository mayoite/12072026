import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";
import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_REQUIREMENT,
  CANVAS_TOOL_SHORTCUTS,
  RAIL_DEFERRED_TOOLS,
  RAIL_DRAW_TOOLS,
  RAIL_NAV_TOOLS,
  toolAccessibleName,
  type PlannerTool,
} from "@/features/planner/editor/canvasTool";

afterEach(() => {
  cleanup();
});

const RAIL_TOOLS: readonly PlannerTool[] = [
  ...RAIL_NAV_TOOLS,
  ...RAIL_DRAW_TOOLS,
  ...RAIL_DEFERRED_TOOLS,
];

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

  it("exposes Grid and Snap as direct pressed-state controls", () => {
    const onToggleGrid = vi.fn();
    const onToggleSnap = vi.fn();
    render(
      <CanvasToolRail
        activeTool="select"
        onToolChange={vi.fn()}
        gridEnabled
        snapEnabled={false}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
      />,
    );

    const grid = screen.getByRole("button", { name: "Disable Grid" });
    const snap = screen.getByRole("button", { name: "Enable Snap" });
    expect(grid).toHaveAttribute("aria-pressed", "true");
    expect(snap).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(grid);
    fireEvent.click(snap);
    expect(onToggleGrid).toHaveBeenCalledTimes(1);
    expect(onToggleSnap).toHaveBeenCalledTimes(1);
  });

  it("does not render hover tooltips", () => {
    render(
      <CanvasToolRail
        activeTool="select"
        onToolChange={vi.fn()}
        onZoomReset={vi.fn()}
      />,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("labels still resolve from maps for live tools", () => {
    expect(`${CANVAS_TOOL_LABELS.wall} (${CANVAS_TOOL_SHORTCUTS.wall})`).toBe("Wall (W)");
    expect(toolAccessibleName("wall")).toBe("Wall (W)");
  });

  it("stamps data-deferred + data-tier only for deferred rail tools", () => {
    render(<CanvasToolRail activeTool="select" onToolChange={vi.fn()} />);

    for (const tool of RAIL_TOOLS) {
      const btn = screen.getByTestId(`canvas-tool-${tool}`);
      const tier = CANVAS_TOOL_REQUIREMENT[tool];
      expect(btn).toHaveAttribute("data-tier", tier);

      if (tier === "deferred") {
        expect(btn).toHaveAttribute("data-deferred", "true");
        expect(toolAccessibleName(tool)).toMatch(/deferred/i);
        expect(btn).toHaveAttribute("aria-label", toolAccessibleName(tool));
      } else {
        expect(btn).not.toHaveAttribute("data-deferred");
        expect(toolAccessibleName(tool).toLowerCase()).not.toContain("deferred");
      }
    }
  });

  it("renders both deferred draw tools (room + dimension) on the rail", () => {
    render(<CanvasToolRail activeTool="wall" onToolChange={vi.fn()} />);
    for (const tool of ["room", "dimension"] as const) {
      expect(CANVAS_TOOL_REQUIREMENT[tool]).toBe("deferred");
      const btn = screen.getByRole("radio", { name: toolAccessibleName(tool) });
      expect(btn).toHaveAttribute("data-deferred", "true");
      expect(btn).toHaveAttribute("data-tier", "deferred");
    }
  });

  it("keeps live draw tools free of deferred attrs", () => {
    render(<CanvasToolRail activeTool="wall" onToolChange={vi.fn()} />);
    for (const tool of ["wall", "opening", "placement"] as const) {
      const btn = screen.getByTestId(`canvas-tool-${tool}`);
      expect(btn).toHaveAttribute("data-tier", "live");
      expect(btn).not.toHaveAttribute("data-deferred");
    }
  });
});
