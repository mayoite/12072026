/**
 * 05-PORT-01: /portal/svg-catalog index.
 * loadAll() -> card grid with thumbs (R2 PNG) + links to slug.
 * RSC. a11y roving + live region per spec.
 * GS: BP-05 (anti-copy, 1 Render), design §7/9, I-D; uses loader + alias for registry (no fork).
 */

import Link from "next/link";
import Image from "next/image";
import { loadAll } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

const THUMB_BUCKET = "site-block-thumbs";

function thumbUrl(slug: string): string {
  const account = (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
  if (account) {
    return `https://${account}.r2.cloudflarestorage.com/${THUMB_BUCKET}/${slug}.png`;
  }
  return `https://cdn.oando.co.in/${THUMB_BUCKET}/${slug}.png`;
}

export default async function SvgCatalogIndex() {
  const descriptors = loadAll();
  const version = "2026-07-04.v2";

  return (
    <div className="portal-svg-catalog">
      <header>
        <h1>SVG catalog</h1>
        <p>Public previews of Puck-authored block descriptors. Schema {version}.</p>
      </header>

      <div role="status" aria-live="polite" className="sr-only">
        {descriptors.length} blocks available
      </div>

      {descriptors.length === 0 ? (
        <p>No blocks published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
          {descriptors.map((d) => (
            <Link
              key={d.slug}
              href={`/portal/svg-catalog/${d.slug}`}
              className="block border rounded p-3 hover:bg-muted"
              role="listitem"
            >
              <div className="mb-2">
                <Image
                  src={thumbUrl(d.slug)}
                  alt={`${d.slug} thumbnail`}
                  width={240}
                  height={120}
                  className="w-full h-auto"
                />
              </div>
              <div>
                <code>{d.slug}</code>
                <span className="ml-2 text-xs opacity-70">{d.variant}</span>
              </div>
              <div className="text-xs text-muted">v{d.schemaVersion}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
