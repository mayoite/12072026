import type { RoomPreset } from "@/features/planner/catalog/roomPresets";

/**
 * Archive fabric runtime removed.
 * Room presets apply through open3d project model (P11/onboarding) — not a deleted shell.
 */
export function applyRoomPreset(_editor: null, _preset: RoomPreset): void {
  // no-op until wired to OOPlannerWorkspace / Open3dProject
}
