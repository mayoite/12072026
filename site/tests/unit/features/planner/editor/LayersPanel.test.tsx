import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayersPanel } from "@/features/planner/editor/LayersPanel";
import { DEFAULT_LAYER_VISIBILITY } from "@/features/planner/editor/layerVisibility";
import { createPlannerProject } from "@/features/planner/project/model/project";

describe("LayersPanel", () => {
  it("lists layer categories for a floor", () => {
    const project = createPlannerProject();
    render(
      <LayersPanel
        floor={project.floors[0]!}
        visibility={DEFAULT_LAYER_VISIBILITY}
        onVisibilityChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("region", { name: /layers/i })).toBeDefined();
    expect(document.body.textContent).toMatch(/Walls/i);
    expect(document.body.textContent).toMatch(/Furniture/i);
    expect(screen.getByRole("button", { name: /Show all layers/i })).toBeDefined();
  });

  it("toggles layer visibility and show-all", async () => {
    const user = userEvent.setup();
    const onVisibilityChange = vi.fn();
    const project = createPlannerProject();

    render(
      <LayersPanel
        floor={project.floors[0]!}
        visibility={DEFAULT_LAYER_VISIBILITY}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Hide Walls/i }));
    expect(onVisibilityChange).toHaveBeenCalled();
    const afterToggle = onVisibilityChange.mock.calls[0]?.[0] as Record<string, boolean>;
    expect(afterToggle.walls).toBe(false);

    onVisibilityChange.mockClear();
    await user.click(screen.getByRole("button", { name: /Show all layers/i }));
    expect(onVisibilityChange).toHaveBeenCalledWith(
      expect.objectContaining({ walls: true, furniture: true }),
    );
  });
});
