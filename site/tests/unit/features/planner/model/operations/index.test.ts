import { describe, expect, it } from "vitest";
import * as ops from "@/features/planner/model/operations";
import { createPlannerProject } from "@/features/planner/model/project";

describe("operations barrel", () => {
  it("re-exports pure actions and history helpers", () => {
    expect(typeof ops.addWall).toBe("function");
    expect(typeof ops.createHistoryState).toBe("function");
    expect(typeof ops.createEnvelopeV1).toBe("function");
    const p = createPlannerProject();
    const h = ops.createHistoryState(p);
    expect(h.present.id).toBe(p.id);
    expect(ops.canUndo(h)).toBe(false);
  });
});
