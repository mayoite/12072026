import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/lib/commands/plannerAccessContext";

describe("lib/commands/plannerAccessContext.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["GUEST_BLOCKED_COMMAND_KEYS","isCommandBlockedForContext"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
