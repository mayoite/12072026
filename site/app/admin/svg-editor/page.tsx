/**
 * 04-ADMIN-01: /admin/svg-editor — one Product Studio page.
 * Inventory list OR desk-assembly factory via ?new=desk-assembly | ?edit=<slug>.
 * Gated by parent /admin layout (requireAuthUser 'admin').
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  adminSvgEditorEditHref,
  isDeskAssemblyFactorySlug,
} from "@/features/admin/svg-editor/parametric/deskAssemblyFactoryIdentity";
import { loadDeskAssemblyDisplayForEdit } from "@/features/admin/svg-editor/parametric/loadDeskAssemblyAuthoring.server";
import {
  AdminProductStudioView,
  parseAdminProductStudioMode,
} from "@/features/admin/svg-editor/views/AdminProductStudioView";
import { readLifecycleManifest } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import type { SvgPublishDualWriteMode } from "@/features/admin/svg-editor/publish/svgPublishDualWriteMode";
import { readSvgArtifactStatuses } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { loadAll } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";

export const metadata: Metadata = {
  title: "Product Studio | Oando Admin",
  description:
    "Product plan symbols — inventory, desk assembly, preview, and publish on one page.",
};

/** Catalog is disk-backed; always re-read after admin publish/refresh. */
export const dynamic = "force-dynamic";

async function resolveListDualWriteMode(): Promise<SvgPublishDualWriteMode> {
  try {
    const dualWrite = await resolveSvgPublishDualWriteDeps();
    return dualWrite.mode;
  } catch {
    return "skipped_no_db";
  }
}

type StudioSearchParams = {
  readonly new?: string | string[];
  readonly edit?: string | string[];
};

export default async function AdminSvgEditorListPage({
  searchParams,
}: {
  readonly searchParams?: Promise<StudioSearchParams>;
}) {
  const params: StudioSearchParams = (await searchParams) ?? {};
  const editRaw = Array.isArray(params.edit) ? params.edit[0] : params.edit;
  const editSlug = typeof editRaw === "string" ? editRaw.trim() : "";
  if (editSlug.length > 0 && !isDeskAssemblyFactorySlug(editSlug)) {
    redirect(adminSvgEditorEditHref(editSlug));
  }
  const mode = parseAdminProductStudioMode(params);
  const hydratedMode =
    mode.kind === "factory" && mode.editSlug
      ? {
          ...mode,
          initialDisplay: loadDeskAssemblyDisplayForEdit(mode.editSlug) ?? undefined,
        }
      : mode;
  const descriptors = loadAll({ forceReload: true });
  const refreshedAtLabel = new Date().toISOString();
  const artifactStatuses = readSvgArtifactStatuses(
    descriptors.map((descriptor) => descriptor.slug),
  );
  const lifecycleManifest = readLifecycleManifest();
  const dualWriteMode = await resolveListDualWriteMode();
  return (
    <AdminProductStudioView
      mode={hydratedMode}
      descriptors={descriptors}
      refreshedAtLabel={refreshedAtLabel}
      artifactStatuses={artifactStatuses}
      lifecycleManifest={lifecycleManifest}
      dualWriteMode={dualWriteMode}
    />
  );
}
