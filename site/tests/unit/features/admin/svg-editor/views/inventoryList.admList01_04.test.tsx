/**
 * ADM-LIST-01..04 — search, multi-filter, sort, paging, saved views;
 * row fields; accessible action names; family grouping.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import {
  availabilityFromLifecycle,
  createSavedView,
  filterInventoryRows,
  groupInventoryRowsByFamily,
  pageInventoryRows,
  parseSavedViews,
  serializeSavedViews,
  sortInventoryRows,
  type SvgInventoryRow,
} from "@/features/admin/svg-editor/lifecycle/svgInventoryFilter";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/admin/svg-editor/publish/PublishedSvgPreview", () => ({
  PublishedSvgPreview: () => <span data-testid="preview-stub" />,
}));

vi.mock("@/lib/api/browserApi", () => ({
  apiPath: (p: string) => p,
  browserApiFetch: vi.fn(),
}));

import { AdminSvgEditorListView } from "@/features/admin/svg-editor/views/AdminSvgEditorListView";

function row(
  partial: Partial<BlockDescriptor> &
    Pick<BlockDescriptor, "slug" | "variant">,
  extras?: Partial<SvgInventoryRow>,
): SvgInventoryRow {
  const descriptor = {
    sku: "SKU-1",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
    generatedAt: 1_700_000_000,
    ...partial,
  } as BlockDescriptor;
  const lifecycle = extras?.lifecycle ?? "draft";
  return {
    descriptor,
    artifactState: "published",
    lifecycle,
    lastChangeLabel: "2026-07-13",
    lastChangeEpoch: 1_700_000_000_000,
    validationLabel: "ok",
    family: descriptor.variant,
    availability: availabilityFromLifecycle(lifecycle),
    ...extras,
  };
}

describe("ADM-LIST-01 search multi-filter sort page saved views", () => {
  it("filters by query artifact lifecycle variant", () => {
    const rows = [
      row({ slug: "a", variant: "fixed", sku: "AAA" }, { lifecycle: "live" }),
      row(
        { slug: "b", variant: "configurable", sku: "BBB" },
        { artifactState: "missing", lifecycle: "draft", validationLabel: "missing" },
      ),
    ];
    expect(
      filterInventoryRows(rows, {
        query: "bbb",
        artifact: "all",
        lifecycle: "all",
        variant: "all",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["b"]);
    expect(
      filterInventoryRows(rows, {
        query: "",
        artifact: "missing",
        lifecycle: "draft",
        variant: "configurable",
      }).map((r) => r.descriptor.slug),
    ).toEqual(["b"]);
  });

  it("sorts by sku and pages results", () => {
    const rows = [
      row({ slug: "z", variant: "fixed", sku: "Z" }),
      row({ slug: "a", variant: "fixed", sku: "A" }),
      row({ slug: "m", variant: "fixed", sku: "M" }),
    ];
    const sorted = sortInventoryRows(rows, "sku", "asc");
    expect(sorted.map((r) => r.descriptor.sku)).toEqual(["A", "M", "Z"]);
    const page1 = pageInventoryRows(sorted, 1, 2);
    expect(page1.pageRows.map((r) => r.descriptor.slug)).toEqual(["a", "m"]);
    expect(page1.totalPages).toBe(2);
    const page2 = pageInventoryRows(sorted, 2, 2);
    expect(page2.pageRows.map((r) => r.descriptor.slug)).toEqual(["z"]);
  });

  it("round-trips saved views JSON", () => {
    const view = createSavedView(
      "Live only",
      {
        query: "",
        artifact: "published",
        lifecycle: "live",
        variant: "all",
      },
      "slug",
      "asc",
      10,
      () => "view-1",
    );
    const raw = serializeSavedViews([view]);
    expect(parseSavedViews(raw)).toEqual([view]);
  });
});

describe("ADM-LIST-04 family groups", () => {
  it("groups variants for comparison", () => {
    const rows = [
      row({ slug: "f1", variant: "fixed" }),
      row({ slug: "c1", variant: "configurable" }),
      row({ slug: "f2", variant: "fixed" }),
    ];
    const groups = groupInventoryRowsByFamily(rows);
    expect(groups.map((g) => g.family)).toEqual(["fixed", "configurable"]);
    expect(groups[0]?.rows.map((r) => r.descriptor.slug)).toEqual(["f1", "f2"]);
  });
});

describe("ADM-LIST-02/03 list view rows and actions", () => {
  const descriptors = [
    {
      slug: "side-table-001",
      sku: "OFL-TBL-001",
      variant: "fixed",
      sourceProvenance: "native",
      generatedAt: 1_700_000_000_000,
      geometry: { widthMm: 600, depthMm: 600, heightMm: 750 },
    },
    {
      slug: "desk-cfg-001",
      sku: "OFL-DSK-001",
      variant: "configurable",
      sourceProvenance: "native",
      generatedAt: 1_700_000_100_000,
      geometry: { widthMm: 1200, depthMm: 800, heightMm: 750 },
    },
  ] as unknown as BlockDescriptor[];

  it("exposes identity SKU family dimensions lifecycle availability symbol last change", () => {
    render(
      <AdminSvgEditorListView
        descriptors={descriptors}
        refreshedAtLabel="test"
        artifactStatuses={{
          "side-table-001": {
            state: "published",
            bytes: 12,
            updatedAt: 1,
            hash: "abc",
            publicUrl: "/svg-catalog/side-table-001.svg",
            markup: "<svg></svg>",
          },
          "desk-cfg-001": {
            state: "missing",
            bytes: 0,
            updatedAt: null,
            hash: null,
            publicUrl: null,
            markup: null,
          },
        }}
        lifecycleManifest={{
          "side-table-001": { state: "live", updatedAt: "2026-07-13" },
        }}
      />,
    );

    expect(screen.getByTestId("admin-svg-inventory-search")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-filter-artifact")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory-sort")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory-paging")).toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory-saved-views")).toBeInTheDocument();

    expect(screen.getByTestId("admin-svg-family-group-fixed")).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-svg-family-group-configurable"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("admin-svg-sku-side-table-001")).toHaveTextContent(
      "OFL-TBL-001",
    );
    expect(
      screen.getByTestId("admin-svg-dimensions-side-table-001"),
    ).toHaveTextContent(/600×600/);
    expect(
      screen.getByTestId("admin-svg-availability-side-table-001"),
    ).toHaveTextContent(/available/);
    expect(
      screen.getByTestId("admin-svg-last-change-side-table-001"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-svg-validation-side-table-001"),
    ).toHaveTextContent(/Published|Valid|Missing/i);

    const edit = screen.getByTestId("admin-svg-edit-side-table-001");
    expect(edit).toHaveAttribute(
      "aria-label",
      "Edit side-table-001 in SVG studio",
    );
    const retire = screen.getByTestId("admin-svg-retire-side-table-001");
    expect(retire).toHaveAttribute("aria-label", "Retire side-table-001");

    // Status chips use intentional title case, not raw enum tokens
    const lifecycleBadges = document.querySelectorAll(
      "td[data-label='Lifecycle'] .admin-badge",
    );
    const badgeText = Array.from(lifecycleBadges).map((el) => el.textContent);
    expect(badgeText).toContain("Live");
    expect(badgeText).toContain("Draft");
    expect(badgeText).not.toContain("live");
    expect(badgeText).not.toContain("draft");

    // Symbol status is operator language (no pipeline/validation jargon)
    expect(
      screen.getByTestId("admin-svg-validation-side-table-001"),
    ).toHaveTextContent(/^Published$/);
    expect(
      screen.getByTestId("admin-svg-validation-desk-cfg-001"),
    ).toHaveTextContent(/^Missing$/);

    // Phone-oriented card markup present for CSS cards-priority layout
    expect(
      screen.getByTestId("admin-svg-inventory-table"),
    ).toHaveAttribute("data-phone-layout", "cards-priority");
    expect(
      document.querySelector(
        ".admin-table-wrap[data-phone-layout='cards-priority']",
      ),
    ).not.toBeNull();

    // Edit is labeled (not icon-only); retire has accessible name
    expect(screen.getByTestId("admin-svg-edit-side-table-001")).toHaveTextContent(
      /Edit/i,
    );
    expect(
      screen.getByTestId("admin-svg-retire-side-table-001"),
    ).toHaveClass("admin-svg-inventory-actions__retire");

    // Advanced bulk stays demoted (closed details)
    const advanced = screen.getByTestId("admin-svg-advanced-import");
    expect(advanced.tagName.toLowerCase()).toBe("details");
    expect(advanced).not.toHaveAttribute("open");
  });

  it("shows clear filters when filters active and resets inventory", async () => {
    const user = userEvent.setup();
    render(
      <AdminSvgEditorListView
        descriptors={descriptors}
        refreshedAtLabel="test"
        artifactStatuses={{
          "side-table-001": {
            state: "published",
            bytes: 12,
            updatedAt: 1,
            hash: "abc",
            publicUrl: "/svg-catalog/side-table-001.svg",
            markup: "<svg></svg>",
          },
          "desk-cfg-001": {
            state: "missing",
            bytes: 0,
            updatedAt: null,
            hash: null,
            publicUrl: null,
            markup: null,
          },
        }}
        lifecycleManifest={{}}
      />,
    );

    expect(
      screen.queryByTestId("admin-svg-inventory-clear-filters"),
    ).not.toBeInTheDocument();

    await user.type(screen.getByTestId("admin-svg-inventory-search"), "no-match-xyz");
    expect(screen.getByTestId("admin-svg-inventory-empty")).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-svg-inventory-clear-filters"),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("admin-svg-inventory-clear-filters-empty"));
    expect(
      screen.queryByTestId("admin-svg-inventory-empty"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("admin-svg-inventory-search")).toHaveValue("");
    expect(screen.getByTestId("admin-svg-edit-side-table-001")).toBeInTheDocument();
  });
});
