import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/index";

describe("catalog/index.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["usePlannerWorkspaceCatalog","usePlannerSvgCatalog"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
