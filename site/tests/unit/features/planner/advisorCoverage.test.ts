import { describe, expect, it } from "vitest";

import {
  AI_ADVISOR_PLANNER_ID,
  buildAdvisorChatWelcome,
  buildChatSuggestionChips,
  resolveSpaceSuggestDefaults,
} from "@/features/planner/ai/aiAdvisorConfig";
import {
  getSketchRecoveryMessage,
  classifySketchConversionError,
  buildSketchPlanFabricDraft,
  SketchConversionError,
} from "@/features/planner/ai/sketchToPlan";

describe("root ai advisor config", () => {
  it("exposes planner id and welcome / chip helpers", () => {
    expect(AI_ADVISOR_PLANNER_ID).toBe("oando");
    expect(buildAdvisorChatWelcome(null)).toContain("layout");
    expect(buildChatSuggestionChips(null).length).toBeGreaterThan(0);
    expect(resolveSpaceSuggestDefaults(null).seatCount).toBeGreaterThan(0);
  });
});

describe("sketch-to-plan (canonical root ai)", () => {
  it("exposes recovery messages and error classification", () => {
    expect(getSketchRecoveryMessage("low_confidence")).toContain("reliable");
    const classified = classifySketchConversionError(new Error("unsupported mime"), "sketch.png");
    expect(classified).toBeInstanceOf(SketchConversionError);
    expect(classified.reason).toBe("unsupported_input");
  });

  it("builds editable fabric draft from converted objects", () => {
    const draft = JSON.parse(
      buildSketchPlanFabricDraft({
        objects: [{ type: "wall", x1: 0, y1: 0, x2: 1000, y2: 0 }],
        warnings: [],
      }),
    );
    expect(draft.objects).toHaveLength(1);
    expect(draft.objects[0].type).toBe("line");
  });
});
