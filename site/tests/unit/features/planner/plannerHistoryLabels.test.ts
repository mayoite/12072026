import { describe, expect, it } from "vitest";

import {
  describePlannerRedoLabel,
  describePlannerUndoLabel,
  entityCollectionLabel,
} from "@/features/planner/editor/plannerHistoryLabels";
import { createPlannerHistory } from "@/features/planner/store/history";
import { createPlannerProject } from "@/features/planner/model/project";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";

function furnitureItem(overrides: Partial<PlannerFurnitureItem> = {}): PlannerFurnitureItem {
  return {
    id: "furn-1",
    position: { x: 1000, y: 2000 },
    rotation: 0,
    width: 800,
    depth: 600,
    height: 750,
    catalogId: "chair-demo",
    ...overrides,
  };
}

describe("plannerHistoryLabels", () => {
  it("labels furniture width edits for undo", () => {
    const base = createPlannerProject({ name: "Label test" });
    const floor = base.floors[0];
    floor.furniture = [furnitureItem({ width: 800 })];

    const edited = {
      ...base,
      floors: [
        {
          ...floor,
          furniture: [furnitureItem({ width: 900 })],
        },
      ],
    };

    const history = {
      ...createPlannerHistory(edited),
      past: [base],
    };

    expect(describePlannerUndoLabel(history)).toBe(
      "Change furniture width to 900 mm",
    );
  });

  it("labels redo from present to future", () => {
    const before = createPlannerProject({ name: "Redo label" });
    const floor = before.floors[0];
    floor.furniture = [furnitureItem({ width: 800 })];

    const after = {
      ...before,
      floors: [
        {
          ...floor,
          furniture: [furnitureItem({ width: 900 })],
        },
      ],
    };

    const history = {
      past: [before],
      present: before,
      future: [after],
      dragStart: null,
    };

    expect(describePlannerRedoLabel(history)).toBe(
      "Change furniture width to 900 mm",
    );
  });

  it("pluralizes entity collection labels for multi-select copy", () => {
    expect(entityCollectionLabel("furniture", 1)).toBe("furniture");
    expect(entityCollectionLabel("furniture", 3)).toBe("furniture");
    expect(entityCollectionLabel("walls", 2)).toBe("walls");
  });
});