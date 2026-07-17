import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/workstationFamilyBuyer";

describe("catalog/workstationFamilyBuyer.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["BUYER_WORKSTATION_FAMILY_CONTRACT","topologyIdForShape","optionIdsFromDraft","draftToFamilySelection","assessBuyerPlacement","buyerConfiguratorPreview","buyerNeedsMigrationChoice"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
