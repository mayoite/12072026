import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildPlanner3DSceneDocument } from "@/features/planner/3d/types";
import { usePlannerCatalogStore } from "@/features/planner/catalog-api/catalogStore";
import { buildPlannerDocumentFromEditor } from "@/features/planner/shared/document/workspacePlannerDocument";
import {
  buildPlannerDocumentFromFabric,
  getFabricSnapshotFromDocument,
  loadPlannerDocumentIntoFabric,
} from "@/features/planner/lib/fabricDocumentBridge";
import { createPlannerExportPayload } from "@/features/planner/lib/sessionState";
import { getPlannerSceneEnvelope, normalizePlannerDocument } from "@/features/planner/model";
import { applyProjectSetup } from "@/features/planner/onboarding/projectSetup";
import { usePlannerWorkspaceStore } from "@/features/planner/cloud-store/workspaceStore";

function fabricSnapshotFromObjects(
  objects: Array<Record<string, string | number>>,
): string {
  return JSON.stringify({ objects });
}

describe("planner document editor bridge", () => {
  beforeEach(() => {
    usePlannerWorkspaceStore.setState((state) => ({
      ...state,
      unitSystem: "metric",
      projectMetadata: null,
    }));
    usePlannerCatalogStore.setState((state) => ({
      ...state,
      purposeFilter: null,
    }));
  });

  it("stores fabric snapshot on the scene envelope for downstream consumers", () => {
    const serialized = fabricSnapshotFromObjects([
      { name: "GENERIC:Desk", left: 10, top: 10, width: 120, height: 60 },
    ]);

    const document = buildPlannerDocumentFromFabric(serialized, {
      unitSystem: "mm",
      name: "Workspace Plan",
    });
    const scene = getPlannerSceneEnvelope(document.sceneJson);
    const viewerScene = buildPlanner3DSceneDocument(document);

    expect(document.itemCount).toBe(0);
    expect(scene?.items).toEqual([]);
    expect(viewerScene.items).toHaveLength(0);
    expect(getFabricSnapshotFromDocument(document)).toContain('"name":"GENERIC:Desk"');
  });

  it("preserves project setup metadata through export/import", () => {
    applyProjectSetup({
      projectName: "TVS Bihar Office",
      city: "Patna",
      floorAreaSqFt: 5000,
      primaryPurpose: "workstations",
      seatTarget: 42,
      completedAt: "2026-06-21T10:30:00.000Z",
    });

    const document = buildPlannerDocumentFromEditor(null, { title: "Local Session A" });
    const normalized = normalizePlannerDocument(createPlannerExportPayload(document));
    const importDraft = vi.fn(async () => undefined);

    expect(loadPlannerDocumentIntoFabric(importDraft, normalized)).toBe(false);
    expect(normalized.projectName).toBe("TVS Bihar Office");
    expect(normalized.clientName).toBe("Patna");
    expect(normalized.seatTarget).toBe(42);
    expect(importDraft).not.toHaveBeenCalled();
  });

  it("merges workspace layer visibility into exported scene metadata", () => {
    usePlannerWorkspaceStore.setState((state) => ({
      ...state,
      layerVisible: {
        ...state.layerVisible,
        walls: false,
      },
    }));

    const document = buildPlannerDocumentFromEditor(null, { title: "Layer test" });
    const scene = getPlannerSceneEnvelope(document.sceneJson) as
      | (ReturnType<typeof getPlannerSceneEnvelope> & {
          layerVisible?: { walls?: boolean };
        })
      | null;

    expect(scene?.layerVisible?.walls).toBe(false);
  });
});
