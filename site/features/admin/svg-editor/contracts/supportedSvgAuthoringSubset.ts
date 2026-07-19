/**
 * ADM-SVG-08 — supported SVG authoring feature subset (documented + enforced).
 * Studio tools and scene nodes must stay inside this list.
 *
 * `path` is supported so custom furniture geometry — drawn in-canvas or brought
 * in via sanitized SVG import — can publish through the existing V1 boundary.
 * The V1 schema (`SvgPartV1Schema`), scene model (`SvgScenePathNode`), serializer,
 * and sanitizer (`svgServerSanitizer` allows `<path>`) already carry `d` end to end;
 * this allowlist is the only gate. What stays excluded is unsanitized raw markup
 * as publish authority — every imported path passes the sanitizer first.
 */

export const SUPPORTED_SVG_AUTHORING_KINDS = [
  "rect",
  "circle",
  "line",
  "text",
  "path",
] as const;

export type SupportedSvgAuthoringKind =
  (typeof SUPPORTED_SVG_AUTHORING_KINDS)[number];

export const SUPPORTED_SVG_AUTHORING_DOC = Object.freeze({
  kinds: SUPPORTED_SVG_AUTHORING_KINDS,
  transforms: ["translate", "resize"] as const,
  layers: ["select", "rename", "order", "lock", "visibility"] as const,
  history: ["named-undo", "named-redo"] as const,
  imported: [
    "path (from sanitized SVG import: rect/circle/ellipse/line/polygon/polyline/path flattened to path d)",
  ] as const,
  excluded: [
    "external image href",
    "script",
    "foreignObject",
    "unsanitized raw SVG markup as authority",
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
