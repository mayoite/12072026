import type { PlannerFloor } from "@/features/planner/model/types";

/** Layer categories aligned with donor LayersPanel.svelte */
export type PlannerLayerCategory =
  | "walls"
  | "doors"
  | "windows"
  | "furniture"
  | "stairs"
  | "columns"
  | "guides"
  | "measurements"
  | "annotations"
  | "rooms";

export type PlannerLayerVisibility = Record<PlannerLayerCategory, boolean>;

export const DEFAULT_LAYER_VISIBILITY: PlannerLayerVisibility = {
  walls: true,
  doors: true,
  windows: true,
  furniture: true,
  stairs: true,
  columns: true,
  guides: true,
  measurements: true,
  annotations: true,
  rooms: true,
};

export function toggleLayerVisibility(
  current: PlannerLayerVisibility,
  category: PlannerLayerCategory,
): PlannerLayerVisibility {
  return { ...current, [category]: !current[category] };
}

export interface LayerCategorySummary {
  key: PlannerLayerCategory;
  label: string;
  count: number;
}

const LAYER_LABELS: Record<PlannerLayerCategory, string> = {
  walls: "Walls",
  doors: "Doors",
  windows: "Windows",
  furniture: "Furniture",
  stairs: "Stairs",
  columns: "Columns",
  guides: "Guides",
  measurements: "Measurements",
  annotations: "Annotations",
  rooms: "Rooms",
};

export function summarizeFloorLayers(floor: PlannerFloor): LayerCategorySummary[] {
  const counts: Record<PlannerLayerCategory, number> = {
    walls: floor.walls.length,
    doors: floor.doors.length,
    windows: floor.windows.length,
    furniture: floor.furniture.length,
    stairs: floor.stairs.length,
    columns: floor.columns.length,
    guides: floor.guides.length,
    measurements: floor.measurements.length,
    annotations: floor.annotations.length + floor.textAnnotations.length,
    rooms: floor.rooms.length,
  };

  return (Object.keys(LAYER_LABELS) as PlannerLayerCategory[]).map((key) => ({
    key,
    label: LAYER_LABELS[key],
    count: counts[key],
  }));
}
