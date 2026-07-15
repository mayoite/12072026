// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { applySvgAiOperations } from "@/features/admin/svg-editor-v2/ai/applySvgAiOperations";

describe("deterministic SVG AI preview", () => {
  it("applies a typed batch to a detached document", () => {
    const original = '<svg xmlns="http://www.w3.org/2000/svg"><rect id="seat" width="10" height="10"/></svg>';
    const result = applySvgAiOperations(original, [{ version: 1, type: "move", targetId: "seat", x: 5, y: 7 }]);
    expect(original).not.toContain("translate");
    expect(result).toContain("translate(5 7)");
  });

  it("rejects missing, locked, and unsafe targets", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect id="seat" data-locked="true"/></svg>';
    expect(() => applySvgAiOperations(svg, [{ version: 1, type: "remove", targetId: "missing" }])).toThrow(/does not exist/);
    expect(() => applySvgAiOperations(svg, [{ version: 1, type: "remove", targetId: "seat" }])).toThrow(/locked/);
  });
});
