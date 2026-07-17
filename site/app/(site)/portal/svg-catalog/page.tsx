/**
 * 05-PORT-01: /portal/svg-catalog index.
 * loadBuyerVisibleDescriptors() -> card grid with thumbs (R2 PNG / local SVG) + links to slug.
 * RSC. a11y roving + live region per spec.
 * GS: BP-05 (anti-copy, 1 Render), design §7/9, I-D; uses loader + alias for registry (no fork).
 *
 * Roving-focus keyboard nav lives in the client boundary `SvgCatalogGrid.tsx`
 * (ArrowUp/Down/Left/Right + Home/End, WAI-ARIA roving tabindex) since RSC
 * pages cannot own DOM focus state.
 */

import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { loadBuyerVisibleDescriptors } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import {
  buildBlockThumbPngUrl,
  buildSvgCatalogPublicUrl,
} from "@/features/planner/catalog/svg/svgPreviewAssets";
import { SvgCatalogGrid } from "./SvgCatalogGrid";

function resolveSvgPublicUrl(slug: string): string | undefined {
  const svgPath = path.resolve(process.cwd(), "public", "svg-catalog", `${slug}.svg`);
  return existsSync(svgPath) ? buildSvgCatalogPublicUrl(slug) : undefined;
}

export default async function SvgCatalogIndex() {
  const descriptors = loadBuyerVisibleDescriptors();
  const version = "2026-07-04.v2";
  const count = descriptors.length;

  return (
    <div className="shell-portal-page portal-svg-catalog mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-12">
      <nav className="portal-svg-catalog__nav mb-4 md:mb-5" aria-label="Portal">
        <Link href="/portal/" className="portal-svg-catalog__back">
          Back to portal
        </Link>
      </nav>

      <header className="shell-portal-panel portal-svg-catalog__header p-5 sm:p-6 md:p-8">
        <p className="shell-portal-table-label">Public inventory</p>
        <h1 className="shell-portal-page-title mt-2">SVG catalog</h1>
        <p className="shell-portal-table-meta mt-3 max-w-3xl">
          Public previews of published block descriptors. Schema {version}.
        </p>
        <p className="shell-portal-table-meta mt-2" aria-hidden={count === 0}>
          {count === 0
            ? "No buyer-visible blocks yet"
            : `${count} block${count === 1 ? "" : "s"} available`}
        </p>
      </header>

      <div role="status" aria-live="polite" className="sr-only">
        {count} blocks available
      </div>

      {count === 0 ? (
        <section
          className="shell-portal-panel portal-svg-catalog__empty mt-5 p-6 md:mt-6 md:p-8"
          data-testid="portal-svg-catalog-empty"
        >
          <div className="shell-portal-empty-icon shell-portal-empty-icon--soft" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7.5h16M4 12h10M4 16.5h14"
              />
            </svg>
          </div>
          <h2 className="shell-portal-section-title">No blocks published yet</h2>
          <p className="shell-portal-table-meta mt-2 max-w-xl">
            When Admin publishes buyer-visible block descriptors, their SVG and PNG previews
            appear here for public review.
          </p>
        </section>
      ) : (
        <section className="portal-svg-catalog__body mt-5 md:mt-6" aria-label="Catalog blocks">
          <SvgCatalogGrid
            cards={descriptors.map((d) => ({
              slug: d.slug,
              variant: d.variant,
              schemaVersion: d.schemaVersion,
              thumbUrl: buildBlockThumbPngUrl(d.slug),
              svgUrl: resolveSvgPublicUrl(d.slug),
            }))}
          />
        </section>
      )}
    </div>
  );
}
