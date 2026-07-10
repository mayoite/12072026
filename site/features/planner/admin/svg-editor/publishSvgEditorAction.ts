/**
 * Server action for admin SVG editor Puck onPublish.
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
} from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import {
  puckEditorDataToDescriptorInput,
  type PuckDataShape,
} from "@/features/planner/admin/svg-editor/puckBlockRegistry";
import {
  publishDescriptorWithPipeline,
  type PublishDescriptorResult,
} from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";
import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";

/**
 * Fail-closed Puck publish for one slug.
 *
 * @param slug - route slug (`new` or existing block-descriptors slug)
 * @param puckDataFromEditor - Puck document payload from client
 */
export async function publishSvgEditorAction(
  slug: string,
  puckDataFromEditor: PuckDataShape,
): Promise<PublishDescriptorResult> {
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
  const input = puckEditorDataToDescriptorInput(descriptor, puckDataFromEditor);
  return publishDescriptorWithPipeline(input);
}
