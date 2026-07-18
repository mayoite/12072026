import { LiveCompiledSvgPreview } from "../../publish/LiveCompiledSvgPreview";
import { PublishedSvgPreview } from "../../publish/PublishedSvgPreview";
import type { SvgArtifactStatus } from "../../publish/svgArtifactStatus.server";
import type { AdminSvgPreviewResult } from "./types";

interface AdminSvgPreviewRailProps {
  readonly slug: string;
  readonly preview: AdminSvgPreviewResult | null;
  readonly previewPending: boolean;
  readonly artifactStatus: SvgArtifactStatus;
  /** Maker recipe when present — publish geometry is not studio sketch. */
  readonly makerRecipe?: string | null;
  /** IR strip: maker name or N blocks · variant. */
  readonly publishIrStrip?: string;
  /** Studio sketch SVG (secondary only; never compiler authority). */
  readonly studioSketchSvg?: string;
}

function releasedStateLabel(state: SvgArtifactStatus["state"]): string {
  switch (state) {
    case "published":
      return "Released to Planner";
    case "missing":
      return "Not released yet";
    case "invalid":
      return "Released file needs repair";
  }
}

function isRenderableSketch(svg: string | undefined): svg is string {
  if (typeof svg !== "string") return false;
  const trimmed = svg.trimStart();
  return trimmed.startsWith("<svg") && !/<script/i.test(svg);
}

export function AdminSvgPreviewRail({
  slug,
  preview,
  previewPending,
  artifactStatus,
  makerRecipe = null,
  publishIrStrip,
  studioSketchSvg = "",
}: AdminSvgPreviewRailProps) {
  const hasMaker = Boolean(makerRecipe);

  return (
    <aside
      aria-label="Draft and released previews"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--preview"
      data-testid="admin-svg-preview-rail"
      tabIndex={0}
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Publish preview</div>
        <div className="admin-panel__body">
          <p className="admin-page__meta admin-svg-engine-shell__rail-hint">
            Same server compile as Publish.
          </p>
          {publishIrStrip ? (
            <p
              className="admin-page__meta"
              data-testid="admin-svg-publish-ir-strip"
            >
              {publishIrStrip}
            </p>
          ) : null}
          {hasMaker ? (
            <p
              className="admin-alert admin-alert--info"
              role="status"
              data-testid="admin-svg-maker-geometry-banner"
            >
              Publish geometry is maker recipe; studio sketch is not released.
            </p>
          ) : (
            <p
              className="admin-page__meta"
              data-testid="admin-svg-form-geometry-note"
            >
              Geometry for Publish comes from product form (blocks or maker).
              Studio is not released.
            </p>
          )}
          <LiveCompiledSvgPreview result={preview} pending={previewPending} />
        </div>
      </div>

      <details
        className="admin-panel admin-svg-engine-shell__panel"
        data-testid="admin-svg-studio-sketch"
      >
        <summary className="admin-panel__header">
          Studio sketch — drawing aid only; not what guests get
        </summary>
        <div className="admin-panel__body">
          {isRenderableSketch(studioSketchSvg) ? (
            <div
              className="admin-svg-preview admin-svg-preview--panel admin-svg-preview--sketch"
              data-testid="admin-svg-studio-sketch-stage"
              // Never data-compiler-authority — studio is not publish geometry.
              dangerouslySetInnerHTML={{ __html: studioSketchSvg }}
            />
          ) : (
            <p
              className="admin-page__meta"
              data-testid="admin-svg-studio-sketch-empty"
            >
              No studio sketch yet. Sketch is optional when blocks or maker
              define publish geometry.
            </p>
          )}
        </div>
      </details>

      <article
        className="admin-panel admin-svg-engine-shell__panel"
        data-artifact-state={artifactStatus.state}
        data-testid="admin-svg-artifact-panel"
      >
        <div className="admin-panel__header">Released symbol</div>
        <div className="admin-panel__body">
          <p
            className="admin-page__meta admin-svg-engine-shell__rail-hint"
            data-testid="admin-svg-released-state"
          >
            {releasedStateLabel(artifactStatus.state)}
          </p>
          <PublishedSvgPreview slug={slug} status={artifactStatus} size="panel" />
        </div>
      </article>
    </aside>
  );
}
