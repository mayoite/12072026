import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/cleanup/importGraphProof";

describe("cleanup/importGraphProof.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["PRODUCTION_IMPORT_GRAPH","routesStillOnFabricStack","FORBIDDEN_GRAPH_IDS","plannerNativeRoutes","plannerHybridRoutes","fabricRetirementBlocked"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
