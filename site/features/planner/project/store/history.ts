import type { PlannerProject } from "../model/types";
import {
  applyPlannerProjectAction,
  type PlannerProjectAction,
  applyPlannerProjectTransaction,
} from "../model/actions/projectActions";

export interface PlannerHistoryState {
  past: PlannerProject[];
  present: PlannerProject;
  future: PlannerProject[];
  dragStart: PlannerProject | null;
}

export function dispatchPlannerTransaction(
  history: PlannerHistoryState,
  actions: readonly PlannerProjectAction[],
  now?: string,
): PlannerHistoryState {
  if (actions.length === 0) return history;
  const next = applyPlannerProjectTransaction(history.present, actions, now);
  if (next === history.present) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: [],
    dragStart: null,
  };
}

export function createPlannerHistory(project: PlannerProject): PlannerHistoryState {
  return { past: [], present: project, future: [], dragStart: null };
}

export function dispatchPlannerAction(
  history: PlannerHistoryState,
  action: PlannerProjectAction,
  now?: string,
): PlannerHistoryState {
  const next = applyPlannerProjectAction(history.present, action, now);
  if (next === history.present) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: [],
    dragStart: null,
  };
}

export function undoPlannerAction(history: PlannerHistoryState): PlannerHistoryState {
  const previous = history.past.at(-1);
  if (!previous) return history;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
    dragStart: null,
  };
}

export function redoPlannerAction(history: PlannerHistoryState): PlannerHistoryState {
  const next = history.future[0];
  if (!next) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
    dragStart: null,
  };
}

/**
 * Apply a functional updater to the current document and record it in history.
 *
 * Used for canvas interactions (wall/opening geometry, placement, entity edits)
 * that are not expressible as a single {@link PlannerProjectAction}. Timestamp
 * stamping mirrors the action reducer: if the updater did not change
 * `updatedAt`, it is stamped so every recorded mutation advances the clock.
 * Returns the same history reference when the updater is a no-op so callers can
 * skip re-renders.
 */
export function updatePlannerProject(
  history: PlannerHistoryState,
  updater: (project: PlannerProject) => PlannerProject,
  now?: string,
): PlannerHistoryState {
  const updated = updater(history.present);
  if (updated === history.present) return history;
  const stamped =
    updated.updatedAt === history.present.updatedAt
      ? { ...updated, updatedAt: now ?? new Date().toISOString() }
      : updated;
  return {
    past: [...history.past, history.present],
    present: stamped,
    future: [],
    dragStart: null,
  };
}

export function beginPlannerDrag(history: PlannerHistoryState): PlannerHistoryState {
  return { ...history, dragStart: history.present };
}

export function commitPlannerDrag(
  history: PlannerHistoryState,
  project: PlannerProject,
): PlannerHistoryState {
  if (!history.dragStart || history.dragStart === project) {
    return { ...history, present: project, dragStart: null };
  }
  return {
    past: [...history.past, history.dragStart],
    present: project,
    future: [],
    dragStart: null,
  };
}
