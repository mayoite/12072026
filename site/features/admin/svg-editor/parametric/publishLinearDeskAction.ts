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
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import {
  normalizeDescriptorForPipeline,
} from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";

export type PublishLinearDeskInput = Record<string, unknown>;

function descriptorFromFields(
  fields: {
    slug?: string;
    name?: string;
    sku?: string;
    widthMm: number;
    depthMm: number;
    heightMm: number;
  },
  svg: string,
): BlockDescriptor {
  const slug = fields.slug ?? "linear-desk";
  const base = makeNewBlockDescriptorStub();
  const now = Math.floor(Date.now() / 1000);
  return {
    ...base,
    id: base.id,
    slug,
    sku: fields.sku,
    name: fields.name,
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
    // Keep stub shape; compile is injected with prebuilt SVG
    themeTokens: { currentColor: "currentColor" },
  } as BlockDescriptor;
}

export async function publishLinearDeskAction(
  raw: PublishLinearDeskInput,
): Promise<PublishDescriptorResult & { readonly svgPath?: string }> {
  try {
    await resolveAuthContext("admin");
  } catch {
    return { success: false, error: "Admin access required" };
  }

  let actorId = DEV_BYPASS_USER.id;
  try {
    const auth = await resolveAuthContext("admin");
    actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
  } catch {
    // already failed above if hard fail; keep bypass actor for local
  }

  const compiled = compileLinearDeskSvg(raw);
  if (!compiled.ok) {
    return { success: false, error: compiled.error };
  }

  const { fields, svg } = compiled;
  const descriptor = descriptorFromFields(fields, svg);

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
