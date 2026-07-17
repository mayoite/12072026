import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/shared/document/plannerDocumentBridge";

describe("shared/document/plannerDocumentBridge.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["plannerDocumentToPlannerProject","plannerProjectToPlannerDocument"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
