import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/catalog/catalogTaxonomy";

describe("catalog/catalogTaxonomy.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["CANONICAL_TAXONOMY","ROOM_TAGS","STYLE_TAGS","buildTaxonomyPath","normalizeMaterial","normalizeColor","isValidRoomTag","isValidStyleTag","normalizeAssemblyType","buildShortName"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
