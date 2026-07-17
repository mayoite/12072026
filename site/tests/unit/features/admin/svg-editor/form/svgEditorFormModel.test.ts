import { describe, expect, it } from "vitest";
import {
  BLOCK_DESCRIPTOR_VARIANTS,
  MountPlaneSchema,
} from "@/features/planner/catalog/svg/svgTypes";
import {
  MOUNT_PLANE_OPTIONS,
  SOURCE_PROVENANCE_OPTIONS,
  SVG_EDITOR_FIELDS,
  SVG_EDITOR_FIELD_GROUP_LABEL,
  VARIANT_OPTIONS,
  fieldsForVariant,
} from "@/features/admin/svg-editor/form/svgEditorFormModel";

describe("svgEditorFormModel", () => {
  it("exposes field groups and variant filtering", () => {
    expect(SVG_EDITOR_FIELD_GROUP_LABEL.identity).toBe("Identity");
    expect(SVG_EDITOR_FIELD_GROUP_LABEL.geometry).toBe("Geometry");
    expect(SVG_EDITOR_FIELD_GROUP_LABEL.commercial).toBe("Commercial");
    expect(MOUNT_PLANE_OPTIONS.length).toBeGreaterThan(0);
    expect(VARIANT_OPTIONS.map((o) => o.value)).toEqual(
      expect.arrayContaining(["fixed", "configurable", "parametric"]),
    );
    expect(SVG_EDITOR_FIELDS.length).toBeGreaterThan(0);
    const fixed = fieldsForVariant("fixed");
    const parametric = fieldsForVariant("parametric");
    const configurable = fieldsForVariant("configurable");
    expect(fixed.length).toBeGreaterThan(0);
    expect(parametric.length).toBeGreaterThan(0);
    expect(configurable.length).toBeGreaterThan(0);
  });

  it("derives mount and variant options from schema authority", () => {
    expect(MOUNT_PLANE_OPTIONS.map((o) => o.value)).toEqual([...MountPlaneSchema.options]);
    expect(VARIANT_OPTIONS.map((o) => o.value)).toEqual([...BLOCK_DESCRIPTOR_VARIANTS]);
    expect(SOURCE_PROVENANCE_OPTIONS.map((o) => o.value)).toEqual(
      expect.arrayContaining(["donor", "native", "migrated"]),
    );
  });

  it("filters fields by variantScope", () => {
    const fixedOnly = fieldsForVariant("fixed");
    const parametricOnly = fieldsForVariant("parametric");
    const fixedPaths = new Set(fixedOnly.map((f) => f.path));
    const parametricPaths = new Set(parametricOnly.map((f) => f.path));

    // Shared identity fields appear for all variants.
    expect(fixedPaths.has("slug")).toBe(true);
    expect(parametricPaths.has("slug")).toBe(true);

    // Variant-scoped fields must not leak into the wrong variant list.
    for (const field of SVG_EDITOR_FIELDS) {
      if (field.variantScope && field.variantScope !== "all") {
        const included = fieldsForVariant(field.variantScope).some(
          (f) => f.path === field.path,
        );
        expect(included).toBe(true);
        const other = (["fixed", "configurable", "parametric"] as const).find(
          (v) => v !== field.variantScope,
        );
        if (other) {
          expect(fieldsForVariant(other).some((f) => f.path === field.path)).toBe(false);
        }
      }
    }
  });

  it("every field has a path, label, kind, and group", () => {
    for (const field of SVG_EDITOR_FIELDS) {
      expect(field.path.length).toBeGreaterThan(0);
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.kind).toBeDefined();
      expect(SVG_EDITOR_FIELD_GROUP_LABEL[field.group]).toBeDefined();
    }
  });
});
