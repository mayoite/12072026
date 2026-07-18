/**
 * Server action: parametric linear desk → sanitise → disk publish.
 * Disk is live authority. Dual-write when DB+R2 ready (existing gate).
 */

"use server";

import { revalidatePath } from "next/cache";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import { compileLinearDeskSvg } from "./compileLinearDeskSvg";
import {
  ensureCommercialSku,
  ensureGuestVisibleSlug,
} from "./linearDeskGuestIdentity";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import {
  normalizeDescriptorForPipeline,
} from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";

export type PublishLinearDeskInput = Record<string, unknown>;

function descriptorFromFields(
  fields: {
    slug?: string;
    sku?: string;
    widthMm: number;
    depthMm: number;
    heightMm: number;
  },
): BlockDescriptor {
  // BOQ display: humanize(slug) + sku (BlockDescriptor has no name field yet).
  const slug = ensureGuestVisibleSlug(fields.slug, fields.widthMm);
  const sku = ensureCommercialSku(fields.sku, fields.widthMm);
  const base = makeNewBlockDescriptorStub();
  const now = Math.floor(Date.now() / 1000);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : base.id;
  return {
    ...base,
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
    generatedAt: now,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
  } as BlockDescriptor;
}

export async function publishLinearDeskAction(
  raw: PublishLinearDeskInput,
): Promise<PublishDescriptorResult & { readonly svgPath?: string }> {
  let actorId = DEV_BYPASS_USER.id;
  try {
    const auth = await resolveAuthContext("admin");
    actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
  } catch {
    return { success: false, error: "Admin access required" };
  }

  const compiled = compileLinearDeskSvg(raw);
  if (!compiled.ok) {
    return { success: false, error: compiled.error };
  }

  const { fields, svg } = compiled;
  const descriptor = descriptorFromFields(fields);

  const dualWrite = await resolveSvgPublishDualWriteDeps();

  const compileSvg = async (
    desc: BlockDescriptor,
  ): Promise<SvgCompileStagesResult> => {
    const normalized = normalizeDescriptorForPipeline(desc);
    return {
      ok: true,
      stages: ["parametric-draw", "sanitise"],
      normalized,
      svg,
    };
  };

  const result = await publishDescriptorWithPipeline(descriptor, {
    compileSvg,
    actorId,
    reason: "parametric-linear-desk",
    ...(dualWrite.mode === "enabled"
      ? {
          dbRepository: dualWrite.dbRepository,
          artifactStore: dualWrite.artifactStore,
        }
      : {}),
  });

  if (result.success) {
    revalidatePath("/admin/svg-editor");
    revalidatePath("/admin/svg-editor/parametric");
  }

  return result;
}
