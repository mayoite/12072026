/**
 * A4.0 — bounded undo/redo over `SvgSceneDocument`.
 *
 * Named transactions: every commit carries a human label ("Move desk-top",
 * "Delete leg-2") so the studio can show an operation history and the layer/
 * inspector panels can narrate what undo will revert. History depth is bounded
 * so long sessions don't grow without limit; the oldest entries drop first.
 *
 * The document is immutable, so each entry is just a reference — no deep cloning.
 */

import type { SvgSceneDocument } from "./svgSceneDocument";

export interface SvgHistoryEntry {
  readonly label: string;
  readonly document: SvgSceneDocument;
}

export interface SvgSceneHistory {
  readonly past: readonly SvgHistoryEntry[];
  readonly present: SvgHistoryEntry;
  readonly future: readonly SvgHistoryEntry[];
  readonly limit: number;
}

export const DEFAULT_HISTORY_LIMIT = 100;

export function createHistory(
  initial: SvgSceneDocument,
  label = "Open",
  limit: number = DEFAULT_HISTORY_LIMIT,
): SvgSceneHistory {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError(`history limit must be a positive integer; received ${limit}`);
  }
  return { past: [], present: { label, document: initial }, future: [], limit };
}

/**
 * Commit a new document state under a named operation. Redo history is cleared
 * (standard linear-undo semantics). A commit whose document is reference-equal
 * to the present is a no-op, so callers can commit optimistically.
 */
export function commit(
  history: SvgSceneHistory,
  label: string,
  document: SvgSceneDocument,
): SvgSceneHistory {
  if (document === history.present.document) return history;
  const past = [...history.past, history.present];
  // Bound depth: keep the newest `limit` past entries.
  const trimmed = past.length > history.limit ? past.slice(past.length - history.limit) : past;
  return { past: trimmed, present: { label, document }, future: [], limit: history.limit };
}

export function canUndo(history: SvgSceneHistory): boolean {
  return history.past.length > 0;
}

export function canRedo(history: SvgSceneHistory): boolean {
  return history.future.length > 0;
}

export function undo(history: SvgSceneHistory): SvgSceneHistory {
  if (!canUndo(history)) return history;
  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
    limit: history.limit,
  };
}

export function redo(history: SvgSceneHistory): SvgSceneHistory {
  if (!canRedo(history)) return history;
  const [next, ...rest] = history.future;
  return {
    past: [...history.past, history.present],
    present: next,
    future: rest,
    limit: history.limit,
  };
}

/** Label of the operation `undo()` would revert, or `undefined`. */
export function undoLabel(history: SvgSceneHistory): string | undefined {
  return canUndo(history) ? history.present.label : undefined;
}

/** Label of the operation `redo()` would re-apply, or `undefined`. */
export function redoLabel(history: SvgSceneHistory): string | undefined {
  return canRedo(history) ? history.future[0].label : undefined;
}
