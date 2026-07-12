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
import { formStateToDescriptorInput } from "@/features/planner/admin/svg-editor/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/planner/admin/svg-editor/svgEditorFormState";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";
import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";
import { appendDescriptorAudit } from "@/features/planner/admin/svg-editor/descriptorAuditLog";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";

/**
 * Fail-closed publish for one slug.
 *
 * @param slug - route slug (`new` or existing block-descriptors slug)
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
  const published = await publishDescriptorWithPipeline(input);
  if (published.success) {
    appendDescriptorAudit({
      actorId,
      slug: published.descriptor.slug,
      action: "publish",
      detail: { checksum: published.descriptor.checksum },
    });
  }
  return published;
}
