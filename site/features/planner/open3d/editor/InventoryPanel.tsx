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
} from "react";
import type {
  InventoryPanelState,
  InventoryCommand,
  InventoryCollectionsState,
} from "../catalog/inventory/inventoryState";
import {
  defaultInventoryPanelState,
  reduceInventoryCommand,
  defaultCollectionsState,
  addInventoryRecent,
  addInventoryFavorite,
  removeInventoryFavorite,
  isInventoryFavorite,
} from "../catalog/inventory/inventoryState";
import { INVENTORY_CATEGORIES, INVENTORY_ROOM_GROUPS } from "../catalog/inventory/inventoryTaxonomy";
import { InventorySearchIndex, type InventorySearchOptions, type InventorySearchResult } from "../catalog/inventory/inventoryIndex";
import type { Open3dCatalogItem } from "../catalog/catalogTypes";
import { OPEN3D_DEMO_CATALOG_ITEMS } from "./demoCatalogItems";
import { Open3dCatalogClient } from "../catalog/catalogClient";
import styles from "./inventory.module.css";

// Create singleton search index instance
const searchIndex = new InventorySearchIndex();

// Wiring for PLAN-FAIL-0405/0419: inventory consumer calls svgBlockDescriptorLoader via catalogClient (catalogue-first primary descriptors, resolver blocks, search parity facets).
// Cites: BP-06, design §9/10 (Features: catalogue-first + Sketchfab cursor/facet parity), GS, phase-06.
const inventoryClientRef: { current: Open3dCatalogClient | null } = { current: null };

export interface InventoryPanelProps {
  /** Initial panel state */
  initialState?: InventoryPanelState;
  /** Callback when an item is selected */
  onItemSelect?: (item: Open3dCatalogItem, variantId: string | null) => void;
  /** Callback when an item is placed */
  onItemPlace?: (itemId: string, variantId: string | null, position: { x: number; y: number }) => void;
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Live catalog items from the workspace API */
  catalogItems?: Open3dCatalogItem[];
  /** Whether the panel is loading */
  isLoading?: boolean;
}

export function InventoryPanel({
  initialState,
  onItemSelect,
  onItemPlace,
  onSearch,
  catalogItems,
  isLoading = false,
}: InventoryPanelProps) {
  const id = useId();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<InventoryPanelState>(initialState ?? defaultInventoryPanelState());
  const [collections, setCollections] = useState<InventoryCollectionsState>(defaultCollectionsState());
  const [searchResults, setSearchResults] = useState<InventorySearchResult>({
    items: [],
    totalCount: 0,
    query: "",
    relaxed: false,
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["furniture"]));
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const indexedItems = useMemo(
    () => (catalogItems && catalogItems.length > 0 ? catalogItems : OPEN3D_DEMO_CATALOG_ITEMS),
    [catalogItems],
  );

  // Load catalog items into search index when the source changes
  // Fixed inventory wiring (PLAN-FAIL-0405/0419): await loader, prefer loaderItems (catalogue-first primary) for searchIndex; resolver/blocks via client.
  useEffect(() => {
    if (!inventoryClientRef.current) inventoryClientRef.current = new Open3dCatalogClient();
    void inventoryClientRef.current.loadDescriptorsFromLoader().then(() => {
      const loaderItems = inventoryClientRef.current!.getAll();
      const sourceItems = loaderItems.length > 0 ? loaderItems : (catalogItems && catalogItems.length > 0 ? catalogItems : OPEN3D_DEMO_CATALOG_ITEMS);
      searchIndex.load(sourceItems);
    });
  }, [catalogItems]);

  // Handle search when query changes
  useEffect(() => {
    const options: InventorySearchOptions = {
      pageSize: 50,
      typoTolerance: true,
    };

    // Add category filter if selected
    if (state.selectedCategoryId) {
      const category = INVENTORY_CATEGORIES.find((c) => c.id === state.selectedCategoryId);
      if (category) {
        options.category = category.catalogCategory;
      }
    }

    // Add room filter if selected
    const roomGroup = INVENTORY_ROOM_GROUPS.find((r) => r.id === state.selectedRoomGroupId);
    if (roomGroup && roomGroup.roomTags.length > 0) {
      options.roomTags = roomGroup.roomTags as Open3dCatalogItem["roomTags"];
    }

    const results = searchIndex.search(state.searchQuery, options);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- update search results derived from state change inside effect; reason: searchIndex is non-reactive dep; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: memoize search or move to useMemo when inventory search stabilized
    setSearchResults(results);
    setFocusedIndex(-1);
    onSearch?.(state.searchQuery);
  }, [state.searchQuery, state.selectedCategoryId, state.selectedRoomGroupId, onSearch]);

  // Dispatch command to update state
  const dispatch = useCallback((command: InventoryCommand) => {
    setState((current) => reduceInventoryCommand(current, command));
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_SEARCH_QUERY", query: event.target.value });
    },
    [dispatch],
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
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
      dispatch({ type: "SELECT_SUBCATEGORY", subCategoryId: subCategoryId === state.selectedSubCategoryId ? null : subCategoryId });
    },
    [state.selectedSubCategoryId, dispatch],
  );

  // Handle room filter selection
  const handleRoomFilterClick = useCallback(
    (roomGroupId: string) => {
      dispatch({ type: "SELECT_ROOM", roomGroupId: roomGroupId === state.selectedRoomGroupId ? null : roomGroupId });
    },
    [state.selectedRoomGroupId, dispatch],
  );

  // Handle item click
  const handleItemClick = useCallback(
    (item: Open3dCatalogItem) => {
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
    (item: Open3dCatalogItem, event: MouseEvent) => {
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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const items = searchResults.items;

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
        case "Escape":
          event.preventDefault();
          if (state.searchQuery) {
            handleClearSearch();
          } else {
            setSelectedItemId(null);
          }
          break;
      }
    },
    [searchResults.items, focusedIndex, handleItemClick, handleClearSearch, state.searchQuery],
  );

  // Filter items for display
  const displayedItems = useMemo(() => {
    let items = searchResults.items;

    // Apply subcategory filter
    if (state.selectedSubCategoryId) {
      const category = INVENTORY_CATEGORIES.find((c) => c.id === state.selectedCategoryId);
      const subCategory = category?.subCategories.find((s) => s.id === state.selectedSubCategoryId);
      if (subCategory) {
        items = items.filter((item) =>
          subCategory.filterTags.some((tag) =>
            item.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
          ),
        );
      }
    }

    return items;
  }, [searchResults.items, state.selectedCategoryId, state.selectedSubCategoryId]);

  // Get recent items from collections
  const recentItems = useMemo(() => {
    return collections.recent
      .slice(0, 6)
      .map((entry) => indexedItems.find((item) => item.id === entry.itemId))
      .filter((item): item is Open3dCatalogItem => item !== undefined);
  }, [collections.recent, indexedItems]);

  // Get favorite items
  const favoriteItems = useMemo(() => {
    return collections.favorites
      .map((id) => indexedItems.find((item) => item.id === id))
      .filter((item): item is Open3dCatalogItem => item !== undefined);
  }, [collections.favorites, indexedItems]);

  // Has active filters
  const hasActiveFilters = state.selectedCategoryId !== null || state.selectedRoomGroupId !== null || state.searchQuery !== "";

  return (
    <div
      className={styles.panel}
      role="region"
      aria-label="Inventory panel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      id={`inventory-panel-${id.replace(/:/g, "")}`}
    >
      {/* Search */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="search"
            className={styles.searchInput}
            placeholder="Search furniture..."
            value={state.searchQuery}
            onChange={handleSearchChange}
            aria-label="Search inventory"
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
        </div>
      </div>

      {/* Quick filters - Room groups */}
      <div className={styles.quickFilters}>
        {INVENTORY_ROOM_GROUPS.slice(0, 5).map((room) => (
          <button
            key={room.id}
            type="button"
            className={`${styles.filterChip} ${state.selectedRoomGroupId === room.id ? styles.filterChipActive : ""}`}
            onClick={() => handleRoomFilterClick(room.id)}
            aria-pressed={state.selectedRoomGroupId === room.id ? "true" : "false"}
          >
            <span className={styles.filterChipIcon}>{room.icon}</span>
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
            >
              Reset
            </button>
          )}
        </div>

        <nav className={styles.categoryList} aria-label="Inventory categories">
          {INVENTORY_CATEGORIES.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <button
                type="button"
                className={`${styles.categoryButton} ${state.selectedCategoryId === category.id ? styles.categoryButtonActive : ""}`}
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={expandedCategories.has(category.id) ? "true" : "false"}
                aria-pressed={state.selectedCategoryId === category.id ? "true" : "false"}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
                {category.subCategories.length > 0 && (
                  <span className={`${styles.categoryChevron} ${expandedCategories.has(category.id) ? styles.categoryChevronOpen : ""}`}>
                    <ChevronIcon />
                  </span>
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category.id) && category.subCategories.length > 0 && (
                <div className={styles.subCategoryList}>
                  {category.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${styles.subCategoryButton} ${state.selectedSubCategoryId === sub.id ? styles.subCategoryButtonActive : ""}`}
                      onClick={() => handleSubCategoryClick(sub.id)}
                      aria-pressed={state.selectedSubCategoryId === sub.id ? "true" : "false"}
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
            <span className={`${styles.chevron} ${state.recentVisible ? styles.chevronOpen : ""}`}>
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
            <span className={`${styles.chevron} ${state.favoritesVisible ? styles.chevronOpen : ""}`}>
              <ChevronIcon />
            </span>
          </button>
        </div>
      )}

      {/* Results count */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {displayedItems.length} item{displayedItems.length !== 1 ? "s" : ""}
        </span>
        {searchResults.relaxed && (
          <span className={styles.relaxedBadge}>Expanded</span>
        )}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <span>Loading inventory...</span>
        </div>
      ) : displayedItems.length === 0 ? (
        /* Empty state */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <EmptyIcon />
          </div>
          <p className={styles.emptyText}>No items found</p>
          {state.searchQuery && (
            <button
              type="button"
              className={styles.emptyAction}
              onClick={handleClearSearch}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        /* Item grid */
        <div
          className={styles.itemGrid}
          role="listbox"
          aria-label="Inventory items"
          aria-activedescendant={focusedIndex >= 0 ? `item-${searchResults.items[focusedIndex]?.id}` : undefined}
        >
          {displayedItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              id={`item-${item.id}`}
              role="option"
              className={`${styles.itemCard} ${selectedItemId === item.id ? styles.itemCardSelected : ""} ${focusedIndex === index ? styles.itemCardFocused : ""}`}
              onClick={() => handleItemClick(item)}
              onDoubleClick={(e) => handleItemDoubleClick(item, e)}
              aria-selected={selectedItemId === item.id ? "true" : "false"}
              aria-label={`${item.name}, ${item.dimensions.widthMm / 1000}m x ${item.dimensions.depthMm / 1000}m`}
            >
              <div className={styles.itemThumbnail}>
                {item.assets.previewImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- native img for R2 preview thumbnails in virtual list (external urls, lazy, no known intrinsic size at render); reason: avoids next/image layout constraints + domain config for dynamic catalog assets; owner: Resolve Failures Agent (PLAN-FAIL-0411); removal: switch to next/image + sizes or remotePatterns when asset ui standardized
              <img
                    src={item.assets.previewImageUrl}
                    alt=""
                    className={styles.itemImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.itemPlaceholder}>
                    <PlaceholderIcon />
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.shortName}</span>
                <span className={styles.itemDimensions}>
                  {(item.dimensions.widthMm / 1000).toFixed(1)}m × {(item.dimensions.depthMm / 1000).toFixed(1)}m
                </span>
              </div>
              <span
                role="button"
                tabIndex={0}
                className={`${styles.favoriteButton} ${isInventoryFavorite(collections, item.id) ? styles.favoriteButtonActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(item.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavoriteToggle(item.id);
                  }
                }}
                aria-label={isInventoryFavorite(collections, item.id) ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isInventoryFavorite(collections, item.id) ? "true" : "false"}
              >
                <FavoriteIcon filled={isInventoryFavorite(collections, item.id)} />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21-10.5 10.5M21 21-10.5-10.5M21 21-18-18M3 3l18 18M3 21l18-18" />
    </svg>
  );
}

function PlaceholderIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function FavoriteIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** @deprecated Use workspace catalog resolver — kept for tests and offline demos. */
export { getDemoCatalogItemById } from "./demoCatalogItems";
