/**
 * 04-ADMIN-01: /admin/svg-editor list view.
 * Gated by parent /admin layout (requireAuthUser 'admin').
 * Thin RSC route: disk loadAll → AdminSvgEditorListView (admin-page shell lives in the view).
 * Dual-write mode is resolved server-side (mode string only; no secrets to client).
 * GS: BP-04, design §11, I-D, anti-copy; loader boundary, no any.
 */

import type { Metadata } from "next";
import AdminSvgEditorListView from "@/features/admin/svg-editor/views/AdminSvgEditorListView";
import { readLifecycleManifest } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import type { SvgPublishDualWriteMode } from "@/features/admin/svg-editor/publish/svgPublishDualWriteMode";
import { readSvgArtifactStatuses } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { loadAll } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

export const metadata: Metadata = {
  title: "SVG block editor | Oando Admin",
  description:
    "No-code SVG block descriptors — fixed, configurable, and parametric variants.",
};

/** Catalog is disk-backed; always re-read after admin publish/refresh. */
export const dynamic = "force-dynamic";

async function resolveListDualWriteMode(): Promise<SvgPublishDualWriteMode> {
  try {
    const dualWrite = await resolveSvgPublishDualWriteDeps();
    return dualWrite.mode;
  } catch {
    // Fail closed for display: do not invent enabled/cutover on probe errors.
    return "skipped_no_db";
  }
}

export default async function AdminSvgEditorListPage() {
  const descriptors = loadAll({ forceReload: true });
  const refreshedAtLabel = new Date().toISOString();
  const artifactStatuses = readSvgArtifactStatuses(
    descriptors.map((descriptor) => descriptor.slug),
  );
  const lifecycleManifest = readLifecycleManifest();
  const dualWriteMode = await resolveListDualWriteMode();
  return (
    <AdminSvgEditorListView
      descriptors={descriptors}
      refreshedAtLabel={refreshedAtLabel}
      artifactStatuses={artifactStatuses}
      lifecycleManifest={lifecycleManifest}
      dualWriteMode={dualWriteMode}
    />
  );
}
