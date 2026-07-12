import type { PlannerFloor, PlannerFurnitureItem } from "@/features/planner/project/model/types";

import type { CanvasFurnitureKind, CanvasPlacementSummary } from "./types";

function inferKind(item: PlannerFurnitureItem): CanvasFurnitureKind | null {
  const blob = `${item.catalogId} ${item.material ?? ""} ${item.sourceSku ?? ""}`.toLowerCase();

  if (blob.includes("chair") || blob.includes("seat")) {
    return "chair";
  }

  if (
    blob.includes("storage") ||
    blob.includes("cabinet") ||
    blob.includes("locker") ||
    blob.includes("pedestal") ||
    blob.includes("file")
  ) {
    return "storage";
  }

  if (
    blob.includes("desk") ||
    blob.includes("workstation") ||
    blob.includes("bench") ||
    blob.includes("table")
  ) {
    return "workstation";
  }

  return "workstation";
}

function toPlacement(item: PlannerFurnitureItem): CanvasPlacementSummary | null {
  const kind = inferKind(item);
  if (!kind) return null;

  const widthMm = item.width ?? 1200;
  const heightMm = item.depth ?? 600;
  const label = item.sourceSku ?? item.catalogId;

  return {
    shapeId: item.id,
    kind,
    label,
    widthMm,
    heightMm,
    catalogItemId: item.sourceCatalogId ?? item.catalogId,
  };
}

export function extractProjectPlacements(floor: PlannerFloor | null | undefined): CanvasPlacementSummary[] {
  if (!floor) return [];

  return floor.furniture
    .map((item) => toPlacement(item))
    .filter((placement): placement is CanvasPlacementSummary => placement !== null);
}
