import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/ai/advisorClient";

describe("project/ai/advisorClient.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["requestAdvisorChat","requestSpaceSuggest","applySuggestion","validateLayout","DEFAULT_ADVISOR_CONFIG","resolveAdvisorProviderChain"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
