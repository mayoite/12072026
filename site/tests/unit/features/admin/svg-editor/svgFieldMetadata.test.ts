import { describe, expect, it } from "vitest";
import {
  SVG_FIELD_METADATA,
  SVG_PUCK_FIELDS,
  SvgFieldMetadataSchema,
  generatePuckFields,
} from "@/features/admin/svg-editor/svgFieldMetadata";

describe("svgFieldMetadata", () => {
  it("validates metadata entries and generates puck fields", () => {
    expect(SVG_FIELD_METADATA.length).toBeGreaterThan(0);
    for (const field of SVG_FIELD_METADATA) {
      expect(SvgFieldMetadataSchema.parse(field).path).toBe(field.path);
    }
    const generated = generatePuckFields(SVG_FIELD_METADATA);
    expect(generated["name"]?.label).toBe("Name");
    expect(SVG_PUCK_FIELDS["name"]).toBeDefined();
  });
});
