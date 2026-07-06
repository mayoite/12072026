import type { Open3dProject } from "../model/types";
import {
  applyOpen3dProjectAction,
  type Open3dProjectAction,
  applyOpen3dProjectTransaction,
} from "../model/actions/projectActions";

export interface Open3dHistoryState {
  past: Open3dProject[];
  present: Open3dProject;
  future: Open3dProject[];
  dragStart: Open3dProject | null;
}

export function dispatchOpen3dTransaction(
  history: Open3dHistoryState,
  actions: readonly Open3dProjectAction[],
  now?: string,
): Open3dHistoryState {
  if (actions.length === 0) return history;
  const next = applyOpen3dProjectTransaction(history.present, actions, now);
  if (next === history.present) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: [],
    dragStart: null,
  };
}

export function createOpen3dHistory(project: Open3dProject): Open3dHistoryState {
  return { past: [], present: project, future: [], dragStart: null };
}

export function dispatchOpen3dAction(
  history: Open3dHistoryState,
  action: Open3dProjectAction,
  now?: string,
): Open3dHistoryState {
  const next = applyOpen3dProjectAction(history.present, action, now);
  if (next === history.present) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: [],
    dragStart: null,
  };
}

export function undoOpen3dAction(history: Open3dHistoryState): Open3dHistoryState {
  const previous = history.past.at(-1);
  if (!previous) return history;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
    dragStart: null,
  };
}

export function redoOpen3dAction(history: Open3dHistoryState): Open3dHistoryState {
  const next = history.future[0];
  if (!next) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
    dragStart: null,
  };
}

export function beginOpen3dDrag(history: Open3dHistoryState): Open3dHistoryState {
  return { ...history, dragStart: history.present };
}

export function commitOpen3dDrag(
  history: Open3dHistoryState,
  project: Open3dProject,
): Open3dHistoryState {
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
