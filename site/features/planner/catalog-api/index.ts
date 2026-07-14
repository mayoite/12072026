/**
 * Top-level planner catalog surface (domain / API / tools).
 * Live guest/canvas placement catalog lives under `features/planner/project/catalog/`.
 * Do not treat this tree as the plan canvas host.
 * @see features/planner/CONTENTS.md — Dual trees
 */

export { CatalogPanel, type CatalogPanelProps } from "./CatalogPanel";
export { CatalogSidebar, type CatalogSidebarProps } from "./CatalogSidebar";
export { CATALOG_PURPOSE_TABS } from "./catalogTypes";
export {
  CATALOG_SUB_CATEGORIES,
  enrichCatalogItem,
  enrichCatalogItems,
  formatCatalogSeatFootprint,
  mapPurposeFilterToCatalogTab,
} from "./catalogHierarchy";
export { CatalogBlockPreview } from "./CatalogBlockPreview";
export { CatalogDropGhost } from "./CatalogDropGhost";
