import { describe, expect, it } from "vitest";
import { toPlannerSvgDefinition } from "@/features/admin/svg-editor/plannerSvgAdapter";
import { FIXED_REFERENCE_DEFINITION } from "@/features/admin/svg-editor/svgReferenceDefinitions";
import type { SvgBlockDefinitionV1 } from "@/features/admin/svg-editor/svgBlockSchemas";

describe("toPlannerSvgDefinition", () => {
  it("filters customer-editable parameters", () => {
    const input: SvgBlockDefinitionV1 = {
      ...FIXED_REFERENCE_DEFINITION,
      parameters: [
        { id: "width", kind: "length", label: "Width", customerEditable: true, defaultValue: 1200 },
        { id: "internal", kind: "text", label: "Internal", customerEditable: false, defaultValue: "x" },
      ],
    };
    const out = toPlannerSvgDefinition(input);
    expect(out.customerParameters).toHaveLength(1);
    expect(out.customerParameters[0]?.id).toBe("width");
    expect(out).not.toHaveProperty("parts");
  });
});
