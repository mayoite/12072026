/**
 * Server action: parametric linear desk → sanitise → disk publish.
 * Disk is live authority. Dual-write when DB+R2 ready (existing gate).
 */

"use server";

import { revalidatePath } from "next/cache";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import { setCatalogLifecycle } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import { normalizeDescriptorForPipeline } from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";
import { compileLinearDeskSvg } from "./compileLinearDeskSvg";
import {
  buildLinearDeskPublishDescriptor,
  type ExistingLinearDeskIdentity,
} from "./linearDeskPublishDescriptor";
import { ensureGuestVisibleSlug } from "./linearDeskGuestIdentity";

export type PublishLinearDeskInput = Record<string, unknown>;

function loadExistingIdentity(slug: string): ExistingLinearDeskIdentity | null {
  const loaded = tryLoad(slug);
  if (!loaded.ok) return null;
  const { id, generatedAt } = loaded.value;
  if (typeof id !== "string" || id.trim().length === 0) return null;
  return {
    id,
    ...(typeof generatedAt === "number" ? { generatedAt } : {}),
  };
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
  // Same slug → same product id (place stamps catalogId; dual-write thrash otherwise).
  const guestSlug = ensureGuestVisibleSlug(fields.slug, fields.widthMm);
  const existing = loadExistingIdentity(guestSlug);
  const descriptor = buildLinearDeskPublishDescriptor(fields, existing);

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
    // Order factory: published parametric product is guest-placeable (live).
    // (Studio freehand path still sets draft; this path is intentional ship.)
    setCatalogLifecycle(result.descriptor.slug, "live");
    revalidatePath("/admin/svg-editor");
    revalidatePath("/admin/svg-editor/parametric");
    revalidatePath("/planner/guest");
  }

  return result;
}
