import { useCallback, useEffect, useMemo } from "react";
import {
  createPlannerFabricRuntimeCleanup,
  setPlannerFabricRuntime,
  setPlannerFabricRuntimeState,
  useFloorplan,
} from "@/features/planner/canvas-fabric";
import { applyLayerVisibility } from "@/features/planner/editor/layerVisibility";
import { usePlannerFabricAutosave } from "@/features/planner/hooks/usePlannerFabricAutosave";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import type { PlannerLayerCategory } from "@/features/planner/store/workspaceStore";

type UsePlannerFabricDraftOptions = {
  layerVisible: Record<PlannerLayerCategory, boolean>;
  placeCatalogIntoFabric: (
    item: CatalogItem & { left?: number; top?: number },
    scene?: { x: number; y: number },
  ) => void;
  guestMode: boolean;
  planId?: string;
  shellVisible: boolean;
};

export function usePlannerFabricDraft({
  layerVisible,
  placeCatalogIntoFabric,
  guestMode,
  planId,
  shellVisible,
}: UsePlannerFabricDraftOptions) {
  const {
    exportDraft,
    importDraft,
    exportSvg,
    exportPngBlob,
    insertObject,
    setLayerVisibility,
    resizeObject,
    editRoom,
    endEditRoom,
    fitToContent,
    clientToSceneUnits,
    setFloorPlanUnderlay,
    redoStates,
    roomEditRedoStates,
    roomEditStates,
    states,
    selections,
  } = useFloorplan();

  const fabricRevisionKey = useMemo(
    () => `${states.length}:${redoStates.length}:${roomEditStates.length}:${roomEditRedoStates.length}`,
    [redoStates.length, roomEditRedoStates.length, roomEditStates.length, states.length],
  );

  const fabricSerializedDraft = useMemo(() => {
    void fabricRevisionKey;
    return exportDraft();
  }, [exportDraft, fabricRevisionKey]);

  const exportFabricDraft = useCallback(() => fabricSerializedDraft, [fabricSerializedDraft]);

  const autosave = usePlannerFabricAutosave(exportFabricDraft, guestMode, planId, fabricRevisionKey, {
    enabled: shellVisible,
  });

  useEffect(() => {
    setPlannerFabricRuntime({
      exportDraft,
      importDraft,
      exportSvg,
      exportPngBlob,
      placeCatalogItem: placeCatalogIntoFabric as (item: CatalogItem) => void,
      insertObject,
      setLayerVisibility,
      resizeObject,
      editRoom,
      endEditRoom,
      fitToContent,
      clientToSceneUnits,
      setFloorPlanUnderlay,
    });
    return createPlannerFabricRuntimeCleanup();
  }, [
    clientToSceneUnits,
    editRoom,
    endEditRoom,
    exportDraft,
    exportPngBlob,
    exportSvg,
    fitToContent,
    importDraft,
    insertObject,
    placeCatalogIntoFabric,
    resizeObject,
    setFloorPlanUnderlay,
    setLayerVisibility,
  ]);

  useEffect(() => {
    setPlannerFabricRuntimeState({
      serializedDraft: fabricSerializedDraft,
      selections,
      layerVisible,
    });
    applyLayerVisibility(null, layerVisible);
  }, [fabricSerializedDraft, layerVisible, selections]);

  const shapeCount = useMemo(() => {
    if (!fabricSerializedDraft) return 0;
    try {
      const state = JSON.parse(fabricSerializedDraft) as { objects?: unknown[] };
      return state.objects?.length ?? 0;
    } catch {
      return 0;
    }
  }, [fabricSerializedDraft]);

  return {
    fabricRevisionKey,
    fabricSerializedDraft,
    exportFabricDraft,
    importDraft,
    exportDraft,
    setFloorPlanUnderlay,
    fitToContent,
    shapeCount,
    ...autosave,
  };
}
