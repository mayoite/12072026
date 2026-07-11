/**
 * 04-ADMIN-01: /admin/svg-editor list view.
 * Gated by parent /admin layout (requireAuthUser 'admin').
 * Thin RSC route: disk loadAll → AdminSvgEditorListView (admin-page shell lives in the view).
 * GS: BP-04, design §11, I-D, anti-copy; loader boundary, no any.
 */

import type { Metadata } from "next";
import AdminSvgEditorListView from "@/features/planner/admin/svg-editor/AdminSvgEditorListView";
import { readSvgArtifactStatuses } from "@/features/planner/admin/svg-editor/svgArtifactStatus.server";
import { loadAll } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

export const metadata: Metadata = {
  title: "SVG block editor | Oando Admin",
  description:
    "Puck-managed SVG block descriptors — fixed, configurable, and parametric variants.",
};

/** Catalog is disk-backed; always re-read after admin publish/refresh. */
export const dynamic = "force-dynamic";

export default async function AdminSvgEditorListPage() {
  const descriptors = loadAll();
  const refreshedAtLabel = new Date().toISOString();
  const artifactStatuses = readSvgArtifactStatuses(
    descriptors.map((descriptor) => descriptor.slug),
  );
  return (
    <AdminSvgEditorListView
      descriptors={descriptors}
      refreshedAtLabel={refreshedAtLabel}
      artifactStatuses={artifactStatuses}
    />
  );
}
