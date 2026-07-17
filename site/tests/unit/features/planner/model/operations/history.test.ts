import { describe, expect, it } from "vitest";
import {
  createHistoryState,
  pushHistory,
  updatePresent,
  canUndo,
  undo,
  canRedo,
  redo,
  getHistoryEntries,
} from "@/features/planner/model/operations/history";
import { createPlannerProject } from "@/features/planner/model/project";

describe("operations/history", () => {
  it("push/undo/redo cycle", () => {
    const a = createPlannerProject({ name: "A" });
    const b = { ...a, name: "B" };
    let h = createHistoryState(a);
    expect(canUndo(h)).toBe(false);
    // Snapshot A into past, then move present to B
    h = pushHistory(h, "before rename");
    h = updatePresent(h, b);
    expect(h.present.name).toBe("B");
    expect(canUndo(h)).toBe(true);
    h = undo(h);
    expect(h.present.name).toBe("A");
    expect(canRedo(h)).toBe(true);
    h = redo(h);
    expect(h.present.name).toBe("B");
    h = updatePresent(h, { ...b, name: "C" });
    expect(h.present.name).toBe("C");
    expect(getHistoryEntries(h).length).toBeGreaterThan(0);
    expect(getHistoryEntries(h)[0]!.description).toBe("before rename");
  });
});
