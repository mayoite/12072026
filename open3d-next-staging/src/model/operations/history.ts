import type { Open3dProject } from "../types";

export interface HistoryEntry {
  state: Open3dProject;
  description: string;
  timestamp: number;
}

export interface HistoryState {
  past: HistoryEntry[];
  present: Open3dProject;
  future: HistoryEntry[];
  maxHistory: number;
}

export function createHistoryState(project: Open3dProject, maxHistory = 50): HistoryState {
  return {
    past: [],
    present: JSON.parse(JSON.stringify(project)),
    future: [],
    maxHistory,
  };
}

export function pushHistory(state: HistoryState, description: string, now: number = Date.now()): HistoryState {
  const newPast = [...state.past, { state: JSON.parse(JSON.stringify(state.present)), description, timestamp: now }];
  if (newPast.length > state.maxHistory) {
    newPast.shift();
  }
  return {
    past: newPast,
    present: state.present,
    future: [],
    maxHistory: state.maxHistory,
  };
}

export function updatePresent(state: HistoryState, project: Open3dProject): HistoryState {
  return {
    ...state,
    present: JSON.parse(JSON.stringify(project)),
  };
}

export function canUndo(state: HistoryState): boolean {
  return state.past.length > 0;
}

export function undo(state: HistoryState): HistoryState {
  if (!canUndo(state)) return state;
  const prev = state.past[state.past.length - 1];
  const newPast = state.past.slice(0, -1);
  return {
    past: newPast,
    present: JSON.parse(JSON.stringify(prev.state)),
    future: [{ state: JSON.parse(JSON.stringify(state.present)), description: prev.description, timestamp: prev.timestamp }, ...state.future],
    maxHistory: state.maxHistory,
  };
}

export function canRedo(state: HistoryState): boolean {
  return state.future.length > 0;
}

export function redo(state: HistoryState): HistoryState {
  if (!canRedo(state)) return state;
  const next = state.future[0];
  const newFuture = state.future.slice(1);
  return {
    past: [...state.past, { state: JSON.parse(JSON.stringify(state.present)), description: next.description, timestamp: next.timestamp }],
    present: JSON.parse(JSON.stringify(next.state)),
    future: newFuture,
    maxHistory: state.maxHistory,
  };
}

export function jumpToHistoryIndex(state: HistoryState, index: number): HistoryState {
  const totalPast = state.past.length;
  // index is 0-based in past entries. index === totalPast means present.
  if (index < 0 || index > totalPast) return state;
  if (index === totalPast) {
    // Rebuild to present: future should be empty, present should be the latest
    if (state.future.length === 0) return state;
    // Replay all future entries to get to present
    let present = state.present;
    const newPast = [...state.past];
    for (const entry of state.future) {
      newPast.push({ state: JSON.parse(JSON.stringify(present)), description: entry.description, timestamp: entry.timestamp });
      present = JSON.parse(JSON.stringify(entry.state));
    }
    return {
      past: newPast,
      present,
      future: [],
      maxHistory: state.maxHistory,
    };
  }

  // Need to go back (totalPast - index) steps
  const targetState = JSON.parse(JSON.stringify(state.past[index].state));
  const newFuture = [
    ...state.past.slice(index + 1).map((e) => ({
      state: JSON.parse(JSON.stringify(e.state)),
      description: e.description,
      timestamp: e.timestamp,
    })),
    { state: JSON.parse(JSON.stringify(state.present)), description: "Current state", timestamp: Date.now() },
    ...state.future,
  ];
  return {
    past: state.past.slice(0, index),
    present: targetState,
    future: newFuture,
    maxHistory: state.maxHistory,
  };
}

export function getHistoryEntries(state: HistoryState): { description: string; timestamp: number }[] {
  return state.past.map((e) => ({ description: e.description, timestamp: e.timestamp }));
}
