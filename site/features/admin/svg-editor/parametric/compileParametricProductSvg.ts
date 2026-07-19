import { sanitiseSvg } from "@/scripts/generate-svg/pipelineCore";
import type { ParametricPreview } from "@/features/planner/asset-engine/svg/parametric/productDrawer";
import { PARAMETRIC_PUBLISH_REGISTRY } from "./parametricPublishRegistry.server";

export type CompileParametricProductResult = { readonly ok: true; readonly type: string; readonly fields: unknown; readonly preview: ParametricPreview; readonly svg: string } | { readonly ok: false; readonly error: string };

export function compileParametricProductSvg(raw: unknown): CompileParametricProductResult {
  try {
    if (!raw || typeof raw !== "object" || !("type" in raw) || typeof (raw as { type?: unknown }).type !== "string") return { ok: false, error: "Unknown parametric product type" };
    const type = (raw as { type: string }).type;
    const adapter = PARAMETRIC_PUBLISH_REGISTRY.require(type);
    const fields = adapter.drawer.parse(raw);
    const preview = adapter.drawer.render(fields);
    const svg = sanitiseSvg(preview.svg);
    if (!svg.trim().startsWith("<svg")) return { ok: false, error: "Sanitised output is not an SVG" };
    if (/currentColor|var\s*\(/i.test(svg)) return { ok: false, error: "SVG contains image-unsafe paints" };
    return { ok: true, type, fields, preview, svg };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
