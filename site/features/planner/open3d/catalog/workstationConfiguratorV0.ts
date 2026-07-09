/**
 * Systems v0 configurator draft — free size/shape/module combos (not fixed 8 SKUs).
 * Pure state → WorkstationConfigV0 for place/BOQ.
 */

import {
  WORKSTATION_V0_DEFAULT_HEIGHT_MM,
  WORKSTATION_V0_SIZE_GRID,
  createWorkstationConfigV0,
  normalizeModules,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
  type WorkstationModuleKindV0,
  type WorkstationShapeV0,
  type WorkstationSizeMm,
} from "./workstationSystemV0";

/** Modules the buyer may toggle (desk always required; return forced on L). */
export const WORKSTATION_V0_TOGGLE_MODULES: readonly WorkstationModuleKindV0[] = [
  "pedestal",
  "panel",
  "overhead",
] as const;

/**
 * Configurator panel batch seat counts (Place N seats via placeWorkstationInstancesOnProject).
 * Kept small for UX; pure layout already supports larger N in tests.
 */
export const WORKSTATION_V0_BATCH_PLACE_COUNTS = [2, 4, 10] as const;

export type WorkstationV0BatchPlaceCount =
  (typeof WORKSTATION_V0_BATCH_PLACE_COUNTS)[number];

export function isWorkstationV0BatchPlaceCount(
  n: number,
): n is WorkstationV0BatchPlaceCount {
  return (WORKSTATION_V0_BATCH_PLACE_COUNTS as readonly number[]).includes(n);
}

export function batchPlaceButtonLabel(count: number): string {
  return `Place ${count} seats`;
}

export type WorkstationConfiguratorDraftV0 = {
  shape: WorkstationShapeV0;
  size: WorkstationSizeMm;
  /** Optional modules (desk/return applied via normalizeModules). */
  toggledModules: readonly WorkstationModuleKindV0[];
  heightMm: number;
};

export function defaultWorkstationConfiguratorDraftV0(): WorkstationConfiguratorDraftV0 {
  return {
    shape: "linear",
    size: { ...WORKSTATION_V0_SIZE_GRID[0]! },
    toggledModules: ["pedestal", "panel"],
    heightMm: WORKSTATION_V0_DEFAULT_HEIGHT_MM,
  };
}

export function setConfiguratorShape(
  draft: WorkstationConfiguratorDraftV0,
  shape: WorkstationShapeV0,
): WorkstationConfiguratorDraftV0 {
  return { ...draft, shape };
}

export function setConfiguratorSize(
  draft: WorkstationConfiguratorDraftV0,
  size: WorkstationSizeMm,
): WorkstationConfiguratorDraftV0 {
  return {
    ...draft,
    size: {
      lengthMm: size.lengthMm,
      depthMm: size.depthMm,
    },
  };
}

export function toggleConfiguratorModule(
  draft: WorkstationConfiguratorDraftV0,
  module: WorkstationModuleKindV0,
): WorkstationConfiguratorDraftV0 {
  if (module === "desk" || module === "return") {
    // Controlled by shape / normalize — ignore direct toggle
    return draft;
  }
  if (!WORKSTATION_V0_TOGGLE_MODULES.includes(module)) {
    return draft;
  }
  const has = draft.toggledModules.includes(module);
  const toggledModules = has
    ? draft.toggledModules.filter((m) => m !== module)
    : [...draft.toggledModules, module];
  return { ...draft, toggledModules };
}

/**
 * Resolve draft → full config (desk always; return on L; toggles for pedestal/panel/overhead).
 */
export function resolveWorkstationConfigFromDraft(
  draft: WorkstationConfiguratorDraftV0,
): WorkstationConfigV0 {
  // Only allowlisted toggles (desk/return come from shape / normalize).
  const seen = new Set<WorkstationModuleKindV0>();
  const toggled: WorkstationModuleKindV0[] = [];
  for (const mod of draft.toggledModules) {
    if (!WORKSTATION_V0_TOGGLE_MODULES.includes(mod)) continue;
    if (seen.has(mod)) continue;
    seen.add(mod);
    toggled.push(mod);
  }
  const modules: WorkstationModuleKindV0[] = ["desk", ...toggled];
  return createWorkstationConfigV0({
    shape: draft.shape,
    size: draft.size,
    modules: normalizeModules(draft.shape, modules),
    heightMm: draft.heightMm,
  });
}

export function configuratorPreview(draft: WorkstationConfiguratorDraftV0): {
  config: WorkstationConfigV0;
  catalogId: string;
  footprint: { widthMm: number; depthMm: number };
  sizeLabel: string;
  shapeLabel: string;
  modulesLabel: string;
} {
  const config = resolveWorkstationConfigFromDraft(draft);
  const footprint = workstationFootprintMm(config);
  return {
    config,
    catalogId: workstationConfigKey(config),
    footprint,
    sizeLabel: `${config.size.lengthMm}×${config.size.depthMm}`,
    shapeLabel: config.shape === "l-shape" ? "L-shape" : "Linear",
    modulesLabel: config.modules.join(", "),
  };
}

export function sizeGridLabel(size: WorkstationSizeMm): string {
  return `${size.lengthMm}×${size.depthMm}`;
}

export function isSameSize(
  a: WorkstationSizeMm,
  b: WorkstationSizeMm,
): boolean {
  return a.lengthMm === b.lengthMm && a.depthMm === b.depthMm;
}

/**
 * Consume-once armed config for canvas place.
 * Clears the bag so a second pointer-up in the same React tick cannot double-place.
 */
export function takePendingWorkstationConfig(bag: {
  current: WorkstationConfigV0 | null;
}): WorkstationConfigV0 | null {
  const config = bag.current;
  bag.current = null;
  return config;
}
