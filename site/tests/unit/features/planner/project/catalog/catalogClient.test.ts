import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/catalogClient";

describe("project/catalog/catalogClient.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["tokenize","PlannerCatalogClient"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
