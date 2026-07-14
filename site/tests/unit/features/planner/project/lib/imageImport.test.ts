import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/lib/imageImport";

describe("project/lib/imageImport.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["SUPPORTED_IMAGE_TYPES","DEFAULT_IMAGE_LIMITS","validateImageFile","loadImageFile","createBackgroundImage","importImageAsBackground"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
