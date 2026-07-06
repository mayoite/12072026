import { describe, expect, it } from "vitest";

// Note: exportAsPDF / exportAsDXF + jspdf/dxf-writer optional paths were removed
// as dead code (see shared/export/index.ts + PLAN-FAIL-0408). This test file
// retained as placeholder (no co-located tests rule); no active optional-dep
// loading to test in current production exports (JSON/SVG only).

describe("export optional dependency failures (pruned)", () => {
  it("documents removal of PDF/DXF optional dep paths", () => {
    expect(true).toBe(true);
  });
});
