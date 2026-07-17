/**
 * Server action for admin SVG editor publish (A4 — no-code form).
 * Must live in a "use server" module so it can be passed to Client Components
 * (inline wrappers / page-local "use server" arrow closures are not a stable
 * Server Action ref and crash or mis-wire RSC → client).
 *
 * Route wiring: `publishSvgEditorAction.bind(null, slug)` from the RSC page.
 * This file exports only async server actions (Next "use server" module rule).
 */

"use server";

import { revalidatePath } from "next/cache";
import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { formStateToDescriptorInput } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import { isDbSvgReleaseAuthority } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { setCatalogLifecycle } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { appendDescriptorAudit } from "@/features/admin/svg-editor/storage/descriptorAuditLog";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { publishSymbolToSupabaseCatalog } from "@/features/shared/catalog/catalogAssetStorage.server";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";
import { assertDraftNotStale, readOpenedBaselineStamp } from "@/features/admin/svg-editor/lifecycle/staleDraftPublishGate";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Fail-closed publish for one slug.
 *
 * Order: stale-draft gate → dual-write resolve → compile → S4 disk → persist.
 * Disk is live publish authority. Supabase Storage mirror is best-effort only
 * and must never roll back a successful disk publish.
 *
 * @param slug - route slug (`new` or existing inventory descriptor slug)
 * @param formFromEditor - no-code form state from the client editor
 */
export async function publishSvgEditorAction(
  slug: string,
  formFromEditor: SvgEditorFormState,
): Promise<PublishDescriptorResult> {
  let actorId = DEV_BYPASS_USER.id;
  try {
    const auth = await resolveAuthContext("admin");
    actorId = auth.user?.id ?? DEV_BYPASS_USER.id;
  } catch {
    return { success: false, error: "Admin access required" };
  }

  let descriptor: BlockDescriptor;
  if (slug === "new") {
    descriptor = makeNewBlockDescriptorStub();
  } else {
    const result = tryLoad(slug);
    if (!result.ok) {
      return { success: false, error: "not found" };
    }
    descriptor = result.value;

    // DB-SVG-09: server-side stale check — rejects concurrent overwrites.
    const staleCheck = assertDraftNotStale({
      slug,
      clientBaselineGeneratedAt: readOpenedBaselineStamp(formFromEditor),
      serverBaselineGeneratedAt: descriptor.generatedAt ?? 0,
    });
    if (!staleCheck.ok) {
      return { success: false, error: staleCheck.error };
    }
  }
  const input = formStateToDescriptorInput(descriptor, formFromEditor);

  // Dual-write only when Products DB is configured AND R2 is reachable.
  // Disk remains live authority unless SVG_RELEASE_AUTHORITY=db (then dual-write
  // is required and disk is not a silent override).
  const dualWrite = await resolveSvgPublishDualWriteDeps();
  if (isDbSvgReleaseAuthority() && dualWrite.mode !== "enabled") {
    return {
      success: false,
      error:
        dualWrite.mode === "skipped_no_db"
          ? "DB release authority requires PRODUCTS_DATABASE_URL"
          : "DB release authority requires reachable R2 catalog storage",
    };
  }

  // Publish SVG bytes come only from server `compileSvgForPublish` (S1–S3).
  // Client `form.compiledSvg` is studio preview only — never substitute it for
  // the released catalog symbol (fail-closed integrity; ADM-SVG-12 authority).
  const published = await publishDescriptorWithPipeline(input, {
    dbRepository: dualWrite.dbRepository,
    artifactStore: dualWrite.artifactStore,
    compileSvg: compileSvgForPublish,
    actorId,
  });
  if (published.success) {
    setCatalogLifecycle(published.descriptor.slug, "draft");
    // Best-effort Supabase Storage mirror for Planner import (stable public paths).
    // Disk remains live authority; Supabase failure must not roll back publish.
    let supabaseMirror: { svgOk: boolean; descriptorOk: boolean; reason?: string } | undefined;
    try {
      const slug = published.descriptor.slug;
      const svgPath = path.join(
        process.cwd(),
        "public",
        "svg-catalog",
        `${slug}.svg`,
      );
      const svgMarkup = await readFile(svgPath, "utf8");
      const mirror = await publishSymbolToSupabaseCatalog({
        slug,
        svgMarkup,
        descriptorJson: JSON.stringify(published.descriptor),
      });
      supabaseMirror = {
        svgOk: mirror.svg.ok,
        descriptorOk: mirror.descriptor.ok,
        reason:
          !mirror.svg.ok && "reason" in mirror.svg
            ? mirror.svg.reason
            : !mirror.descriptor.ok && "reason" in mirror.descriptor
              ? mirror.descriptor.reason
              : undefined,
      };
    } catch (err) {
      supabaseMirror = {
        svgOk: false,
        descriptorOk: false,
        reason: err instanceof Error ? err.message : String(err),
      };
    }
    appendDescriptorAudit({
      actorId,
      slug: published.descriptor.slug,
      action: "publish",
      detail: {
        checksum: published.descriptor.checksum,
        lifecycle: "draft",
        supabaseSvgOk: supabaseMirror?.svgOk ?? false,
        supabaseDescriptorOk: supabaseMirror?.descriptorOk ?? false,
        supabaseMirrorReason: supabaseMirror?.reason ?? null,
      },
    });
    revalidatePath("/admin/svg-editor");
    revalidatePath(`/admin/svg-editor/${published.descriptor.slug}`);
    revalidatePath("/api/planner/catalog/svg-blocks");
  }
  return published;
}
