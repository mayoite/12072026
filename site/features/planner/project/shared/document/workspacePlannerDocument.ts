import {
  createEmptyPlannerDocument,
  type PlannerDocument,
  type PlannerJsonValue,
} from "@/features/planner/model/plannerDocument";
import { toPlannerJsonSafe } from "@/features/planner/model/plannerJsonSafe";
import { metadataToDocumentFields } from "@/features/planner/onboarding/projectSetup";
import { buildPlannerDocumentFromFabric } from "@/features/planner/lib/fabricDocumentBridge";
import { serializeWorkspaceState, usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

function mergeFabricSceneMetadata(
  sceneJson: PlannerJsonValue,
  metadata: Record<string, unknown>,
): PlannerJsonValue {
  if (!sceneJson || typeof sceneJson !== "object" || Array.isArray(sceneJson)) {
    return toPlannerJsonSafe(metadata);
  }

  return toPlannerJsonSafe({
    ...sceneJson,
    ...metadata,
  });
}

/**
 * Build PlannerDocument from live workspace state (cloud-store workspaceStore).
 */
export function buildPlannerDocumentFromEditor(
  _editor: null,
  overrides: Partial<PlannerDocument> = {},
): PlannerDocument {
  const workspace = serializeWorkspaceState();
  const projectMetadata = usePlannerWorkspaceStore.getState().projectMetadata;
  const projectFields = projectMetadata ? metadataToDocumentFields(projectMetadata) : null;

  const base = buildPlannerDocumentFromFabric(null, {
    documentId: overrides.id,
    name: overrides.name,
    projectName: projectFields?.projectName ?? overrides.projectName,
    clientName: projectFields?.clientName ?? overrides.clientName,
    preparedBy: overrides.preparedBy,
    seatTarget: projectFields?.seatTarget ?? overrides.seatTarget,
    unitSystem: workspace.unitSystem === "imperial" ? "ft-in" : "mm",
    thumbnailUrl: overrides.thumbnailUrl,
  });

  const sceneMeta = {
    layerVisible: workspace.layerVisible,
    unitSystem: workspace.unitSystem,
  };

  return {
    ...base,
    ...overrides,
    sceneJson: mergeFabricSceneMetadata(base.sceneJson, sceneMeta),
    projectName: projectFields?.projectName ?? overrides.projectName ?? base.projectName,
    clientName: projectFields?.clientName ?? overrides.clientName ?? base.clientName,
    seatTarget: projectFields?.seatTarget ?? overrides.seatTarget ?? base.seatTarget,
  };
}

export function createBlankPlannerDocument(
  overrides: Partial<PlannerDocument> = {},
): PlannerDocument {
  return {
    ...createEmptyPlannerDocument(),
    ...overrides,
  };
}
