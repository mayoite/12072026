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
    expect(isSupportedSvgAuthoringKind("rect")).toBe(true);
    expect(isSupportedSvgAuthoringKind("path")).toBe(false);
    expect(assertSupportedStudioKinds(["rect"]).ok).toBe(true);
    const bad = assertSupportedStudioKinds(["path"]);
    expect(bad.ok).toBe(false);
    expect(SUPPORTED_SVG_AUTHORING_DOC.excluded.length).toBeGreaterThan(0);
  });
});
