/**
 * Authoring lifecycle + draft-vs-published field diff for Admin SVG editor.
 *
 * Supports ADM-STATE-01 (one authoritative state) and ADM-SVG-14 (field + visual
 * difference). Pure functions only. Uses existing Admin badge classes only.
 */

import type { SvgEditorFormState } from "./svgEditorFormState";
import { SVG_EDITOR_FIELDS } from "./svgEditorFormModel";

export type AuthoringLifecycle =
  | "publishing"
  | "validating"
  | "invalid"
  | "dirty"
  | "clean"
  | "error"
  | "published";

export function deriveAuthoringLifecycle(input: {
  readonly submitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly previewPending: boolean;
  readonly previewOk: boolean | null;
  readonly formDirty: boolean;
}): AuthoringLifecycle {
  if (input.submitting) return "publishing";
  if (input.errorMessage) return "error";
  if (input.previewPending) return "validating";
  if (input.previewOk === false) return "invalid";
  if (input.formDirty) return "dirty";
  if (input.successMessage) return "published";
  return "clean";
}

export function authoringLifecycleLabel(state: AuthoringLifecycle): string {
  switch (state) {
    case "publishing":
      return "Publishing";
    case "validating":
      return "Validating";
    case "invalid":
      return "Publication blocked";
    case "dirty":
      return "Unpublished changes";
    case "clean":
      return "In sync with published";
    case "error":
      return "Publish error";
    case "published":
      return "Just published";
  }
}

/** Existing Admin badge classes only — no new CSS. */
export function authoringLifecycleBadgeClass(state: AuthoringLifecycle): string {
  switch (state) {
    case "publishing":
    case "validating":
      return "admin-badge";
    case "invalid":
    case "error":
    case "dirty":
      return "admin-badge admin-badge--warn";
    case "clean":
    case "published":
      return "admin-badge admin-badge--active";
  }
}

export function changedFormKeys(
  draft: SvgEditorFormState,
  published: SvgEditorFormState,
): string[] {
  const keys = Object.keys(draft) as (keyof SvgEditorFormState)[];
  return keys.filter(
    (key) => JSON.stringify(draft[key]) !== JSON.stringify(published[key]),
  );
}

const KEY_TO_FIELD_PATH: Readonly<Record<string, string>> = {
  slug: "slug",
  sku: "sku",
  sourceProvenance: "sourceProvenance",
  createdBy: "createdBy",
  variant: "variant",
  geometry: "geometry.widthMm",
  viewBox: "viewBox.width",
  mounting: "mounting",
  liveAnnouncementCategories: "liveAnnouncementCategories",
  rovingFocus: "rovingFocus",
  mountingPoints: "mountingPoints",
  blocks: "blocks",
  themeTokens: "themeTokens",
  configurableSizingType: "configurable.sizingType",
  configurableSizeOptions: "configurable.sizeOptions",
  parameterSchema: "parametric.parameterSchema",
  assetsGlbUrl: "assets.glbUrl",
  assetsSvgUrl: "assets.glbUrl",
  sceneViewBox: "viewBox.width",
  sceneParts: "blocks",
};

export interface ChangedFieldDescription {
  readonly key: string;
  readonly label: string;
  readonly targetId: string | null;
}

export function describeChangedFields(
  draft: SvgEditorFormState,
  published: SvgEditorFormState,
): readonly ChangedFieldDescription[] {
  return changedFormKeys(draft, published).map((key) => {
    if (key === "sceneParts" || key === "sceneViewBox") {
      return {
        key,
        label: "Visual studio geometry",
        targetId: null,
      };
    }

    const fieldPath = KEY_TO_FIELD_PATH[key] ?? null;
    const field = fieldPath
      ? SVG_EDITOR_FIELDS.find(
          (entry) =>
            entry.path === fieldPath || fieldPath.startsWith(`${entry.path}.`),
        )
      : undefined;

    return {
      key,
      label: field?.label ?? key,
      targetId: field ? `svgfield-${field.path}` : null,
    };
  });
}
