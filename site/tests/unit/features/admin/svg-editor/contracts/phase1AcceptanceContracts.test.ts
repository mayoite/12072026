import { describe, expect, it } from "vitest";

import {
  stageMeetsMinimumAt1280,
  stageWidthFractionAt,
  STAGE_GRID_COLUMNS,
  STAGE_MIN_FRACTION,
  AUTHORING_WIDTH_PX,
  STUDIO_REGION_IDS,
  STUDIO_REGION_TEST_IDS,
} from "@/features/admin/svg-editor/contracts/stageLayoutContract";
import {
  assertSupportedStudioKinds,
  isSupportedSvgAuthoringKind,
  SUPPORTED_SVG_AUTHORING_DOC,
} from "@/features/admin/svg-editor/contracts/supportedSvgAuthoringSubset";
import {
  filterInventoryRows,
  matchInventoryQuery,
  validationLabelForArtifact,
  type SvgInventoryRow,
} from "@/features/admin/svg-editor/lifecycle/svgInventoryFilter";
import {
  SVG_EDITOR_FIELDS,
  SVG_EDITOR_FIELD_GROUP_LABEL,
} from "@/features/admin/svg-editor/form/svgEditorFormModel";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

function row(
  partial: Partial<BlockDescriptor> & Pick<BlockDescriptor, "slug" | "variant">,
  extras?: Partial<SvgInventoryRow>,
): SvgInventoryRow {
  const descriptor = {
    sku: "SKU-1",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
    ...partial,
  } as BlockDescriptor;
  const lifecycle = extras?.lifecycle ?? "draft";
  return {
    descriptor,
    artifactState: "published",
    lifecycle,
    lastChangeLabel: "2026-07-13",
    lastChangeEpoch: 0,
    validationLabel: "ok",
    family: descriptor.variant,
    availability:
      lifecycle === "live"
        ? "available"
        : lifecycle === "retired"
          ? "retired"
          : "unavailable",
    ...extras,
  };
}

describe("ADM-SVG-02 inventory finding", () => {
  it("matches query on slug and sku", () => {
    const desk = row({ slug: "desk-linear-1200-001", variant: "fixed", sku: "OFL-DSK" });
    expect(matchInventoryQuery(desk.descriptor, "desk")).toBe(true);
    expect(matchInventoryQuery(desk.descriptor, "OFL-DSK")).toBe(true);
    expect(matchInventoryQuery(desk.descriptor, "sofa")).toBe(false);
  });

  it("filters by artifact, lifecycle, and variant", () => {
    const rows = [
      row({ slug: "a", variant: "fixed" }, { artifactState: "published", lifecycle: "live" }),
      row({ slug: "b", variant: "configurable" }, { artifactState: "missing", lifecycle: "draft" }),
      row({ slug: "c", variant: "fixed" }, { artifactState: "invalid", lifecycle: "retired" }),
    ];
    expect(
      filterInventoryRows(rows, {
        query: "",
        artifact: "missing",
        lifecycle: "all",
        variant: "all",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["b"]);
    expect(
      filterInventoryRows(rows, {
        query: "",
        artifact: "all",
        lifecycle: "live",
        variant: "fixed",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["a"]);
  });

  it("maps artifact state to validation labels", () => {
    expect(validationLabelForArtifact("published")).toBe("ok");
    expect(validationLabelForArtifact("invalid")).toBe("invalid");
    expect(validationLabelForArtifact("missing")).toBe("missing");
  });
});

describe("ADM-SVG-04 stage fraction at 1280", () => {
  it("gives the shell stage column at least 55 percent at 1280px (existing CSS grid)", () => {
    // Locked admin theme: minmax(0,1fr) minmax(280px, 22rem), gap 0.75rem
    expect(STAGE_GRID_COLUMNS).toBe("minmax(0, 1fr) minmax(280px, 22rem)");
    expect(AUTHORING_WIDTH_PX).toBe(1280);
    expect(STAGE_MIN_FRACTION).toBe(0.55);
    const fraction = stageWidthFractionAt(1280);
    // 1280 − 12 gap − 352 rail = 916 → 0.716
    expect(fraction).toBeGreaterThanOrEqual(0.55);
    expect(fraction).toBeCloseTo(916 / 1280, 5);
    expect(stageMeetsMinimumAt1280()).toBe(true);
  });
});

describe("ADM-SVG-05 / ADM-SVG-08 regions and subset", () => {
  it("names the four stable studio regions and their data-testids", () => {
    expect([...STUDIO_REGION_IDS]).toEqual([
      "command",
      "stage",
      "layers",
      "properties",
    ]);
    expect(STUDIO_REGION_TEST_IDS).toEqual({
      command: "admin-studio-region-command",
      stage: "admin-studio-region-stage",
      layers: "admin-studio-region-layers",
      properties: "admin-studio-region-properties",
    });
  });

  it("documents and enforces the supported authoring subset", () => {
    expect(SUPPORTED_SVG_AUTHORING_DOC.kinds).toEqual(["rect", "circle", "line", "text"]);
    expect(isSupportedSvgAuthoringKind("rect")).toBe(true);
    expect(isSupportedSvgAuthoringKind("line")).toBe(true);
    expect(isSupportedSvgAuthoringKind("text")).toBe(true);
    expect(isSupportedSvgAuthoringKind("path")).toBe(false);
    expect(assertSupportedStudioKinds(["rect", "circle", "line", "text"])).toEqual({ ok: true });
    expect(assertSupportedStudioKinds(["rect", "path"])).toEqual({
      ok: false,
      unsupported: ["path"],
    });
  });

  it("rejects unsupported kinds at serialize (publish authority)", async () => {
    const { serializeSceneToDefinition } = await import(
      "@/features/admin/svg-editor/scene/svgSceneSerializer"
    );
    const doc = {
      modelVersion: 1 as const,
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      metadata: {
        typeId: "test",
        name: "test",
        category: "furniture",
        tags: [] as string[],
        lifecycleStatus: "draft" as const,
        ownerId: "test",
        physicalDimensionsMm: { width: 100, depth: 100, height: 100 },
        accessibilityTitle: "test",
      },
      nodes: [
        {
          kind: "path" as const,
          id: "bad-path",
          name: "Path",
          locked: false,
          hidden: false,
          style: {
            fillToken: "currentColor",
            strokeToken: "currentColor",
            lineWeight: 1,
          },
          d: "M0 0 L10 10",
        },
      ],
    };
    expect(() => serializeSceneToDefinition(doc)).toThrow(/Unsupported SVG authoring kinds/);
  });
});

describe("ADM-FORM-01 field groups", () => {
  it("assigns every cartography field to an operator task group", () => {
    for (const field of SVG_EDITOR_FIELDS) {
      expect(field.group).toBeDefined();
      expect(SVG_EDITOR_FIELD_GROUP_LABEL[field.group]).toBeDefined();
    }
    const groups = new Set(SVG_EDITOR_FIELDS.map((field) => field.group));
    expect(groups.has("identity")).toBe(true);
    expect(groups.has("geometry")).toBe(true);
    expect(groups.has("assets")).toBe(true);
    expect(groups.has("availability")).toBe(true);
    expect(groups.has("configuration")).toBe(true);
  });
});
