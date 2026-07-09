/**
 * Pure UI routing: which open3d inventory placements use the modular GLB
 * write+stamp path vs plain placeCatalogItemInProject.
 *
 * Narrow by design: only the demo modular SKU id/slug `cabinet-v0`.
 * Other items (including future modular geometry modes) stay procedural place.
 */

import { MODULAR_CABINET_V0_CATALOG_ID } from "@/features/planner/open3d/catalog/placementAction";

export type ModularGlbPlaceCatalogRef = {
  readonly id: string;
  readonly slug?: string;
  /** Present on catalog items; ignored for routing (id/slug only). */
  readonly geometryMode?: string;
};

/**
 * True when open3d inventory place should call the modular write+stamp path
 * (`placeModularWithGeneratedGlbPlan` / browser equivalent) so G8 can load.
 *
 * Matches catalog id **or** slug `cabinet-v0` only.
 */
export function shouldPlaceModularWithGeneratedGlb(
  item: ModularGlbPlaceCatalogRef,
): boolean {
  const id = item.id.trim();
  const slug = (item.slug ?? "").trim();
  return (
    id === MODULAR_CABINET_V0_CATALOG_ID || slug === MODULAR_CABINET_V0_CATALOG_ID
  );
}
