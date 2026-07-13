/**
 * ADM-SVG-11 — deliberate confirmation copy for destructive Admin SVG actions.
 * Pure strings only: every message names the impact before the operator confirms.
 */

export function confirmResetToPublished(productSlug: string): string {
  return [
    `Reset “${productSlug}” to the last published revision?`,
    "",
    "Impact: every unpublished field and studio edit on this draft will be discarded.",
    "The released public SVG (if any) is not deleted; only this editor draft is restored.",
  ].join("\n");
}

export function confirmDiscardUnsavedNavigation(productSlug: string): string {
  return [
    `Leave the editor for “${productSlug}”?`,
    "",
    "Impact: all unpublished field and studio changes will be discarded and cannot be recovered.",
  ].join("\n");
}

export function confirmDeleteLayer(layerName: string): string {
  return [
    `Delete layer “${layerName}” from this draft?`,
    "",
    "Impact: the shape is removed from the draft scene only.",
    "You can undo until this editor is closed. The last published SVG is not changed until you publish again.",
  ].join("\n");
}

export function confirmRollbackRevision(
  productSlug: string,
  version: number,
): string {
  return [
    `Roll back “${productSlug}” to revision v${version}?`,
    "",
    "Impact: the current draft will be replaced by that revision’s content and re-published as a new version.",
    "Prior revision history is kept for later rollback. This cannot be undone with editor undo.",
  ].join("\n");
}
