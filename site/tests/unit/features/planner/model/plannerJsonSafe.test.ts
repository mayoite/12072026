import { describe, expect, it } from "vitest";
import { toPlannerJsonSafe } from "@/features/planner/model/plannerJsonSafe";

describe("plannerJsonSafe", () => {
  it("should have function toPlannerJsonSafe defined", () => {
    expect(toPlannerJsonSafe).toBeTypeOf("function");
    expect(toPlannerJsonSafe.name.length).toBeGreaterThan(0);
  });
});