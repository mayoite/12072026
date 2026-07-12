import type { Open3dFloor } from "@/features/planner/project/model/types";

/** Layer categories aligned with donor LayersPanel.svelte */
export type Open3dLayerCategory =
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

export type Open3dLayerVisibility = Record<Open3dLayerCategory, boolean>;

export const DEFAULT_LAYER_VISIBILITY: Open3dLayerVisibility = {
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
  current: Open3dLayerVisibility,
  category: Open3dLayerCategory,
): Open3dLayerVisibility {
  return { ...current, [category]: !current[category] };
}

export interface LayerCategorySummary {
  key: Open3dLayerCategory;
  label: string;
  count: number;
}

const LAYER_LABELS: Record<Open3dLayerCategory, string> = {
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

export function summarizeFloorLayers(floor: Open3dFloor): LayerCategorySummary[] {
  const counts: Record<Open3dLayerCategory, number> = {
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

  return (Object.keys(LAYER_LABELS) as Open3dLayerCategory[]).map((key) => ({
    key,
    label: LAYER_LABELS[key],
    count: counts[key],
  }));
}
