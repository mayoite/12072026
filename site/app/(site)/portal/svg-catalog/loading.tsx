/**
 * Route-level loading shell for /portal/svg-catalog.
 * Matches portal chrome so navigation is not a bare spinner.
 */

export default function SvgCatalogLoading() {
  return (
    <div
      className="shell-portal-page portal-svg-catalog mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-12"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="shell-portal-panel portal-svg-catalog__header p-5 sm:p-6 md:p-8">
        <p className="shell-portal-table-label">Public inventory</p>
        <h1 className="shell-portal-page-title mt-2">SVG catalog</h1>
        <p className="shell-portal-table-meta mt-3">Loading published block previews…</p>
      </div>
      <div className="portal-svg-catalog__loading mt-6 flex min-h-[12rem] items-center justify-center">
        <div className="shell-portal-spinner" role="status" aria-label="Loading catalog" />
      </div>
    </div>
  );
}
