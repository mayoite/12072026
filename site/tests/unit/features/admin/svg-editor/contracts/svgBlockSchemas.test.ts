import { describe, expect, it } from "vitest";
import {
  SvgBlockDefinitionV1Schema,
  SvgPartV1Schema,
  SvgStyleV1Schema,
} from "@/features/admin/svg-editor/contracts/svgBlockSchemas";
import { FIXED_REFERENCE_DEFINITION } from "@/features/admin/svg-editor/svgReferenceDefinitions";

describe("svgBlockSchemas", () => {
  it("parses style and rect part", () => {
    expect(SvgStyleV1Schema.parse({ fill: "currentColor", opacity: 1 }).fill).toBe(
      "currentColor",
    );
    const part = SvgPartV1Schema.parse({
      kind: "rect",
      id: "top",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    expect(part.kind).toBe("rect");
  });

  it("accepts FIXED_REFERENCE_DEFINITION", () => {
    const parsed = SvgBlockDefinitionV1Schema.parse(FIXED_REFERENCE_DEFINITION);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.typeId).toBe("fixed-table");
  });
});
