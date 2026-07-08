import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Wall as BrickWall, Hand, Cursor as MousePointer2 } from "@phosphor-icons/react";

import { PlannerMobileDock } from "@/features/planner/editor/PlannerMobileDock";
import type { ToolDef } from "@/features/planner/editor/PlannerToolRail";

const dockTools: ToolDef[] = [
  {
    id: "select",
    toolId: "select",
    plannerTool: "select",
    label: "Select",
    hint: "Pick objects",
    shortcut: "V",
    icon: MousePointer2,
  },
  {
    id: "hand",
    toolId: "hand",
    plannerTool: "pan",
    label: "Pan",
    hint: "Move canvas",
    shortcut: "H",
    icon: Hand,
  },
  {
    id: "wall",
    toolId: "planner-wall",
    plannerTool: "wall",
    label: "Wall",
    hint: "Draw wall",
    shortcut: "W",
    icon: BrickWall,
  },
];

describe("PlannerMobileDock", () => {
  it("renders primary tools and opens overflow sheet", () => {
    const onSelect = vi.fn();

    render(
      <PlannerMobileDock
        tools={dockTools}
        activeTool="select"
        activePlannerTool="select"
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Mobile drawing tools" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Wall (W)" }));
    expect(onSelect).toHaveBeenCalledWith("planner-wall", "wall");
  });
});
