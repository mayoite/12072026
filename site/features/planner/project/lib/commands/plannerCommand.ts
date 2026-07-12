import type {
  PlannerEntityCollection,
  PlannerProjectAction,
} from "../../model/actions/projectActions";
import type { PlannerProject } from "../../model/types";
import {
  dispatchPlannerAction,
  dispatchPlannerTransaction,
  redoPlannerAction,
  type PlannerHistoryState,
  undoPlannerAction,
  updatePlannerProject,
} from "../../store/history";

export type PlannerCommand =
  | { type: "document.apply"; action: PlannerProjectAction; now?: string }
  | { type: "document.transaction"; actions: readonly PlannerProjectAction[]; now?: string }
  | {
      type: "document.update";
      updater: (project: PlannerProject) => PlannerProject;
      now?: string;
    }
  | { type: "history.undo" }
  | { type: "history.redo" };

export type PlannerCommandResult =
  | { status: "applied"; history: PlannerHistoryState }
  | { status: "noop"; history: PlannerHistoryState }
  | {
      status: "rejected";
      reason: "locked-item";
      collection: PlannerEntityCollection;
      entityId: string;
      history: PlannerHistoryState;
    };

function mutationTarget(
  project: PlannerProject,
  action: PlannerProjectAction,
): "add" | "missing" | "unlocked" | "locked" {
  if (action.type === "add") return "add";
  const floor = project.floors.find((candidate) => candidate.id === project.activeFloorId);
  const entity = floor?.[action.collection].find((candidate) => candidate.id === action.id);
  if (!entity) return "missing";
  return "locked" in entity && entity.locked === true ? "locked" : "unlocked";
}

export function executePlannerCommand(
  history: PlannerHistoryState,
  command: PlannerCommand,
): PlannerCommandResult {
  if (command.type === "history.undo") {
    const next = undoPlannerAction(history);
    return { status: next === history ? "noop" : "applied", history: next };
  }
  if (command.type === "history.redo") {
    const next = redoPlannerAction(history);
    return { status: next === history ? "noop" : "applied", history: next };
  }

  if (command.type === "document.update") {
    const next = updatePlannerProject(history, command.updater, command.now);
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
    ? dispatchPlannerAction(history, command.action, command.now)
    : dispatchPlannerTransaction(history, command.actions, command.now);
  return { status: next === history ? "noop" : "applied", history: next };
}
