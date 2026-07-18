/**
 * Pure descriptor builder for parametric linear desk publish.
 * Not a server action — keeps identity rules unit-testable without "use server" export constraints.
 */

import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import {
  ensureCommercialSku,
  ensureGuestVisibleSlug,
} from "./linearDeskGuestIdentity";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";

/** Stable identity fields reused when republishing the same slug. */
export type ExistingLinearDeskIdentity = {
  readonly id: string;
  readonly generatedAt?: number;
};

export type LinearDeskDescriptorFields = {
  readonly slug?: string;
  readonly sku?: string;
  readonly widthMm: number;
  readonly depthMm: number;
  readonly heightMm: number;
};

function mintProductId(fallback: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return fallback;
}

/**
 * Build publish descriptor from parsed fields.
 * Same slug → same product `id` + frozen `generatedAt` when prior exists.
 * Pure helper — injectable existing identity for unit isolation (no disk).
 */
export function buildLinearDeskPublishDescriptor(
  fields: LinearDeskDescriptorFields,
  existing?: ExistingLinearDeskIdentity | null,
): BlockDescriptor {
  // BOQ display: humanize(slug) + sku (BlockDescriptor has no name field yet).
  const slug = ensureGuestVisibleSlug(fields.slug, fields.widthMm);
  const sku = ensureCommercialSku(fields.sku, fields.widthMm);
  const base = makeNewBlockDescriptorStub();
  const reusedId =
    typeof existing?.id === "string" && existing.id.trim().length > 0
      ? existing.id.trim()
      : null;
  const id = reusedId ?? mintProductId(base.id);

  // Persist freezes generatedAt and rejects mutation on republish.
  // Reuse frozen stamp when present; first publish omits it so freeze mints once.
  const descriptor = {
    schemaVersion: base.schemaVersion,
    id,
    slug,
    sku,
    sourceProvenance: "native",
    geometry: {
      widthMm: fields.widthMm,
      depthMm: fields.depthMm,
      heightMm: fields.heightMm,
    },
    viewBox: {
      x: 0,
      y: 0,
      width: fields.widthMm,
      height: fields.depthMm,
    },
    mounting: base.mounting,
    themeTokens: base.themeTokens,
    rovingFocus: base.rovingFocus,
    liveAnnouncementCategories: base.liveAnnouncementCategories,
    checksum: base.checksum,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    ...(typeof existing?.generatedAt === "number"
      ? { generatedAt: existing.generatedAt }
      : {}),
  } as BlockDescriptor;

  return descriptor;
}
