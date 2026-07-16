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

import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { formStateToDescriptorInput } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { DrizzleSvgRevisionPersistence } from "@/features/admin/svg-editor/storage/drizzleSvgPersistence.server";
import { ImmutableSvgRevisionRepository } from "@/features/admin/svg-editor/svgRevisionRepository.server";
import { isProductsDatabaseConfigured } from "@/platform/drizzle/databaseUrls";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { setCatalogLifecycle } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { appendDescriptorAudit } from "@/features/admin/svg-editor/storage/descriptorAuditLog";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

/**
 * Fail-closed publish for one slug.
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
  }
  const input = formStateToDescriptorInput(descriptor, formFromEditor);

  // Inject DB dual-write repository when Products DB is configured.
  const dbRepository: ImmutableSvgRevisionRepository | undefined =
    isProductsDatabaseConfigured()
      ? new ImmutableSvgRevisionRepository(new DrizzleSvgRevisionPersistence())
      : undefined;

  const compiledSvgStr = formFromEditor.compiledSvg;
  const compileSvg =
    typeof compiledSvgStr === "string" && compiledSvgStr.trim().length > 0
      ? async (desc: BlockDescriptor) => {
          const base = await compileSvgForPublish(desc);
          if (!base.ok) return base;
          // Prefer studio-compiled SVG bytes when the form already has them.
          return { ...base, svg: compiledSvgStr };
        }
      : compileSvgForPublish;

  const published = await publishDescriptorWithPipeline(input, {
    dbRepository,
    compileSvg,
  });
  if (published.success) {
    setCatalogLifecycle(published.descriptor.slug, "draft");
    appendDescriptorAudit({
      actorId,
      slug: published.descriptor.slug,
      action: "publish",
      detail: { checksum: published.descriptor.checksum, lifecycle: "draft" },
    });
  }
  return published;
}
