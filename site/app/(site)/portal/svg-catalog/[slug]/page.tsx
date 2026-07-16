/**
 * 05-PORT-02: /portal/svg-catalog/[slug]
 * getPuckData + loader.tryLoad, <Render config from alias>, inline SVG (fs), PNG R2, metadata, 404, pillbar, a11y.
 * RSC.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import { resolvePublicDir } from "@/lib/paths/sitePackageRoot.server";
import { Render } from "@puckeditor/core";
import {
  tryLoad,
} from "@/features/planner/project/catalog/svg/svgBlockDescriptorLoader";
import {
  puckConfig,
  getPuckData,
  type PuckConfig,
  type PuckDataShape,
} from "../puckBlockRegistry";
import {
  buildBlockThumbPngUrl,
  buildBlockThumbSrcSet,
} from "@/features/planner/project/catalog/svg/svgPreviewAssets";

function readInlineSvg(slug: string): string | null {
  const p = path.join(resolvePublicDir(), "svg-catalog", `${slug}.svg`);
  if (!existsSync(p)) return null;
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = tryLoad(slug);
  if (!result.ok) {
    return { title: "Not found | SVG catalog", robots: { index: false } };
  }
  const d = result.value;
  const png = buildBlockThumbPngUrl(slug);
  return {
    title: `${d.slug} | SVG catalog`,
    description: `Puck-rendered ${d.variant} block descriptor (schema ${d.schemaVersion})`,
    openGraph: {
      images: [{ url: png }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SvgCatalogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const load = tryLoad(slug);
  if (!load.ok) {
    notFound();
  }
  const descriptor = load.value;

  const data = getPuckData(descriptor);
  const inlineSvg = readInlineSvg(slug);
  const pngUrl = buildBlockThumbPngUrl(slug);
  const pngSrcSet = buildBlockThumbSrcSet(slug);

  // pillbar versions
  const registryVersion = "registry-2026-07-04";
  const schemaVersion = descriptor.schemaVersion;

  return (
    <main className="portal-svg-detail">
      <div className="pillbar text-xs flex gap-2 mb-3" aria-label="Versions">
        <span className="px-2 py-0.5 border rounded">registry: {registryVersion}</span>
        <span className="px-2 py-0.5 border rounded">schema: {schemaVersion}</span>
      </div>

      <h1>
        <code>{slug}</code> <span className="text-sm">({descriptor.variant})</span>
      </h1>

      <section aria-label="Puck render" className="my-4 border p-3">
        {/* <Render> (Puck.Render per task/phase) using alias + registry. 1 mount per route (BP-05). 
           GS-BP-05 · handover-routing.md · anti-copy · design §9 · I-D module paths 
           No donor trade dress; semantic + roving a11y per benchmark. */}
        <Render config={puckConfig as unknown as PuckConfig} data={data as unknown as PuckDataShape} />
      </section>

      {inlineSvg && (
        <section aria-label="Inline SVG source" className="my-4">
          <h2 className="text-sm">SVG</h2>
          <div
            dangerouslySetInnerHTML={{ __html: inlineSvg }}
            className="svg-inline svg-catalog-vector"
            // role/img + aria from Phase 03 sanitize + descriptor.title
          />
        </section>
      )}

      <section aria-label="PNG thumb">
        <Image
          src={pngUrl}
          alt={`${slug} thumbnail`}
          width={512}
          height={256}
          sizes="(max-width: 640px) 100vw, 512px"
          className="svg-catalog-thumb"
          loading="lazy"
          unoptimized
          data-srcset={pngSrcSet}
        />
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        Loaded {slug} version {schemaVersion}
      </div>
    </main>
  );
}
