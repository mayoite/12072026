import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

import { AdminSvgEditorEditView } from "@/features/admin/svg-editor/views/AdminSvgEditorEditView";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { tryLoad, type BlockDescriptor } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { readLifecycleManifest, resolveCatalogLifecycle } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { publishSvgEditorAction } from "@/features/admin/svg-editor/publish/publishSvgEditorAction";

export const dynamic = "force-dynamic";

export default async function AdminSvgEditorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  let descriptor: BlockDescriptor;
  if (isNew) {
    descriptor = makeNewBlockDescriptorStub();
  } else {
    const result = tryLoad(id);
    if (!result.ok) notFound();
    descriptor = result.value;
  }
  
  const artifactStatus = isNew ? { state: "missing" as const, bytes: 0, updatedAt: null, hash: null, publicUrl: null, markup: null } : readSvgArtifactStatus(descriptor.slug);
  const manifest = readLifecycleManifest();
  const catalogLifecycle = isNew ? "draft" : resolveCatalogLifecycle(descriptor.slug, artifactStatus.state, manifest);
  
  // Format dates for UI
  const generatedAt = descriptor.generatedAt ? new Date(descriptor.generatedAt) : new Date();
  const updatedAtLabel = generatedAt.toLocaleString();

  // If descriptor has excalidrawElements, they will be loaded automatically into FormState via descriptorToFormState

  return (
    <main className="h-full w-full">
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel={updatedAtLabel}
        artifactStatus={artifactStatus}
        catalogLifecycle={catalogLifecycle}
        onPublishAction={publishSvgEditorAction.bind(null, id)}
      />
    </main>
  );
}
