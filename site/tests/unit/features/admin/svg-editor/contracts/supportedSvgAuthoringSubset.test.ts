import { describe, expect, it } from "vitest";
import {
  SUPPORTED_SVG_AUTHORING_DOC,
  SUPPORTED_SVG_AUTHORING_KINDS,
  assertSupportedStudioKinds,
  isSupportedSvgAuthoringKind,
} from "@/features/admin/svg-editor/contracts/supportedSvgAuthoringSubset";

describe("supportedSvgAuthoringSubset", () => {
  it("allows rect/circle/line/text/path", () => {
    expect([...SUPPORTED_SVG_AUTHORING_KINDS]).toEqual(["rect", "circle", "line", "text", "path"]);
    for (const kind of SUPPORTED_SVG_AUTHORING_KINDS) {
      expect(isSupportedSvgAuthoringKind(kind)).toBe(true);
    }
    expect(isSupportedSvgAuthoringKind("path")).toBe(true);
    expect(isSupportedSvgAuthoringKind("image")).toBe(false);
    expect(isSupportedSvgAuthoringKind("")).toBe(false);
  });

  it("assertSupportedStudioKinds accepts supported sets and rejects unsupported", () => {
    expect(assertSupportedStudioKinds(["rect", "circle", "line", "text", "path"])).toEqual({ ok: true });
    expect(assertSupportedStudioKinds([])).toEqual({ ok: true });

    const bad = assertSupportedStudioKinds(["path", "rect", "image", "foreignObject"]);
    expect(bad.ok).toBe(false);
    if (bad.ok) throw new Error("expected failure");
    expect(bad.unsupported).toEqual(["image", "foreignObject"]);
  });

  it("documents transforms, layers, history, and exclusions", () => {
    expect(SUPPORTED_SVG_AUTHORING_DOC.kinds).toEqual(SUPPORTED_SVG_AUTHORING_KINDS);
    expect([...SUPPORTED_SVG_AUTHORING_DOC.transforms]).toEqual(["translate", "resize"]);
    expect(SUPPORTED_SVG_AUTHORING_DOC.layers).toContain("visibility");
    expect(SUPPORTED_SVG_AUTHORING_DOC.history).toContain("named-undo");
    expect(SUPPORTED_SVG_AUTHORING_DOC.excluded.length).toBeGreaterThan(0);
    expect(SUPPORTED_SVG_AUTHORING_DOC.excluded).toContain("script");
  });
});
