import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/catalogQuery";

describe("catalog/catalogQuery.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["PLANNER_CATALOG_QUERY_KEY","loadPlannerCatalog"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
