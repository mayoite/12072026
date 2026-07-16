"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  memo,
} from "react";
import Image from "next/image";
import {
  SearchField,
  Input,
  Label,
} from "react-aria-components";
import type {
  InventoryPanelState,
  InventoryCommand,
  InventoryCollectionsState,
} from "@/features/planner/project/catalog/inventory/inventoryState";
import {
  defaultInventoryPanelState,
  reduceInventoryCommand,
  defaultCollectionsState,
  addInventoryRecent,
  addInventoryFavorite,
  removeInventoryFavorite,
  isInventoryFavorite,
} from "@/features/planner/project/catalog/inventory/inventoryState";
import {
  inventoryCategoriesForProduct,
  inventoryRoomGroupsForProduct,
} from "@/features/planner/project/catalog/inventory/inventoryTaxonomy";
import { InventoryIcon } from "./inventoryIcons";
import {
  PLANNER_CATALOG_RESULT_CAP,
  capCatalogResults,
  rankCatalogItems,
} from "@/features/planner/project/catalog/catalogSearch";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import {
  filterBuyerFacingCatalogItems,
  formatCatalogFootprint,
  prioritizeOfficeSystemsBrowse,
} from "@/features/planner/project/catalog/catalogBuyerVisibility";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";
import type { WorkstationConfigV0 } from "@/features/planner/project/catalog/workstationSystemV0";
import { PLANNER_DEMO_CATALOG_ITEMS } from "./demoCatalogItems";
import { isSvgAssetUrl } from "@/features/planner/project/catalog/svg/svgPreviewAssets";
import { usePlannerSvgCatalog } from "@/features/planner/project/catalog/usePlannerWorkspaceCatalog";
import { WorkstationConfiguratorPanel } from "./WorkstationConfiguratorPanel";
import styles from "./inventory.module.css";

// Wiring for PLAN-FAIL-0405/0419: inventory consumer calls svgBlockDescriptorLoader via catalogClient (catalogue-first primary descriptors, resolver blocks, search parity facets).
// Phase 06: usePlannerSvgCatalog in panel when catalogItems prop is omitted; workspace may still pass live items.
// Cites: BP-06, design §9/10 (Features: catalogue-first + Sketchfab cursor/facet parity), GS, phase-06. Fuse for local rank, RAC owns a11y.

export interface InventoryPanelProps {
  /** Initial panel state */
  initialState?: InventoryPanelState;
  /** Callback when an item is selected */
  onItemSelect?: (item: PlannerCatalogItem, variantId: string | null) => void;
  /** Callback when an item is placed */
  onItemPlace?: (
    itemId: string,
    variantId: string | null,
    position: { x: number; y: number },
  ) => void;
  /** Systems v0 configurator — arm place with free size/shape/modules combo */
  onWorkstationConfigPlace?: (config: WorkstationConfigV0) => void;
  /** Systems v0 — immediate batch place (2/4/10) via placeWorkstationInstancesOnProject */
  onWorkstationConfigBatchPlace?: (
    config: WorkstationConfigV0,
    count: number,
  ) => void;
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Live catalog items from the workspace API */
  catalogItems?: PlannerCatalogItem[];
  /** Whether the panel is loading */
  isLoading?: boolean;
  /** Catalog lifecycle status (RQ owns remote; Fuse local rank; RAC a11y) */
  catalogStatus?:
    | "loading"
    | "ready"
    | "fallback"
    | "stale"
    | "offline"
    | "error";
  /**
   * Guest / systems planner defaults to office room chips only.
   * Member full catalog may pass false for residential room filters.
   */
  officeSystemsInventory?: boolean;
  /** Workspace display unit for footprint labels (document stays mm). */
  displayUnit?: PlannerDisplayUnit;
}

export const InventoryPanel = memo(function InventoryPanel({
  initialState,
  onItemSelect,
  onItemPlace,
  onWorkstationConfigPlace,
  onWorkstationConfigBatchPlace,
  onSearch,
  catalogItems,
  isLoading = false,
  catalogStatus = "ready",
  officeSystemsInventory = true,
  displayUnit = "cm",
}: InventoryPanelProps) {
  const id = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasExternalCatalog = catalogItems !== undefined;
  const productMode = officeSystemsInventory ? "office-systems" : "full";
  const roomGroups = useMemo(
    () => inventoryRoomGroupsForProduct(productMode),
    [productMode],
  );
  const categories = useMemo(
    () => inventoryCategoriesForProduct(productMode),
    [productMode],
  );
  const svgCatalog = usePlannerSvgCatalog();
  const [state, setState] = useState<InventoryPanelState>(
    initialState ?? defaultInventoryPanelState(),
  );
  const [collections, setCollections] = useState<InventoryCollectionsState>(
    defaultCollectionsState(),
  );
  /* Collapsed by default so fixed chrome stays short and .itemGrid keeps height.
     Expand on click (category still filters when selected). */
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const indexedItems = useMemo(() => {
    const raw: PlannerCatalogItem[] = (() => {
      if (hasExternalCatalog) {
        const external = catalogItems ?? [];
        return external.length > 0 ? external : PLANNER_DEMO_CATALOG_ITEMS;
      }
      return svgCatalog.items.length > 0
        ? svgCatalog.items
        : PLANNER_DEMO_CATALOG_ITEMS;
    })();
    // P-UI-1: never show proof / missing-geom fallback SKUs in buyer inventory.
    return filterBuyerFacingCatalogItems(raw);
  }, [hasExternalCatalog, catalogItems, svgCatalog.items]);

  const effectiveStatus = hasExternalCatalog ? catalogStatus : svgCatalog.status;
  const effectiveLoading = hasExternalCatalog
    ? isLoading
    : svgCatalog.isLoading && svgCatalog.items.length === 0;

  // Catalogue loading: React Query (in hook) owns remote; here local Fuse ranking (after server filter) + RAC for search/collection.

  useEffect(() => {
    onSearch?.(state.searchQuery);
  }, [state.searchQuery, onSearch]);

  // Dispatch command to update state
  const dispatch = useCallback((command: InventoryCommand) => {
    setState((current) => reduceInventoryCommand(current, command));
  }, []);

  // Handle search input change
  const handleSearchValueChange = useCallback(
    (query: string) => {
      setFocusedIndex(-1);
      dispatch({ type: "SET_SEARCH_QUERY", query });
    },
    [dispatch],
  );

  const handleClearSearch = useCallback(() => {
    setFocusedIndex(-1);
    dispatch({ type: "CLEAR_SEARCH" });
    searchInputRef.current?.focus();
  }, [dispatch]);

  // Handle category selection
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      if (state.selectedCategoryId === categoryId) {
        dispatch({ type: "SELECT_CATEGORY", categoryId: null });
      } else {
        dispatch({ type: "SELECT_CATEGORY", categoryId });
      }
      setExpandedCategories((current) => {
        const next = new Set(current);
        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
        }
        return next;
      });
    },
    [state.selectedCategoryId, dispatch],
  );

  // Handle subcategory selection
  const handleSubCategoryClick = useCallback(
    (subCategoryId: string) => {
      dispatch({
        type: "SELECT_SUBCATEGORY",
        subCategoryId:
          subCategoryId === state.selectedSubCategoryId ? null : subCategoryId,
      });
    },
    [state.selectedSubCategoryId, dispatch],
  );

  // Handle room filter selection
  const handleRoomFilterClick = useCallback(
    (roomGroupId: string) => {
      dispatch({
        type: "SELECT_ROOM",
        roomGroupId:
          roomGroupId === state.selectedRoomGroupId ? null : roomGroupId,
      });
    },
    [state.selectedRoomGroupId, dispatch],
  );

  // Handle item click
  const handleItemClick = useCallback(
    (item: PlannerCatalogItem) => {
      setSelectedItemId(item.id);
      onItemSelect?.(item, null);

      // Add to recent items
      setCollections((current) =>
        addInventoryRecent(current, item.id, new Date().toISOString()),
      );
    },
    [onItemSelect],
  );

  // Handle item double-click (place)
  const handleItemDoubleClick = useCallback(
    (item: PlannerCatalogItem, event: MouseEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      onItemPlace?.(item.id, null, position);

      // Add to recent items
      setCollections((current) =>
        addInventoryRecent(current, item.id, new Date().toISOString()),
      );
    },
    [onItemPlace],
  );

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(
    (itemId: string) => {
      if (isInventoryFavorite(collections, itemId)) {
        setCollections((current) => removeInventoryFavorite(current, itemId));
      } else {
        setCollections((current) => addInventoryFavorite(current, itemId));
      }
    },
    [collections],
  );

  // Toggle recent items visibility
  const handleToggleRecent = useCallback(() => {
    dispatch({ type: "TOGGLE_RECENT_VISIBLE" });
  }, [dispatch]);

  // Toggle favorites visibility
  const handleToggleFavorites = useCallback(() => {
    dispatch({ type: "TOGGLE_FAVORITES_VISIBLE" });
  }, [dispatch]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, [dispatch]);

  // Fuse + displayed computed early for keyboard closure order (TS block scope)
  // GS: Fuse local rank, RAC a11y.
  const searchResultsItems = useMemo(() => {
    let base = indexedItems;
    if (state.selectedCategoryId) {
      const category = categories.find(
        (c) => c.id === state.selectedCategoryId,
      );
      if (category?.catalogCategory) {
        base = base.filter((it) => it.category === category.catalogCategory);
      }
    }
    const roomGroup = roomGroups.find(
      (r) => r.id === state.selectedRoomGroupId,
    );
    if (roomGroup && roomGroup.roomTags.length > 0) {
      const tags = roomGroup.roomTags as string[];
      base = base.filter((it) => it.roomTags?.some((t) => tags.includes(t)));
    }
    const ranked = rankCatalogItems(base, state.searchQuery || "");
    const ordered =
      officeSystemsInventory && !(state.searchQuery || "").trim()
        ? prioritizeOfficeSystemsBrowse(ranked)
        : ranked;
    return capCatalogResults(ordered, PLANNER_CATALOG_RESULT_CAP);
  }, [
    indexedItems,
    categories,
    roomGroups,
    officeSystemsInventory,
    state.searchQuery,
    state.selectedCategoryId,
    state.selectedRoomGroupId,
  ]);

  const displayedItems = useMemo(() => {
    let items = searchResultsItems;
    if (state.selectedSubCategoryId) {
      const category = categories.find(
        (c) => c.id === state.selectedCategoryId,
      );
      const subCategory = category?.subCategories.find(
        (s) => s.id === state.selectedSubCategoryId,
      );
      if (subCategory) {
        items = items.filter((item) =>
          subCategory.filterTags.some((tag) =>
            item.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
          ),
        );
      }
    }
    return capCatalogResults(items, PLANNER_CATALOG_RESULT_CAP);
  }, [
    categories,
    searchResultsItems,
    state.selectedCategoryId,
    state.selectedSubCategoryId,
  ]);

  // Keyboard navigation (panel owns list roving when focus is on the region, not chrome controls)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target;
      const isEditable =
        target instanceof HTMLElement
        && (target.tagName === "INPUT"
          || target.tagName === "TEXTAREA"
          || target.tagName === "SELECT"
          || target.isContentEditable);

      // Escape clears search even from the search field (common pattern).
      if (event.key === "Escape") {
        event.preventDefault();
        if (state.searchQuery) {
          handleClearSearch();
        } else {
          setSelectedItemId(null);
        }
        return;
      }

      // Do not steal Arrow/Enter/Home/End from search, Place, favorite, or filters.
      if (isEditable) return;
      if (
        target instanceof HTMLElement
        && target !== event.currentTarget
        && target.closest("button, a[href], input, textarea, select, [role='button']")
      ) {
        return;
      }

      const items = displayedItems; // post filter/rank

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((current) => Math.min(current + 1, items.length - 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((current) => Math.max(current - 1, 0));
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            handleItemClick(items[focusedIndex]);
          }
          break;
        case "Home":
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          event.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
      }
    },
    [
      displayedItems,
      focusedIndex,
      handleItemClick,
      handleClearSearch,
      state.searchQuery,
    ],
  );

  // Get recent items from collections
  const recentItems = useMemo(() => {
    return collections.recent
      .slice(0, 6)
      .map((entry) => indexedItems.find((item) => item.id === entry.itemId))
      .filter((item): item is PlannerCatalogItem => item !== undefined);
  }, [collections.recent, indexedItems]);

  // Get favorite items
  const favoriteItems = useMemo(() => {
    return collections.favorites
      .map((id) => indexedItems.find((item) => item.id === id))
      .filter((item): item is PlannerCatalogItem => item !== undefined);
  }, [collections.favorites, indexedItems]);

  // Has active filters
  const hasActiveFilters =
    state.selectedCategoryId !== null ||
    state.selectedRoomGroupId !== null ||
    state.searchQuery !== "";

  return (
    <div
      className={styles.panel}
      role="region"
      aria-label="Inventory panel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      id={`inventory-panel-${id.replace(/:/g, "")}`}
    >
      {/* Search - React Aria SearchField owns accessible search behavior */}
      <div className={styles.searchSection}>
        <SearchField
          value={state.searchQuery}
          onChange={handleSearchValueChange}
          className={styles.searchWrapper}
        >
          <Label className="sr-only">Search inventory by name or SKU</Label>
          <SearchIcon className={styles.searchIcon} aria-hidden />
          <Input
            ref={searchInputRef}
            type="search"
            className={styles.searchInput}
            placeholder="Search by name or SKU"
            aria-describedby={`inventory-search-hint-${id.replace(/:/g, "")}`}
          />
          {state.searchQuery && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </SearchField>
        <p
          id={`inventory-search-hint-${id.replace(/:/g, "")}`}
          className={styles.searchHint}
        >
          Filter furniture to place on the plan
        </p>
      </div>

      {onWorkstationConfigPlace ? (
        <WorkstationConfiguratorPanel
          onPlaceConfig={onWorkstationConfigPlace}
          onPlaceBatchConfig={onWorkstationConfigBatchPlace}
          defaultOpen={false}
        />
      ) : null}

      {/* Quick filters - Room groups (office-systems: All + Office only) */}
      <div className={styles.quickFilters}>
        {roomGroups.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`${styles.filterChip} ${state.selectedRoomGroupId === room.id ? styles.filterChipActive : ""}`}
            onClick={() => handleRoomFilterClick(room.id)}
            aria-pressed={
              state.selectedRoomGroupId === room.id ? "true" : "false"
            }
          >
            <span className={styles.filterChipIcon}>
              <InventoryIcon name={room.icon} />
            </span>
            <span className={styles.filterChipLabel}>{room.label}</span>
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Categories</span>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilters}
              aria-label="Reset inventory filters"
            >
              Reset
            </button>
          )}
        </div>

        <nav className={styles.categoryList} aria-label="Inventory categories">
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <button
                type="button"
                className={`${styles.categoryButton} ${state.selectedCategoryId === category.id ? styles.categoryButtonActive : ""}`}
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={
                  expandedCategories.has(category.id) ? "true" : "false"
                }
                aria-pressed={
                  state.selectedCategoryId === category.id ? "true" : "false"
                }
              >
                <span className={styles.categoryIcon}>
                  <InventoryIcon name={category.icon} />
                </span>
                <span className={styles.categoryLabel}>{category.label}</span>
                {category.subCategories.length > 0 && (
                  <span
                    className={`${styles.categoryChevron} ${expandedCategories.has(category.id) ? styles.categoryChevronOpen : ""}`}
                  >
                    <ChevronIcon />
                  </span>
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category.id) &&
                category.subCategories.length > 0 && (
                  <div className={styles.subCategoryList}>
                    {category.subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        className={`${styles.subCategoryButton} ${state.selectedSubCategoryId === sub.id ? styles.subCategoryButtonActive : ""}`}
                        onClick={() => handleSubCategoryClick(sub.id)}
                        aria-pressed={
                          state.selectedSubCategoryId === sub.id
                            ? "true"
                            : "false"
                        }
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* Recent items toggle */}
      {recentItems.length > 0 && (
        <div className={styles.sectionHeader}>
          <button
            type="button"
            className={styles.sectionToggle}
            onClick={handleToggleRecent}
            aria-expanded={state.recentVisible ? "true" : "false"}
          >
            <span className={styles.sectionTitle}>Recent</span>
            <span
              className={`${styles.chevron} ${state.recentVisible ? styles.chevronOpen : ""}`}
            >
              <ChevronIcon />
            </span>
          </button>
        </div>
      )}

      {/* Favorites toggle */}
      {favoriteItems.length > 0 && (
        <div className={styles.sectionHeader}>
          <button
            type="button"
            className={styles.sectionToggle}
            onClick={handleToggleFavorites}
            aria-expanded={state.favoritesVisible ? "true" : "false"}
          >
            <span className={styles.sectionTitle}>Favorites</span>
            <span
              className={`${styles.chevron} ${state.favoritesVisible ? styles.chevronOpen : ""}`}
            >
              <ChevronIcon />
            </span>
          </button>
        </div>
      )}

      {/* Results count + non-blocking catalog lifecycle hint */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {displayedItems.length} item{displayedItems.length !== 1 ? "s" : ""}
        </span>
        {effectiveStatus === "stale" ? (
          <span className={styles.resultsStatus} aria-live="polite">
            Refreshing…
          </span>
        ) : effectiveStatus === "offline" ? (
          <span className={styles.resultsStatus}>Offline</span>
        ) : effectiveStatus === "fallback" ? (
          <span className={styles.resultsStatus}>Offline catalog</span>
        ) : null}
      </div>

      {/* Loading/empty/grid — lifecycle badges above stay visible; never replace results (E2E + REC-04). */}
      {(effectiveLoading || effectiveStatus === "loading") &&
      displayedItems.length === 0 &&
      indexedItems.length === 0 ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <span>Loading inventory...</span>
        </div>
      ) : effectiveStatus === "error" && displayedItems.length === 0 ? (
        <section className={styles.emptyState} aria-label="Catalog browser" data-state="error">
          <div className={styles.emptyIcon} aria-hidden>
            <EmptyIcon />
          </div>
          <p className={styles.emptyText}>Could not load inventory</p>
          <p className={styles.emptyHint}>Check your connection, then try again.</p>
          <button
            type="button"
            className={styles.emptyAction}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </section>
      ) : displayedItems.length === 0 ? (
        <section className={styles.emptyState} aria-label="Catalog browser">
          <div className={styles.emptyIcon} aria-hidden>
            <EmptyIcon />
          </div>
          <p className={styles.emptyText}>
            {state.searchQuery
              ? "No products match this search"
              : hasActiveFilters
                ? "No products in this filter"
                : "No products available"}
          </p>
          <p className={styles.emptyHint}>
            {state.searchQuery
              ? "Try another name or SKU, or clear the search."
              : hasActiveFilters
                ? "Reset filters to see the full inventory."
                : "Inventory will appear here when the catalog is ready."}
          </p>
          {state.searchQuery ? (
            <button
              type="button"
              className={styles.emptyAction}
              onClick={handleClearSearch}
            >
              Clear search
            </button>
          ) : hasActiveFilters ? (
            <button
              type="button"
              className={styles.emptyAction}
              onClick={handleResetFilters}
            >
              Reset filters
            </button>
          ) : null}
        </section>
      ) : (
        <section className={styles.catalogBrowser} aria-label="Catalog browser">
          <ul className={styles.itemGrid}>
            {displayedItems.map((item, index) => (
              <li
                key={item.id}
                className={styles.itemListEntry}
                data-catalog-item={item.id}
              >
                <article
                  className={`pw-catalog-card ${styles.itemCard} ${selectedItemId === item.id ? styles.itemCardSelected : ""} ${focusedIndex === index ? styles.itemCardFocused : ""}`}
                  // Roving tab stop for panel arrow keys + focus-visible ring.
                  // No role=button — Place / favorite stay nested interactive controls.
                  tabIndex={focusedIndex === index ? 0 : -1}
                  data-selected={selectedItemId === item.id ? "true" : "false"}
                  data-catalog-name={item.shortName}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={(event) => handleItemDoubleClick(item, event)}
                  onFocus={() => setFocusedIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      // Ignore when Place / favorite owns the event
                      if (
                        event.target instanceof HTMLElement
                        && event.target.closest("button")
                      ) {
                        return;
                      }
                      event.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                >
              <div className={styles.itemThumbnail} aria-hidden="true">
                {item.assets.previewImageUrl ? (
                  <Image
                    src={item.assets.previewImageUrl}
                    alt=""
                    className={`${styles.itemImage}${ isSvgAssetUrl(item.assets.previewImageUrl) ? ` ${styles.itemImageVector}` : "" }`}
                    width={256}
                    height={256}
                    loading="lazy"
                    unoptimized
                    onError={(event) => {
                      // Residual 404 thumbs: hide broken image, show icon fallback.
                      const img = event.currentTarget;
                      img.style.display = "none";
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector("[data-thumb-fallback]")) {
                        const fallback = document.createElement("div");
                        fallback.className = styles.itemPlaceholder;
                        fallback.dataset.thumbFallback = "1";
                        fallback.setAttribute("aria-hidden", "true");
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className={styles.itemPlaceholder}>
                    <PlaceholderIcon />
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName} title={item.name || item.shortName}>
                  {item.shortName || item.name}
                </span>
                <span className={styles.itemMeta}>
                  {item.sku ? (
                    <span className={styles.itemSku} title={`SKU ${item.sku}`}>
                      {item.sku}
                    </span>
                  ) : null}
                  <span className={styles.itemDimensions}>
                    {formatCatalogFootprint(
                      item.dimensions.widthMm,
                      item.dimensions.depthMm,
                      displayUnit,
                    )}
                  </span>
                  {item.category ? (
                    <span className={styles.itemCategory}>{item.category}</span>
                  ) : null}
                </span>
                {item.availability && item.availability !== "in-stock" ? (
                  <span
                    className={styles.itemAvailability}
                    data-availability={item.availability}
                  >
                    {item.availability === "out-of-stock"
                      ? "Unavailable"
                      : item.availability === "discontinued"
                        ? "Discontinued"
                        : item.availability === "preorder"
                          ? "Pre-order"
                          : item.availability === "backorder"
                            ? "Backorder"
                            : item.availability}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                className={styles.placeAction}
                // WCAG 2.5.3: accessible name must contain visible "Place".
                // Keep "Add … to canvas" substring so existing e2e locators still match.
                aria-label={`Place — Add ${item.shortName} to canvas`}
                title={`Arm place: click the plan to drop ${item.shortName}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onItemPlace?.(item.id, null, { x: 0, y: 0 });
                  setCollections((current) =>
                    addInventoryRecent(current, item.id, new Date().toISOString()),
                  );
                }}
              >
                Place
              </button>
              <button
                type="button"
                className={`${styles.favoriteButton} ${isInventoryFavorite(collections, item.id) ? styles.favoriteButtonActive : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleFavoriteToggle(item.id);
                }}
                aria-label={
                  isInventoryFavorite(collections, item.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                aria-pressed={
                  isInventoryFavorite(collections, item.id) ? "true" : "false"
                }
              >
                <FavoriteIcon
                  filled={isInventoryFavorite(collections, item.id)}
                />
              </button>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

// Icons
function SearchIcon({ className, "aria-hidden": ariaHidden }: { className?: string; "aria-hidden"?: boolean | "true" | "false" }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden ?? true}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 21-10.5 10.5M21 21-10.5-10.5M21 21-18-18M3 3l18 18M3 21l18-18" />
    </svg>
  );
}

function PlaceholderIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function FavoriteIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** @deprecated Use workspace catalog resolver — kept for tests and offline demos. */
export { getDemoCatalogItemById } from "./demoCatalogItems";
