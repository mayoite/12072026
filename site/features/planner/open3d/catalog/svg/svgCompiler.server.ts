import "server-only";

import type { SvgBlockDefinitionV1 } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import { SvgBlockDefinitionV1Schema } from "@/features/planner/admin/svg-editor/svgBlockSchemas";
import { sha256Hex } from "./sha256";
import { sanitizeAndOptimizeSvg } from "./svgServerSanitizer";
import type { ZodIssue } from "zod";

// GS: BP-03 (pipeline), REC-04 (catalogue), anti-copy (tokens from site/app/css only; no hex). svgCompiler.server.ts is single authority (unifies with generate-svg.mjs thin wrapper). Reference fixtures validation only.
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

export interface SvgCompileDiagnostic {
  readonly code: string;
  readonly severity: "error";
  readonly path: string;
  readonly message: string;
}

export class SvgCompileError extends Error {
  constructor(readonly diagnostics: readonly SvgCompileDiagnostic[]) {
    super("SVG definition failed validation");
    this.name = "SvgCompileError";
  }
}

function toDiagnostic(issue: ZodIssue): SvgCompileDiagnostic {
  return {
    code: `schema.${issue.code}`,
    severity: "error",
    path: issue.path.map(String).join("."),
    message: issue.message,
  };
}

export function compileSvgBlockV1(input: unknown): CompiledSvgBlockV1 {
  const parsed = SvgBlockDefinitionV1Schema.safeParse(input);
  if (!parsed.success) {
    const diagnostics = parsed.error.issues.map(toDiagnostic).sort((left, right) =>
      left.path.localeCompare(right.path) || left.code.localeCompare(right.code) || left.message.localeCompare(right.message));
    throw new SvgCompileError(Object.freeze(diagnostics));
  }
  const definition = parsed.data;

  // Full geometry + constraint validation (reference fixtures only, per 1B).
  const geoDiags = validateGeometry(definition);
  const conDiags = validateConstraints(definition);
  if (geoDiags.length || conDiags.length) {
    const all = [...geoDiags, ...conDiags].sort((left, right) => left.path.localeCompare(right.path) || left.message.localeCompare(right.message));
    throw new SvgCompileError(Object.freeze(all));
  }

  const namespace = `${definition.typeId}-v1`;
  const viewBox = definition.viewBox;
  const body = [...definition.parts].sort((a, b) => a.id.localeCompare(b.id)).map((part) => compilePart(part, namespace)).join("");
  const description = definition.accessibility.description ? `<desc id="${namespace}-desc">${escape(definition.accessibility.description)}</desc>` : "";
  const labelledBy = `${namespace}-title${description ? ` ${namespace}-desc` : ""}`;
  const raw = `<svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="${labelledBy}" role="img" shape-rendering="geometricPrecision" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"><title id="${namespace}-title">${escape(definition.accessibility.title)}</title>${description}${body}</svg>`;
  const svg = sanitizeAndOptimizeSvg(raw);
  const canonicalDescriptor = JSON.stringify(canonicalize(definition));
  return {
    svg,
    descriptorChecksum: sha256Hex(canonicalDescriptor),
    svgChecksum: sha256Hex(svg),
    compilerVersion: SVG_COMPILER_VERSION,
  };
}

// Geometry validation for ref fixtures: parts must be inside viewBox, finite/positive (schema helps).
function validateGeometry(def: SvgBlockDefinitionV1): SvgCompileDiagnostic[] {
  const diags: SvgCompileDiagnostic[] = [];
  const vb = def.viewBox;
  const vbx2 = vb.x + vb.width;
  const vby2 = vb.y + vb.height;
  for (const part of def.parts) {
    if (!part.visible) continue;
    if (part.kind === "rect") {
      if (part.x < vb.x || part.y < vb.y || part.x + part.width > vbx2 || part.y + part.height > vby2) {
        diags.push({ code: "geometry.outOfViewBox", severity: "error", path: `parts.${part.id}`, message: "rect must lie inside viewBox" });
      }
    } else if (part.kind === "circle") {
      if (part.cx - part.r < vb.x || part.cy - part.r < vb.y || part.cx + part.r > vbx2 || part.cy + part.r > vby2) {
        diags.push({ code: "geometry.outOfViewBox", severity: "error", path: `parts.${part.id}`, message: "circle must lie inside viewBox" });
      }
    }
  }
  return diags;
}

// Constraint validation (ref fixtures): e.g. max on number params.
function validateConstraints(def: SvgBlockDefinitionV1): SvgCompileDiagnostic[] {
  const diags: SvgCompileDiagnostic[] = [];
  const paramById = new Map(def.parameters.map(p => [p.id, p]));
  for (const c of def.constraints) {
    if (c.kind === "maximum") {
      for (const pid of c.parameterIds) {
        const p = paramById.get(pid);
        if (p && typeof p.defaultValue === "number" && typeof c.value === "number" && p.defaultValue > c.value) {
          diags.push({ code: "constraint.violation", severity: "error", path: `parameters.${pid}.defaultValue`, message: `exceeds maximum ${c.value}` });
        }
      }
    }
  }
  return diags;
}
