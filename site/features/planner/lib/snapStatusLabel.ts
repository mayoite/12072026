/**
 * Human-readable snap indicator for the planner status bar.
 * Matches Floorplanner/RoomSketcher-class expectation: users see whether
 * grid and object snapping are active, not a placeholder.
 */
export function buildSnapStatusLabel(snapEnabled: boolean, gridEnabled: boolean): string {
  if (!snapEnabled) {
    return "Off";
  }
  if (gridEnabled) {
    return "Grid + Objects";
  }
  return "Objects";
}

export function isSnapStatusActive(label: string): boolean {
  return label !== "Off" && label !== "Pending";
}
