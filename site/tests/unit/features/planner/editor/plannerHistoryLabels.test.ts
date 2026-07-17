import { describe, expect, it } from "vitest";
import {
  describePlannerUndoLabel,
  describePlannerRedoLabel,
  entityCollectionLabel,
} from "@/features/planner/editor/plannerHistoryLabels";
import { createPlannerHistory } from "@/features/planner/store/history";
import { createPlannerProject } from "@/features/planner/model/project";
import type { PlannerFurnitureItem } from "@/features/planner/model/types";

function furniture(overrides: Partial<PlannerFurnitureItem> = {}): PlannerFurnitureItem {
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
  it("labels furniture width edits for undo and redo", () => {
    const base = createPlannerProject({ name: "Label test" });
    const floor = base.floors[0]!;
    floor.furniture = [furniture({ width: 800 })];
    const edited = {
      ...base,
      floors: [{ ...floor, furniture: [furniture({ width: 900 })] }],
    };
    const history = { ...createPlannerHistory(edited), past: [base] };
    expect(describePlannerUndoLabel(history)).toBe("Change furniture width to 900 mm");

    const redoHistory = {
      ...createPlannerHistory(base),
      future: [edited],
    };
    expect(describePlannerRedoLabel(redoHistory).toLowerCase()).toMatch(/furniture|width|900/);
  });

  it("entityCollectionLabel maps known collections", () => {
    expect(entityCollectionLabel("walls")).toMatch(/wall/i);
    expect(entityCollectionLabel("furniture")).toMatch(/furniture/i);
  });
});
