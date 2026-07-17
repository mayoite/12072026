"use client";

import { InventoryPanel } from "./InventoryPanel";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import type { WorkstationConfigV0 } from "@/features/planner/project/catalog/workstationSystemV0";
import type { PlannerWorkspaceCatalogStatus } from "@/features/planner/project/catalog/usePlannerWorkspaceCatalog";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";

export type WorkspaceLeftPanelProps = {
  catalogItems: PlannerCatalogItem[];
  isLoading: boolean;
  catalogStatus: PlannerWorkspaceCatalogStatus;
  onItemPlace: (itemId: string) => void;
  onWorkstationConfigPlace: (config: WorkstationConfigV0) => void;
  onWorkstationConfigBatchPlace: (config: WorkstationConfigV0, count: number) => void;
  displayUnit?: PlannerDisplayUnit;
};

export function WorkspaceLeftPanel({
  catalogItems,
  isLoading,
  catalogStatus,
  onItemPlace,
  onWorkstationConfigPlace,
  onWorkstationConfigBatchPlace,
  displayUnit = "cm",
}: WorkspaceLeftPanelProps) {
  return (
    <InventoryPanel
      catalogItems={catalogItems}
      isLoading={isLoading}
      catalogStatus={catalogStatus}
      onItemPlace={onItemPlace}
      onWorkstationConfigPlace={onWorkstationConfigPlace}
      onWorkstationConfigBatchPlace={onWorkstationConfigBatchPlace}
      displayUnit={displayUnit}
    />
  );
}
