import { describe, expect, it } from "vitest";
import {
  SUPPORTED_SVG_AUTHORING_DOC,
  SUPPORTED_SVG_AUTHORING_KINDS,
  assertSupportedStudioKinds,
  isSupportedSvgAuthoringKind,
} from "@/features/admin/svg-editor/contracts/supportedSvgAuthoringSubset";

describe("supportedSvgAuthoringSubset", () => {
  it("allows only rect/circle/line/text", () => {
    expect([...SUPPORTED_SVG_AUTHORING_KINDS]).toEqual(["rect", "circle", "line", "text"]);
    for (const kind of SUPPORTED_SVG_AUTHORING_KINDS) {
      expect(isSupportedSvgAuthoringKind(kind)).toBe(true);
    }
    expect(isSupportedSvgAuthoringKind("path")).toBe(false);
    expect(isSupportedSvgAuthoringKind("image")).toBe(false);
    expect(isSupportedSvgAuthoringKind("")).toBe(false);
  });

  it("assertSupportedStudioKinds accepts supported sets and rejects unsupported", () => {
    expect(assertSupportedStudioKinds(["rect", "circle", "line", "text"])).toEqual({ ok: true });
    expect(assertSupportedStudioKinds([])).toEqual({ ok: true });

    const bad = assertSupportedStudioKinds(["path", "rect", "path", "image"]);
    expect(bad.ok).toBe(false);
    if (bad.ok) throw new Error("expected failure");
    expect(bad.unsupported).toEqual(["path", "image"]);
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
