import { buildPlannerDocumentFromFabric } from "@/features/planner/lib/fabricDocumentBridge";
import {
  type PlannerDocument,
  type PlannerSceneEnvelope,
  type PlannerSceneItem,
  type PlannerSceneRoom,
  getPlannerSceneEnvelope,
  isPlannerSceneEnvelope,
} from "../model";
import type { MeasurementUnit } from "./measurements";

export type { PlannerSceneEnvelope, PlannerSceneItem, PlannerSceneRoom };
export { getPlannerSceneEnvelope, isPlannerSceneEnvelope };

export interface BuildPlannerDocumentFromEditorOptions {
  documentId?: string | null;
  name?: string;
  projectName?: string | null;
  clientName?: string | null;
  preparedBy?: string | null;
  seatTarget?: number;
  unitSystem: MeasurementUnit;
  thumbnailUrl?: string | null;
}

/** @deprecated Archive fabric runtime removed — builds empty snapshot document. */
export function buildPlannerDocumentFromEditor(
  _editor: null,
  options: BuildPlannerDocumentFromEditorOptions,
): PlannerDocument {
  return buildPlannerDocumentFromFabric(null, {
    documentId: options.documentId,
    name: options.name,
    projectName: options.projectName,
    clientName: options.clientName,
    preparedBy: options.preparedBy,
    seatTarget: options.seatTarget,
    unitSystem: options.unitSystem,
    thumbnailUrl: options.thumbnailUrl,
  });
}

/** @deprecated Always false — no archive editor load path. */
export function loadPlannerDocumentIntoEditor(_editor: null, _document: PlannerDocument): boolean {
  return false;
}
