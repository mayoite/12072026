import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/lib/commands/plannerCommand";

describe("lib/commands/plannerCommand.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["executePlannerCommand"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
