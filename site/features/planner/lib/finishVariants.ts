/**
 * Curated Oando Finish Variants
 *
 * Predefined finish/material options for furniture items.
 * Initially curated (not user-extensible) to maintain design consistency.
 */

import type { FurnitureCategory } from "../store/catalogData";

export interface FinishVariant {
  id: string;
  name: string;
  colorHex: string;
  textureUrl?: string;
  category: "wood" | "laminate" | "fabric" | "metal" | "glass";
}

export const OANDO_FINISHES: FinishVariant[] = [
  {
    id: "oak-natural",
    name: "Oak Natural",
    colorHex: "var(--color-ecru-500)",
    category: "wood",
  },
  {
    id: "walnut-dark",
    name: "Walnut Dark",
    colorHex: "var(--color-ecru-900)",
    category: "wood",
  },
  {
    id: "teak",
    name: "Teak",
    colorHex: "var(--color-ecru-600)",
    category: "wood",
  },
  {
    id: "white-laminate",
    name: "White Laminate",
    colorHex: "var(--color-bronze-50)",
    category: "laminate",
  },
  {
    id: "grey-fabric",
    name: "Grey Fabric",
    colorHex: "var(--color-bronze-400)",
    category: "fabric",
  },
  {
    id: "brushed-steel",
    name: "Brushed Steel",
    colorHex: "var(--color-white-450)",
    category: "metal",
  },
  {
    id: "matte-black",
    name: "Matte Black",
    colorHex: "var(--color-bronze-900)",
    category: "metal",
  },
  {
    id: "clear-glass",
    name: "Clear Glass",
    colorHex: "var(--color-white-300)",
    category: "glass",
  },
];

/**
 * Map from furniture category to relevant finish categories.
 * This controls which finishes are offered for each furniture type.
 */
const CATEGORY_FINISH_MAP: Record<FurnitureCategory, FinishVariant["category"][]> = {
  desks: ["wood", "laminate", "metal"],
  seating: ["fabric", "metal", "wood"],
  tables: ["wood", "laminate", "glass", "metal"],
  storage: ["wood", "laminate", "metal"],
  "soft-seating": ["fabric", "wood", "metal"],
  education: ["laminate", "wood", "metal"],
  misc: ["wood", "laminate", "metal", "glass", "fabric"],
};

/**
 * Returns finishes relevant to a given furniture category.
 * Falls back to all finishes if the category is unknown.
 */
export function getFinishesForCategory(furnitureCategory: string): FinishVariant[] {
  const allowedCategories = CATEGORY_FINISH_MAP[furnitureCategory as FurnitureCategory];
  if (!allowedCategories) {
    return OANDO_FINISHES;
  }
  return OANDO_FINISHES.filter((f) => allowedCategories.includes(f.category));
}
