import "server-only";

import type { SvgBlockDefinitionV1 } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import { SvgBlockDefinitionV1Schema } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import { sha256Hex } from "./sha256";
import { sanitizeAndOptimizeSvg } from "./svgServerSanitizer";

export const SVG_COMPILER_VERSION = "svg-block-v1";

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalize(entry)]),
    );
  }
  return value;
}

function attrs(style: SvgBlockDefinitionV1["parts"][number]["style"]): string {
  if (!style) return "";
  return Object.entries(style).filter(([, value]) => value !== undefined).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ` ${key === "lineWeight" ? "stroke-width" : key}="${escape(String(value))}"`).join("");
}

function compilePart(part: SvgBlockDefinitionV1["parts"][number], namespace: string): string {
  const common = ` id="${namespace}-${part.id}"${attrs(part.style)}`;
  if (!part.visible) return "";
  switch (part.kind) {
    case "rect": return `<rect${common} height="${part.height}" width="${part.width}" x="${part.x}" y="${part.y}"/>`;
    case "circle": return `<circle${common} cx="${part.cx}" cy="${part.cy}" r="${part.r}"/>`;
    case "line": return `<line${common} x1="${part.x1}" x2="${part.x2}" y1="${part.y1}" y2="${part.y2}"/>`;
    case "path": return `<path${common} d="${escape(part.d)}"/>`;
    case "text": return `<text${common} x="${part.x}" y="${part.y}">${escape(part.text)}</text>`;
  }
}

export interface CompiledSvgBlockV1 {
  readonly svg: string;
  readonly descriptorChecksum: string;
  readonly svgChecksum: string;
  readonly compilerVersion: typeof SVG_COMPILER_VERSION;
}

export function compileSvgBlockV1(input: unknown): CompiledSvgBlockV1 {
  const definition = SvgBlockDefinitionV1Schema.parse(input);
  const namespace = `${definition.typeId}-v1`;
  const viewBox = definition.viewBox;
  const body = [...definition.parts].sort((a, b) => a.id.localeCompare(b)).map((part) => compilePart(part, namespace)).join("");
  const description = definition.accessibility.description ? `<desc id="${namespace}-desc">${escape(definition.accessibility.description)}</desc>` : "";
  const labelledBy = `${namespace}-title${description ? ` ${namespace}-desc` : ""}`;
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="${labelledBy}" role="img" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"><title id="${namespace}-title">${escape(definition.accessibility.title)}</title>${description}${body}</svg>`;
  const svg = sanitizeAndOptimizeSvg(raw);
  const canonicalDescriptor = JSON.stringify(canonicalize(definition));
  return {
    svg,
    descriptorChecksum: sha256Hex(canonicalDescriptor),
    svgChecksum: sha256Hex(svg),
    compilerVersion: SVG_COMPILER_VERSION,
  };
}
