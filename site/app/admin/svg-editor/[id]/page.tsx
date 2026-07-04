/**
 * 04-ADMIN-02: /admin/svg-editor/[id] edit (or /new).
 * Loads via svgBlockDescriptorLoader.tryLoad (or defaults for "new").
 * Renders AdminSvgEditorEditView (JSON + fields) + Puck preview mount using puckConfig + getPuckData.
 * Gated by parent admin layout.
 * RSC + client islands for edit form.
 */

import { notFound } from "next/navigation";
import { AdminSvgEditorEditView } from "@/features/planner/admin/svg-editor/AdminSvgEditorEditView";
import {
  tryLoad,
  type BlockDescriptor,
} from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import {
  puckConfig,
  getPuckData,
  type PuckConfig,
  type PuckDataShape,
} from "@/features/planner/admin/svg-editor/puckBlockRegistry";
import { Render } from "@puckeditor/core";

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

  const puckData = getPuckData(descriptor);

  return (
    <div>
      <AdminSvgEditorEditView
        slug={descriptor.slug}
        descriptor={descriptor}
        updatedAtLabel={updatedAtLabel}
      />

      {/* 04-ADMIN-02 Puck mount for visual preview (config from registry).
         Admin edit uses registry-driven Render (Puck.Render equiv) + EditView json for descriptor metadata.
         Full <Puck config=... onPublish=...> editor can mount here for visual block props (per phase spec "edit with Puck").
         GS BP-04 (allowed pkgs), BP-05 (1 Render/route hard), design §7/11, I-D, anti-copy (semantic tokens, no donor trade-dress), 5-product model.
         Uses loader.tryLoad + registry; error taxonomy via notFound. */}
      <section aria-label="Puck preview" className="mt-6 border-t pt-4">
        <h2 className="text-sm font-medium mb-2">Live render preview (Puck)</h2>
        <div className="rounded border bg-panel p-3">
          <Render config={puckConfig as unknown as PuckConfig} data={puckData as unknown as PuckDataShape} />
        </div>
      </section>
    </div>
  );
}
