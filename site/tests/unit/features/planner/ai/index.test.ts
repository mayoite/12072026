import { describe, expect, it } from "vitest";
import {
  extractCanvasPlacements,
  applySuggestedLayout,
  buildShapesFromSuggestedLayout,
  classifyAIResponse,
  validateLayoutSchema,
  suggestLayoutGridPack,
  matchCatalogForPlacements,
  AI_ADVISOR_PLANNER_ID,
  CATALOG_TIER_LABELS,
  SPACE_SUGGEST_SYSTEM_PROMPT,
} from "@/features/planner/ai";

describe("ai/index barrel", () => {
  it("re-exports status + placement helpers", () => {
    expect(extractCanvasPlacements()).toEqual([]);
    expect(buildShapesFromSuggestedLayout()).toEqual([]);
    expect(classifyAIResponse(true, false, null).kind).toBe("live_success");
    expect(
      validateLayoutSchema({
        version: 1,
        furniture: [],
        room: { label: "R", widthMm: 1, depthMm: 1 },
      }),
    ).toBe(true);
  });

  it("re-exports advisor config and prompts", () => {
    expect(typeof AI_ADVISOR_PLANNER_ID).toBe("string");
    expect(CATALOG_TIER_LABELS.budget).toBeTruthy();
    expect(SPACE_SUGGEST_SYSTEM_PROMPT.length).toBeGreaterThan(10);
  });

  it("re-exports layout suggest + catalog match", () => {
    const layout = suggestLayoutGridPack({
      seatCount: 4,
      purpose: "workstations",
    });
    expect(layout.version).toBe(1);
    expect(matchCatalogForPlacements([])).toEqual([]);
  });

  it("applySuggestedLayout fails closed when unwired", () => {
    expect(() => applySuggestedLayout(null)).toThrow(/No layout provided/);
  });
});
