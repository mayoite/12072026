/**
 * Buyer P01 — consume Admin P04 workstation-family contract for place/2D/3D/BOQ.
 */

import {
  driveWorkstationFamily,
  type WorkstationFamilyDrive,
  type WorkstationFamilySelection,
} from "@/features/admin/workstation/workstationFamilyDrive";
import {
  WORKSTATION_FAMILY_V0_FIXTURE,
  type WorkstationFamilyContract,
  type WorkstationFamilyVersion,
} from "@/features/admin/workstation/workstationFamilyContract";
import { requiresMigrationChoice } from "@/features/admin/workstation/workstationFamilyRelease";
import { workstationV0UnitPriceInr } from "@/features/planner/project/catalog/workstationBoqV0";
import {
  generateWorkstationV0MeshPlan,
  type WorkstationV0MeshPlan,
} from "@/features/planner/project/catalog/workstationMeshV0";
import {
  createWorkstationConfigV0,
  normalizeModules,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
  type WorkstationModuleKindV0,
  type WorkstationShapeV0,
} from "./workstationSystemV0";
import type { WorkstationConfiguratorDraftV0 } from "./workstationConfiguratorV0";

const BUYER_TOGGLE_MODULES: readonly WorkstationModuleKindV0[] = [
  "pedestal",
  "panel",
  "overhead",
] as const;

function previewConfigFromDraft(
  draft: WorkstationConfiguratorDraftV0,
): WorkstationConfigV0 {
  const seen = new Set<WorkstationModuleKindV0>();
  const toggled: WorkstationModuleKindV0[] = [];
  for (const mod of draft.toggledModules) {
    if (!BUYER_TOGGLE_MODULES.includes(mod)) continue;
    if (seen.has(mod)) continue;
    seen.add(mod);
    toggled.push(mod);
  }
  return createWorkstationConfigV0({
    shape: draft.shape,
    size: draft.size,
    modules: normalizeModules(draft.shape, ["desk", ...toggled]),
    heightMm: draft.heightMm,
  });
}

/** Default released family contract shipped with planner v0. */
export const BUYER_WORKSTATION_FAMILY_CONTRACT: WorkstationFamilyContract =
  WORKSTATION_FAMILY_V0_FIXTURE;

export type BuyerPlacementAssessment = {
  readonly placeable: boolean;
  readonly reason: string | null;
  readonly versionId: string | null;
  readonly drive: WorkstationFamilyDrive | null;
};

export function topologyIdForShape(shape: WorkstationShapeV0): string {
  return shape === "l-shape" ? "l-4" : "linear-2";
}

export function optionIdsFromDraft(
  version: WorkstationFamilyVersion,
  draft: WorkstationConfiguratorDraftV0,
): string[] {
  const allowed = new Set(version.options.map((entry) => entry.optionId));
  const optionIds: string[] = [];
  for (const moduleKind of draft.toggledModules) {
    if (!BUYER_TOGGLE_MODULES.includes(moduleKind)) continue;
    const match = version.options.find((entry) => entry.module === moduleKind);
    if (!match || !allowed.has(match.optionId)) continue;
    optionIds.push(match.optionId);
  }
  return optionIds;
}

export function draftToFamilySelection(
  version: WorkstationFamilyVersion,
  draft: WorkstationConfiguratorDraftV0,
): WorkstationFamilySelection {
  return {
    topologyId: topologyIdForShape(draft.shape),
    lengthMm: draft.size.lengthMm,
    depthMm: draft.size.depthMm,
    optionIds: optionIdsFromDraft(version, draft),
  };
}

function unsupportedModuleReason(
  version: WorkstationFamilyVersion,
  draft: WorkstationConfiguratorDraftV0,
): string | null {
  const supportedModules = new Set(version.options.map((entry) => entry.module));
  for (const moduleKind of draft.toggledModules) {
    if (!BUYER_TOGGLE_MODULES.includes(moduleKind)) continue;
    if (!supportedModules.has(moduleKind)) {
      return `${moduleKind} is not offered on the active family version`;
    }
  }
  return null;
}

export function assessBuyerPlacement(
  contract: WorkstationFamilyContract,
  draft: WorkstationConfiguratorDraftV0,
): BuyerPlacementAssessment {
  const version = contract.versions.find(
    (entry) => entry.versionId === contract.activeVersionId,
  );
  if (!version || version.status !== "released") {
    return {
      placeable: false,
      reason: "No released active workstation family version",
      versionId: null,
      drive: null,
    };
  }

  const unsupported = unsupportedModuleReason(version, draft);
  if (unsupported) {
    return {
      placeable: false,
      reason: unsupported,
      versionId: version.versionId,
      drive: null,
    };
  }

  const result = driveWorkstationFamily(contract, draftToFamilySelection(version, draft));
  if ("error" in result) {
    return {
      placeable: false,
      reason: result.error,
      versionId: version.versionId,
      drive: null,
    };
  }

  return {
    placeable: true,
    reason: null,
    versionId: version.versionId,
    drive: result,
  };
}

export type BuyerConfiguratorPreview = {
  readonly config: WorkstationConfigV0;
  readonly catalogId: string;
  readonly footprint: { widthMm: number; depthMm: number };
  readonly sizeLabel: string;
  readonly shapeLabel: string;
  readonly modulesLabel: string;
  readonly placeable: boolean;
  readonly placeDisabledReason: string | null;
  readonly familyVersionId: string | null;
  readonly boqUnitPriceInr: number | null;
  readonly meshPlan: WorkstationV0MeshPlan | null;
};

export function buyerConfiguratorPreview(
  contract: WorkstationFamilyContract,
  draft: WorkstationConfiguratorDraftV0,
): BuyerConfiguratorPreview {
  const assessment = assessBuyerPlacement(contract, draft);
  const drive = assessment.drive;
  const config = drive?.config ?? previewConfigFromDraft(draft);
  const footprint = drive?.footprint2d ?? workstationFootprintMm(config);
  const meshPlan = drive?.meshPlan ?? generateWorkstationV0MeshPlan(config);
  const boqUnitPriceInr = drive?.boqUnitPriceInr ?? workstationV0UnitPriceInr(config);

  return {
    config,
    catalogId: workstationConfigKey(config),
    footprint,
    sizeLabel: `${config.size.lengthMm}×${config.size.depthMm}`,
    shapeLabel: config.shape === "l-shape" ? "L-shape" : "Linear",
    modulesLabel: config.modules.join(", "),
    placeable: assessment.placeable,
    placeDisabledReason: assessment.reason,
    familyVersionId: assessment.versionId,
    boqUnitPriceInr: assessment.placeable ? boqUnitPriceInr : null,
    meshPlan: assessment.placeable ? meshPlan : null,
  };
}

export function buyerNeedsMigrationChoice(
  contract: WorkstationFamilyContract,
  nextVersionId: string,
): boolean {
  return requiresMigrationChoice(contract, nextVersionId);
}