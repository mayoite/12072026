/**
 * Visible published-SVG stage for admin list + editor.
 *
 * Catalog artifacts use `fill="currentColor"`. Rendering via `<img>` leaves
 * shapes near-invisible against light chrome. We inline trusted catalog markup
 * and paint `currentColor` with a semantic token so authors see geometry + color.
 *
 * Markup comes only from `readSvgArtifactStatus` (disk under public/svg-catalog).
 * Never from arbitrary user HTML.
 */

import type { SvgArtifactStatus } from "./svgArtifactStatus.server";

export type PublishedSvgPreviewSize = "thumb" | "panel";

export interface PublishedSvgPreviewProps {
  readonly slug: string;
  readonly status: SvgArtifactStatus;
  readonly size?: PublishedSvgPreviewSize;
  /** Optional aria override; default names the slug. */
  readonly label?: string;
}

function emptyCopy(state: SvgArtifactStatus["state"]): string {
  switch (state) {
    case "missing":
      return "No SVG on disk";
    case "invalid":
      return "Invalid SVG bytes";
    case "published":
      return "Preview unavailable";
  }
}

export function PublishedSvgPreview({
  slug,
  status,
  size = "panel",
  label,
}: PublishedSvgPreviewProps) {
  const aria =
    label ??
    (status.state === "published"
      ? `Published SVG preview for ${slug}`
      : `SVG artifact ${status.state} for ${slug}`);

  const sizeClass =
    size === "thumb"
      ? "admin-svg-preview admin-svg-preview--thumb"
      : "admin-svg-preview admin-svg-preview--panel";

  if (status.state !== "published" || !status.markup) {
    return (
      <div
        className={sizeClass}
        data-artifact-state={status.state}
        data-testid="admin-svg-preview"
        data-slug={slug}
        role="img"
        aria-label={aria}
      >
        <div className="admin-svg-preview__stage admin-svg-preview__stage--empty">
          <span className="admin-svg-preview__empty">{emptyCopy(status.state)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={sizeClass}
      data-artifact-state={status.state}
      data-testid="admin-svg-preview"
      data-slug={slug}
    >
      {size === "thumb" && status.publicUrl ? (
        <img
          src={status.publicUrl}
          alt=""
          className="admin-svg-preview__img"
          data-testid="admin-svg-preview-img"
        />
      ) : null}
      <div
        className="admin-svg-preview__stage"
        role="img"
        aria-label={aria}
        // Trusted catalog bytes only (validated + script-stripped in server reader).
        dangerouslySetInnerHTML={{ __html: status.markup }}
      />
      {size === "panel" && status.publicUrl ? (
        <p className="admin-svg-preview__meta admin-page__meta">
          Painted with{" "}
          <code>currentColor → var(--color-primary)</code> · source{" "}
          <code>{status.publicUrl}</code>
          {status.hash ? (
            <>
              {" "}
              · cache key <code>{status.hash.slice(0, 12)}…</code>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

export default PublishedSvgPreview;
