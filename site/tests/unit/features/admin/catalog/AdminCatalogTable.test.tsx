import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { AdminCatalogTable } from "@/features/admin/catalog/AdminCatalogTable";
import type { CatalogManagerItem } from "@/features/admin/catalog/adminCatalogManagerUtils";
import {
  ADMIN_CATALOG_PHONE_CELL_LABELS,
  ADMIN_PHONE_CARDS_MAX_WIDTH_REM,
  ADMIN_PHONE_MIN_TAP_PX,
  ADMIN_PHONE_MIN_TAP_REM,
  phoneListLayoutMode,
} from "@/features/admin/ui/adminMobileReview";

const standardItem = {
  id: "1",
  name: "Desk",
  slug: "desk",
  category: "desk",
  subcategory: "height-adjustable",
  visible: true,
  width_mm: 1200,
  depth_mm: 600,
  height_mm: 750,
} as unknown as CatalogManagerItem;

const hiddenItem = {
  id: "2",
  name: "Side table",
  slug: "side-table",
  category: "table",
  visible: false,
  width_mm: 400,
  depth_mm: 400,
  height_mm: 450,
} as unknown as CatalogManagerItem;

const configuratorItem = {
  id: "cfg-1",
  name: "Param desk",
  slug: "param-desk",
  category: "desks",
  family: "series-a",
  active: true,
  sizing_type: "parametric",
} as unknown as CatalogManagerItem;

function renderTable(
  overrides: Partial<{
    items: CatalogManagerItem[];
    isStandard: boolean;
    onEdit: (item: CatalogManagerItem) => void;
    total: number;
    page: number;
    readOnly: boolean;
    onPageChange: (page: number) => void;
  }> = {},
) {
  const onEdit = overrides.onEdit ?? vi.fn();
  const onPageChange = overrides.onPageChange ?? vi.fn();
  const view = render(
    <AdminCatalogTable
      items={overrides.items ?? [standardItem]}
      isStandard={overrides.isStandard ?? true}
      total={overrides.total ?? 1}
      page={overrides.page ?? 1}
      pendingId={null}
      readOnly={overrides.readOnly ?? false}
      onEdit={onEdit}
      onToggleVisible={vi.fn()}
      onDelete={vi.fn()}
      onPageChange={onPageChange}
    />,
  );
  return { onEdit, onPageChange, ...view };
}

function adminPagesCss(): string {
  return readFileSync(
    path.join(
      process.cwd(),
      "app/css/core/locked/admin/admin-pages.css",
    ),
    "utf8",
  );
}

function adminPrimitivesCss(): string {
  return readFileSync(
    path.join(
      process.cwd(),
      "app/css/core/locked/admin/admin-primitives.css",
    ),
    "utf8",
  );
}

describe("AdminCatalogTable", () => {
  it("renders rows and edit action", () => {
    const { onEdit } = renderTable();
    expect(screen.getByText("Desk")).toBeInTheDocument();
    const edit = screen.getByTestId("admin-catalog-edit-1");
    fireEvent.click(edit);
    expect(onEdit).toHaveBeenCalled();
  });

  it("AF-06 unit: phone cards-priority layout with labeled cells and text actions", () => {
    expect(phoneListLayoutMode()).toBe("cards-priority");
    const { container } = renderTable();
    const inventory = screen.getByTestId("admin-catalog-inventory");
    const wrap = container.querySelector(
      '[data-phone-layout="cards-priority"].admin-catalog-table-wrap',
    );
    const table = screen.getByTestId("admin-catalog-table");

    expect(inventory).toHaveAttribute("data-phone-layout", "cards-priority");
    expect(wrap).not.toBeNull();
    expect(table).toHaveAttribute("data-phone-layout", "cards-priority");

    for (const label of ADMIN_CATALOG_PHONE_CELL_LABELS) {
      expect(container.querySelector(`td[data-label="${label}"]`)).not.toBeNull();
    }

    // Actions are not icon-only — visible text for phone review
    expect(screen.getByTestId("admin-catalog-edit-1")).toHaveTextContent(/Edit/i);
    expect(screen.getByTestId("admin-catalog-toggle-1")).toHaveTextContent(/Hide|Show/i);
    expect(screen.getByTestId("admin-catalog-delete-1")).toHaveTextContent(/Delete/i);

    // Name is card header content (primary), slug is secondary
    const nameCell = container.querySelector('td[data-label="Name"]');
    expect(nameCell?.querySelector(".admin-table__primary")).toHaveTextContent("Desk");
    expect(nameCell?.querySelector(".admin-table__secondary")).toHaveTextContent("desk");
  });

  it("AF-06 unit: row actions declare ≥44px tap floor and stay labeled", () => {
    renderTable();
    const actions = screen.getByTestId("admin-catalog-row-actions-1");
    const buttons = within(actions).getAllByRole("button");
    expect(buttons).toHaveLength(3);

    for (const button of buttons) {
      expect(button).toHaveAttribute("data-min-tap-px", String(ADMIN_PHONE_MIN_TAP_PX));
      expect(button.textContent?.replace(/\s+/g, " ").trim().length).toBeGreaterThan(0);
      // Visible label text, not aria-only
      expect(button.textContent).toMatch(/Edit|Hide|Show|Delete/i);
      // No shell-level primary on rows
      expect(button).not.toHaveClass("admin-btn--primary");
    }

    // Clear primary vs secondary vs destructive hierarchy
    expect(screen.getByTestId("admin-catalog-edit-1")).toHaveAttribute(
      "data-row-action",
      "primary",
    );
    expect(screen.getByTestId("admin-catalog-toggle-1")).toHaveAttribute(
      "data-row-action",
      "secondary",
    );
    expect(screen.getByTestId("admin-catalog-delete-1")).toHaveAttribute(
      "data-row-action",
      "destructive",
    );
  });

  it("AF-06 unit: locked CSS enforces cards-priority labels and ≥44px actions", () => {
    const pages = adminPagesCss();
    const primitives = adminPrimitivesCss();

    expect(pages).toContain(`max-width: ${ADMIN_PHONE_CARDS_MAX_WIDTH_REM}rem`);
    expect(pages).toContain('data-phone-layout="cards-priority"');
    expect(pages).toContain("content: attr(data-label)");
    expect(pages).toContain('td[data-label="Name"]');
    expect(pages).toContain('td[data-label="Actions"]');
    expect(pages).toContain(".admin-catalog-row-actions");
    expect(pages).toContain(`min-height: ${ADMIN_PHONE_MIN_TAP_REM}rem`); /* ≥44px */
    expect(pages).toMatch(
      /table\[data-phone-layout="cards-priority"\][\s\S]*td\[data-label="Actions"\][\s\S]*\.admin-btn[\s\S]*min-height:\s*2\.75rem/,
    );
    expect(pages).toMatch(
      /\.admin-catalog-paging[\s\S]*\.admin-btn[\s\S]*min-height:\s*2\.75rem/,
    );
    // Name spans full width when no Preview column (catalog cards)
    expect(pages).toContain('td[data-label="Preview"]');
    expect(pages).toContain(
      "tr:not(.admin-table__group):not(:has(td[data-label=\"Preview\"]))",
    );

    expect(primitives).toMatch(
      /\.admin-catalog-row-actions \.admin-btn[\s\S]*min-height:\s*2\.75rem/,
    );
    expect(ADMIN_PHONE_MIN_TAP_PX).toBe(44);
    expect(ADMIN_PHONE_MIN_TAP_REM).toBe(2.75);
  });

  it("AF-06 unit: Show label when product is hidden; size/category text present", () => {
    const { container } = renderTable({ items: [hiddenItem] });
    expect(screen.getByTestId("admin-catalog-toggle-2")).toHaveTextContent(/^Show$/);
    expect(container.querySelector('td[data-label="Status"]')).toHaveTextContent(
      /Hidden/i,
    );
    expect(container.querySelector('td[data-label="Size"]')).toHaveTextContent(
      "400×400×450 mm",
    );
    expect(container.querySelector('td[data-label="Category"]')).toHaveTextContent(
      "table",
    );
  });

  it("AF-06 unit: configurator rows use sizing type and keep phone labels", () => {
    const { container } = renderTable({
      items: [configuratorItem],
      isStandard: false,
    });
    expect(container.querySelector('td[data-label="Size"]')).toHaveTextContent(
      "parametric",
    );
    expect(container.querySelector('td[data-label="Category"]')).toHaveTextContent(
      /desks.*series-a/i,
    );
    expect(screen.getByTestId("admin-catalog-table")).toHaveAttribute(
      "data-phone-layout",
      "cards-priority",
    );
  });

  it("disables write actions when read-only", () => {
    renderTable({ readOnly: true });
    expect(screen.getByTestId("admin-catalog-toggle-1")).toBeDisabled();
    expect(screen.getByTestId("admin-catalog-delete-1")).toBeDisabled();
    expect(screen.getByTestId("admin-catalog-edit-1")).not.toBeDisabled();
  });

  it("pages when total exceeds page size", () => {
    const onPageChange = vi.fn();
    renderTable({ total: 51, page: 1, onPageChange });
    const paging = screen.getByTestId("admin-catalog-paging");
    expect(paging).toBeInTheDocument();
    expect(paging).toHaveAttribute("data-min-tap-px", String(ADMIN_PHONE_MIN_TAP_PX));
    fireEvent.click(screen.getByRole("button", { name: /next catalog page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
