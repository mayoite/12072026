import type { ParametricParseResult } from "./authoringTypes";

export function ParametricStatusBar({ parse, widthMm, depthMm }: { readonly parse: ParametricParseResult<unknown>; readonly widthMm?: number; readonly depthMm?: number }) {
  return <div className="flex flex-wrap items-center gap-2 text-sm" role="status" aria-live="polite"><span className="rounded-full border px-2 py-1">{parse.ok ? "Draft ready" : `${parse.errors.length} issue(s)`}</span>{widthMm && depthMm ? <span className="rounded-full border px-2 py-1">{widthMm} × {depthMm} mm</span> : null}</div>;
}
