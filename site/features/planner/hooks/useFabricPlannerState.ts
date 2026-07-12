"use client";

/**
 * Archive fabric runtime removed.
 * Metrics/selection for open3d come from Open3dProject / workspace — not deleted shell.
 */

export type PlanMetrics = {
  wallCount: number;
  furnitureCount: number;
  roomAreaSqm: number;
  zoneAreaSqm: number;
};

const EMPTY_METRICS: PlanMetrics = {
  wallCount: 0,
  furnitureCount: 0,
  roomAreaSqm: 0,
  zoneAreaSqm: 0,
};

export function useFabricPlanMetrics(): PlanMetrics {
  return EMPTY_METRICS;
}

export function useFabricSelectionStatus(): string | null {
  return null;
}
