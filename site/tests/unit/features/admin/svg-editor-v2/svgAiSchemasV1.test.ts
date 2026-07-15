import { describe, expect, it } from "vitest";

import { SvgAiRequestV1Schema, SvgAiResponseV1Schema } from "@/features/admin/svg-editor-v2/ai/svgAiSchemasV1";

const checksum = "a".repeat(64);

describe("SVG AI V1 schemas", () => {
  it("accepts a bounded closed request and typed response", () => {
    expect(SvgAiRequestV1Schema.parse({ version: 1, mode: "edit", prompt: "Move the chair", scope: { type: "selection", elementIds: ["seat"] }, svg: "<svg />", dimensionsMm: { width: 10, depth: 10, height: 10 }, baseChecksum: checksum }).version).toBe(1);
    expect(SvgAiResponseV1Schema.parse({ version: 1, summary: "Moved", baseChecksum: checksum, operations: [{ version: 1, type: "move", targetId: "seat", x: 1, y: 2 }], findings: [], provider: "openai", model: "quality" }).operations).toHaveLength(1);
  });

  it("rejects unknown versions, operations, properties, and unbounded values", () => {
    const base = { version: 1, mode: "edit", prompt: "x", scope: { type: "document" }, svg: "<svg />", dimensionsMm: { width: 10, depth: 10, height: 10 }, baseChecksum: checksum };
    expect(() => SvgAiRequestV1Schema.parse({ ...base, version: 2 })).toThrow();
    expect(() => SvgAiRequestV1Schema.parse({ ...base, extra: true })).toThrow();
    expect(() => SvgAiResponseV1Schema.parse({ version: 1, summary: "x", baseChecksum: checksum, operations: [{ version: 1, type: "move", targetId: "x", x: Infinity, y: 0 }], findings: [], provider: "x", model: "x" })).toThrow();
  });
});
