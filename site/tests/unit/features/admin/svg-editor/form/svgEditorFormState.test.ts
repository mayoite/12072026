import { describe, expect, it } from "vitest";
import type {
  FormVec2,
  SvgEditorFormState,
} from "@/features/admin/svg-editor/form/svgEditorFormState";

function asVec2(v: FormVec2): FormVec2 {
  return v;
}

describe("svgEditorFormState types", () => {
  it("accepts FormVec2 and minimal SvgEditorFormState shapes", () => {
    expect(asVec2({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    const state: SvgEditorFormState = {
      variant: "fixed",
      slug: "desk",
      sku: "SKU",
      sourceProvenance: "native",
      createdBy: "tester",
      geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 600, height: 600 },
      mounting: ["floor"],
      liveAnnouncementCategories: ["status"],
      rovingFocus: [],
      mountingPoints: [],
      blocks: [],
      themeTokens: [{ key: "currentColor", value: "currentColor" }],
      configurableSizingType: "discrete",
      configurableSizeOptions: [],
      parameterSchema: [],
      assetsGlbUrl: "",
      assetsSvgUrl: "",
    };
    expect(state.slug).toBe("desk");
    expect(state.geometry.widthMm).toBe(600);
  });
});
