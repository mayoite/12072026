/**
 * 04-ADMIN-02 + 1B P0: /admin/svg-editor/[id] edit (or /new).
 * Loads via svgBlockDescriptorLoader.tryLoad (or defaults for "new").
 * Renders AdminSvgEditorEditView now mounting full <Puck config onPublish> (replaces JSON + Render preview).
 * onPublish server action: build descriptor → runSvgPipeline → persist (fail-closed; matches API route).
 * Gated by parent admin layout. RSC + client Puck.
 *
 * GS: BP-04 (Puck+Ark+RAC chrome only — no Radix), BP-05 (≤1 Render/route; this route now uses Puck editor),
 * REC-01, anti-copy (semantic tokens site/app/css/ only; no hex), 5-product model.
 */

import { notFound } from "next/navigation";
import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";
import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import {
  puckEditorDataToDescriptorInput,
  type PuckDataShape,
} from "@/features/planner/admin/svg-editor/puckBlockRegistry";
import { publishDescriptorWithPipeline } from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";

// Default stub for /new — matches registry defaults shape (minimal valid fixed)
function makeNewDefault(): BlockDescriptor {
  const now = Math.floor(Date.now());
  return {
    schemaVersion: "2026-07-04.v2",
    id: "00000000-0000-4000-8000-000000000000",
    slug: "new-block",
    sourceProvenance: "native",
    geometry: { widthMm: 600, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" },
    rovingFocus: [],
    liveAnnouncementCategories: ["status"],
    generatedAt: now,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: "0".repeat(64), // overwritten on persist
  } as BlockDescriptor;
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
    descriptor = makeNewDefault();
  } else {
    const result = tryLoad(slug);
    if (!result.ok) {
      notFound();
    }
    descriptor = result.value;
  }

  const updatedAtLabel = new Date(descriptor.generatedAt ?? 0)
    .toISOString()
    .replace("T", " ")
    .replace(/\..*$/, "");

  return (
    <div>
      <AdminSvgEditorEditView
        slug={slug}
        descriptor={descriptor}
        updatedAtLabel={updatedAtLabel}
        onPublishAction={(puckDataFromEditor) => publishViaPuck(slug, puckDataFromEditor)}
      />
      {/* Full Puck editor now inside EditView (with live preview from registry render fns). No separate <Render> here (BP-05). */}
    </div>
  );
}

// Server action extracted (critical fix for unstable identity/closure).
// Accepts slug + data, re-loads descriptor inside to avoid capturing from render scope.
// Fail-closed: pipeline before persist (same order as POST /api/admin/svg-editor).
async function publishViaPuck(
  slug: string,
  puckDataFromEditor: PuckDataShape,
): Promise<{ success?: boolean; error?: string }> {
  "use server";
  let descriptor: BlockDescriptor;
  if (slug === "new") {
    descriptor = makeNewDefault();
  } else {
    const result = tryLoad(slug);
    if (!result.ok) {
      return { success: false, error: "not found" };
    }
    descriptor = result.value;
  }
  // GS: BP-04, BP-05, anti-copy. onPublish path for 1B admin UX (draft/preview, validation fail/recover).
  const input = puckEditorDataToDescriptorInput(descriptor, puckDataFromEditor);
  return publishDescriptorWithPipeline(input);
}
