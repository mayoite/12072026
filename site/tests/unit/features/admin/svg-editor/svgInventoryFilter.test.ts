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
} from "@/features/admin/svg-editor/svgInventoryFilter";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

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

describe("svgInventoryFilter", () => {
  it("matches query and filters rows", () => {
    expect(matchInventoryQuery(row({ slug: "desk-a", variant: "fixed" }).descriptor, "desk")).toBe(
      true,
    );
    const rows = [
      row({ slug: "a", variant: "fixed" }, { lifecycle: "live" }),
      row({ slug: "b", variant: "configurable" }, { lifecycle: "draft" }),
    ];
    const filtered = filterInventoryRows(rows, {
      query: "a",
      artifact: "all",
      lifecycle: "live",
      variant: "all",
    });
    expect(filtered.map((r) => r.descriptor.slug)).toEqual(["a"]);
  });

  it("sorts, pages, groups, and serializes saved views", () => {
    expect(validationLabelForArtifact("published")).toBe("ok");
    expect(availabilityFromLifecycle("retired")).toBe("retired");
    const rows = [
      row({ slug: "b", variant: "fixed" }),
      row({ slug: "a", variant: "configurable" }),
    ];
    expect(sortInventoryRows(rows, "slug", "asc").map((r) => r.descriptor.slug)).toEqual([
      "a",
      "b",
    ]);
    const page = pageInventoryRows(rows, 1, 1);
    expect(page.pageRows).toHaveLength(1);
    expect(page.totalPages).toBe(2);
    expect(groupInventoryRowsByFamily(rows).length).toBeGreaterThan(0);
    const view = createSavedView(
      "All",
      { query: "", artifact: "all", lifecycle: "all", variant: "all" },
      "slug",
      "asc",
      INVENTORY_PAGE_SIZE_DEFAULT,
    );
    const round = parseSavedViews(serializeSavedViews([view]));
    expect(round[0]?.name).toBe("All");
  });
});
