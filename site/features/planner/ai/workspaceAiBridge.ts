import type { CanvasPlacementSummary, SuggestedLayoutJson } from "./types";

/**
 * Hooks AI Assist to the live planner document (not Fabric).
 * Named to avoid "open3d + ai" mashups that read like a product brand.
 */
export type WorkspaceAiBridge = {
  placementCount: number;
  getPlacements: () => CanvasPlacementSummary[];
  applyLayout: (layout: SuggestedLayoutJson) => void;
  replaceCatalogMatch: (furnitureId: string, catalogItemId: string) => void;
  fitCanvas?: () => void;
};
