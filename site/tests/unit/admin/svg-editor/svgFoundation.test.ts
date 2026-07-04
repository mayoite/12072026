import { describe, expect, it } from "vitest";

import { SvgBlockDefinitionV1Schema, PublishedRevisionV1Schema } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import { toPlannerSvgDefinition } from "@/features/planner/admin/svg-editor/plannerSvgAdapter";

const definition = {
  schemaVersion: 1,
  typeId: "door-basic",
  name: "Basic door",
  category: "Doors",
  lifecycle: { status: "draft", ownerId: "admin-1" },
  viewBox: { x: 0, y: 0, width: 900, height: 100 },
  physicalDimensionsMm: { width: 900, depth: 100, height: 2100 },
  parts: [{ kind: "rect", id: "leaf", x: 0, y: 0, width: 900, height: 100, customerEditable: false }],
  parameters: [
    { id: "width", kind: "length", label: "Width", customerEditable: true, defaultValue: 900 },
    { id: "internal-code", kind: "text", label: "Internal code", customerEditable: false, defaultValue: "A" },
  ],
  accessibility: { title: "Door" },
};

describe("SVG foundation schemas and browser projection", () => {
  it("parses SvgBlockDefinitionV1 and exposes only customer-editable parameters", () => {
    const parsed = SvgBlockDefinitionV1Schema.parse(definition);
    expect(toPlannerSvgDefinition(parsed).customerParameters.map((parameter) => parameter.id)).toEqual(["width"]);
  });

  it("requires immutable publication checksums and a valid publication result", () => {
    expect(() => PublishedRevisionV1Schema.parse({
      schemaVersion: 1, revisionId: "door-revision", definitionTypeId: "door-basic",
      definitionVersion: 1, compilerVersion: "svg-block-v1", sourceRevision: 2,
      artifactChecksums: { descriptor: "bad", svg: "bad" },
      validation: { valid: true, diagnostics: [] }, actorId: "admin-1",
      publishedAt: "2026-07-05T00:00:00.000Z", reason: "Approved",
    })).toThrow();
  });
});
