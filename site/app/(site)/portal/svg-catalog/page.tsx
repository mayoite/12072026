/**
 * 05-PORT-01: /portal/svg-catalog index.
 * loadAll() -> card grid with thumbs (R2 PNG) + links to slug.
 * RSC. a11y roving + live region per spec.
 * GS: BP-05 (anti-copy, 1 Render), design §7/9, I-D; uses loader + alias for registry (no fork).
 *
 * Roving-focus keyboard nav lives in the client boundary `SvgCatalogGrid.tsx`
 * (ArrowUp/Down/Left/Right + Home/End, WAI-ARIA roving tabindex) since RSC
 * pages cannot own DOM focus state.
 */

import { loadAll } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";
import { SvgCatalogGrid } from "./SvgCatalogGrid";

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
        <SvgCatalogGrid
          cards={descriptors.map((d) => ({
            slug: d.slug,
            variant: d.variant,
            schemaVersion: d.schemaVersion,
            thumbUrl: thumbUrl(d.slug),
          }))}
        />
      )}
    </div>
  );
}
