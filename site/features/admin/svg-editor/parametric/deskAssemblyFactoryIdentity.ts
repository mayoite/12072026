/**
 * Desk-assembly factory inventory identity.
 * One Product Studio door: /admin/svg-editor (not a separate parametric route).
 */

const DESK_ASSEMBLY_SLUG_PATTERN = /^oando-desk-assembly-\d+$/i;

export const ADMIN_PRODUCT_STUDIO_NEW_HREF =
  "/admin/svg-editor?new=desk-assembly" as const;

/** True when slug is a factory desk-assembly product. */
export function isDeskAssemblyFactorySlug(slug: string): boolean {
  return DESK_ASSEMBLY_SLUG_PATTERN.test(slug.trim());
}

/** Same-page deep link for New desk assembly. */
export function adminSvgEditorNewDeskAssemblyHref(): string {
  return ADMIN_PRODUCT_STUDIO_NEW_HREF;
}

/** Admin edit href: factory desk → same-page studio; else freehand. */
export function adminSvgEditorEditHref(slug: string): string {
  const trimmed = slug.trim();
  if (isDeskAssemblyFactorySlug(trimmed)) {
    return `/admin/svg-editor?edit=${encodeURIComponent(trimmed)}`;
  }
  return `/admin/svg-editor/${trimmed}`;
}
