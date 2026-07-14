import { beforeEach, describe, expect, it } from "vitest";
import {
  PLANNER_LAYER_CATEGORIES,
  hydrateWorkspaceState,
  serializeWorkspaceState,
  usePlannerWorkspaceStore,
} from "@/features/planner/cloud-store/workspaceStore";

describe("workspaceStore", () => {
  beforeEach(() => {
    usePlannerWorkspaceStore.setState({
      layerVisible: {
        walls: true,
        rooms: true,
        zones: true,
        furniture: true,
        measurements: true,
      },
      unitSystem: "metric",
      projectMetadata: null,
      plannerStep: "draw",
      pendingBootstrapLayout: null,
    });
  });

  it("lists all planner layer categories", () => {
    expect(PLANNER_LAYER_CATEGORIES).toEqual([
      "walls",
      "rooms",
      "zones",
      "furniture",
      "measurements",
    ]);
  });

  it("toggles and sets layer visibility", () => {
    usePlannerWorkspaceStore.getState().toggleLayer("furniture");
    expect(usePlannerWorkspaceStore.getState().layerVisible.furniture).toBe(false);
    usePlannerWorkspaceStore.getState().setLayerVisible("furniture", true);
    expect(usePlannerWorkspaceStore.getState().layerVisible.furniture).toBe(true);
  });

  it("serializes and hydrates unit system and layers", () => {
    usePlannerWorkspaceStore.getState().setUnitSystem("imperial");
    usePlannerWorkspaceStore.getState().setLayerVisible("walls", false);
    const snap = serializeWorkspaceState();
    expect(snap.unitSystem).toBe("imperial");
    expect(snap.layerVisible.walls).toBe(false);

    usePlannerWorkspaceStore.getState().setUnitSystem("metric");
    usePlannerWorkspaceStore.getState().setLayerVisible("walls", true);
    hydrateWorkspaceState(snap);
    expect(usePlannerWorkspaceStore.getState().unitSystem).toBe("imperial");
    expect(usePlannerWorkspaceStore.getState().layerVisible.walls).toBe(false);
  });

  it("stores planner step and project metadata", () => {
    usePlannerWorkspaceStore.getState().setPlannerStep("place");
    expect(usePlannerWorkspaceStore.getState().plannerStep).toBe("place");
    usePlannerWorkspaceStore.getState().setProjectMetadata({
      projectName: "HQ",
      city: "Mumbai",
      floorAreaSqFt: 1200,
      primaryPurpose: "workstations",
      seatTarget: 24,
      completedAt: "2026-07-13T12:00:00.000Z",
    });
    expect(usePlannerWorkspaceStore.getState().projectMetadata).toMatchObject({
      projectName: "HQ",
      city: "Mumbai",
    });
  });
});
