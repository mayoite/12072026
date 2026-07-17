/**
 * Suggested layout apply — archive fabric runtime removed.
 * Live apply must go through WorkspaceAiBridge / project apply paths.
 * This module remains only as a hard fail-closed guard for legacy callers.
 */
import type { SuggestedLayoutJson } from "./types";
import { validateLayoutSchema } from "./aiStatus";

/**
 * @deprecated Use WorkspaceAiBridge.applyLayout. Always fails closed.
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

/** @deprecated Archive shape builder — always empty. */
export function buildShapesFromSuggestedLayout(_layout?: SuggestedLayoutJson): unknown[] {
  return [];
}
