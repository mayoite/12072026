/**
 * ADM-SVG-08 — supported SVG authoring feature subset (documented + enforced).
 * Studio tools and scene nodes must stay inside this list.
 */

export const SUPPORTED_SVG_AUTHORING_KINDS = [
  "rect",
  "circle",
] as const;

export type SupportedSvgAuthoringKind =
  (typeof SUPPORTED_SVG_AUTHORING_KINDS)[number];

export const SUPPORTED_SVG_AUTHORING_DOC = Object.freeze({
  kinds: SUPPORTED_SVG_AUTHORING_KINDS,
  transforms: ["translate", "resize"] as const,
  layers: ["select", "rename", "order", "lock", "visibility"] as const,
  history: ["named-undo", "named-redo"] as const,
  excluded: [
    "freehand path editing",
    "external image href",
    "script",
    "foreignObject",
    "raw SVG markup paste as authority",
  ] as const,
});

export function isSupportedSvgAuthoringKind(
  kind: string,
): kind is SupportedSvgAuthoringKind {
  return (SUPPORTED_SVG_AUTHORING_KINDS as readonly string[]).includes(kind);
}

/** Reject unsupported node kinds when serializing or importing studio nodes. */
export function assertSupportedStudioKinds(
  kinds: readonly string[],
): { ok: true } | { ok: false; unsupported: readonly string[] } {
  const unsupported = kinds.filter((kind) => !isSupportedSvgAuthoringKind(kind));
  if (unsupported.length > 0) {
    return { ok: false, unsupported: [...new Set(unsupported)] };
  }
  return { ok: true };
}
