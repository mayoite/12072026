import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/modularCabinetV0";

describe("catalog/modularCabinetV0.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["TOE_HEIGHT_MM","TOE_INSET_MM","DOOR_THICKNESS_MM","defaultCabinetV0Options","generateCabinetV0Footprint","generateCabinetV0Mesh","countCabinetV0Parts"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
