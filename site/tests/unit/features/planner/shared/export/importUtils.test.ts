import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/shared/export/importUtils";

describe("shared/export/importUtils.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["importFromJSON","importFromJSONWithRecovery","importRoomPlan","importRoomPlanFromJson","detectFormat","autoImport","importPlannerPlannerText","parseJsonToEnvelope","validateEnvelopeStructure","recoverFromErrors","DEFAULT_IMPORT_LIMITS"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
