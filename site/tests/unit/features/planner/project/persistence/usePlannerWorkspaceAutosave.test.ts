import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/persistence/usePlannerWorkspaceAutosave";

describe("project/persistence/usePlannerWorkspaceAutosave.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["usePlannerWorkspaceAutosave"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
