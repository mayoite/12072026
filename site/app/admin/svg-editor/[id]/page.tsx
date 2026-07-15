import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { notFound } from "next/navigation";

import { AdminSvgEditorV2 } from "@/features/admin/svg-editor-v2/ui/AdminSvgEditorV2";
import type { SvgAssetManifestV2 } from "@/features/admin/svg-editor-v2/model/svgAssetManifestV2";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/newBlockDescriptorStub";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import { tryLoad, type BlockDescriptor } from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import { resolvePublicDir } from "@/lib/paths/sitePackageRoot.server";

export const dynamic = "force-dynamic";

function readReleasedSvg(slug: string): string | null {
  const file = path.join(resolvePublicDir(), "svg-catalog", `${slug}.svg`);
  if (!existsSync(file)) return null;
  try {
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function toManifest(descriptor: BlockDescriptor): SvgAssetManifestV2 {
  const timestamp = new Date(descriptor.generatedAt ?? Date.now()).toISOString();
  return {
    version: 2,
    assetId: descriptor.id,
    productId: descriptor.parentProductId ?? null,
    slug: descriptor.slug,
    name: descriptor.sku ?? descriptor.slug.replaceAll("-", " "),
    assetKind: descriptor.variant,
    dimensionsMm: {
      width: descriptor.geometry.widthMm,
      depth: descriptor.geometry.depthMm,
      height: descriptor.geometry.heightMm,
    },
    sourceChecksum: descriptor.checksum,
    lifecycle: "draft",
    currentVersion: 1,
    capabilities: ["geometry"],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function resolveInitialSvg(descriptor: BlockDescriptor, isNew: boolean): Promise<string> {
  if (isNew) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${descriptor.viewBox.width} ${descriptor.viewBox.height}" />`;
  }
  const released = readReleasedSvg(descriptor.slug);
  if (released) return released;
  const compiled = await compileSvgForPublish(descriptor);
  if (!compiled.ok) throw new Error(`Unable to compile SVG editor asset: ${descriptor.slug}`);
  return compiled.svg;
}

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
  return <AdminSvgEditorV2 manifest={toManifest(descriptor)} initialSvg={await resolveInitialSvg(descriptor, isNew)} />;
}
