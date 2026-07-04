/**
 * 04-ADMIN-01: /admin/svg-editor list view.
 * Gated by parent /admin layout (requireAuthUser 'admin').
 * Uses loader + AdminSvgEditorListView (puckBlockRegistry surface available via props).
 * RSC.
 * GS cites: BP-04, design §11, I-D, anti-copy; follows architecture (loader, no any, withAuth at api boundary).
 */

import AdminSvgEditorListView from "@/features/planner/admin/svg-editor/AdminSvgEditorListView";
import { loadAll } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

export default async function AdminSvgEditorListPage() {
  const descriptors = loadAll();
  const refreshedAtLabel = new Date().toISOString();
  return (
    <AdminSvgEditorListView
      descriptors={descriptors}
      refreshedAtLabel={refreshedAtLabel}
    />
  );
}
