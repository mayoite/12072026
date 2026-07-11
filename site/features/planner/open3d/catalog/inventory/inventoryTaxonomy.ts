/**
 * Phase 03A Inventory Taxonomy
 *
 * Extensible taxonomy with stable category IDs, subcategories, tags,
 * room/use context, and configurable ordering for the inventory panel.
 *
 * Built on Phase 03 catalog taxonomy but adds inventory-specific metadata
 * for display ordering, grouping, and navigation.
 */

import type {
  Open3dCatalogCategory,
  Open3dRoomTag,
  Open3dStyleTag,
} from "../catalogTypes";

// ── Icon keys ──

/**
 * Stable, presentation-free icon keys. Each maps to a Phosphor glyph in
 * `editor/inventoryIcons.tsx`. The taxonomy stays a pure data module (no JSX,
 * no emoji); rendering is the component's concern. Phosphor is the exclusive
 * planner icon system per `01-START.md` §5 and `00-REVISION.md` Decision 3.
 */
export type InventoryIconName =
  | "armchair"
  | "lightbulb"
  | "image"
  | "plant"
  | "fork-knife"
  | "ruler"
  | "house"
  | "couch"
  | "bed"
  | "cooking-pot"
  | "shower"
  | "briefcase"
  | "tree"
  | "car";

// ── Stable category IDs ──

export type InventoryCategoryId = string;

export interface InventoryCategory {
  /** Stable ID for persistence and URL params */
  id: InventoryCategoryId;
  /** Canonical catalog category */
  catalogCategory: Open3dCatalogCategory;
  /** Display name */
  label: string;
  /** Subcategories for drill-down navigation */
  subCategories: InventorySubCategory[];
  /** Sort order index (lower = first) */
  sortOrder: number;
  /** Whether this category is expanded by default */
  defaultExpanded: boolean;
  /** Phosphor icon key (see `editor/inventoryIcons.tsx`) for quick visual identification */
  icon: InventoryIconName;
}

export interface InventorySubCategory {
  id: string;
  label: string;
  /** Filter tag(s) used to match catalog items */
  filterTags: string[];
  sortOrder: number;
}

// ── Canonical inventory categories ──

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  {
    id: "furniture",
    catalogCategory: "Furniture",
    label: "Furniture",
    sortOrder: 1,
    defaultExpanded: true,
    icon: "armchair",
    subCategories: [
      { id: "sofas", label: "Sofas & Sectionals", filterTags: ["sofa", "sectional", "loveseat"], sortOrder: 1 },
      { id: "chairs", label: "Chairs", filterTags: ["chair", "seat", "stool"], sortOrder: 2 },
      { id: "tables", label: "Tables", filterTags: ["table"], sortOrder: 3 },
      { id: "desks", label: "Desks & Workstations", filterTags: ["desk", "workstation"], sortOrder: 4 },
      { id: "storage", label: "Storage", filterTags: ["storage", "wardrobe", "cabinet", "shelf"], sortOrder: 5 },
      { id: "beds", label: "Beds", filterTags: ["bed"], sortOrder: 6 },
    ],
  },
  {
    id: "lighting",
    catalogCategory: "Lighting",
    label: "Lighting",
    sortOrder: 2,
    defaultExpanded: false,
    icon: "lightbulb",
    subCategories: [
      { id: "ceiling", label: "Ceiling Lights", filterTags: ["ceiling", "chandelier", "pendant"], sortOrder: 1 },
      { id: "floor", label: "Floor Lamps", filterTags: ["floor", "lamp"], sortOrder: 2 },
      { id: "table-lamps", label: "Table Lamps", filterTags: ["table", "lamp"], sortOrder: 3 },
    ],
  },
  {
    id: "decor",
    catalogCategory: "Decor",
    label: "Decor",
    sortOrder: 3,
    defaultExpanded: false,
    icon: "image",
    subCategories: [
      { id: "rugs", label: "Rugs", filterTags: ["rug"], sortOrder: 1 },
      { id: "plants", label: "Plants", filterTags: ["plant"], sortOrder: 2 },
      { id: "art", label: "Wall Art & Mirrors", filterTags: ["art", "mirror"], sortOrder: 3 },
    ],
  },
  {
    id: "outdoor",
    catalogCategory: "Outdoor",
    label: "Outdoor",
    sortOrder: 4,
    defaultExpanded: false,
    icon: "plant",
    subCategories: [
      { id: "patio", label: "Patio Furniture", filterTags: ["patio", "outdoor"], sortOrder: 1 },
      { id: "grills", label: "BBQ & Fire Pits", filterTags: ["bbq", "grill", "fire"], sortOrder: 2 },
    ],
  },
  {
    id: "kitchen-dining",
    catalogCategory: "Kitchen & Dining",
    label: "Kitchen & Dining",
    sortOrder: 5,
    defaultExpanded: false,
    icon: "fork-knife",
    subCategories: [
      { id: "dining", label: "Dining", filterTags: ["dining", "table", "chair"], sortOrder: 1 },
      { id: "kitchen", label: "Kitchen", filterTags: ["kitchen", "cook"], sortOrder: 2 },
    ],
  },
  {
    id: "symbols",
    catalogCategory: "Symbols",
    label: "Symbols",
    sortOrder: 6,
    defaultExpanded: false,
    icon: "ruler",
    subCategories: [
      {
        id: "svg-catalog",
        label: "SVG catalog",
        filterTags: ["symbol", "descriptor", "svg"],
        sortOrder: 0,
      },
      { id: "electrical", label: "Electrical", filterTags: ["electrical"], sortOrder: 1 },
      { id: "plumbing", label: "Plumbing", filterTags: ["plumbing"], sortOrder: 2 },
    ],
  },
];

// ── Room/use context filter groups ──

export interface InventoryRoomGroup {
  id: string;
  label: string;
  roomTags: Open3dRoomTag[];
  icon: InventoryIconName;
}

export const INVENTORY_ROOM_GROUPS: InventoryRoomGroup[] = [
  { id: "all-rooms", label: "All Rooms", roomTags: [], icon: "house" },
  { id: "living", label: "Living Room", roomTags: ["Living Room"], icon: "couch" },
  { id: "bedroom", label: "Bedroom", roomTags: ["Bedroom"], icon: "bed" },
  { id: "kitchen", label: "Kitchen", roomTags: ["Kitchen"], icon: "cooking-pot" },
  { id: "bathroom", label: "Bathroom", roomTags: ["Bathroom"], icon: "shower" },
  { id: "office", label: "Office", roomTags: ["Office"], icon: "briefcase" },
  { id: "dining", label: "Dining", roomTags: ["Dining"], icon: "fork-knife" },
  { id: "outdoor", label: "Outdoor", roomTags: ["Outdoor"], icon: "tree" },
  { id: "garage", label: "Garage", roomTags: ["Garage"], icon: "car" },
];

/** Guest / O&O systems planner: no residential home-room chips. */
const OFFICE_SYSTEMS_ROOM_GROUP_IDS = new Set(["all-rooms", "office"]);

/**
 * Room chips for inventory. `office-systems` keeps All + Office only
 * (premium workstation product — not home DIY room filters).
 */
export function inventoryRoomGroupsForProduct(
  product: "full" | "office-systems",
): InventoryRoomGroup[] {
  if (product === "full") {
    return INVENTORY_ROOM_GROUPS;
  }
  return INVENTORY_ROOM_GROUPS.filter((group) =>
    OFFICE_SYSTEMS_ROOM_GROUP_IDS.has(group.id),
  ).map((group) =>
    group.id === "all-rooms" ? { ...group, label: "All" } : group,
  );
}

/** Categories kept for O&O workstation product (no outdoor / kitchen home path). */
const OFFICE_SYSTEMS_CATEGORY_IDS = new Set([
  "furniture",
  "lighting",
  "symbols",
]);

/**
 * Category nav for inventory. `office-systems` reorders furniture toward desks
 * and drops residential-only top-level categories (Outdoor, Kitchen & Dining, Decor).
 */
export function inventoryCategoriesForProduct(
  product: "full" | "office-systems",
): InventoryCategory[] {
  if (product === "full") {
    return INVENTORY_CATEGORIES;
  }

  return INVENTORY_CATEGORIES.filter((category) =>
    OFFICE_SYSTEMS_CATEGORY_IDS.has(category.id),
  ).map((category) => {
    if (category.id !== "furniture") {
      return category;
    }
    // Desks first; beds out of office systems nav.
    const byId = new Map(
      category.subCategories.map((sub) => [sub.id, sub] as const),
    );
    const orderedIds = ["desks", "chairs", "storage", "tables", "sofas"] as const;
    const officeSubs: InventorySubCategory[] = orderedIds
      .map((id, index) => {
        const sub = byId.get(id);
        return sub ? { ...sub, sortOrder: index + 1 } : null;
      })
      .filter((sub): sub is InventorySubCategory => sub !== null);
    return {
      ...category,
      subCategories: officeSubs,
    };
  });
}

// ── Style filter groups ──

export interface InventoryStyleGroup {
  id: string;
  label: string;
  styleTags: Open3dStyleTag[];
}

export const INVENTORY_STYLE_GROUPS: InventoryStyleGroup[] = [
  { id: "all-styles", label: "All Styles", styleTags: [] },
  { id: "modern", label: "Modern", styleTags: ["Modern", "Contemporary", "Minimalist"] },
  { id: "scandinavian", label: "Scandinavian", styleTags: ["Scandinavian"] },
  { id: "traditional", label: "Traditional", styleTags: ["Traditional", "Mid-Century", "Rustic"] },
  { id: "coastal-boho", label: "Coastal & Boho", styleTags: ["Coastal", "Boho"] },
  { id: "industrial", label: "Industrial", styleTags: ["Industrial"] },
];

// ── Sort options ──

export type InventorySortKey = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

export interface InventorySortOption {
  key: InventorySortKey;
  label: string;
}

export const INVENTORY_SORT_OPTIONS: InventorySortOption[] = [
  { key: "name-asc", label: "Name A–Z" },
  { key: "name-desc", label: "Name Z–A" },
  { key: "price-asc", label: "Price Low–High" },
  { key: "price-desc", label: "Price High–Low" },
  { key: "newest", label: "Newest" },
];

// ── Density options ──

export type InventoryDensity = "comfortable" | "compact";

export interface InventoryDensityOption {
  key: InventoryDensity;
  label: string;
  columns: number;
  previewSize: number;
}

export const INVENTORY_DENSITY_OPTIONS: InventoryDensityOption[] = [
  { key: "comfortable", label: "Comfortable", columns: 3, previewSize: 120 },
  { key: "compact", label: "Compact", columns: 5, previewSize: 80 },
];
