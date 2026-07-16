/**
 * 05-PORT-02: /portal/svg-catalog/[slug]
 * getPuckData + loader.tryLoad, <Render config from alias>, inline SVG (fs), PNG R2, metadata, 404, pillbar, a11y.
 * RSC.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    <div className="shell-portal-page portal-svg-detail mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-12">
      <nav className="portal-svg-catalog__nav mb-4 md:mb-5" aria-label="Portal">
        <Link href="/portal/svg-catalog/" className="portal-svg-catalog__back">
          Back to SVG catalog
        </Link>
      </nav>

      <header className="shell-portal-panel p-5 sm:p-6 md:p-8">
        <p className="shell-portal-table-label">Block descriptor</p>
        <h1 className="shell-portal-page-title mt-2 break-all">
          <code>{slug}</code>
        </h1>
        <p className="shell-portal-table-meta mt-2">
          {descriptor.variant} · schema {schemaVersion}
        </p>
        <div className="portal-svg-detail__pillbar mt-4 flex flex-wrap gap-2" aria-label="Versions">
          <span className="shell-portal-panel-soft px-2.5 py-1 text-xs">
            registry: {registryVersion}
          </span>
          <span className="shell-portal-panel-soft px-2.5 py-1 text-xs">
            schema: {schemaVersion}
          </span>
        </div>
      </header>

      <section
        aria-label="Puck render"
        className="shell-portal-panel mt-5 overflow-x-auto p-4 md:mt-6 md:p-6"
      >
        {/* <Render> (Puck.Render per task/phase) using alias + registry. 1 mount per route (BP-05).
           GS-BP-05 · handover-routing.md · anti-copy · design §9 · I-D module paths
           No donor trade dress; semantic + roving a11y per benchmark. */}
        <Render config={puckConfig as unknown as PuckConfig} data={data as unknown as PuckDataShape} />
      </section>

      {inlineSvg && (
        <section aria-label="Inline SVG source" className="shell-portal-panel mt-5 overflow-x-auto p-4 md:mt-6 md:p-6">
          <h2 className="shell-portal-section-title">SVG</h2>
          <div
            dangerouslySetInnerHTML={{ __html: inlineSvg }}
            className="svg-inline svg-catalog-vector mt-3"
            // role/img + aria from Phase 03 sanitize + descriptor.title
          />
        </section>
      )}

      <section aria-label="PNG thumb" className="shell-portal-panel mt-5 p-4 md:mt-6 md:p-6">
        <h2 className="shell-portal-section-title">PNG preview</h2>
        <div className="svg-catalog-thumb-wrap shell-portal-thumbnail mt-3">
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
        </div>
      </section>

      <div role="status" aria-live="polite" className="sr-only">
        Loaded {slug} version {schemaVersion}
      </div>
    </div>
  );
}
