import { describe, expect, it } from "vitest";
import type {
  ValidationIssue,
  ValidationRuleId,
  PlacedFurniture,
} from "@/features/planner/lib/validation/types";

describe("lib/validation/types", () => {
  it("accepts validation issue model", () => {
    const rule: ValidationRuleId = "furniture-overlap";
    const issue: ValidationIssue = {
      id: "i1",
      ruleId: rule,
      severity: "warning",
      objectIds: ["a", "b"],
      message: "Overlap",
      remedy: "Move furniture",
      focusMm: { x: 100, y: 200 },
    };
    const placed: PlacedFurniture = {
      id: "a",
      xMm: 0,
      yMm: 0,
      widthMm: 1200,
      depthMm: 600,
    };
    expect(issue.objectIds).toContain(placed.id);
  });
});
