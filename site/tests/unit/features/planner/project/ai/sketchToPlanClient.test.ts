import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/ai/sketchToPlanClient";

describe("project/ai/sketchToPlanClient.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["SKETCH_RECOVERY_MESSAGES","getSketchRecoveryMessage","convertSketchToPlan","convertSketchToPlanWithProgress","acceptConversion","rejectConversion","getDefaultSketchPrompt","estimateConversionTimeout","isSketchToPlanAvailable"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
