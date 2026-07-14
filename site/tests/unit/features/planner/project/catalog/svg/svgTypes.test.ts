import { describe, expect, it } from "vitest";
import * as mod from "@/features/planner/project/catalog/svg/svgTypes";

describe("project/catalog/svg/svgTypes.ts", () => {
  it("exposes expected public API symbols", () => {
    const expected = ["SVG_THEMES","CATEGORY_SHAPE_COLORS","BLOCK_DESCRIPTOR_SCHEMA_VERSION","BLOCK_DESCRIPTOR_GENERATED_AT_FROZEN_ON_FIRST_PARSE","BLOCK_DESCRIPTOR_SLUG_REGEX","MountPlaneSchema","BlockDescriptorVec2Schema","BlockDescriptorViewBoxSchema","MountingPointSchema","BlockDescriptorBlockSchema","BlockDescriptorGeometrySchema","BlockDescriptorIdentitySchema"] as const;
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).not.toBeUndefined();
    }
  });
});
