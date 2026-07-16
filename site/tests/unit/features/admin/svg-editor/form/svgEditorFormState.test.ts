import { describe, expect, it } from "vitest";
import type {
  FieldIssue,
  FormVec2,
  SvgEditorFormState,
} from "@/features/admin/svg-editor/form/svgEditorFormState";

function asVec2(v: FormVec2): FormVec2 {
  return v;
}

function minimalState(overrides: Partial<SvgEditorFormState> = {}): SvgEditorFormState {
  return {
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
    ...overrides,
  };
}

describe("svgEditorFormState types", () => {
  it("accepts FormVec2 and minimal SvgEditorFormState shapes", () => {
    expect(asVec2({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
    const state = minimalState();
    expect(state.slug).toBe("desk");
    expect(state.geometry.widthMm).toBe(600);
  });

  it("accepts optional scene and compiled fields", () => {
    const state = minimalState({
      sceneViewBox: { x: 0, y: 0, width: 100, height: 50 },
      sceneParts: [
        {
          kind: "rect",
          id: "top",
          x: 0,
          y: 0,
          width: 100,
          height: 50,
        },
      ],
      compiledSvg: "<svg></svg>",
      geometry: {
        widthMm: 100,
        depthMm: 50,
        heightMm: 10,
        seatHeightMm: 5,
        weightKg: 12,
      },
    });
    expect(state.sceneParts).toHaveLength(1);
    expect(state.compiledSvg).toContain("svg");
    expect(state.geometry.seatHeightMm).toBe(5);
  });

  it("FieldIssue is path + message", () => {
    const issue: FieldIssue = { path: "slug", message: "required" };
    expect(issue.path).toBe("slug");
    expect(issue.message).toBe("required");
  });
});
