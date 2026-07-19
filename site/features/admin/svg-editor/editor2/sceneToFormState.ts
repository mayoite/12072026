/**
 * Bridge a parsed {@link SvgSceneDocument} into editor form state.
 *
 * Both editor inputs — import an `.svg` and draw on the fabric canvas — end as an
 * SVG string that `importSvgToScene` parses into a scene document. This helper is
 * the single funnel from that document into the `SvgEditorFormState` the existing
 * preview/publish actions already consume: it serializes the scene to V1 parts
 * (z-order preserved) and attaches them as the geometry authority (`sceneParts` /
 * `sceneViewBox`). Path geometry then survives to publish via `importedPaths`.
 */

import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { serializeSceneToDefinition } from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import type { SvgEditorFormState } from "@/features/admin/svg-editor/form/svgEditorFormState";

export interface SceneToFormOptions {
  /** Base form state to merge geometry onto (identity, tokens, variant kept). */
  readonly base: SvgEditorFormState;
  /** Slug for the symbol (already validated by the caller). */
  readonly slug: string;
  /** Real-world footprint in mm; falls back to the scene viewBox extent. */
  readonly dimensionsMm?: {
    readonly widthMm: number;
    readonly depthMm: number;
    readonly heightMm: number;
  };
}

/**
 * Produce a new form state whose geometry authority is the scene document.
 * Pure: returns a fresh object; never mutates `base`.
 */
export function sceneToFormState(
  doc: SvgSceneDocument,
  opts: SceneToFormOptions,
): SvgEditorFormState {
  const definition = serializeSceneToDefinition(doc);
  const vb = definition.viewBox;
  const dims =
    opts.dimensionsMm ??
    {
      widthMm: Math.max(1, Math.round(vb.width)),
      depthMm: Math.max(1, Math.round(vb.height)),
      heightMm: Math.max(1, Math.round(vb.height)),
    };

  return {
    ...opts.base,
    slug: opts.slug,
    variant: "fixed",
    geometry: {
      ...opts.base.geometry,
      widthMm: dims.widthMm,
      depthMm: dims.depthMm,
      heightMm: dims.heightMm,
    },
    viewBox: { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
    sceneViewBox: vb,
    sceneParts: definition.parts,
    // Legacy freehand sketch has no bearing on this path.
    excalidrawElements: undefined,
  };
}
