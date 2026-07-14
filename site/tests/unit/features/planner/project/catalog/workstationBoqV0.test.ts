import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/workstationBoqV0";

describe("project/catalog/workstationBoqV0.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["WORKSTATION_V0_GST_RATE","workstationV0UnitPriceInr","workstationBoqToQuoteCartItems","summarizeWorkstationBoqV0"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
