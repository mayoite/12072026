/**
 * Phase 03A Inventory State Contracts
 *
 * Inventory panel state, filters, sort, collections, collapsed/expanded state,
 * recent/frequent items, and command contracts for Phase 05 docking/UI integration.
 *
 * Defines the contract between the inventory data layer and the UI layer.
 * Phase 05 implements docking and final visuals using these contracts.
 */

import type {
  Open3dCatalogItem,
  Open3dCatalogCategory,
  Open3dRoomTag,
  Open3dStyleTag,
} from "../catalogTypes";
import type { InventorySortKey, InventoryDensity } from "./inventoryTaxonomy";

// ── Inventory panel state ──

export type InventoryMode = "browse" | "search";

export interface InventoryItemIdentity {
  itemId: string;
  variantId: string | null;
}

export interface InventoryLoadedRange {
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export type InventoryAnnouncementKind = "placement" | "filter-count" | "undo-redo" | "error";

export interface InventoryAnnouncement {
  kind: InventoryAnnouncementKind;
  message: string;
  politeness: "polite" | "assertive";
  createdAt: string;
}

export interface InventoryPanelState {
  /** Browse mode shows category/collection lanes; search mode shows query/facet results */
  mode: InventoryMode;
  /** Currently active search query text */
  searchQuery: string;
  /** Selected category filter ID (null = all) */
  selectedCategoryId: string | null;
  /** Selected subcategory filter ID (null = all) */
  selectedSubCategoryId: string | null;
  /** Selected room filter (null = all) */
  selectedRoomGroupId: string | null;
  /** Selected style filter (null = all) */
  selectedStyleGroupId: string | null;
  /** Active sort order */
  sortOrder: InventorySortKey;
  /** Display density */
  density: InventoryDensity;
  /** Collapsed/expanded state of each category (categoryId -> collapsed) */
  collapsedCategories: Record<string, boolean>;
  /** Whether the recent items panel is visible */
  recentVisible: boolean;
  /** Whether the favorites panel is visible */
  favoritesVisible: boolean;
  /** Focus retention is by catalog identity, not recycled DOM index */
  focusedItem: InventoryItemIdentity | null;
  /** Stable scroll restoration anchor for virtualized result lists */
  scrollAnchor: InventoryItemIdentity | null;
  /** Rendered virtualized range exposed for tests and screen-reader status */
  loadedRange: InventoryLoadedRange;
  /** Last coalesced announcement for placement/filter/error workflows */
  liveAnnouncement: InventoryAnnouncement | null;
}

/** Default inventory panel state */
export function defaultInventoryPanelState(): InventoryPanelState {
  return {
    mode: "browse",
    searchQuery: "",
    selectedCategoryId: null,
    selectedSubCategoryId: null,
    selectedRoomGroupId: null,
    selectedStyleGroupId: null,
    sortOrder: "name-asc",
    density: "comfortable",
    collapsedCategories: {},
    recentVisible: false,
    favoritesVisible: false,
    focusedItem: null,
    scrollAnchor: null,
    loadedRange: { startIndex: 0, endIndex: 0, totalCount: 0 },
    liveAnnouncement: null,
  };
}

// ── Inventory command contracts ──

/** Actions that the inventory panel dispatches */
export type InventoryCommand =
  | { type: "SET_MODE"; mode: InventoryMode }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SELECT_CATEGORY"; categoryId: string | null }
  | { type: "SELECT_SUBCATEGORY"; subCategoryId: string | null }
  | { type: "SELECT_ROOM"; roomGroupId: string | null }
  | { type: "SELECT_STYLE"; styleGroupId: string | null }
  | { type: "SET_SORT"; sort: InventorySortKey }
  | { type: "SET_DENSITY"; density: InventoryDensity }
  | { type: "SET_FOCUSED_ITEM"; item: InventoryItemIdentity | null }
  | { type: "SET_SCROLL_ANCHOR"; item: InventoryItemIdentity | null }
  | { type: "SET_LOADED_RANGE"; range: InventoryLoadedRange }
  | { type: "ANNOUNCE"; announcement: InventoryAnnouncement }
  | { type: "CLEAR_ANNOUNCEMENT" }
  | { type: "TOGGLE_CATEGORY_COLLAPSE"; categoryId: string }
  | { type: "TOGGLE_RECENT_VISIBLE" }
  | { type: "TOGGLE_FAVORITES_VISIBLE" }
  | { type: "PLACE_ITEM"; itemId: string; variantId: string | null; position: { x: number; y: number } }
  | { type: "ADD_TO_FAVORITES"; itemId: string }
  | { type: "REMOVE_FROM_FAVORITES"; itemId: string }
  | { type: "CLEAR_SEARCH" }
  | { type: "RESET_FILTERS" };

/** Result of processing an inventory command */
export interface InventoryCommandResult {
  /** Updated panel state */
  state: InventoryPanelState;
  /** Placed item (if placement command) */
  placedItem?: {
    itemId: string;
    variantId: string | null;
    position: { x: number; y: number };
  };
}

// ── Inventory command processor ──

/**
 * Pure reducer for inventory panel commands.
 * Phase 05 UI uses this to derive display state from commands.
 */
export function reduceInventoryCommand(
  state: InventoryPanelState,
  command: InventoryCommand,
): InventoryPanelState {
  switch (command.type) {
    case "SET_MODE":
      return { ...state, mode: command.mode };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: command.query, mode: command.query.trim() ? "search" : state.mode };
    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategoryId: command.categoryId,
        selectedSubCategoryId: null,
      };
    case "SELECT_SUBCATEGORY":
      return { ...state, selectedSubCategoryId: command.subCategoryId };
    case "SELECT_ROOM":
      return { ...state, selectedRoomGroupId: command.roomGroupId };
    case "SELECT_STYLE":
      return { ...state, selectedStyleGroupId: command.styleGroupId };
    case "SET_SORT":
      return { ...state, sortOrder: command.sort };
    case "SET_DENSITY":
      return { ...state, density: command.density };
    case "SET_FOCUSED_ITEM":
      return { ...state, focusedItem: command.item };
    case "SET_SCROLL_ANCHOR":
      return { ...state, scrollAnchor: command.item };
    case "SET_LOADED_RANGE":
      return { ...state, loadedRange: command.range };
    case "ANNOUNCE":
      return { ...state, liveAnnouncement: command.announcement };
    case "CLEAR_ANNOUNCEMENT":
      return { ...state, liveAnnouncement: null };
    case "TOGGLE_CATEGORY_COLLAPSE":
      return {
        ...state,
        collapsedCategories: {
          ...state.collapsedCategories,
          [command.categoryId]: !state.collapsedCategories[command.categoryId],
        },
      };
    case "TOGGLE_RECENT_VISIBLE":
      return { ...state, recentVisible: !state.recentVisible };
    case "TOGGLE_FAVORITES_VISIBLE":
      return { ...state, favoritesVisible: !state.favoritesVisible };
    case "CLEAR_SEARCH":
      return { ...state, searchQuery: "", mode: "browse" };
    case "RESET_FILTERS":
      return defaultInventoryPanelState();
    default:
      return state;
  }
}

// ── Collections state ──

export interface InventoryCollectionsState {
  /** Recently placed items (most recent first, max 50) */
  recent: Array<{ itemId: string; variantId?: string; placedAt: string }>;
  /** Project-level recents stay separate from in-editor recently placed items */
  projectRecent: Array<{ itemId: string; variantId?: string; openedAt: string }>;
  /** Frequently used items with usage count */
  frequent: Array<{ itemId: string; variantId?: string; useCount: number }>;
  /** Favorited item IDs */
  favorites: string[];
  /** Custom user collections (project-specific groupings) */
  collections: Array<{ id: string; name: string; itemIds: string[] }>;
}

const MAX_RECENT_ITEMS = 50;

function stableUniqueItemIds(itemIds: string[]): string[] {
  return Array.from(new Set(itemIds)).sort((a, b) => a.localeCompare(b));
}

export function defaultCollectionsState(): InventoryCollectionsState {
  return {
    recent: [],
    projectRecent: [],
    frequent: [],
    favorites: [],
    collections: [],
  };
}

export function addInventoryRecent(
  state: InventoryCollectionsState,
  itemId: string,
  placedAt: string,
  variantId?: string | null,
): InventoryCollectionsState {
  const sameIdentity = (entry: { itemId: string; variantId?: string }) =>
    entry.itemId === itemId && (entry.variantId ?? null) === (variantId ?? null);
  const identityEntry = {
    itemId,
    ...(variantId ? { variantId } : {}),
  };
  const recent = [
    { ...identityEntry, placedAt },
    ...state.recent.filter((entry) => !sameIdentity(entry)),
  ].slice(0, MAX_RECENT_ITEMS);

  const useCount = (state.frequent.find((entry) => sameIdentity(entry))?.useCount ?? 0) + 1;
  const frequent = [
    ...state.frequent.filter((entry) => !sameIdentity(entry)),
    { ...identityEntry, useCount },
  ].sort((a, b) => (b.useCount - a.useCount) || a.itemId.localeCompare(b.itemId) || (a.variantId ?? "").localeCompare(b.variantId ?? ""));

  return { ...state, recent, frequent };
}

export function addProjectRecent(
  state: InventoryCollectionsState,
  itemId: string,
  openedAt: string,
  variantId?: string | null,
): InventoryCollectionsState {
  const sameIdentity = (entry: { itemId: string; variantId?: string }) =>
    entry.itemId === itemId && (entry.variantId ?? null) === (variantId ?? null);
  const entry = { itemId, ...(variantId ? { variantId } : {}), openedAt };
  return {
    ...state,
    projectRecent: [entry, ...state.projectRecent.filter((item) => !sameIdentity(item))].slice(0, MAX_RECENT_ITEMS),
  };
}

export function addInventoryFavorite(state: InventoryCollectionsState, itemId: string): InventoryCollectionsState {
  if (state.favorites.includes(itemId)) return state;
  return { ...state, favorites: stableUniqueItemIds([...state.favorites, itemId]) };
}

export function removeInventoryFavorite(state: InventoryCollectionsState, itemId: string): InventoryCollectionsState {
  return { ...state, favorites: state.favorites.filter((favoriteId) => favoriteId !== itemId) };
}

export function isInventoryFavorite(state: InventoryCollectionsState, itemId: string): boolean {
  return state.favorites.includes(itemId);
}

export function upsertInventoryCollection(
  state: InventoryCollectionsState,
  collection: { id: string; name: string; itemIds: string[] },
): InventoryCollectionsState {
  const normalized = { ...collection, itemIds: stableUniqueItemIds(collection.itemIds) };
  const collections = [
    ...state.collections.filter((entry) => entry.id !== collection.id),
    normalized,
  ].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  return { ...state, collections };
}

export function addInventoryItemToCollection(
  state: InventoryCollectionsState,
  collectionId: string,
  itemId: string,
): InventoryCollectionsState {
  const collection = state.collections.find((entry) => entry.id === collectionId);
  if (!collection) return state;
  return upsertInventoryCollection(state, {
    ...collection,
    itemIds: [...collection.itemIds, itemId],
  });
}

export function removeInventoryItemFromCollection(
  state: InventoryCollectionsState,
  collectionId: string,
  itemId: string,
): InventoryCollectionsState {
  const collection = state.collections.find((entry) => entry.id === collectionId);
  if (!collection) return state;
  return upsertInventoryCollection(state, {
    ...collection,
    itemIds: collection.itemIds.filter((entryId) => entryId !== itemId),
  });
}

// ── Inventory panel contract for Phase 05 ──

/**
 * Contract that Phase 05 UI must implement.
 * Defines what the docking/workflow layer expects from the inventory panel.
 */
export interface InventoryPanelContract {
  /** Panel unique ID for docking system */
  panelId: string;
  /** Panel display name */
  title: string;
  /** Default dock position */
  defaultDock: "left" | "right" | "bottom";
  /** Minimum panel width in CSS px */
  minWidth: number;
  /** Default panel width */
  defaultWidth: number;
  /** Whether the panel is resizable */
  resizable: boolean;
  /** Panel commands for keyboard shortcuts */
  shortcutCommands: Array<{ key: string; command: string }>;
  /** Whether the panel can be closed */
  closable: boolean;
  /** Whether the panel can be undocked/floated */
  undockable: boolean;
}

/** Default inventory panel contract for Phase 05 */
export const INVENTORY_PANEL_CONTRACT: InventoryPanelContract = {
  panelId: "inventory",
  title: "Inventory",
  defaultDock: "left",
  minWidth: 280,
  defaultWidth: 340,
  resizable: true,
  shortcutCommands: [
    { key: "Ctrl+I", command: "toggle-inventory" },
    { key: "Ctrl+F", command: "focus-inventory-search" },
    { key: "Escape", command: "close-or-collapse-inventory" },
    { key: "Enter", command: "place-focused-item" },
    { key: "Ctrl+Shift+F", command: "reset-inventory-filters" },
    { key: "Ctrl+Shift+D", command: "toggle-inventory-density" },
  ],
  closable: false,
  undockable: true,
};
