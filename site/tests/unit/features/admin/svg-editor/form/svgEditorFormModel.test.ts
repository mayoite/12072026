import { describe, expect, it } from "vitest";
import {
  MOUNT_PLANE_OPTIONS,
  SVG_EDITOR_FIELDS,
  SVG_EDITOR_FIELD_GROUP_LABEL,
  VARIANT_OPTIONS,
  fieldsForVariant,
} from "@/features/admin/svg-editor/form/svgEditorFormModel";

describe("svgEditorFormModel", () => {
  it("exposes field groups and variant filtering", () => {
    expect(SVG_EDITOR_FIELD_GROUP_LABEL.identity).toBe("Identity");
    expect(MOUNT_PLANE_OPTIONS.length).toBeGreaterThan(0);
    expect(VARIANT_OPTIONS.map((o) => o.value)).toEqual(
      expect.arrayContaining(["fixed", "configurable", "parametric"]),
    );
    expect(SVG_EDITOR_FIELDS.length).toBeGreaterThan(0);
    const fixed = fieldsForVariant("fixed");
    const parametric = fieldsForVariant("parametric");
    expect(fixed.length).toBeGreaterThan(0);
    expect(parametric.length).toBeGreaterThan(0);
  });
});
