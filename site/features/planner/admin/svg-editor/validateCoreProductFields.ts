/**
 * Phase 1 — core product fields: clear client validation before publish.
 *
 * Pure checks for identity + millimetre geometry + required placement planes.
 * Paths match `SVG_EDITOR_FIELDS` / zod so SvgEditorForm can link them.
 * Full schema still runs on the server via freezeFreshDescriptor.
 */

import { BLOCK_DESCRIPTOR_SLUG_REGEX } from "@/features/planner/project/catalog/svg/svgTypes";
import type { FieldIssue, SvgEditorFormState } from "./svgEditorFormState";

function positiveMm(value: number, path: string, label: string): FieldIssue | null {
  if (!Number.isFinite(value) || value <= 0) {
    return {
      path,
      message: `${label} must be a positive number in millimetres.`,
    };
  }
  return null;
}

/**
 * Validate required core product fields with operator-facing messages.
 * Empty result means the core fields are acceptable for preview/publish.
 */
export function validateCoreProductFields(
  form: SvgEditorFormState,
): readonly FieldIssue[] {
  const issues: FieldIssue[] = [];

  const slug = form.slug.trim();
  if (slug.length === 0) {
    issues.push({ path: "slug", message: "Slug is required." });
  } else if (!BLOCK_DESCRIPTOR_SLUG_REGEX.test(slug)) {
    issues.push({
      path: "slug",
      message:
        "Slug must be lowercase kebab-case (2–64 chars), e.g. side-table-001.",
    });
  }

  const sku = form.sku.trim();
  if (sku.length > 120) {
    issues.push({ path: "sku", message: "SKU must be at most 120 characters." });
  }

  if (
    form.sourceProvenance !== "donor" &&
    form.sourceProvenance !== "native" &&
    form.sourceProvenance !== "migrated"
  ) {
    issues.push({
      path: "sourceProvenance",
      message: "Source must be donor, native, or migrated.",
    });
  }

  const width = positiveMm(form.geometry.widthMm, "geometry.widthMm", "Width");
  if (width) issues.push(width);
  const depth = positiveMm(form.geometry.depthMm, "geometry.depthMm", "Depth");
  if (depth) issues.push(depth);
  const height = positiveMm(
    form.geometry.heightMm,
    "geometry.heightMm",
    "Height",
  );
  if (height) issues.push(height);

  if (
    form.geometry.seatHeightMm !== undefined &&
    form.geometry.seatHeightMm !== null &&
    (!Number.isFinite(form.geometry.seatHeightMm) ||
      form.geometry.seatHeightMm <= 0)
  ) {
    issues.push({
      path: "geometry.seatHeightMm",
      message: "Seat height must be a positive number in millimetres when set.",
    });
  }

  if (
    form.geometry.weightKg !== undefined &&
    form.geometry.weightKg !== null &&
    (!Number.isFinite(form.geometry.weightKg) || form.geometry.weightKg <= 0)
  ) {
    issues.push({
      path: "geometry.weightKg",
      message: "Weight must be a positive number in kilograms when set.",
    });
  }

  if (!Number.isFinite(form.viewBox.width) || form.viewBox.width <= 0) {
    issues.push({
      path: "viewBox.width",
      message: "ViewBox width must be a positive number.",
    });
  }
  if (!Number.isFinite(form.viewBox.height) || form.viewBox.height <= 0) {
    issues.push({
      path: "viewBox.height",
      message: "ViewBox height must be a positive number.",
    });
  }

  if (form.mounting.length === 0) {
    issues.push({
      path: "mounting",
      message: "Pick at least one mounting plane (floor, wall, ceiling, or floating).",
    });
  }

  if (form.liveAnnouncementCategories.length === 0) {
    issues.push({
      path: "liveAnnouncementCategories",
      message: "Pick at least one live-announcement category.",
    });
  }

  return issues;
}

export function hasCoreProductFieldErrors(form: SvgEditorFormState): boolean {
  return validateCoreProductFields(form).length > 0;
}
