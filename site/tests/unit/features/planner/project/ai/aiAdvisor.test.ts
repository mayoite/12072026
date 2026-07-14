import { describe, expect, it } from "vitest";
import {
  DEFAULT_CATALOG_IDS,
  summarizeProjectState,
  validateAiProposal,
  createAiPrivacyNotice,
  formatDimensionWithUnit,
} from "@/features/planner/project/ai/aiAdvisor";
import { createPlannerProject } from "@/features/planner/project/model/project";

describe("aiAdvisor", () => {
  it("summarizes empty project and validates placement proposal", () => {
    const project = createPlannerProject({ name: "Advisor Target" });
    const summary = summarizeProjectState(project, "wall-1", "wall");
    expect(summary.projectName).toBe("Advisor Target");
    expect(summary.totalWalls).toBe(0);
    expect(DEFAULT_CATALOG_IDS.length).toBeGreaterThan(0);

    const validation = validateAiProposal(
      {
        id: "proposal-1",
        type: "placement",
        confidence: 0.9,
        description: "Add desk",
        units: "mm",
        details: {
          catalogId: DEFAULT_CATALOG_IDS[0],
          position: { x: 100, y: 200 },
        },
      },
      summary,
    );
    expect(validation.valid).toBe(true);
  });

  it("privacy notice and dimension format", () => {
    const privacy = createAiPrivacyNotice();
    expect(privacy.privacy).toMatch(/AI/i);
    expect(formatDimensionWithUnit(1500, "m")).toContain("m");
  });
});
