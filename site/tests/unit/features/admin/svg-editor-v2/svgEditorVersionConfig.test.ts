import { describe, expect, it } from "vitest";

import { parseSvgEditorVersionConfig } from "@/features/admin/svg-editor-v2/config/svgEditorVersionConfig";

describe("SVG editor cutover config", () => {
  it("defaults local execution to V2 with read-only V1 recovery", () => {
    expect(parseSvgEditorVersionConfig({})).toEqual({ ADMIN_SVG_EDITOR_VERSION: "v2", ADMIN_SVG_EDITOR_LEGACY_READONLY: true, PLANNER_SVG_CATALOG_VERSION: "v2" });
  });

  it("rejects invalid and contradictory cutover states", () => {
    expect(() => parseSvgEditorVersionConfig({ ADMIN_SVG_EDITOR_VERSION: "v3" })).toThrow();
    expect(() => parseSvgEditorVersionConfig({ ADMIN_SVG_EDITOR_VERSION: "v1", ADMIN_SVG_EDITOR_LEGACY_READONLY: "true" })).toThrow(/read-only/i);
  });
});
