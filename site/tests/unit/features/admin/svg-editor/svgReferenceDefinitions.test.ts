import { describe, expect, it } from "vitest";
import {
  CONFIGURABLE_REFERENCE_DEFINITION,
  FIXED_REFERENCE_DEFINITION,
  PARAMETRIC_REFERENCE_DEFINITION,
  SVG_REFERENCE_DEFINITIONS,
} from "@/features/admin/svg-editor/svgReferenceDefinitions";

describe("svgReferenceDefinitions", () => {
  it("exports fixed, configurable, parametric references", () => {
    expect(FIXED_REFERENCE_DEFINITION.typeId).toBe("fixed-table");
    expect(CONFIGURABLE_REFERENCE_DEFINITION.parameters.length).toBeGreaterThan(0);
    expect(PARAMETRIC_REFERENCE_DEFINITION.typeId).toBeTruthy();
    expect(SVG_REFERENCE_DEFINITIONS.length).toBeGreaterThanOrEqual(3);
    expect(
      SVG_REFERENCE_DEFINITIONS.map((d) => d.typeId),
    ).toEqual(
      expect.arrayContaining([
        FIXED_REFERENCE_DEFINITION.typeId,
        CONFIGURABLE_REFERENCE_DEFINITION.typeId,
      ]),
    );
  });
});
