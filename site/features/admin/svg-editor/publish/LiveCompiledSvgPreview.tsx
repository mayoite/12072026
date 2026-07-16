/**
 * Live compiled-SVG preview for the no-code editor (A4).
 *
 * Renders the REAL compiled catalog SVG returned by `previewSvgEditorAction`
 * (server-sanitized in S3), matching `PublishedSvgPreview`'s trusted-inline
 * stage so `currentColor` paints via the semantic token. On compile/validation
 * failure it shows an inline alert and keeps the last good SVG dimmed underneath.
 *
 * Honesty: catalog **publish** SVG geometry — not the Fabric plan-draw canvas.
 */

"use client";

import { useState } from "react";
import type { SvgPreviewResult } from "./previewSvgEditorAction";

/** ADM-SVG-13 — identity / footprint / validation shown with the Planner symbol. */
export interface LiveCompiledSvgPreviewMeta {
  readonly identity: string;
  readonly footprint: string;
  readonly validation: string;
}

export interface LiveCompiledSvgPreviewProps {
  readonly result: SvgPreviewResult | null;
  readonly pending: boolean;
  /** Product identity, mm footprint, and validation status for the live preview. */
  readonly meta?: LiveCompiledSvgPreviewMeta;
}

function isRenderableSvg(svg: string | undefined): svg is string {
  if (typeof svg !== "string") return false;
  const trimmed = svg.trimStart();
  return trimmed.startsWith("<svg") && !/<script/i.test(svg);
}

function failureCopy(result: SvgPreviewResult): string {
  switch (result.phase) {
    case "compile":
      return `Compile failed at ${result.failedAt ?? "unknown stage"}: ${result.error ?? "unknown error"}`;
    case "validate":
      return result.error ?? "Descriptor failed validation";
    case "auth":
      return result.error ?? "Admin access required";
    case "notFound":
      return result.error ?? "Descriptor not found";
    default:
      return result.error ?? "Preview unavailable";
  }
}

export function LiveCompiledSvgPreview({
  result,
  pending,
  meta,
}: LiveCompiledSvgPreviewProps) {
  // Remember the last successfully-compiled SVG so a later failure can keep
  // showing the last good geometry (dimmed) instead of a blank stage. Tracked
  // as state and adjusted during render (React's "store previous value" pattern)
  // so we never read a ref during render.
  const [lastGood, setLastGood] = useState<string | null>(null);

  const okSvg =
    result?.ok === true && isRenderableSvg(result.svg) ? result.svg : null;
  const currentOk = okSvg !== null;
  if (okSvg !== null && okSvg !== lastGood) {
    setLastGood(okSvg);
  }

  const showFailure = result !== null && !currentOk;
  const dimmedSvg = showFailure ? lastGood : null;
  const fallbackState = currentOk
    ? "live"
    : dimmedSvg
      ? "stale"
      : "empty";

  return (
    <div
      className="admin-svg-livepreview"
      data-testid="admin-svg-livepreview"
      data-pending={pending ? "true" : "false"}
      data-fallback-state={fallbackState}
      data-compiler-authority="compileSvgForPublish"
    >
      {meta ? (
        <p
          className="admin-page__meta"
          data-testid="admin-svg-livepreview-meta"
        >
          <span data-testid="admin-svg-livepreview-identity">{meta.identity}</span>
          {" · "}
          <span data-testid="admin-svg-livepreview-footprint">{meta.footprint}</span>
          {" · "}
          <span data-testid="admin-svg-livepreview-validation">
            {meta.validation}
          </span>
          {" · "}
          <span data-testid="admin-svg-livepreview-planner-symbol">
            Planner 2D symbol (same compile as publish)
          </span>
        </p>
      ) : null}

      {showFailure ? (
        <div
          className="admin-alert admin-alert--error"
          role="alert"
          data-testid="admin-svg-livepreview-validation-error"
        >
          {failureCopy(result)}
        </div>
      ) : null}

      {currentOk ? (
        <div
          className="admin-svg-preview admin-svg-preview--panel"
          data-artifact-state="published"
          data-testid="admin-svg-livepreview-symbol"
        >
          <div
            className="admin-svg-preview__stage"
            role="img"
            aria-label="Live compiled SVG preview — Planner symbol"
            aria-busy={pending ? "true" : undefined}
            // Server-sanitized compile output only (S3 sanitize/optimize).
            dangerouslySetInnerHTML={{ __html: okSvg ?? "" }}
          />
          {pending ? (
            <p className="admin-svg-preview__meta admin-page__meta text-muted">
              Updating preview…
            </p>
          ) : null}
        </div>
      ) : dimmedSvg ? (
        <div
          className="admin-svg-preview admin-svg-preview--panel admin-svg-preview--stale"
          data-artifact-state="stale"
          data-testid="admin-svg-livepreview-fallback"
          aria-hidden="true"
        >
          <div
            className="admin-svg-preview__stage"
            // Last good compile output (server-sanitized).
            dangerouslySetInnerHTML={{ __html: dimmedSvg }}
          />
          <p className="admin-page__meta" data-testid="admin-svg-livepreview-fallback-note">
            Fallback: last valid compile (current draft failed validation or compile).
          </p>
        </div>
      ) : (
        <div
          className="admin-svg-preview admin-svg-preview--panel"
          data-artifact-state="missing"
          data-testid="admin-svg-livepreview-empty"
        >
          <div className="admin-svg-preview__stage admin-svg-preview__stage--empty">
            <span className="admin-svg-preview__empty">
              {pending
                ? "Compiling…"
                : "Draw a shape in the visual studio to generate the preview"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveCompiledSvgPreview;
