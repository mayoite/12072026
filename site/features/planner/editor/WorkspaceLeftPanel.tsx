"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { InventoryPanel } from "./InventoryPanel";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";
import type { WorkstationConfigV0 } from "@/features/planner/catalog/workstationSystemV0";
import type { PlannerWorkspaceCatalogStatus } from "@/features/planner/catalog/usePlannerWorkspaceCatalog";
import type { PlannerDisplayUnit } from "@/features/planner/model/types";

export type WorkspaceLeftPanelProps = {
  catalogItems: PlannerCatalogItem[];
  isLoading: boolean;
  catalogStatus: PlannerWorkspaceCatalogStatus;
  onItemPlace: (itemId: string) => void;
  onWorkstationConfigPlace: (config: WorkstationConfigV0) => void;
  onWorkstationConfigBatchPlace: (config: WorkstationConfigV0, count: number) => void;
  displayUnit?: PlannerDisplayUnit;
  /** Optional override; defaults to inbound `siteProduct` query. */
  focusProductSlug?: string | null;
};

type InventoryBridgeProps = Omit<WorkspaceLeftPanelProps, "focusProductSlug"> & {
  focusProductSlug?: string | null;
};

function InventoryWithSiteProductFocus({
  catalogItems,
  isLoading,
  catalogStatus,
  onItemPlace,
  onWorkstationConfigPlace,
  onWorkstationConfigBatchPlace,
  displayUnit = "mm",
  focusProductSlug,
}: InventoryBridgeProps) {
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("siteProduct");
  const resolvedFocus =
    typeof focusProductSlug === "string" && focusProductSlug.trim().length > 0
      ? focusProductSlug.trim()
      : typeof fromUrl === "string" && fromUrl.trim().length > 0
        ? fromUrl.trim()
        : null;

  return (
    <InventoryPanel
      catalogItems={catalogItems}
      isLoading={isLoading}
      catalogStatus={catalogStatus}
      onItemPlace={onItemPlace}
      onWorkstationConfigPlace={onWorkstationConfigPlace}
      onWorkstationConfigBatchPlace={onWorkstationConfigBatchPlace}
      displayUnit={displayUnit}
      focusProductSlug={resolvedFocus}
    />
  );
}

export function WorkspaceLeftPanel({
  catalogItems,
  isLoading,
  catalogStatus,
  onItemPlace,
  onWorkstationConfigPlace,
  onWorkstationConfigBatchPlace,
  displayUnit = "mm",
  focusProductSlug = null,
}: WorkspaceLeftPanelProps) {
  const shared = {
    catalogItems,
    isLoading,
    catalogStatus,
    onItemPlace,
    onWorkstationConfigPlace,
    onWorkstationConfigBatchPlace,
    displayUnit,
  };

  return (
    <Suspense
      fallback={
        <InventoryPanel
          {...shared}
          focusProductSlug={focusProductSlug}
        />
      }
    >
      <InventoryWithSiteProductFocus
        {...shared}
        focusProductSlug={focusProductSlug}
      />
    </Suspense>
  );
}
