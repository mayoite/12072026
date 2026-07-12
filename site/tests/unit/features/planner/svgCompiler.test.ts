import { describe, expect, it } from "vitest";

vi.mock("server-only", () => ({}));
import { vi } from "vitest";
import { compileSvgBlockV1 } from "@/features/planner/project/catalog/svg/svgCompiler.server";
import { sanitizeAndOptimizeSvg } from "@/features/planner/project/catalog/svg/svgServerSanitizer";

const definition = {
  schemaVersion: 1, typeId: "door-basic", name: "Door", category: "Doors",
  lifecycle: { status: "draft", ownerId: "admin-1" },
  viewBox: { x: 0, y: 0, width: 900, height: 100 },
  physicalDimensionsMm: { width: 900, depth: 100, height: 2100 },
  parts: [{ kind: "rect", id: "leaf", x: 0, y: 0, width: 900, height: 100, customerEditable: false }],
  accessibility: { title: "Door" },
};

describe("server SVG compiler", () => {
  it("produces byte-identical canonical SVG and checksums", () => {
    expect(compileSvgBlockV1(definition)).toEqual(compileSvgBlockV1(structuredClone(definition)));
  });

  it("namespaces semantic IDs and preserves accessibility metadata", () => {
    const result = compileSvgBlockV1(definition);
    expect(result.svg).toContain("door-basic-v1-leaf");
    expect(result.svg).toContain("<title");
    expect(result.svgChecksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects executable markup before SVGO can optimize it", () => {
    expect(() => sanitizeAndOptimizeSvg('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')).toThrow(/sanitization/);
    expect(() => sanitizeAndOptimizeSvg('<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(1)"/></svg>')).toThrow(/sanitization/);
  });
});
