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
  /** Icon/emoji for quick visual identification */
  icon: string;
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
    icon: "🪑",
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
    icon: "💡",
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
    icon: "🖼️",
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
    icon: "🌿",
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
    icon: "🍽️",
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
    icon: "📐",
    subCategories: [
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
  icon: string;
}

export const INVENTORY_ROOM_GROUPS: InventoryRoomGroup[] = [
  { id: "all-rooms", label: "All Rooms", roomTags: [], icon: "🏠" },
  { id: "living", label: "Living Room", roomTags: ["Living Room"], icon: "🛋️" },
  { id: "bedroom", label: "Bedroom", roomTags: ["Bedroom"], icon: "🛏️" },
  { id: "kitchen", label: "Kitchen", roomTags: ["Kitchen"], icon: "🍳" },
  { id: "bathroom", label: "Bathroom", roomTags: ["Bathroom"], icon: "🚿" },
  { id: "office", label: "Office", roomTags: ["Office"], icon: "💼" },
  { id: "dining", label: "Dining", roomTags: ["Dining"], icon: "🍽️" },
  { id: "outdoor", label: "Outdoor", roomTags: ["Outdoor"], icon: "🌳" },
  { id: "garage", label: "Garage", roomTags: ["Garage"], icon: "🚗" },
];

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
