/**
 * Fields → multipath SVG → sanitise (publish-path safety).
 * Same draw* as Admin preview.
 */

import { sanitiseSvg } from "@/scripts/generate-svg/pipelineCore";
import {
  parseLinearDeskFields,
  renderLinearDeskSvg,
  type LinearDeskFields,
} from "@/features/planner/asset-engine/svg/parametric";

export type CompileLinearDeskResult =
  | { readonly ok: true; readonly svg: string; readonly fields: LinearDeskFields }
  | { readonly ok: false; readonly error: string };

export function compileLinearDeskSvg(raw: unknown): CompileLinearDeskResult {
  try {
    const fields = parseLinearDeskFields(raw);
    const rendered = renderLinearDeskSvg(fields);
    const svg = sanitiseSvg(rendered);
    if (!svg.trim().startsWith("<svg")) {
      return { ok: false, error: "Sanitised output is not an SVG" };
    }
    if (/currentColor|var\s*\(/i.test(svg)) {
      return { ok: false, error: "SVG contains image-unsafe paints" };
    }
    return { ok: true, svg, fields };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
