import { LiveCompiledSvgPreview } from "../../publish/LiveCompiledSvgPreview";
import { PublishedSvgPreview } from "../../publish/PublishedSvgPreview";
import type { SvgArtifactStatus } from "../../publish/svgArtifactStatus.server";
import type { AdminSvgPreviewResult } from "./types";

interface AdminSvgPreviewRailProps {
  readonly slug: string;
  readonly preview: AdminSvgPreviewResult | null;
  readonly previewPending: boolean;
  readonly artifactStatus: SvgArtifactStatus;
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

export function AdminSvgPreviewRail({
  slug,
  preview,
  previewPending,
  artifactStatus,
}: AdminSvgPreviewRailProps) {
  return (
    <aside
      aria-label="Draft and released previews"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--preview"
      data-testid="admin-svg-preview-rail"
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Draft preview</div>
        <div className="admin-panel__body">
          <p className="admin-page__meta admin-svg-engine-shell__rail-hint">
            What Publish will release to Planner.
          </p>
          <LiveCompiledSvgPreview result={preview} pending={previewPending} />
        </div>
      </div>
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
