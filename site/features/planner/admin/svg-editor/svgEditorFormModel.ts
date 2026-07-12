/**
 * No-code SVG editor — field cartography (A4).
 *
 * Single source of truth for the bespoke schema-driven admin form that replaces
 * the Puck auto-sidebar. Each entry maps ONE editable `BlockDescriptor` field
 * (path === the zod issue path from `parseBlockDescriptor`) to an explicit,
 * fully no-code control. There are NO free-text-JSON or comma-separated inputs:
 * every former Puck `"custom"` field becomes a structured control here.
 *
 * Enum option lists are DERIVED from the schema authority (`svgTypes.ts`) via
 * `.options`, never hand-copied — a drift test asserts this in
 * `svgEditorFormModel.test.ts`.
 *
 * Authority: `svgTypes.ts` (BlockDescriptor discriminated union) →
 * `docs/architecture/01-MODULE-LAYOUT.md` (admin views live here).
 */

import {
  MountPlaneSchema,
  BlockDescriptorLiveAnnouncementCategorySchema,
  BlockDescriptorIdentitySchema,
  BlockDescriptorConfigurableSchema,
  BlockDescriptorParametricSchema,
  BLOCK_DESCRIPTOR_VARIANTS,
  type BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";

/** Control kinds the form renderer knows how to draw. */
export type SvgEditorControlKind =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "tokenRows"
  | "stringList"
  | "objectArray";

/** Which descriptor variant a field applies to (`all` = every variant). */
export type SvgEditorVariantScope = "all" | BlockDescriptorVariant;

export interface SvgEditorSelectOption {
  readonly label: string;
  readonly value: string;
}

/** One sub-field of an `objectArray` row (e.g. a rovingFocus entry's `label`). */
export interface SvgEditorItemField {
  readonly key: string;
  readonly label: string;
  readonly kind: "text" | "number" | "select";
  readonly options?: readonly SvgEditorSelectOption[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly optional?: boolean;
  readonly placeholder?: string;
}

/** Metadata for one editable descriptor field. */
export interface SvgEditorFieldMeta {
  /** Dot path — equals the zod issue path so validation maps 1:1. */
  readonly path: string;
  readonly label: string;
  readonly kind: SvgEditorControlKind;
  readonly help?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly unit?: string;
  /** `select` / `multiselect` options. */
  readonly options?: readonly SvgEditorSelectOption[];
  /** Default `all`. Filters the field out for other variants. */
  readonly variantScope?: SvgEditorVariantScope;
  readonly optional?: boolean;
  readonly placeholder?: string;
  /** `objectArray`: the shape of each row. */
  readonly itemFields?: readonly SvgEditorItemField[];
  /** `objectArray`: minimum required rows (surfaced inline). */
  readonly minItems?: number;
  /** `tokenRows`: allowed semantic key options (schema-valid, no hex). */
  readonly tokenKeyOptions?: readonly SvgEditorSelectOption[];
  /** `tokenRows`: allowed semantic value options (CSS vars / currentColor, no hex). */
  readonly tokenValueOptions?: readonly SvgEditorSelectOption[];
}

const asOptions = (values: readonly string[]): readonly SvgEditorSelectOption[] =>
  Object.freeze(values.map((value) => ({ label: value, value })));

// Enum option lists derived from the schema authority (never hand-copied).
export const MOUNT_PLANE_OPTIONS = asOptions(MountPlaneSchema.options);
export const LIVE_ANNOUNCEMENT_OPTIONS = asOptions(
  BlockDescriptorLiveAnnouncementCategorySchema.options,
);
export const SOURCE_PROVENANCE_OPTIONS = asOptions(
  BlockDescriptorIdentitySchema.shape.sourceProvenance.options,
);
export const CONFIGURABLE_SIZING_OPTIONS = asOptions(
  BlockDescriptorConfigurableSchema.shape.configurable.shape.sizingType.options,
);
export const PARAMETER_KIND_OPTIONS = asOptions(
  BlockDescriptorParametricSchema.shape.parametric.shape.parameterSchema.element.shape.kind
    .options,
);
export const VARIANT_OPTIONS = asOptions(BLOCK_DESCRIPTOR_VARIANTS);

/**
 * Theme-token keys that are schema-valid (`currentColor` or `--kebab`) AND that
 * the pipeline / catalog consume. Curated so a non-coder picks from a list.
 */
export const THEME_TOKEN_KEY_OPTIONS: readonly SvgEditorSelectOption[] = Object.freeze([
  { label: "currentColor", value: "currentColor" },
  { label: "Fill (--fill-primary)", value: "--fill-primary" },
  { label: "Stroke accent (--stroke-accent)", value: "--stroke-accent" },
  { label: "Block stroke (--block-stroke-accent)", value: "--block-stroke-accent" },
]);

/**
 * Allowed theme-token VALUES — semantic CSS variables and `currentColor` only.
 * No `#hex` is reachable through the UI (schema also rejects hex defensively).
 */
export const THEME_TOKEN_VALUE_OPTIONS: readonly SvgEditorSelectOption[] = Object.freeze([
  { label: "currentColor", value: "currentColor" },
  { label: "Primary", value: "var(--color-primary)" },
  { label: "Accent", value: "var(--color-accent)" },
  { label: "Text strong", value: "var(--text-strong)" },
  { label: "Text muted", value: "var(--text-muted)" },
  { label: "Surface panel", value: "var(--surface-panel)" },
  { label: "Border muted", value: "var(--border-muted)" },
  {
    label: "Block stroke (fallback currentColor)",
    value: "var(--block-stroke-accent, currentColor)",
  },
]);

const ROVING_FOCUS_ITEM_FIELDS: readonly SvgEditorItemField[] = Object.freeze([
  { key: "key", label: "Key", kind: "text", placeholder: "focus-seat" },
  {
    key: "focusSelector",
    label: "Focus selector",
    kind: "text",
    placeholder: "#seat-block",
  },
  { key: "label", label: "Label", kind: "text", placeholder: "Seat area" },
]);

const MOUNTING_POINT_ITEM_FIELDS: readonly SvgEditorItemField[] = Object.freeze([
  { key: "plane", label: "Plane", kind: "select", options: MOUNT_PLANE_OPTIONS },
  { key: "offset.x", label: "Offset X (mm)", kind: "number", step: 1 },
  { key: "offset.y", label: "Offset Y (mm)", kind: "number", step: 1 },
]);

const BLOCK_ITEM_FIELDS: readonly SvgEditorItemField[] = Object.freeze([
  { key: "id", label: "Id", kind: "text", optional: true, placeholder: "seat-block" },
  { key: "x", label: "X (mm)", kind: "number", step: 1 },
  { key: "y", label: "Y (mm)", kind: "number", step: 1 },
  { key: "width", label: "Width (mm)", kind: "number", min: 1, step: 1 },
  { key: "depth", label: "Depth (mm)", kind: "number", min: 1, step: 1 },
]);

const PARAMETER_ITEM_FIELDS: readonly SvgEditorItemField[] = Object.freeze([
  { key: "key", label: "Key", kind: "text", placeholder: "width" },
  { key: "label", label: "Label", kind: "text", placeholder: "Width" },
  { key: "kind", label: "Kind", kind: "select", options: PARAMETER_KIND_OPTIONS },
]);

/**
 * The field cartography. Ordering here is the visual order in the form.
 * `blocks` is numeric-row editing (no-code) — the full visual drag composer is
 * a later phase; here a user edits block rects via number steppers.
 */
export const SVG_EDITOR_FIELDS: readonly SvgEditorFieldMeta[] = Object.freeze([
  // ── Identity ──
  {
    path: "slug",
    label: "Slug",
    kind: "text",
    help: "Lowercase kebab-case, 2–64 chars (e.g. side-table-001). Used in the public URL.",
    placeholder: "side-table-001",
  },
  { path: "sku", label: "SKU", kind: "text", optional: true, placeholder: "REF-FIX-001" },
  {
    path: "sourceProvenance",
    label: "Source",
    kind: "select",
    options: SOURCE_PROVENANCE_OPTIONS,
  },
  {
    path: "createdBy",
    label: "Created by",
    kind: "text",
    optional: true,
    placeholder: "admin",
  },
  {
    path: "variant",
    label: "Variant",
    kind: "select",
    options: VARIANT_OPTIONS,
    help: "Fixed = locked size · Configurable = size options · Parametric = full parameter schema.",
  },

  // ── Geometry (mm) ──
  { path: "geometry.widthMm", label: "Width", kind: "number", min: 1, step: 1, unit: "mm" },
  { path: "geometry.depthMm", label: "Depth", kind: "number", min: 1, step: 1, unit: "mm" },
  { path: "geometry.heightMm", label: "Height", kind: "number", min: 1, step: 1, unit: "mm" },
  {
    path: "geometry.seatHeightMm",
    label: "Seat height",
    kind: "number",
    min: 1,
    step: 1,
    unit: "mm",
    optional: true,
  },
  {
    path: "geometry.weightKg",
    label: "Weight",
    kind: "number",
    min: 0,
    step: 0.1,
    unit: "kg",
    optional: true,
  },

  // ── ViewBox ──
  { path: "viewBox.x", label: "ViewBox X", kind: "number", step: 1 },
  { path: "viewBox.y", label: "ViewBox Y", kind: "number", step: 1 },
  { path: "viewBox.width", label: "ViewBox width", kind: "number", min: 1, step: 1 },
  { path: "viewBox.height", label: "ViewBox height", kind: "number", min: 1, step: 1 },

  // ── Mounting + accessibility ──
  {
    path: "mounting",
    label: "Mounting planes",
    kind: "multiselect",
    options: MOUNT_PLANE_OPTIONS,
    minItems: 1,
    help: "Pick at least one placement plane.",
  },
  {
    path: "liveAnnouncementCategories",
    label: "Live-announcement categories",
    kind: "multiselect",
    options: LIVE_ANNOUNCEMENT_OPTIONS,
    minItems: 1,
  },
  {
    path: "rovingFocus",
    label: "Roving focus targets",
    kind: "objectArray",
    itemFields: ROVING_FOCUS_ITEM_FIELDS,
    optional: true,
  },
  {
    path: "mountingPoints",
    label: "Mounting points",
    kind: "objectArray",
    itemFields: MOUNTING_POINT_ITEM_FIELDS,
    optional: true,
    help: "Required (at least one) for parametric blocks.",
  },

  // ── Geometry blocks (numeric no-code editing) ──
  {
    path: "blocks",
    label: "Blocks (footprint rects)",
    kind: "objectArray",
    itemFields: BLOCK_ITEM_FIELDS,
    optional: true,
    help: "The rectangles the SVG footprint is built from. Edit numerically; the preview updates live.",
  },

  // ── Theme tokens ──
  {
    path: "themeTokens",
    label: "Theme tokens",
    kind: "tokenRows",
    tokenKeyOptions: THEME_TOKEN_KEY_OPTIONS,
    tokenValueOptions: THEME_TOKEN_VALUE_OPTIONS,
    help: "Semantic colours only — no hex. Controls the compiled fill/stroke.",
  },

  // ── Variant-specific ──
  {
    path: "configurable.sizingType",
    label: "Sizing type",
    kind: "select",
    options: CONFIGURABLE_SIZING_OPTIONS,
    variantScope: "configurable",
  },
  {
    path: "configurable.sizeOptions",
    label: "Size options",
    kind: "stringList",
    variantScope: "configurable",
    optional: true,
    help: "Discrete size labels (e.g. 900, 1200).",
  },
  {
    path: "parametric.parameterSchema",
    label: "Parameter schema",
    kind: "objectArray",
    itemFields: PARAMETER_ITEM_FIELDS,
    variantScope: "parametric",
    minItems: 1,
  },
  {
    path: "assets.glbUrl",
    label: "Generated GLB URL",
    kind: "text",
    variantScope: "fixed",
    optional: true,
    help: "System-generated only (catalog-assets/generated/…). Set by the 3D convert step.",
  },
]);

/** Fields that apply to a given variant (respects `variantScope`). */
export function fieldsForVariant(
  variant: BlockDescriptorVariant,
  fields: readonly SvgEditorFieldMeta[] = SVG_EDITOR_FIELDS,
): readonly SvgEditorFieldMeta[] {
  return fields.filter(
    (field) => (field.variantScope ?? "all") === "all" || field.variantScope === variant,
  );
}
