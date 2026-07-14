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

import { existsSync } from "node:fs";
import path from "node:path";

import { loadBuyerVisibleDescriptors } from "@/features/admin/svg-editor/catalogLifecycle";
import {
  buildBlockThumbPngUrl,
  buildSvgCatalogPublicUrl,
} from "@/features/planner/project/catalog/svg/svgPreviewAssets";
import { SvgCatalogGrid } from "./SvgCatalogGrid";

function resolveSvgPublicUrl(slug: string): string | undefined {
  const svgPath = path.resolve(process.cwd(), "public", "svg-catalog", `${slug}.svg`);
  return existsSync(svgPath) ? buildSvgCatalogPublicUrl(slug) : undefined;
}

export default async function SvgCatalogIndex() {
  const descriptors = loadBuyerVisibleDescriptors();
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
            thumbUrl: buildBlockThumbPngUrl(d.slug),
            svgUrl: resolveSvgPublicUrl(d.slug),
          }))}
        />
      )}
    </div>
  );
}
