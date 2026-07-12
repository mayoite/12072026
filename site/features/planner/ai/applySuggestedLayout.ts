/**
 * Suggested layout apply — archive fabric runtime removed.
 * Prefer WorkspaceAiBridge / planner project apply paths.
 */
import type { SuggestedLayoutJson } from "./types";
import { validateLayoutSchema } from "./aiStatus";

/** @deprecated No archive Fabric runtime — no-op until open3d apply is wired. */
export function applySuggestedLayout(_editor?: null, layout?: SuggestedLayoutJson): void {
  if (!layout) return;
  if (!validateLayoutSchema(layout)) {
    console.error("[applySuggestedLayout] Schema validation failed for layout:", layout);
  }
}

export function buildShapesFromSuggestedLayout(_layout?: SuggestedLayoutJson): unknown[] {
  return [];
}
