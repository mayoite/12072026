import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/persistence/usePlannerWorkspaceAutosave";

describe("persistence/usePlannerWorkspaceAutosave.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["usePlannerWorkspaceAutosave"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
