import type {
  Open3dEntityCollection,
  Open3dProjectAction,
} from "../../model/actions/projectActions";
import type { Open3dProject } from "../../model/types";
import {
  dispatchOpen3dAction,
  dispatchOpen3dTransaction,
  redoOpen3dAction,
  type Open3dHistoryState,
  undoOpen3dAction,
} from "../../store/history";

export type PlannerCommand =
  | { type: "document.apply"; action: Open3dProjectAction; now?: string }
  | { type: "document.transaction"; actions: readonly Open3dProjectAction[]; now?: string }
  | { type: "history.undo" }
  | { type: "history.redo" };

export type PlannerCommandResult =
  | { status: "applied"; history: Open3dHistoryState }
  | { status: "noop"; history: Open3dHistoryState }
  | {
      status: "rejected";
      reason: "locked-item";
      collection: Open3dEntityCollection;
      entityId: string;
      history: Open3dHistoryState;
    };

function mutationTarget(
  project: Open3dProject,
  action: Open3dProjectAction,
): "add" | "missing" | "unlocked" | "locked" {
  if (action.type === "add") return "add";
  const floor = project.floors.find((candidate) => candidate.id === project.activeFloorId);
  const entity = floor?.[action.collection].find((candidate) => candidate.id === action.id);
  if (!entity) return "missing";
  return "locked" in entity && entity.locked === true ? "locked" : "unlocked";
}

export function executePlannerCommand(
  history: Open3dHistoryState,
  command: PlannerCommand,
): PlannerCommandResult {
  if (command.type === "history.undo") {
    const next = undoOpen3dAction(history);
    return { status: next === history ? "noop" : "applied", history: next };
  }
  if (command.type === "history.redo") {
    const next = redoOpen3dAction(history);
    return { status: next === history ? "noop" : "applied", history: next };
  }

  const actions = command.type === "document.apply" ? [command.action] : command.actions;
  for (const action of actions) {
    const target = mutationTarget(history.present, action);
    if (target === "locked" && action.type !== "add") {
      return {
        status: "rejected",
        reason: "locked-item",
        collection: action.collection,
        entityId: action.id,
        history,
      };
    }
    if (target === "missing") return { status: "noop", history };
  }

  const next = command.type === "document.apply"
    ? dispatchOpen3dAction(history, command.action, command.now)
    : dispatchOpen3dTransaction(history, command.actions, command.now);
  return { status: next === history ? "noop" : "applied", history: next };
}
