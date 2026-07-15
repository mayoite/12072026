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

export function AdminSvgPreviewRail({
  slug,
  preview,
  previewPending,
  artifactStatus,
}: AdminSvgPreviewRailProps) {
  return (
    <aside
      aria-label="Preview viewports"
      className="admin-svg-engine-shell__rail admin-svg-engine-shell__rail--preview"
    >
      <div className="admin-panel admin-svg-engine-shell__panel">
        <div className="admin-panel__header">Draft preview</div>
        <div className="admin-panel__body">
          <LiveCompiledSvgPreview result={preview} pending={previewPending} />
        </div>
      </div>
      <article
        className="admin-panel admin-svg-engine-shell__panel"
        data-artifact-state={artifactStatus.state}
        data-testid="admin-svg-artifact-panel"
      >
        <div className="admin-panel__header">Published symbol</div>
        <div className="admin-panel__body">
          <PublishedSvgPreview slug={slug} status={artifactStatus} size="panel" />
        </div>
      </article>
    </aside>
  );
}
