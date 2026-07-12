"use client";

/**
 * Inventory icon mapping — the single place that binds inventory taxonomy icon
 * keys to Phosphor glyphs. Phosphor is the exclusive planner icon system
 * (`01-START.md` §5, `00-REVISION.md` Decision 3), so no emoji or unicode
 * controls appear in planner chrome. The taxonomy stays a pure data module and
 * carries only stable keys; this component owns presentation.
 */

import { Armchair, Bed, Briefcase, Car, CookingPot, Couch, ForkKnife, House, Image, Lightbulb, Plant, Ruler, Shower, Tree, type Icon, type IconProps } from "@phosphor-icons/react";

import type { InventoryIconName } from "@/features/planner/project/catalog/inventory/inventoryTaxonomy";

const INVENTORY_ICON_GLYPHS: Record<InventoryIconName, Icon> = {
  armchair: Armchair,
  lightbulb: Lightbulb,
  image: Image,
  plant: Plant,
  "fork-knife": ForkKnife,
  ruler: Ruler,
  house: House,
  couch: Couch,
  bed: Bed,
  "cooking-pot": CookingPot,
  shower: Shower,
  briefcase: Briefcase,
  tree: Tree,
  car: Car,
};

export interface InventoryIconProps extends Omit<IconProps, "ref"> {
  /** Stable taxonomy icon key. */
  name: InventoryIconName;
}

/**
 * Render the Phosphor glyph for a taxonomy icon key. Decorative by default
 * (`aria-hidden`) because the adjacent label carries the accessible name.
 */
export function InventoryIcon({ name, ...props }: InventoryIconProps) {
  const Glyph = INVENTORY_ICON_GLYPHS[name];
  return <Glyph aria-hidden {...props} />;
}
