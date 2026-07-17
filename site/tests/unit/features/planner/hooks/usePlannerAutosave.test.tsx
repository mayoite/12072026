import { describe, expect, it } from "vitest";
import { getPlannerProjectId } from "@/features/planner/hooks/usePlannerAutosave";
import { TEST_PLAN_ID_1 } from "@/tests/fixtures/plannerTestUuids";

describe("usePlannerAutosave helpers", () => {
  it("getPlannerProjectId uses guest constant or member plan id", () => {
    const guestId = getPlannerProjectId(true);
    expect(guestId).toMatch(/guest/i);
    expect(getPlannerProjectId(false, TEST_PLAN_ID_1)).toContain(TEST_PLAN_ID_1);
    expect(getPlannerProjectId(false)).not.toContain(TEST_PLAN_ID_1);
    expect(getPlannerProjectId(false, "  ")).not.toContain(TEST_PLAN_ID_1);
  });
});
