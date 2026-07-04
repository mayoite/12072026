import { useCallback, useEffect } from "react";
import { usePlannerStore } from "@/features/planner/store/plannerStore";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import {
  getDefaultPlacementCatalogItemId,
  isFurniturePlacementCatalogItem,
} from "@/features/planner/catalog/placementCatalogResolver";
import {
  isCatalogShapeType,
  isRoomCatalogShapeType,
  PlannerCatalogShapeType,
} from "@/features/planner/catalog/shapeTypeRegistry";
import { buildTemplateCanvasPlacements, type LayoutTemplate } from "@/features/planner/templates/layoutTemplates";
import type { InsertPayload } from "@/features/planner/canvas-fabric/context/FloorplanContext";
import {
  getStepLeftTab,
  getStepToolBinding,
  type PlannerLeftTab,
} from "@/features/planner/editor/plannerStepBindings";
import { type PlannerStep } from "@/features/planner/editor/plannerStep";
import {
  resolvePlannerToolKey,
  type PlannerToolBinding,
} from "@/features/planner/editor/plannerKeyboardShortcuts";

type UsePlannerWorkspaceToolingOptions = {
  applyStepLayout: (step: PlannerStep) => void;
  insertObject: (payload: InsertPayload) => void;
  isTemplateOpen: boolean;
  leftOpen: boolean;
  placeCatalogIntoFabric: (
    item: CatalogItem & { left?: number; top?: number },
    scene?: { x: number; y: number },
  ) => void;
  recordRecentPlacement: (catalogItemId: string) => void;
  setIsTemplateOpen: (open: boolean) => void;
  setLeftOpen: (open: boolean) => void;
  setLeftTab: (tab: PlannerLeftTab) => void;
  setPlannerStep: (step: PlannerStep) => void;
  setSessionStatusMessage: (message: string | null) => void;
  setViewMode: React.Dispatch<React.SetStateAction<"2d" | "3d" | "split">>;
  shapeCount: number;
};

export function usePlannerWorkspaceTooling({
  applyStepLayout,
  insertObject,
  isTemplateOpen,
  leftOpen,
  placeCatalogIntoFabric,
  recordRecentPlacement,
  setIsTemplateOpen,
  setLeftOpen,
  setLeftTab,
  setPlannerStep,
  setSessionStatusMessage,
  setViewMode,
  shapeCount,
}: UsePlannerWorkspaceToolingOptions) {
  const setPlannerTool = usePlannerStore((s) => s.setTool);
  const setActiveCatalogId = usePlannerStore((s) => s.setActiveCatalogId);

  const applyToolBinding = useCallback((binding: PlannerToolBinding) => {
    if (binding.plannerTool === "furniture" && !usePlannerStore.getState().activeCatalogId) {
      const defaultCatalogId = getDefaultPlacementCatalogItemId();
      if (defaultCatalogId) {
        setActiveCatalogId(defaultCatalogId);
        recordRecentPlacement(defaultCatalogId);
      }
      setLeftTab("library");
      if (!leftOpen) {
        setLeftOpen(true);
      }
    }

    setPlannerTool(binding.plannerTool);
  }, [leftOpen, recordRecentPlacement, setActiveCatalogId, setLeftOpen, setLeftTab, setPlannerTool]);

  const syncPlannerStep = useCallback((step: PlannerStep) => {
    setPlannerStep(step);
    setLeftTab(getStepLeftTab(step));
    applyToolBinding(getStepToolBinding(step));
    applyStepLayout(step);
  }, [applyStepLayout, applyToolBinding, setLeftTab, setPlannerStep]);

  const handlePlannerStepChange = useCallback((step: PlannerStep) => {
    syncPlannerStep(step);
  }, [syncPlannerStep]);

  const handleCatalogItemClick = useCallback((item: CatalogItem) => {
    if (isFurniturePlacementCatalogItem(item)) {
      placeCatalogIntoFabric(item);
      recordRecentPlacement(item.id);
      return;
    }

    if (isRoomCatalogShapeType(item.shapeType)) {
      applyToolBinding({ toolId: "planner-room", plannerTool: "room" });
    } else if (isCatalogShapeType(item.shapeType, PlannerCatalogShapeType.zone)) {
      applyToolBinding({ toolId: "planner-zone", plannerTool: "zone" });
    }
  }, [applyToolBinding, placeCatalogIntoFabric, recordRecentPlacement]);

  const handleApplyTemplate = useCallback((template: LayoutTemplate) => {
    if (shapeCount > 0) {
      const confirmed = window.confirm(
        `Applying "${template.name}" will replace your current ${shapeCount} object${shapeCount !== 1 ? "s" : ""}. Continue?`,
      );
      if (!confirmed) return;
    }

    const roomWidthCm = template.recommendedRoomSize.minWidth;
    const roomHeightCm = template.recommendedRoomSize.minHeight;
    insertObject({
      type: "ROOM",
      object: {
        title: template.name,
        width: roomWidthCm,
        height: roomHeightCm,
      },
    });

    for (const shape of buildTemplateCanvasPlacements(template)) {
      placeCatalogIntoFabric({
        id: shape.id,
        name: shape.label,
        shortName: shape.label,
        category: "equipment",
        shapeType: shape.type,
        widthMm: shape.width,
        heightMm: shape.height,
        depthMm: shape.height,
        description: `${template.name} — ${shape.label}`,
        tags: [],
        left: shape.left,
        top: shape.top,
      });
    }

    setIsTemplateOpen(false);
    setSessionStatusMessage(`Applied template: ${template.name}`);
  }, [insertObject, placeCatalogIntoFabric, setIsTemplateOpen, setSessionStatusMessage, shapeCount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const binding = resolvePlannerToolKey(e);
      if (binding) {
        e.preventDefault();
        applyToolBinding(binding);
        return;
      }

      if (e.key === "Escape" && isTemplateOpen) {
        setIsTemplateOpen(false);
      }
      if (e.ctrlKey && e.key === "Tab") {
        e.preventDefault();
        setViewMode((prev) => (prev === "2d" ? "3d" : "2d"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [applyToolBinding, isTemplateOpen, setIsTemplateOpen, setViewMode]);

  return {
    applyToolBinding,
    handleApplyTemplate,
    handleCatalogItemClick,
    handlePlannerStepChange,
    syncPlannerStep,
  };
}
