/**
 * 04-ADMIN-01: /admin/svg-editor list view.
 * Gated by parent /admin layout (requireAuthUser 'admin').
 * Thin RSC route: disk loadAll → AdminSvgEditorListView (admin-page shell lives in the view).
 * GS: BP-04, design §11, I-D, anti-copy; loader boundary, no any.
 */

import type { Metadata } from "next";
import AdminSvgEditorListView from "@/features/admin/svg-editor/views/AdminSvgEditorListView";
import { readLifecycleManifest } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { readSvgArtifactStatuses } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { loadAll } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";

export const metadata: Metadata = {
  title: "SVG block editor | Oando Admin",
  description:
    "No-code SVG block descriptors — fixed, configurable, and parametric variants.",
};

/** Catalog is disk-backed; always re-read after admin publish/refresh. */
export const dynamic = "force-dynamic";

export default async function AdminSvgEditorListPage() {
  const descriptors = loadAll();
  const refreshedAtLabel = new Date().toISOString();
  const artifactStatuses = readSvgArtifactStatuses(
    descriptors.map((descriptor) => descriptor.slug),
  );
  const lifecycleManifest = readLifecycleManifest();
  return (
    <AdminSvgEditorListView
      descriptors={descriptors}
      refreshedAtLabel={refreshedAtLabel}
      artifactStatuses={artifactStatuses}
      lifecycleManifest={lifecycleManifest}
    />
  );
}
