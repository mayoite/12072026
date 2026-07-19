/**
 * Publish a custom-furniture symbol straight to storage — no disk, no guards.
 *
 * Press publish → compile (S1–S3 sanitize/optimise) → upload SVG + descriptor
 * JSON to Supabase Storage → return the public URL. That is the whole contract.
 *
 * Why this exists: the legacy `publishDescriptorWithPipeline` treats a local
 * `public/svg-catalog/*.svg` disk write as the release authority, wrapped in a
 * dual-write / R2-probe / pointer-column / revision-collision guard stack. None
 * of that disk write can run on Vercel (ephemeral, read-only FS), so the only
 * part that actually works in production — the Supabase upload — was demoted to
 * a "best-effort mirror." This action inverts that: storage IS the authority.
 *
 * Compile is pure and re-sanitizes on the server (`compileSvgForPublish`), so
 * the client never supplies release bytes. The only pre-publish check is that
 * compile succeeds; if it does, we push and we are done.
 */

"use server";

import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { formStateToDescriptorInput } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { publishSymbolToSupabaseCatalog } from "@/features/shared/catalog/catalogAssetStorage.server";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { freezeFreshDescriptor } from "@/features/planner/catalog/svg/svgTypes";

export type PublishToStorageResult =
  | {
      readonly success: true;
      readonly slug: string;
      readonly svgUrl: string;
      readonly descriptorUrl: string;
    }
  | { readonly success: false; readonly error: string };

/**
 * Compile the editor form to a release SVG and publish it to Supabase Storage.
 *
 * @param slug - route slug (`new` or an existing inventory descriptor slug)
 * @param form - no-code editor form state (scene parts are the geometry authority)
 */
export async function publishToStorageAction(
  slug: string,
  form: SvgEditorFormState,
): Promise<PublishToStorageResult> {
  // Base descriptor identity: reuse an existing record, or a fresh fixed stub.
  let base: BlockDescriptor;
  if (slug === "new") {
    base = makeNewBlockDescriptorStub();
  } else {
    const loaded = tryLoad(slug);
    base = loaded.ok ? loaded.value : makeNewBlockDescriptorStub();
  }

  // Merge form over the base → persistable descriptor input (path geometry
  // survives as `importedPaths`). Freeze recomputes checksum/generatedAt.
  const input = formStateToDescriptorInput(base, form);
  const frozen = freezeFreshDescriptor(input, () => Math.floor(Date.now() / 1000));
  if (!frozen.ok) {
    return {
      success: false,
      error: `invalid_descriptor: ${frozen.error.message}`,
    };
  }
  const descriptor = frozen.value;

  // The one pre-publish check: compilation must succeed (S1–S3 re-sanitize).
  const compiled = await compileSvgForPublish(descriptor);
  if (!compiled.ok) {
    return {
      success: false,
      error: `compile_failed: ${compiled.error} (at ${compiled.failedAt})`,
    };
  }

  // Push to storage. This is the release.
  const uploaded = await publishSymbolToSupabaseCatalog({
    slug: descriptor.slug,
    svgMarkup: compiled.svg,
    descriptorJson: JSON.stringify(descriptor),
  });
  if (!uploaded.svg.ok) {
    return { success: false, error: `storage_svg: ${uploaded.svg.reason}` };
  }
  if (!uploaded.descriptor.ok) {
    return {
      success: false,
      error: `storage_descriptor: ${uploaded.descriptor.reason}`,
    };
  }

  return {
    success: true,
    slug: descriptor.slug,
    svgUrl: uploaded.svg.publicUrl,
    descriptorUrl: uploaded.descriptor.publicUrl,
  };
}
