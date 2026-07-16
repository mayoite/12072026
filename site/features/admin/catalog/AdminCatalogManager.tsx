"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleNotch as Loader2, Plus, ArrowsClockwise as RefreshCw, MagnifyingGlass as Search } from "@phosphor-icons/react";

import { usePlannerCatalogStore } from "@/features/planner/catalog-api/catalogStore";
import { AdminField, AdminSelect, AdminTextInput } from "../ui/AdminFormFields";
import { AdminCatalogEditorDrawer } from "./AdminCatalogEditorDrawer";
import { AdminCatalogTable } from "./AdminCatalogTable";
import {
  createAdminCatalogItem,
  deleteAdminCatalogItem,
  fetchAdminCatalog,
  patchAdminCatalogItem,
  type ConfiguratorCatalogItem,
  type StandardCatalogItem,
} from "../api/adminCatalogClient";
import {
  type CatalogListProps,
  type CatalogManagerItem,
  type EditorMode,
  emptyConfiguratorDraft,
  emptyStandardDraft,
  configuratorDraftToPayload,
  configuratorFromItem,
  getConfiguratorJsonErrors,
  standardDraftToPayload,
  standardFromItem,
  validateConfiguratorDraft,
  validateStandardDraft,
} from "./adminCatalogManagerUtils";

export function AdminCatalogManager({
  title,
  description,
  catalogType,
}: CatalogListProps) {
  const isStandard = catalogType === "standard";
  const [items, setItems] = useState<CatalogManagerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibleFilter, setVisibleFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [editorMode, setEditorMode] = useState<EditorMode>(null);
  const [standardDraft, setStandardDraft] = useState(emptyStandardDraft);
  const [configuratorDraft, setConfiguratorDraft] = useState(emptyConfiguratorDraft);
  const [showAdvancedJson, setShowAdvancedJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const readOnly = isStandard && source === "local-catalog";
  const configuratorJsonErrors = useMemo(
    () => getConfiguratorJsonErrors(configuratorDraft),
    [configuratorDraft],
  );

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query: Record<string, string | number | undefined> = {
        page,
        limit: 50,
      };

      if (isStandard) {
        if (search.trim()) query.search = search.trim();
        if (categoryFilter) query.category = categoryFilter;
        if (visibleFilter) query.visible = visibleFilter;
      }

      const payload = await fetchAdminCatalog(catalogType, query);
      const rows = (payload.items ?? payload.catalog_items ?? []) as CatalogManagerItem[];

      setItems(rows);
      setTotal(payload.pagination?.total ?? payload.total ?? rows.length);
      setSource(payload.source ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [catalogType, categoryFilter, isStandard, page, search, visibleFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadItems]);

  const categories = useMemo(() => {
    const nextCategories = new Set<string>();
    for (const item of items) {
      if (item.category) nextCategories.add(item.category);
    }
    return [...nextCategories].sort();
  }, [items]);

  const filteredConfiguratorItems = useMemo(() => {
    if (isStandard) return items;

    let rows = items;

    if (categoryFilter) {
      rows = rows.filter((item) => item.category === categoryFilter);
    }

    if (visibleFilter === "true") {
      rows = rows.filter((item) => item.active !== false);
    }

    if (visibleFilter === "false") {
      rows = rows.filter((item) => item.active === false);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      rows = rows.filter((item) =>
        [item.name, item.category, "slug" in item ? item.slug : ""]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    return rows;
  }, [categoryFilter, isStandard, items, search, visibleFilter]);

  const filteredStandardFallbackItems = useMemo(() => {
    if (!readOnly) return items;

    let rows = items as StandardCatalogItem[];

    if (categoryFilter) {
      rows = rows.filter((item) => item.category === categoryFilter);
    }

    if (visibleFilter) {
      const visible = visibleFilter === "true";
      rows = rows.filter(
        (item) => (item.visible !== false && item.active !== false) === visible,
      );
    }

    const query = search.trim().toLowerCase();
    if (query) {
      rows = rows.filter((item) =>
        [item.id, item.name, item.category, item.subcategory, item.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    return rows;
  }, [categoryFilter, items, readOnly, search, visibleFilter]);

  const displayItems = isStandard ? filteredStandardFallbackItems : filteredConfiguratorItems;
  const hasActiveFilters = Boolean(search.trim() || categoryFilter || visibleFilter);
  const displayTotal = readOnly && hasActiveFilters ? displayItems.length : total;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setVisibleFilter("");
    setPage(1);
  };

  const openCreate = () => {
    if (readOnly) return;

    setEditorMode("create");
    setStandardDraft(emptyStandardDraft());
    setConfiguratorDraft(emptyConfiguratorDraft());
    setShowAdvancedJson(false);
    setError(null);
  };

  const openEdit = (item: CatalogManagerItem) => {
    setEditorMode("edit");

    if (isStandard) {
      setStandardDraft(standardFromItem(item as StandardCatalogItem));
    } else {
      setConfiguratorDraft(configuratorFromItem(item as ConfiguratorCatalogItem));
    }

    setShowAdvancedJson(false);
    setError(null);
  };

  const closeEditor = useCallback(() => {
    setEditorMode(null);
    setShowAdvancedJson(false);
    setSaving(false);
  }, []);

  const handleSave = async () => {
    if (readOnly) return;

    setSaving(true);
    setError(null);

    try {
      const validationError = isStandard
        ? validateStandardDraft(standardDraft)
        : validateConfiguratorDraft(configuratorDraft, configuratorJsonErrors);

      if (validationError) {
        if (!isStandard) setShowAdvancedJson(true);
        throw new Error(validationError);
      }

      const payload = isStandard
        ? standardDraftToPayload(standardDraft)
        : configuratorDraftToPayload(configuratorDraft);

      if (editorMode === "create") {
        await createAdminCatalogItem(catalogType, payload);
      } else {
        const id = isStandard ? standardDraft.id : configuratorDraft.id;
        if (!id) throw new Error("Missing item id");
        await patchAdminCatalogItem(catalogType, id, payload);
      }

      closeEditor();
      await loadItems();
      void usePlannerCatalogStore.getState().hydrateCatalog().catch((hydrateError: unknown) => {
        setError(hydrateError instanceof Error ? hydrateError.message : "Failed to refresh planner catalog");
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save item");
      setSaving(false);
    }
  };

  const handleToggleVisible = async (item: CatalogManagerItem) => {
    if (readOnly || !item.id) return;

    setPendingId(item.id);
    setError(null);

    try {
      const nextVisible = isStandard
        ? standardFromItem(item as StandardCatalogItem).visible === false
        : item.active === false;
      await patchAdminCatalogItem(
        catalogType,
        item.id,
        isStandard ? { visible: nextVisible } : { active: nextVisible },
      );
      await loadItems();
      void usePlannerCatalogStore.getState().hydrateCatalog().catch((hydrateError: unknown) => {
        setError(hydrateError instanceof Error ? hydrateError.message : "Failed to refresh planner catalog");
      });
    } catch (toggleError) {
      setError(
        toggleError instanceof Error ? toggleError.message : "Failed to update visibility",
      );
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (item: CatalogManagerItem) => {
    if (readOnly || !item.id) return;

    if (
      !window.confirm(
        `Delete "${item.name}"? This cannot be undone for standard catalog items.`,
      )
    ) {
      return;
    }

    setPendingId(item.id);
    setError(null);

    try {
      await deleteAdminCatalogItem(catalogType, item.id);
      if (editorMode === "edit") closeEditor();
      await loadItems();
      void usePlannerCatalogStore.getState().hydrateCatalog().catch((hydrateError: unknown) => {
        setError(hydrateError instanceof Error ? hydrateError.message : "Failed to refresh planner catalog");
      });
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete item");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="admin-page" data-testid="admin-catalog-page">
      <header className="admin-page__header" data-testid="admin-shell-header">
        <div>
          <p className="admin-page__eyebrow" data-testid="admin-shell-scope">
            Catalog admin
          </p>
          <h1 className="admin-page__title" data-testid="admin-shell-title">
            {title}
          </h1>
          <p className="admin-page__copy">{description}</p>
          <p className="admin-page__meta" data-testid="admin-shell-source">
            Source:{" "}
            {source ? (
              <code>{source}</code>
            ) : (
              <span>loading…</span>
            )}
            {readOnly
              ? " · read-only (local fallback — edits disabled until managed products are connected)"
              : " · editable"}
          </p>
          <p
            className="admin-page__meta"
            role="status"
            data-testid="admin-shell-state"
          >
            State:{" "}
            <strong>{displayTotal}</strong> shown
            {hasActiveFilters ? " (filtered)" : ""} ·{" "}
            {readOnly ? "read-only" : "editable"}
          </p>
        </div>
        <div className="admin-page__actions" data-testid="admin-shell-actions">
          <button
            type="button"
            className="admin-btn admin-btn--outline"
            onClick={() => void loadItems()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" aria-hidden />
            ) : (
              <RefreshCw size={14} aria-hidden />
            )}
            Refresh
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={openCreate}
            disabled={readOnly}
            data-testid="admin-shell-primary-action"
          >
            <Plus size={14} aria-hidden />
            Add item
          </button>
        </div>
      </header>

      {readOnly ? (
        <div className="admin-alert admin-alert--warn" role="status">
          Read-only local catalog. Writes are disabled until the managed product
          source is connected. You can still search and review rows.
        </div>
      ) : null}

      {error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="admin-toolbar">
        <AdminField label="Search" className="admin-field--search">
          <div className="min-w-[12.5rem]">
            <Search size={14} className="admin-field__search-icon" />
            <AdminTextInput
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="admin-field__input--search"
              placeholder="Name, category..."
            />
          </div>
        </AdminField>
        <AdminField label="Category">
          <AdminSelect
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            className="min-w-[8.75rem]"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Status">
          <AdminSelect
            value={visibleFilter}
            onChange={(event) => {
              setVisibleFilter(event.target.value as "" | "true" | "false");
              setPage(1);
            }}
            className="min-w-[7.5rem]"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Hidden</option>
          </AdminSelect>
        </AdminField>
      </div>

      {loading && items.length === 0 ? (
        <div className="admin-inline-row text-sm text-muted" role="status" aria-live="polite">
          <Loader2 size={16} className="animate-spin" aria-hidden />
          Loading catalog...
        </div>
      ) : error && items.length === 0 ? null
      : items.length === 0 ? (
        <div className="admin-empty" role="status">
          <p>The catalog source returned no items.</p>
          <p className="admin-page__meta mt-2">
            Data source: <code>{source ?? "unreported"}</code>. Refresh to check again.
          </p>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="admin-empty" role="status">
          <p>No items match the current filters.</p>
          {hasActiveFilters ? (
            <button
              type="button"
              className="admin-btn admin-btn--outline mt-3"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <AdminCatalogTable
          items={displayItems}
          isStandard={isStandard}
          total={displayTotal}
          page={page}
          pendingId={pendingId}
          readOnly={readOnly}
          onEdit={openEdit}
          onToggleVisible={handleToggleVisible}
          onDelete={handleDelete}
          onPageChange={setPage}
        />
      )}

      <AdminCatalogEditorDrawer
        editorMode={editorMode}
        isStandard={isStandard}
        readOnly={readOnly}
        saving={saving}
        standardDraft={standardDraft}
        configuratorDraft={configuratorDraft}
        configuratorJsonErrors={configuratorJsonErrors}
        showAdvancedJson={showAdvancedJson}
        onToggleAdvancedJson={() => setShowAdvancedJson((current) => !current)}
        onClose={closeEditor}
        onSave={handleSave}
        onStandardDraftChange={setStandardDraft}
        onConfiguratorDraftChange={setConfiguratorDraft}
      />
    </div>
  );
}
