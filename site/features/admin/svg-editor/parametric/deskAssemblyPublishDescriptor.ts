import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { DeskAssemblyFields } from "@/features/planner/asset-engine/svg/parametric/deskAssemblyFields";
import { fieldsToDeskAssemblyMakerRecipe } from "@/features/planner/asset-engine/svg/parametric/drawDeskAssembly";
import type { ParametricPreview } from "@/features/planner/asset-engine/svg/parametric/productDrawer";

export type ExistingParametricIdentity = {
  readonly id: string;
  readonly generatedAt?: number;
};

export function defaultDeskAssemblyIdentity(fields: DeskAssemblyFields) {
  const count = String(fields.workstationCount).padStart(2, "0");
  return {
    slug: fields.slug ?? `oando-desk-assembly-${count}`,
    sku: fields.sku ?? `OANDO-DSK-ASM-${count}`,
  };
}

export function buildDeskAssemblyPublishDescriptor(
  fields: DeskAssemblyFields,
  preview: ParametricPreview,
  existing?: ExistingParametricIdentity | null,
): BlockDescriptor {
  const base = makeNewBlockDescriptorStub();
  const identity = defaultDeskAssemblyIdentity(fields);
  return {
    schemaVersion: base.schemaVersion,
    id: existing?.id ?? crypto.randomUUID(),
    slug: identity.slug,
    sku: identity.sku,
    sourceProvenance: "native",
    geometry: {
      widthMm: preview.widthMm,
      depthMm: preview.depthMm,
      heightMm: fields.deskHeightMm,
    },
    viewBox: preview.viewBox,
    mounting: base.mounting,
    themeTokens: base.themeTokens,
    rovingFocus: base.rovingFocus,
    liveAnnouncementCategories: base.liveAnnouncementCategories,
    checksum: base.checksum,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    maker: fieldsToDeskAssemblyMakerRecipe(fields),
    ...(typeof existing?.generatedAt === "number"
      ? { generatedAt: existing.generatedAt }
      : {}),
  } as BlockDescriptor;
}
