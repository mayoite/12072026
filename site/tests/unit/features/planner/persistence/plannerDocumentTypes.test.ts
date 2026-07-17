import { describe, expect, it } from "vitest";
import { isStagingPlannerDocument } from "@/features/planner/persistence/plannerDocumentTypes";

describe("plannerDocumentTypes", () => {
  it("detects staging planner documents", () => {
    expect(
      isStagingPlannerDocument({
        id: "d1",
        name: "Plan",
        unit_system: "metric",
        sceneJson: "{}",
      }),
    ).toBe(true);
    expect(isStagingPlannerDocument({ kind: "other" })).toBe(false);
    expect(isStagingPlannerDocument(null)).toBe(false);
  });
});
