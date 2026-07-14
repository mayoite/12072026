import { describe, expect, it } from "vitest";
import {
  buildClearedPlannerState,
  buildTemplateLoadedState,
  plannerHasContent,
  snapPointToGrid,
} from "@/features/planner/cloud-store/plannerStateUtils";
import type { FloorTemplate } from "@/features/planner/cloud-store/floorTemplates";

const emptyContent = {
  walls: [],
  rooms: [],
  furniture: [],
  doors: [],
  windows: [],
  zones: [],
  textLabels: [],
  structuralElements: [],
};

describe("plannerStateUtils", () => {
  it("buildClearedPlannerState resets geometry, furniture, ui, history", () => {
    const cleared = buildClearedPlannerState();
    expect(cleared.geometry.walls).toEqual([]);
    expect(cleared.furniture.furniture).toEqual([]);
    expect(cleared.furniture.selectedId).toBeNull();
    expect(cleared.ui.zoom).toBe(1);
    expect(cleared.ui.viewMode).toBe("2d");
    expect(cleared.history.undoStack).toEqual([]);
    expect(cleared.history.clipboard).toBeNull();
  });

  it("snapPointToGrid rounds to snap distance", () => {
    expect(snapPointToGrid({ x: 14, y: 26 }, 10)).toEqual({ x: 10, y: 30 });
    expect(snapPointToGrid({ x: 5, y: 5 }, 10)).toEqual({ x: 10, y: 10 });
    expect(snapPointToGrid({ x: 4, y: 4 }, 10)).toEqual({ x: 0, y: 0 });
  });

  it("plannerHasContent is false for empty plan", () => {
    expect(plannerHasContent(emptyContent)).toBe(false);
  });

  it("plannerHasContent is true when any entity array non-empty", () => {
    expect(
      plannerHasContent({
        ...emptyContent,
        furniture: [
          {
            id: "f1",
            catalogId: "c",
            name: "Desk",
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            rotation: 0,
            color: "#000",
            shape: "rect",
            zIndex: 0,
          },
        ],
      }),
    ).toBe(true);
  });

  it("buildTemplateLoadedState instantiates template walls and marks dirty", () => {
    const template: FloorTemplate = {
      id: "t1",
      name: "Box",
      description: "test",
      icon: "□",
      size: "3x3",
      walls: [
        {
          start: { x: 0, y: 0 },
          end: { x: 100, y: 0 },
          thickness: 8,
          color: "#000",
        },
      ],
      rooms: [],
      doors: [],
      windows: [],
      furniture: [],
    };
    const state = buildTemplateLoadedState(template);
    expect(state.walls).toHaveLength(1);
    expect(state.walls?.[0]?.id).toBeTruthy();
    expect(state.isDirty).toBe(true);
    expect(state.selectedId).toBeNull();
    expect(state.undoStack).toEqual([]);
  });
});
