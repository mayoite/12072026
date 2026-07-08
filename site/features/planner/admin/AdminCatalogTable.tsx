"use client";

import { Archive, CircleNotch as Loader2, PencilSimple as Pencil, Trash as Trash2 } from "@phosphor-icons/react";

import type {
  ConfiguratorCatalogItem,
  StandardCatalogItem,
} from "./adminCatalogClient";
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
  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        {isStandard ? total : items.length} items
        {isStandard && total > 50 ? ` - page ${page}` : null}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Size / type</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = item.id ?? ("slug" in item ? item.slug : item.name);
              const busy = pendingId === item.id;
              const isActive = isStandard
                ? (item as StandardCatalogItem).visible !== false
                : (item as ConfiguratorCatalogItem).active !== false;

              return (
                <tr key={String(id)}>
                  <td>
                    <p className="admin-table__primary">{item.name}</p>
                    {"slug" in item && item.slug ? (
                      <p className="admin-table__secondary">{item.slug}</p>
                    ) : null}
                  </td>
                  <td className="text-muted">
                    {item.category}
                    {"subcategory" in item && item.subcategory ? ` - ${item.subcategory}` : null}
                    {"family" in item && item.family ? ` - ${item.family}` : null}
                  </td>
                  <td className="text-muted">
                    {isStandard ? (
                      <>
                        {(item as StandardCatalogItem).width_mm ?? "--"} x{" "}
                        {(item as StandardCatalogItem).depth_mm ?? "--"} x{" "}
                        {(item as StandardCatalogItem).height_mm ?? "--"} mm
                      </>
                    ) : (
                      (item as ConfiguratorCatalogItem).sizing_type
                    )}
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${isActive ? "admin-badge--active" : "admin-badge--hidden"}`}
                    >
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="justify-end gap-1">
                      <button
                        type="button"
                        className="admin-icon-btn"
                        title="Edit"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        title={isActive ? "Hide" : "Show"}
                        disabled={readOnly || busy || !item.id}
                        onClick={() => void onToggleVisible(item)}
                      >
                        {busy ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Archive size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--danger"
                        title="Delete"
                        disabled={readOnly || busy || !item.id}
                        onClick={() => void onDelete(item)}
                      >
                        <Trash2 size={14} />
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
        <div className="border-t border-soft px-4 py-3 text-sm">
          <button
            type="button"
            className="btn-outline px-3 py-1"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {page} of {Math.ceil(total / 50)}
          </span>
          <button
            type="button"
            className="btn-outline px-3 py-1"
            disabled={page >= Math.ceil(total / 50)}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
