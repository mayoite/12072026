import { describe, expect, it } from "vitest";
import {
  EMPTY_PLANNER_SELECTION,
  createPlannerSelection,
} from "@/features/planner/store/selection";

describe("selection", () => {
  it("EMPTY is none with empty ids", () => {
    expect(EMPTY_PLANNER_SELECTION).toEqual({ type: "none", ids: [] });
  });

  it("createPlannerSelection dedupes and drops empty; none on empty ids", () => {
    expect(createPlannerSelection("wall", [])).toEqual(EMPTY_PLANNER_SELECTION);
    expect(createPlannerSelection("none", ["x"])).toEqual(EMPTY_PLANNER_SELECTION);
    const sel = createPlannerSelection("furniture", ["a", "a", "", "b"]);
    expect(sel.type).toBe("furniture");
    expect([...sel.ids]).toEqual(["a", "b"]);
  });
});
