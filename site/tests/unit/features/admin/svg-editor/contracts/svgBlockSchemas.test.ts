import { describe, expect, it } from "vitest";
import {
  BlockInstanceV1Schema,
  CompositionDocumentV1Schema,
  PublishedRevisionV1Schema,
  SvgActionV1Schema,
  SvgBlockDefinitionV1Schema,
  SvgConstraintV1Schema,
  SvgParameterV1Schema,
  SvgPartV1Schema,
  SvgStyleV1Schema,
  SvgVariantV1Schema,
} from "@/features/admin/svg-editor/contracts/svgBlockSchemas";

/** Minimal valid V1 block definition fixture (replaces deleted svgReferenceDefinitions). */
const MINIMAL_BLOCK_DEFINITION = {
  schemaVersion: 1 as const,
  typeId: "fixed-table",
  name: "Fixed table",
  category: "tables",
  tags: ["furniture"],
  lifecycle: {
    status: "draft" as const,
    ownerId: "admin-1",
  },
  viewBox: { x: 0, y: 0, width: 600, height: 600 },
  physicalDimensionsMm: { width: 600, depth: 600, height: 750 },
  parts: [
    {
      kind: "rect" as const,
      id: "top",
      x: 0,
      y: 0,
      width: 600,
      height: 600,
    },
  ],
  parameters: [
    {
      id: "width-mm",
      kind: "length" as const,
      label: "Width",
      defaultValue: 600,
      minimum: 400,
      maximum: 2000,
      step: 10,
    },
  ],
  actions: [
    {
      id: "resize-width",
      kind: "resize" as const,
      parameterIds: ["width-mm"],
    },
  ],
  constraints: [
    {
      id: "min-width",
      kind: "minimum" as const,
      parameterIds: ["width-mm"],
      value: 400,
    },
  ],
  variants: [
    {
      id: "std",
      label: "Standard",
      parameterValues: { "width-mm": 600 },
    },
  ],
  mounting: [
    {
      plane: "floor" as const,
      anchor: { x: 0, y: 0 },
      rotationDegrees: 0,
    },
  ],
  accessibility: {
    title: "Fixed table",
    description: "Rectangular fixed table top",
  },
};

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

  it("parses circle, line, path, and text parts", () => {
    expect(
      SvgPartV1Schema.parse({ kind: "circle", id: "knob", cx: 5, cy: 5, r: 2 }).kind,
    ).toBe("circle");
    expect(
      SvgPartV1Schema.parse({
        kind: "line",
        id: "edge",
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 0,
      }).kind,
    ).toBe("line");
    expect(
      SvgPartV1Schema.parse({ kind: "path", id: "outline", d: "M0 0 L10 0 Z" }).kind,
    ).toBe("path");
    expect(
      SvgPartV1Schema.parse({ kind: "text", id: "label", x: 1, y: 2, text: "W" }).kind,
    ).toBe("text");
  });

  it("accepts a minimal valid block definition", () => {
    const parsed = SvgBlockDefinitionV1Schema.parse(MINIMAL_BLOCK_DEFINITION);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.typeId).toBe("fixed-table");
    expect(parsed.parts).toHaveLength(1);
    expect(parsed.parameters[0]?.id).toBe("width-mm");
  });

  it("rejects unknown parameter references on actions", () => {
    const result = SvgBlockDefinitionV1Schema.safeParse({
      ...MINIMAL_BLOCK_DEFINITION,
      actions: [
        { id: "bad", kind: "move", parameterIds: ["missing-param"] },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate part ids", () => {
    const result = SvgBlockDefinitionV1Schema.safeParse({
      ...MINIMAL_BLOCK_DEFINITION,
      parts: [
        { kind: "rect", id: "top", x: 0, y: 0, width: 10, height: 10 },
        { kind: "rect", id: "top", x: 1, y: 1, width: 10, height: 10 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("parses parameter, action, constraint, and variant schemas", () => {
    expect(
      SvgParameterV1Schema.parse({
        id: "color",
        kind: "color-token",
        label: "Color",
        defaultValue: "oak",
        values: ["oak", "walnut"],
      }).kind,
    ).toBe("color-token");
    expect(
      SvgActionV1Schema.parse({
        id: "flip-x",
        kind: "flip",
        parameterIds: [],
      }).kind,
    ).toBe("flip");
    expect(
      SvgConstraintV1Schema.parse({
        id: "ratio",
        kind: "aspect-ratio",
        parameterIds: [],
        value: 1,
      }).kind,
    ).toBe("aspect-ratio");
    expect(
      SvgVariantV1Schema.parse({
        id: "wide",
        label: "Wide",
        parameterValues: { "width-mm": 1200 },
      }).label,
    ).toBe("Wide");
  });

  it("parses instance, composition, and published revision schemas", () => {
    const instance = BlockInstanceV1Schema.parse({
      definitionTypeId: "fixed-table",
      definitionVersion: 1,
      parameterValues: { "width-mm": 600 },
      variantId: "std",
    });
    expect(instance.definitionTypeId).toBe("fixed-table");

    const doc = CompositionDocumentV1Schema.parse({
      schemaVersion: 1,
      id: "layout-1",
      revision: 0,
      roots: [instance],
    });
    expect(doc.roots).toHaveLength(1);

    const hash = "a".repeat(64);
    const rev = PublishedRevisionV1Schema.parse({
      schemaVersion: 1,
      revisionId: "rev-1",
      definitionTypeId: "fixed-table",
      definitionVersion: 1,
      compilerVersion: "v1",
      sourceRevision: 0,
      artifactChecksums: {
        descriptor: hash,
        svg: hash,
        png: hash,
        thumbnails: { sm: hash },
      },
      validation: {
        valid: true,
        diagnostics: [],
      },
      actorId: "admin-1",
      publishedAt: "2026-07-01T00:00:00.000Z",
      reason: "initial publish",
    });
    expect(rev.artifactChecksums.svg).toHaveLength(64);
    expect(rev.validation.valid).toBe(true);
  });
});
