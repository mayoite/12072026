import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  });
});
