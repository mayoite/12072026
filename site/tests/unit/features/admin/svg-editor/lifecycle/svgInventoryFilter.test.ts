import { describe, expect, it } from "vitest";
import {
  INVENTORY_PAGE_SIZE_DEFAULT,
  availabilityFromLifecycle,
  createSavedView,
  filterInventoryRows,
  groupInventoryRowsByFamily,
  matchInventoryQuery,
  pageInventoryRows,
  parseSavedViews,
  serializeSavedViews,
  sortInventoryRows,
  validationLabelForArtifact,
  type SvgInventoryRow,
} from "@/features/admin/svg-editor/lifecycle/svgInventoryFilter";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

function row(
  partial: Partial<BlockDescriptor> & Pick<BlockDescriptor, "slug" | "variant">,
  extras?: Partial<SvgInventoryRow>,
): SvgInventoryRow {
  const descriptor = {
    sku: "SKU-1",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
    generatedAt: 1,
    ...partial,
  } as BlockDescriptor;
  const lifecycle = extras?.lifecycle ?? "draft";
  return {
    descriptor,
    artifactState: "published",
    lifecycle,
    lastChangeLabel: "2026-07-13",
    lastChangeEpoch: 1,
    validationLabel: "ok",
    family: descriptor.variant,
    availability: availabilityFromLifecycle(lifecycle),
    ...extras,
  };
}

describe("matchInventoryQuery", () => {
  it("matches empty query and haystack fields", () => {
    const desk = row({
      slug: "desk-a",
      variant: "fixed",
      sku: "OFL-DSK",
      sourceProvenance: "native",
    }).descriptor;
    expect(matchInventoryQuery(desk, "")).toBe(true);
    expect(matchInventoryQuery(desk, "   ")).toBe(true);
    expect(matchInventoryQuery(desk, "desk")).toBe(true);
    expect(matchInventoryQuery(desk, "OFL-DSK")).toBe(true);
    expect(matchInventoryQuery(desk, "fixed")).toBe(true);
    expect(matchInventoryQuery(desk, "native")).toBe(true);
    expect(matchInventoryQuery(desk, "sofa")).toBe(false);
  });
});

describe("filterInventoryRows", () => {
  const rows = [
    row({ slug: "a", variant: "fixed" }, { artifactState: "published", lifecycle: "live" }),
    row({ slug: "b", variant: "configurable" }, { artifactState: "missing", lifecycle: "draft" }),
    row({ slug: "c", variant: "parametric" }, { artifactState: "invalid", lifecycle: "retired" }),
  ];

  it("filters by query, artifact, lifecycle, and variant", () => {
    expect(
      filterInventoryRows(rows, {
        query: "a",
        artifact: "all",
        lifecycle: "live",
        variant: "all",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["a"]);
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
        lifecycle: "retired",
        variant: "all",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["c"]);
    expect(
      filterInventoryRows(rows, {
        query: "",
        artifact: "all",
        lifecycle: "all",
        variant: "configurable",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["b"]);
  });
});

describe("validationLabelForArtifact / availabilityFromLifecycle", () => {
  it("maps every artifact and lifecycle state", () => {
    expect(validationLabelForArtifact("published")).toBe("ok");
    expect(validationLabelForArtifact("invalid")).toBe("invalid");
    expect(validationLabelForArtifact("missing")).toBe("missing");
    expect(availabilityFromLifecycle("live")).toBe("available");
    expect(availabilityFromLifecycle("draft")).toBe("unavailable");
    expect(availabilityFromLifecycle("retired")).toBe("retired");
  });
});

describe("sortInventoryRows", () => {
  it("sorts by each key ascending and descending", () => {
    const rows = [
      row(
        { slug: "b", variant: "fixed", sku: "Z", geometry: { widthMm: 800, depthMm: 1, heightMm: 1 } },
        { lifecycle: "retired", lastChangeEpoch: 10 },
      ),
      row(
        {
          slug: "a",
          variant: "configurable",
          sku: "A",
          geometry: { widthMm: 400, depthMm: 1, heightMm: 1 },
        },
        { lifecycle: "draft", lastChangeEpoch: 20 },
      ),
      row(
        {
          slug: "c",
          variant: "fixed",
          sku: undefined,
          geometry: { widthMm: 600, depthMm: 1, heightMm: 1 },
        },
        { lifecycle: "live", lastChangeEpoch: 5 },
      ),
    ];

    expect(sortInventoryRows(rows, "slug", "asc").map((r) => r.descriptor.slug)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(sortInventoryRows(rows, "slug", "desc").map((r) => r.descriptor.slug)).toEqual([
      "c",
      "b",
      "a",
    ]);
    expect(sortInventoryRows(rows, "sku", "asc").map((r) => r.descriptor.slug)).toEqual([
      "c",
      "a",
      "b",
    ]);
    expect(sortInventoryRows(rows, "family", "asc").map((r) => r.family)).toEqual([
      "configurable",
      "fixed",
      "fixed",
    ]);
    expect(sortInventoryRows(rows, "lifecycle", "asc").map((r) => r.lifecycle)).toEqual([
      "draft",
      "live",
      "retired",
    ]);
    expect(sortInventoryRows(rows, "lastChange", "desc").map((r) => r.lastChangeEpoch)).toEqual([
      20, 10, 5,
    ]);
    expect(
      sortInventoryRows(rows, "widthMm", "asc").map((r) => r.descriptor.geometry.widthMm),
    ).toEqual([400, 600, 800]);
  });
});

describe("pageInventoryRows", () => {
  it("clamps page and pageSize", () => {
    const rows = [row({ slug: "a", variant: "fixed" }), row({ slug: "b", variant: "fixed" })];
    const first = pageInventoryRows(rows, 1, 1);
    expect(first.pageRows).toHaveLength(1);
    expect(first.totalPages).toBe(2);
    expect(first.total).toBe(2);

    const beyond = pageInventoryRows(rows, 99, 1);
    expect(beyond.page).toBe(2);
    expect(beyond.pageRows[0]?.descriptor.slug).toBe("b");

    const zeroSize = pageInventoryRows(rows, 0, 0);
    expect(zeroSize.pageSize).toBe(1);
    expect(zeroSize.page).toBe(1);

    const empty = pageInventoryRows([], 1, 10);
    expect(empty.totalPages).toBe(1);
    expect(empty.pageRows).toEqual([]);
  });
});

describe("groupInventoryRowsByFamily", () => {
  it("groups in fixed → configurable → parametric order and drops empty families", () => {
    const rows = [
      row({ slug: "p", variant: "parametric" }),
      row({ slug: "f1", variant: "fixed" }),
      row({ slug: "c", variant: "configurable" }),
      row({ slug: "f2", variant: "fixed" }),
    ];
    const groups = groupInventoryRowsByFamily(rows);
    expect(groups.map((g) => g.family)).toEqual(["fixed", "configurable", "parametric"]);
    expect(groups[0]?.rows.map((r) => r.descriptor.slug)).toEqual(["f1", "f2"]);
    expect(groupInventoryRowsByFamily([row({ slug: "only", variant: "fixed" })]).map((g) => g.family)).toEqual([
      "fixed",
    ]);
  });
});

describe("saved views", () => {
  it("creates, serializes, and parses views with guards", () => {
    const view = createSavedView(
      "  All  ",
      { query: "desk", artifact: "published", lifecycle: "live", variant: "fixed" },
      "slug",
      "asc",
      INVENTORY_PAGE_SIZE_DEFAULT,
      () => "view-1",
    );
    expect(view).toEqual({
      id: "view-1",
      name: "All",
      filter: { query: "desk", artifact: "published", lifecycle: "live", variant: "fixed" },
      sortKey: "slug",
      sortDir: "asc",
      pageSize: INVENTORY_PAGE_SIZE_DEFAULT,
    });

    const blankName = createSavedView(
      "   ",
      { query: "", artifact: "all", lifecycle: "all", variant: "all" },
      "sku",
      "desc",
      0.9,
      () => "view-2",
    );
    expect(blankName.name).toBe("Saved view");
    expect(blankName.pageSize).toBe(1);

    const round = parseSavedViews(serializeSavedViews([view]));
    expect(round[0]?.id).toBe("view-1");
    expect(parseSavedViews(null)).toEqual([]);
    expect(parseSavedViews("")).toEqual([]);
    expect(parseSavedViews("   ")).toEqual([]);
    expect(parseSavedViews("not-json")).toEqual([]);
    expect(parseSavedViews("{}")).toEqual([]);
    expect(parseSavedViews(JSON.stringify([{ id: 1, name: "x", filter: {} }]))).toEqual([]);
    expect(
      parseSavedViews(
        JSON.stringify([
          { id: "ok", name: "Ok", filter: { query: "" }, sortKey: "slug", sortDir: "asc", pageSize: 10 },
          { name: "missing-id", filter: {} },
        ]),
      ),
    ).toHaveLength(1);
  });
});
