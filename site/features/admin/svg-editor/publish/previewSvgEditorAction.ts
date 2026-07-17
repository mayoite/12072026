/**
 * Live-preview server action for the no-code SVG editor (A4).
 *
 * Compiles the CURRENT form state through the REAL publish compile
 * (`compileSvgForPublish`, S1–S3, no disk I/O) so the author sees the actual
 * catalog SVG as they edit — NOT a placeholder. Also returns field-level
 * validation issues from `freezeFreshDescriptor` so the form can annotate the
 * offending controls.
 *
 * STRICT separation from publish: this NEVER writes disk and NEVER persists.
 * (`publishSvgEditorAction` owns S4/S6.)
 *
 * Honesty: this is catalog **publish** SVG geometry, not the Fabric plan-draw
 * canvas (Admin PHASE-01 publish path; stack lock in plan/QUALITY-BAR.md).
 */

"use server";

import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { freezeFreshDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { formStateToDescriptorInput } from "@/features/admin/svg-editor/form/svgEditorFormAdapters";
import type {
  SvgEditorFormState,
  FieldIssue,
} from "@/features/admin/svg-editor/form/svgEditorFormState";
import { resolveAuthContext } from "@/features/shared/api/withAuth";

export type SvgPreviewPhase = "auth" | "notFound" | "validate" | "compile" | "ok";

export interface SvgPreviewResult {
  readonly ok: boolean;
  readonly phase: SvgPreviewPhase;
  /** Compiled, server-sanitized SVG markup (present only when ok). */
  readonly svg?: string;
  /** Field-level validation issues (path === zod path). */
  readonly issues: readonly FieldIssue[];
  /** Compile stage that failed, e.g. `svg-s2-compile`. */
  readonly failedAt?: string;
  /** Human-readable error for auth/validate/compile failures. */
  readonly error?: string;
}

function fail(
  phase: SvgPreviewPhase,
  error: string,
  issues: readonly FieldIssue[] = [],
  failedAt?: string,
): SvgPreviewResult {
  return { ok: false, phase, error, issues, failedAt };
}

/**
 * Compile the current editor form state for a slug and return the real SVG +
 * validation issues. `slug === "new"` uses the new-block stub as the base.
 */
export async function previewSvgEditorAction(
  slug: string,
  form: SvgEditorFormState,
): Promise<SvgPreviewResult> {
  try {
    await resolveAuthContext("admin");
  } catch {
    return fail("auth", "Admin access required");
  }

  let descriptor: BlockDescriptor;
  if (slug === "new") {
    descriptor = makeNewBlockDescriptorStub();
  } else {
    const loaded = tryLoad(slug);
    if (!loaded.ok) {
      return fail("notFound", `Descriptor not found: ${slug}`);
    }
    descriptor = loaded.value;
  }

  const input = formStateToDescriptorInput(descriptor, form);

  // Structural validation first — surfaces {path,message} per field. Uses
  // freezeFreshDescriptor so an absent/stub checksum does not block preview.
  const frozen = freezeFreshDescriptor(input, () => Date.now());
  if (!frozen.ok) {
    const issues =
      frozen.error.kind === "invalid" ? frozen.error.issues : [];
    return fail(
      "validate",
      frozen.error.message,
      issues,
      undefined,
    );
  }

  // Real compile — no disk I/O.
  const compiled = await compileSvgForPublish(input);
  if (!compiled.ok) {
    return fail("compile", compiled.error, [], compiled.failedAt);
  }

  return { ok: true, phase: "ok", svg: compiled.svg, issues: [] };
}
