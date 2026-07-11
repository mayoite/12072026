/**
 * 04-ADMIN-02 + 1B P0: /admin/svg-editor/[id] edit (or /new).
 * Loads via svgBlockDescriptorLoader.tryLoad (or defaults for "new").
 * Renders AdminSvgEditorEditView with full Puck + server-action publish.
 * Gated by parent admin layout. RSC + client Puck.
 *
 * Server Action rule: pass `publishSvgEditorAction.bind(null, slug)` only —
 * never an arrow wrapper around the action (breaks Server Action identity).
 */

import { notFound } from "next/navigation";
import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";
import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import { makeNewBlockDescriptorStub } from "@/features/planner/admin/svg-editor/newBlockDescriptorStub";
import { publishSvgEditorAction } from "@/features/planner/admin/svg-editor/publishSvgEditorAction";
import { readSvgArtifactStatus } from "@/features/planner/admin/svg-editor/svgArtifactStatus.server";

/** Disk descriptors can change under admin publish — never static-cache this route. */
export const dynamic = "force-dynamic";

function formatDescriptorStamp(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return "—";
  }
  const normalized = value < 1e12 ? value * 1000 : value;
  try {
    return new Date(normalized)
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, " UTC");
  } catch {
    return String(value);
  }
}

export default async function AdminSvgEditorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawSlug } = await params;
  const slug = rawSlug === "new" ? "new" : rawSlug;

  let descriptor: BlockDescriptor;
  if (slug === "new") {
    descriptor = makeNewBlockDescriptorStub();
  } else {
    const result = tryLoad(slug);
    if (!result.ok) {
      notFound();
    }
    descriptor = result.value;
  }

  const updatedAtLabel = formatDescriptorStamp(descriptor.generatedAt);

  // Bind slug so Client Component receives a Server Action ref (not a page wrapper fn).
  const onPublishAction = publishSvgEditorAction.bind(null, slug);
  const artifactStatus = readSvgArtifactStatus(slug);

  return (
    <AdminSvgEditorEditView
      slug={slug}
      descriptor={descriptor}
      updatedAtLabel={updatedAtLabel}
      artifactStatus={artifactStatus}
      onPublishAction={onPublishAction}
    />
  );
}
