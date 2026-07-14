import { describe, expect, it } from "vitest";
import { getPlannerProjectId } from "@/features/planner/hooks/usePlannerAutosave";

describe("usePlannerAutosave helpers", () => {
  it("getPlannerProjectId uses guest constant or member plan id", () => {
    const guestId = getPlannerProjectId(true);
    expect(guestId).toMatch(/guest/i);
    expect(getPlannerProjectId(false, "proj-1")).toContain("proj-1");
    expect(getPlannerProjectId(false)).not.toContain("proj-1");
    expect(getPlannerProjectId(false, "  ")).not.toContain("proj-1");
  });
});
