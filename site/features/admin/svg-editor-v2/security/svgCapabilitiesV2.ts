import type { SvgAssetCapabilityV2 } from "../model/svgAssetManifestV2";

export const SVG_SANITIZER_VERSION_V2 = "svg-sanitizer-v2.0.0" as const;
export const SVG_MAX_SOURCE_BYTES_V2 = 1_000_000;
export const SVG_MAX_ELEMENTS_V2 = 10_000;

export const SVG_ALLOWED_TAGS_V2 = [
  "svg", "title", "desc", "g", "defs", "symbol", "use",
  "path", "rect", "circle", "ellipse", "line", "polyline", "polygon",
  "text", "tspan", "textPath", "clipPath", "mask",
  "linearGradient", "radialGradient", "stop", "pattern", "image",
] as const;

export const SVG_ALLOWED_ATTRIBUTES_V2 = [
  "xmlns", "xmlns:xlink", "viewBox", "preserveAspectRatio",
  "id", "role", "aria-label", "aria-labelledby", "aria-describedby", "class",
  "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry",
  "width", "height", "d", "points", "pathLength",
  "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity",
  "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset",
  "opacity", "color", "vector-effect", "shape-rendering", "paint-order",
  "transform", "transform-origin", "clip-path", "clip-rule", "mask",
  "href", "xlink:href", "offset", "stop-color", "stop-opacity",
  "gradientUnits", "gradientTransform", "spreadMethod",
  "patternUnits", "patternContentUnits", "patternTransform",
  "font-family", "font-size", "font-style", "font-weight",
  "text-anchor", "dominant-baseline", "letter-spacing", "word-spacing",
  "style", "visibility", "display",
] as const;

export const SVG_ALLOWED_STYLE_PROPERTIES_V2 = new Set([
  "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity",
  "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset",
  "opacity", "color", "vector-effect", "shape-rendering", "paint-order",
  "clip-path", "clip-rule", "mask", "font-family", "font-size", "font-style",
  "font-weight", "text-anchor", "dominant-baseline", "letter-spacing",
  "word-spacing", "visibility", "display",
]);

export function isManagedSvgImageReference(value: string): boolean {
  return value.startsWith("/api/admin/svg-assets/") || value.startsWith("/svg-catalog/");
}

export function capabilitiesForSvgElement(
  element: Element,
): readonly SvgAssetCapabilityV2[] {
  const capabilities = new Set<SvgAssetCapabilityV2>();
  const geometryTags = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "use"]);
  const textTags = new Set(["text", "tspan", "textPath"]);
  const elements = [element, ...Array.from(element.querySelectorAll("*"))];
  for (const candidate of elements) {
    if (geometryTags.has(candidate.localName)) capabilities.add("geometry");
    if (textTags.has(candidate.localName)) capabilities.add("text");
    if (candidate.hasAttribute("transform")) capabilities.add("transforms");
    if (candidate.localName === "clipPath" || candidate.hasAttribute("clip-path")) capabilities.add("clipping");
    if (candidate.localName === "mask" || candidate.hasAttribute("mask")) capabilities.add("masks");
    if (candidate.localName === "linearGradient" || candidate.localName === "radialGradient") capabilities.add("gradients");
    if (candidate.localName === "pattern") capabilities.add("patterns");
    if (candidate.localName === "image") capabilities.add("managed-images");
  }
  const order: readonly SvgAssetCapabilityV2[] = [
    "geometry", "text", "transforms", "clipping", "masks", "gradients", "patterns", "managed-images",
  ];
  return order.filter((capability) => capabilities.has(capability));
}
