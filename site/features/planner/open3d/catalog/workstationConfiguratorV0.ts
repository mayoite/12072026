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
  const modules: WorkstationModuleKindV0[] = ["desk", ...draft.toggledModules];
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
