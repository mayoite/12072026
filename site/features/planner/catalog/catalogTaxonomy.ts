/**
 * Phase 03 Catalog Taxonomy
 *
 * Canonical type-based hierarchy with room/style/material/color as filterable attributes.
 * Two-field material approach. Assembly type attribute.
 *
 * Research-backed from Wayfair taxonomy, IKEA knowledge graph, LynkPIM/WISEPIM best practices.
 */

import type {
  PlannerAssemblyType,
  PlannerCatalogCategory,
  PlannerCatalogColor,
  PlannerCatalogMaterial,
  PlannerCatalogSubCategory,
  PlannerCatalogTaxonomyPath,
  PlannerRoomTag,
  PlannerStyleTag,
} from "./catalogTypes";

// ── Canonical taxonomy hierarchy ──

export interface TaxonomyNode {
  name: string;
  subCategories: Record<string, TaxonomyNode>;
  leafCategories: string[];
}

/**
 * Canonical type-based taxonomy tree.
 * Primary axis is product type (Furniture, Lighting, Decor...),
 * NOT room. Room is a multi-value filterable attribute.
 */
export const CANONICAL_TAXONOMY: Record<PlannerCatalogCategory, TaxonomyNode> = {
  Furniture: {
    name: "Furniture",
    subCategories: {
      "Sofas & Sectionals": {
        name: "Sofas & Sectionals",
        subCategories: {},
        leafCategories: [
          "2-Seater Sofas",
          "3-Seater Sofas",
          "Corner Sofas",
          "Sofa Beds",
          "Recliners",
        ],
      },
      Chairs: {
        name: "Chairs",
        subCategories: {},
        leafCategories: [
          "Armchairs",
          "Accent Chairs",
          "Office Chairs",
          "Ergonomic Chairs",
          "Gaming Chairs",
          "Dining Chairs",
          "Bar Stools",
        ],
      },
      Tables: {
        name: "Tables",
        subCategories: {},
        leafCategories: [
          "Coffee Tables",
          "Side Tables",
          "Console Tables",
          "Dining Tables",
          "Extendable Tables",
          "Desks",
          "Standing Desks",
          "L-Shaped Desks",
        ],
      },
      Storage: {
        name: "Storage",
        subCategories: {},
        leafCategories: [
          "Wardrobes",
          "Chests of Drawers",
          "Nightstands",
          "Dressers",
          "Bookcases",
          "Display Cabinets",
          "Sideboards",
          "Filing Cabinets",
        ],
      },
      Beds: {
        name: "Beds",
        subCategories: {},
        leafCategories: [
          "Single Beds",
          "Double Beds",
          "King Beds",
          "Super King Beds",
          "Bunk Beds",
          "Loft Beds",
        ],
      },
      Benches: {
        name: "Benches",
        subCategories: {},
        leafCategories: ["Workbenches", "Hall Benches", "Dining Benches", "Outdoor Benches"],
      },
    },
    leafCategories: [],
  },
  Lighting: {
    name: "Lighting",
    subCategories: {},
    leafCategories: [
      "Ceiling Lights",
      "Chandeliers",
      "Pendant Lights",
      "Floor Lamps",
      "Table Lamps",
      "Wall Sconces",
      "Recessed Lights",
    ],
  },
  Decor: {
    name: "Decor",
    subCategories: {},
    leafCategories: [
      "Rugs",
      "Mirrors",
      "Wall Art",
      "Vases",
      "Potted Plants",
      "Curtains",
      "Clocks",
      "Candles",
    ],
  },
  Outdoor: {
    name: "Outdoor",
    subCategories: {},
    leafCategories: [
      "Patio Dining Sets",
      "Lounge Seating",
      "Outdoor Sofas",
      "Hammocks",
      "Parasols & Shade",
      "BBQ Grills",
      "Fire Pits",
    ],
  },
  "Bedding & Textiles": {
    name: "Bedding & Textiles",
    subCategories: {},
    leafCategories: [
      "Duvet Sets",
      "Pillowcases",
      "Throws",
      "Curtains",
      "Blackout Curtains",
      "Mattress Toppers",
    ],
  },
  "Storage & Organisation": {
    name: "Storage & Organisation",
    subCategories: {},
    leafCategories: [
      "Shelving",
      "Boxes & Baskets",
      "Hooks",
      "Drawer Organisers",
    ],
  },
  "Kitchen & Dining": {
    name: "Kitchen & Dining",
    subCategories: {},
    leafCategories: [
      "Cookware",
      "Tableware",
      "Kitchen Storage",
      "Appliances",
    ],
  },
  Symbols: {
    name: "Symbols",
    subCategories: {},
    leafCategories: [
      "Electrical",
      "Plumbing",
      "HVAC",
      "Evacuation",
    ],
  },
};

// ── Normalized room tags ──

export const ROOM_TAGS: readonly PlannerRoomTag[] = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Dining",
  "Outdoor",
  "Garage",
  "Utility",
  "Kids & Nursery",
  "Entryway & Hallway",
] as const;

// ── Normalized style tags ──

export const STYLE_TAGS: readonly PlannerStyleTag[] = [
  "Modern",
  "Scandinavian",
  "Industrial",
  "Traditional",
  "Coastal",
  "Boho",
  "Mid-Century",
  "Minimalist",
  "Contemporary",
  "Rustic",
] as const;

// ── Normalized material map ──

/**
 * Maps marketing material names to normalized filter values.
 * Example: "Smoked Oak" → "Oak", "Warm Walnut Veneer" → "Walnut"
 */
const MARKETING_TO_NORMALIZED_MATERIAL: Record<string, string> = {
  "smoked oak": "Oak",
  "natural oak": "Oak",
  "light oak": "Oak",
  "dark oak": "Oak",
  "warm walnut": "Walnut",
  "warm walnut veneer": "Walnut",
  "walnut veneer": "Walnut",
  "black walnut": "Walnut",
  "brushed concrete effect": "Concrete",
  "concrete effect": "Concrete",
  "hammered antique brass": "Brass",
  "antique brass": "Brass",
  "polished brass": "Brass",
  "brushed brass": "Brass",
  "matte black": "Metal",
  "polished chrome": "Metal",
  "brushed steel": "Steel",
  "stainless steel": "Steel",
  "white pine": "Pine",
  "pine": "Pine",
  "solid pine": "Pine",
  "mahogany": "Mahogany",
  "teak": "Teak",
  "birch": "Birch",
  "beech": "Beech",
  "maple": "Maple",
  "cherry": "Cherry",
  "ash": "Ash",
  "mdf": "MDF",
  "particle board": "Particle Board",
  "laminate": "Laminate",
  "glass": "Glass",
  "tempered glass": "Glass",
  "marble": "Marble",
  "granite": "Granite",
  "leather": "Leather",
  "genuine leather": "Leather",
  "faux leather": "Faux Leather",
  "bonded leather": "Faux Leather",
  "velvet": "Velvet",
  "cotton": "Cotton",
  "linen": "Linen",
  "polyester": "Polyester",
  "microfiber": "Microfiber",
  "wool": "Wool",
  "rattan": "Rattan",
  "wicker": "Wicker",
  "bamboo": "Bamboo",
  "rope": "Rope",
  "ceramic": "Ceramic",
  "porcelain": "Porcelain",
};

// ── Normalized color families ──

const COLOR_NAME_TO_FAMILY: Record<string, string> = {
  white: "Neutral",
  "off-white": "Neutral",
  cream: "Neutral",
  ivory: "Neutral",
  beige: "Neutral",
  grey: "Neutral",
  gray: "Neutral",
  charcoal: "Neutral",
  black: "Neutral",
  brown: "Brown",
  tan: "Brown",
  sand: "Brown",
  taupe: "Brown",
  red: "Red",
  crimson: "Red",
  maroon: "Red",
  burgundy: "Red",
  pink: "Pink",
  rose: "Pink",
  orange: "Orange",
  coral: "Orange",
  peach: "Orange",
  yellow: "Yellow",
  gold: "Yellow",
  amber: "Yellow",
  green: "Green",
  olive: "Green",
  mint: "Green",
  emerald: "Green",
  teal: "Green",
  blue: "Blue",
  navy: "Blue",
  "sky blue": "Blue",
  "light blue": "Blue",
  indigo: "Blue",
  purple: "Purple",
  violet: "Purple",
  lavender: "Purple",
  plum: "Purple",
};

// ── Taxonomy utility functions ──

/**
 * Build a taxonomy path string: "Furniture > Tables > Dining Tables"
 */
export function buildTaxonomyPath(
  category: PlannerCatalogCategory,
  subCategory?: PlannerCatalogSubCategory,
  leafCategory?: string,
): PlannerCatalogTaxonomyPath {
  const parts: string[] = [category];
  if (subCategory && subCategory.length > 0) {
    parts.push(subCategory);
  }
  if (leafCategory && leafCategory.length > 0) {
    parts.push(leafCategory);
  }
  return parts.join(" > ");
}

/**
 * Normalize a material: given a marketing name, return the two-field material object.
 * Falls back to "Other" as normalized value if no mapping exists.
 */
export function normalizeMaterial(marketingMaterial: string): PlannerCatalogMaterial {
  const normalized = marketingMaterial.trim();
  const key = normalized.toLowerCase();
  const normalizedValue = MARKETING_TO_NORMALIZED_MATERIAL[key] ?? normalized;
  return {
    marketingMaterial: normalized || "Unknown",
    normalizedMaterial: normalizedValue,
  };
}

/**
 * Resolve a color from name and hex to structured color with normalized family.
 */
export function normalizeColor(name: string, hex: string): PlannerCatalogColor {
  const colorName = name.trim();
  const normalizedHex = hex.startsWith("#") ? hex : `#${hex}`;
  const familyKey = colorName.toLowerCase();
  const normalizedFamily = COLOR_NAME_TO_FAMILY[familyKey] ?? "Other";
  return {
    hex: normalizedHex,
    name: colorName || "Unknown",
    normalizedFamily,
  };
}

/**
 * Validate that a room tag is a recognized canonical value.
 */
export function isValidRoomTag(value: string): value is PlannerRoomTag {
  return (ROOM_TAGS as readonly string[]).includes(value);
}

/**
 * Validate that a style tag is a recognized canonical value.
 */
export function isValidStyleTag(value: string): value is PlannerStyleTag {
  return (STYLE_TAGS as readonly string[]).includes(value);
}

/**
 * Normalize an assembly type string to the canonical enum.
 */
export function normalizeAssemblyType(raw: string): PlannerAssemblyType {
  const normalized = raw.trim().toLowerCase();
  if (normalized.includes("flat") || normalized.includes("pack")) return "flat-pack";
  if (normalized.includes("partial") || normalized.includes("some") || normalized.includes("semi")) return "partial";
  if (normalized.includes("fully") || normalized.includes("complete") || normalized.includes("pre")) return "fully-assembled";
  return "partial";
}

/**
 * Build a short display name (≤ 30 characters) from a product name.
 */
export function buildShortName(name: string): string {
  if (name.length <= 30) return name;
  return `${name.slice(0, 27).trim()}…`;
}
