"use client";

import {
  Archive,
  CircleNotch as Loader2,
  PencilSimple as Pencil,
  Trash as Trash2,
} from "@phosphor-icons/react";

import type {
  ConfiguratorCatalogItem,
  StandardCatalogItem,
} from "../api/adminCatalogClient";
import {
  ADMIN_PHONE_MIN_TAP_PX,
  phoneListLayoutMode,
} from "../ui/adminMobileReview";
import type { CatalogManagerItem } from "./adminCatalogManagerUtils";

type Props = {
  items: CatalogManagerItem[];
  isStandard: boolean;
  total: number;
  page: number;
  pendingId: string | null;
  readOnly: boolean;
  onEdit: (item: CatalogManagerItem) => void;
  onToggleVisible: (item: CatalogManagerItem) => void | Promise<void>;
  onDelete: (item: CatalogManagerItem) => void | Promise<void>;
  onPageChange: (page: number) => void;
};

function sizeLabel(item: CatalogManagerItem, isStandard: boolean): string {
  if (isStandard) {
    const row = item as StandardCatalogItem;
    return `${row.width_mm ?? "—"}×${row.depth_mm ?? "—"}×${row.height_mm ?? "—"} mm`;
  }
  return (item as ConfiguratorCatalogItem).sizing_type ?? "—";
}

function categoryLabel(item: CatalogManagerItem): string {
  const parts = [item.category];
  if ("subcategory" in item && item.subcategory) parts.push(item.subcategory);
  if ("family" in item && item.family) parts.push(item.family);
  return parts.filter(Boolean).join(" · ");
}

const phoneLayout = phoneListLayoutMode();
const minTapPx = String(ADMIN_PHONE_MIN_TAP_PX);

export function AdminCatalogTable({
  items,
  isStandard,
  total,
  page,
  pendingId,
  readOnly,
  onEdit,
  onToggleVisible,
  onDelete,
  onPageChange,
}: Props) {
  const pageCount = Math.max(1, Math.ceil(total / 50));

  return (
    <div
      className="admin-panel admin-catalog-inventory"
      data-testid="admin-catalog-inventory"
      data-phone-layout={phoneLayout}
    >
      <div className="admin-panel__header">
        {isStandard ? total : items.length} items
        {isStandard && total > 50 ? ` · page ${page}` : null}
        {readOnly ? " · read-only" : null}
      </div>
      <div
        className="admin-table-wrap admin-catalog-table-wrap"
        data-phone-layout={phoneLayout}
      >
        <table
          className="admin-table admin-catalog-table"
          data-testid="admin-catalog-table"
          data-phone-layout={phoneLayout}
        >
          <caption className="sr-only">
            Catalog products with name, category, size, status, and actions.
          </caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Size / type</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = item.id ?? ("slug" in item ? item.slug : item.name);
              const busy = pendingId === item.id;
              const isActive = isStandard
                ? (item as StandardCatalogItem).visible !== false
                : (item as ConfiguratorCatalogItem).active !== false;
              const name = item.name;
              const slug =
                "slug" in item && item.slug ? String(item.slug) : null;

              return (
                <tr
                  key={String(id)}
                  className="admin-catalog-row"
                  data-item-id={String(id)}
                >
                  <td data-label="Name">
                    <p className="admin-table__primary">{name}</p>
                    {slug ? (
                      <p className="admin-table__secondary">{slug}</p>
                    ) : null}
                  </td>
                  <td data-label="Category">
                    <span className="admin-table__secondary">
                      {categoryLabel(item)}
                    </span>
                  </td>
                  <td data-label="Size">
                    <span className="admin-table__secondary">
                      {sizeLabel(item, isStandard)}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span
                      className={`admin-badge ${isActive ? "admin-badge--active !text-strong" : "admin-badge--hidden"}`}
                    >
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div
                      className="admin-catalog-row-actions"
                      data-testid={`admin-catalog-row-actions-${String(id)}`}
                    >
                      <button
                        type="button"
                        className="admin-btn admin-btn--outline"
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${name}`}
                        data-min-tap-px={minTapPx}
                        data-testid={`admin-catalog-edit-${String(id)}`}
                      >
                        <Pencil size={14} aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--outline"
                        title={isActive ? "Hide from Planner" : "Show in Planner"}
                        aria-label={
                          isActive
                            ? `Hide ${name} from Planner`
                            : `Show ${name} in Planner`
                        }
                        disabled={readOnly || busy || !item.id}
                        onClick={() => void onToggleVisible(item)}
                        data-min-tap-px={minTapPx}
                        data-testid={`admin-catalog-toggle-${String(id)}`}
                      >
                        {busy ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <Archive size={14} aria-hidden />
                        )}
                        {isActive ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--outline"
                        aria-label={`Delete ${name}`}
                        disabled={readOnly || busy || !item.id}
                        onClick={() => void onDelete(item)}
                        data-min-tap-px={minTapPx}
                        data-testid={`admin-catalog-delete-${String(id)}`}
                      >
                        <Trash2 size={14} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isStandard && total > 50 ? (
        <div
          className="admin-catalog-paging"
          data-testid="admin-catalog-paging"
          data-min-tap-px={minTapPx}
        >
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            aria-label="Previous catalog page"
            data-min-tap-px={minTapPx}
          >
            Previous
          </button>
          <span className="admin-table__secondary" role="status">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next catalog page"
            data-min-tap-px={minTapPx}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
