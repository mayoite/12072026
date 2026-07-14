/**
 * Suggested layout apply — archive fabric runtime removed.
 * Prefer WorkspaceAiBridge / planner project apply paths.
 */
import type { SuggestedLayoutJson } from "./types";
import { validateLayoutSchema } from "./aiStatus";

/**
 * Apply is not wired to the live workspace host.
 * Callers must use project apply / WorkspaceAiBridge instead.
 * Invalid layouts fail closed; valid layouts throw so silent no-ops cannot look like success.
 */
export function applySuggestedLayout(_editor?: null, layout?: SuggestedLayoutJson): void {
  if (!layout) {
    throw new Error(
      "[applySuggestedLayout] No layout provided. Use WorkspaceAiBridge / project apply paths.",
    );
  }
  if (!validateLayoutSchema(layout)) {
    throw new Error(
      "[applySuggestedLayout] Schema validation failed. Layout was not applied.",
    );
  }
  throw new Error(
    "[applySuggestedLayout] Apply is not wired to the live workspace. Use WorkspaceAiBridge / project apply paths.",
  );
}

export function buildShapesFromSuggestedLayout(_layout?: SuggestedLayoutJson): unknown[] {
  return [];
}
