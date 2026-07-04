import { useCallback } from "react";
import type { CatalogItem } from "@/features/planner/catalog/catalogTypes";
import {
  catalogFootprintToCanvasUnits,
  resolveCatalogItemBlock2D,
  resolveCatalogPlacementFootprintMm,
} from "@/features/planner/catalog/catalogBlockBridge";
import {
  isCatalogShapeType,
  isRoomCatalogShapeType,
  PlannerCatalogShapeType,
} from "@/features/planner/catalog/shapeTypeRegistry";
import { blockToSvg } from "@/lib/catalog/blocks2d";

import type { InsertPayload } from "@/features/planner/canvas-fabric/context/FloorplanContext";

type InsertObjectFn = (payload: InsertPayload) => void;

export function usePlannerCatalogPlacement(insertObject: InsertObjectFn) {
  const placeCatalogIntoFabric = useCallback((
    item: CatalogItem & { left?: number; top?: number },
    scene?: { x: number; y: number },
  ) => {
    const footprint = resolveCatalogPlacementFootprintMm(item);
    const { width: widthCu, depth: depthCu } = catalogFootprintToCanvasUnits(footprint);
    const block = resolveCatalogItemBlock2D(item);
    const instanceId = `fi-${item.id}-${Date.now().toString(36)}`;
    const variant = isRoomCatalogShapeType(item.shapeType)
      ? "room"
      : isCatalogShapeType(item.shapeType, PlannerCatalogShapeType.zone)
        ? "zone"
        : "furniture";
    insertObject({
      type: "GENERIC",
      object: {
        id: instanceId,
        catalogItemId: item.id,
        left: scene?.x ?? item.left,
        top: scene?.y ?? item.top,
        name: item.shortName || item.name || "Catalog Item",
        title: item.shortName || item.name || "Catalog Item",
        variant,
        width: widthCu,
        height: depthCu,
        svg: block ? blockToSvg(block) : undefined,
      },
    });
  }, [insertObject]);

  return { placeCatalogIntoFabric };
}
