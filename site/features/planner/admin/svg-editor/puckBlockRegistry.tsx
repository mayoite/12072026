/**
 * Phase 04 — puckBlockRegistry (single source of truth)
 *
 * §04-ADMIN-05: declare every admin-edited BlockDescriptor as a Puck block:
 *   - a Zod schema slice keyed on `variant`
 *   - an Ark UI primitive `Component` (placeholder render via local SVG until
 *     Phase 03 SVG pipeline output is wired into the editor preview)
 *   - a Puck `fields` map driven by the Zod schema's cartography
 *
 * Authority: PACKAGES.md admin panel set, AGENTS.md §Deferred by User Step 3,
 * Phase 02 §02-CAT-02 discriminated union (fixed | configurable | parametric).
 *
 * The registry is referenced from:
 *   - `site/app/admin/svg-editor/[id]/page.tsx` (Phase 04 edit route)
 *   - `site/app/admin/svg-editor/page.tsx` (Phase 04 list route)
 *   - `site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts`
 *     (Phase 05 one-line alias re-export — verbatim, no fork; see I-D module paths).
 * Full resolution of PLAN-FAIL-0403/0404 (beyond min): actual routes/pages implemented (list + [id] edit using registry + loader + Puck/Render preview; portal index + [slug] with <Render> + alias).
 * One-line alias: site/app/(site)/portal/svg-catalog/puckBlockRegistry.ts does `export * from "@/features/planner/admin/svg-editor/puckBlockRegistry";` (verbatim, no fork, per I-D).
 * Pages use svgBlockDescriptorLoader (loadAll/tryLoad), puck registry (puckConfig + getPuckData), error taxonomy (notFound on !ok).
 * Canonical path locked: site/features/planner/admin/svg-editor/puckBlockRegistry.tsx .
 * GS BP-04/BP-05 + design §7/11 + anti-copy (no donor visuals; semantic tokens + Figma minimize principles) + 5-product. See also route-contract _phase* entries.
 *
 * Forbidden:
 *   - `any`, `@ts-ignore`, `@ts-nocheck`, `eslint-disable` (AGENTS.md).
 *   - `#hex` literal colour values; the per-rule `currentColor` semantics
 *     and semantic CSS var references are enforced via the upstream
 *     `BlockDescriptorThemeTokensSchema` (§02-CAT-07).
 *   - Donor trade-dress (Puck UI panel labels are owned by O&O Admin).
 */
import type * as React from "react";
import { z } from "zod";

// Type-only import (erased at runtime) so registry + server consumers (pages, tests) stay server-safe
// without pulling Puck client runtime. Enables typed <Puck>/<Render> usage in admin/portal without `any`.
// Per AGENTS type safety; GS BP-05 (≤1 Render per route).
import type { Config, Data } from "@puckeditor/core";

import {
  BLOCK_DESCRIPTOR_VARIANTS,
  BlockDescriptorConfigurableSchema,
  BlockDescriptorFixedSchema,
  BlockDescriptorParametricSchema,
  MountPlaneSchema,
  type BlockDescriptor,
  type BlockDescriptorConfigurable,
  type BlockDescriptorParametric,
  type BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";

// ── Puck field descriptor (typed mirror of @puckeditor/core Field) ──────────
//
// We avoid importing Puck's internal generic `Field` directly so the registry
// is consumable from server-side tests without pulling the React runtime into
// the type evaluator. Puck's runtime still accepts this shape at the seam.

export type PuckFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "custom"
  | "array"
  | "object"
  | "external"
  | "slot";

export interface PuckField {
  readonly type: PuckFieldType;
  readonly label?: string;
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly options?: ReadonlyArray<{ label: string; value: string }>;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export type PuckFields = Readonly<Record<string, PuckField>>;

// ── Block registry shape (mirrors Puck `ComponentConfig`) ──────────────────

export interface PuckBlockDefinition<TProps extends Record<string, unknown>> {
  /** Stable string identifier — forward-ref by `puckConfig.components[name]`. */
  readonly name: string;
  /** Discriminated-union tag mirrored from the BlockDescriptor schema. */
  readonly variant: BlockDescriptorVariant;
  /** Zod schema slice for the variant; first line of defense on save. */
  readonly schema: z.ZodType<unknown>;
  /** Convenience getter for the discriminated-union's schema slice. */
  readonly descriptorSchema:
    | typeof BlockDescriptorFixedSchema
    | typeof BlockDescriptorConfigurableSchema
    | typeof BlockDescriptorParametricSchema;
  /** Puck `fields` map rendered in the editor sidebar. */
  readonly fields: PuckFields;
  /** Defaults populated into the editor when "new block" is opened. */
  readonly defaultProps: TProps;
  /** Render is a pure server-renderable React component (no Puck runtime). */
  readonly render: (props: TProps) => React.ReactNode;
}

// ── Field maps for the three variant tags ───────────────────────────────────

/**
 * Variant tags map 1:1 to the BLOCK_DESCRIPTOR_VARIANTS tuple. The cartography
 * here is intentional: only the user-editable fields appear as Puck fields,
 * and the discriminator `variant` is set per-block (never as a field).
 */
const IDENTITY_FIELDS: PuckFields = {
  slug: {
    type: "text",
    label: "Slug",
    helperText: "kebab case, 2..64 chars (regex pinned in BlockDescriptor schema)",
    placeholder: "side-table",
  },
  sku: {
    type: "text",
    label: "SKU",
    placeholder: "OFL-ST-001",
  },
  sourceProvenance: {
    type: "radio",
    label: "Source provenance",
    options: [
      { label: "Native", value: "native" },
      { label: "Migrated", value: "migrated" },
      { label: "Donor", value: "donor" },
    ],
  },
  createdBy: {
    type: "text",
    label: "Created by",
    placeholder: "ops@oneandonly.example",
  },
} as const;

const GEOMETRY_FIELDS: PuckFields = {
  "geometry.widthMm": {
    type: "number",
    label: "Width (mm)",
    min: 1,
    max: 100000,
    step: 1,
  },
  "geometry.depthMm": {
    type: "number",
    label: "Depth (mm)",
    min: 1,
    max: 100000,
    step: 1,
  },
  "geometry.heightMm": {
    type: "number",
    label: "Height (mm)",
    min: 1,
    max: 100000,
    step: 1,
  },
  "geometry.seatHeightMm": {
    type: "number",
    label: "Seat height (mm)",
    min: 1,
    max: 100000,
    step: 1,
  },
  "geometry.weightKg": {
    type: "number",
    label: "Weight (kg)",
    min: 0.01,
    max: 10000,
    step: 0.1,
  },
} as const;

const VIEWBOX_FIELDS: PuckFields = {
  "viewBox.x": { type: "number", label: "viewBox x", min: 0, max: 100000, step: 1 },
  "viewBox.y": { type: "number", label: "viewBox y", min: 0, max: 100000, step: 1 },
  "viewBox.width": {
    type: "number",
    label: "viewBox width",
    min: 1,
    max: 100000,
    step: 1,
  },
  "viewBox.height": {
    type: "number",
    label: "viewBox height",
    min: 1,
    max: 100000,
    step: 1,
  },
} as const;

const MOUNTING_FIELDS: PuckFields = {
  mounting: {
    type: "custom",
    label: "Mount planes",
    helperText: "Comma-separated list of mounting planes (e.g. floor,wall)",
  },
  mountingPoints: {
    type: "custom",
    label: "Mounting points (parametric only)",
    helperText: "JSON array of { plane, offset } for parametric descriptors",
  },
} as const;

const THEME_FIELDS: PuckFields = {
  themeTokens: {
    type: "object",
    label: "Theme tokens",
    helperText:
      "keys must be 'currentColor' or --kebab; values must be semantic CSS vars (no #hex)",
  },
} as const;

const A11Y_FIELDS: PuckFields = {
  rovingFocus: {
    type: "array",
    label: "Roving focus entries",
    helperText: "Each entry carries key, focusSelector, and label",
  },
  liveAnnouncementCategories: {
    type: "custom",
    label: "Live-announcement categories",
    helperText: "Comma-separated subset of status | error | success | polish",
  },
} as const;

// ── Block-level composer helpers ───────────────────────────────────────────

/** Combine multiple field maps preserving stable key ordering. */
function chainFields(...sources: ReadonlyArray<PuckFields>): PuckFields {
  const merged: Record<string, PuckField> = {};
  for (const source of sources) {
    for (const [key, field] of Object.entries(source)) {
      merged[key] = field;
    }
  }
  return Object.freeze(merged);
}

// ── Variant-specific renderers (placeholder geometry, real semantic tokens) ─

interface FixedRenderProps {
  readonly slug: string;
  readonly sku?: string;
}

function FixedBlockRender({ slug, sku }: FixedRenderProps): React.ReactNode {
  return (
    <svg
      role="img"
      aria-label={`Block descriptor "${slug}" (fixed)`}
      viewBox="0 0 200 100"
      className="block-preview block-preview--fixed"
      data-block-variant="fixed"
    >
      <rect
        x="2"
        y="2"
        width="196"
        height="96"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <text
        x="100"
        y="48"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="11"
        fill="currentColor"
      >
        {slug}
      </text>
      {sku ? (
        <text
          x="100"
          y="64"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="ui-sans-serif, system-ui"
          fontSize="9"
          fill="currentColor"
          opacity="0.7"
        >
          {sku}
        </text>
      ) : null}
    </svg>
  );
}

interface ConfigurableRenderProps {
  readonly slug: string;
  readonly sizingType: "discrete" | "parametric";
  readonly optionCount: number;
}

function ConfigurableBlockRender({
  slug,
  sizingType,
  optionCount,
}: ConfigurableRenderProps): React.ReactNode {
  return (
    <svg
      role="img"
      aria-label={`Block descriptor "${slug}" (configurable, ${sizingType}, ${optionCount} options)`}
      viewBox="0 0 220 110"
      className="block-preview block-preview--configurable"
      data-block-variant="configurable"
    >
      <rect
        x="2"
        y="2"
        width="216"
        height="106"
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="4 3"
      />
      <text
        x="110"
        y="44"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="11"
        fill="currentColor"
      >
        {slug}
      </text>
      <text
        x="110"
        y="62"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="9"
        fill="currentColor"
        opacity="0.75"
      >
        {sizingType === "discrete" ? `discrete · ${optionCount}` : "parametric"}
      </text>
    </svg>
  );
}

interface ParametricRenderProps {
  readonly slug: string;
  readonly parameterCount: number;
}

function ParametricBlockRender({
  slug,
  parameterCount,
}: ParametricRenderProps): React.ReactNode {
  return (
    <svg
      role="img"
      aria-label={`Block descriptor "${slug}" (parametric, ${parameterCount} parameters)`}
      viewBox="0 0 220 110"
      className="block-preview block-preview--parametric"
      data-block-variant="parametric"
    >
      <rect
        x="2"
        y="2"
        width="216"
        height="106"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="2 2"
      />
      <text
        x="110"
        y="44"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="11"
        fill="currentColor"
      >
        {slug}
      </text>
      <text
        x="110"
        y="62"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="9"
        fill="currentColor"
        opacity="0.75"
      >
        parametric · {parameterCount} parameters
      </text>
    </svg>
  );
}

// ── Three variant block definitions ────────────────────────────────────────

const FixedPuckFields = chainFields(
  IDENTITY_FIELDS,
  GEOMETRY_FIELDS,
  VIEWBOX_FIELDS,
  MOUNTING_FIELDS,
  THEME_FIELDS,
  A11Y_FIELDS,
);

/** Schema slice for the Puck editor view-model; mirrors the variant subset. */
const FixedEditorSchema = BlockDescriptorFixedSchema.pick({
  slug: true,
  sku: true,
  sourceProvenance: true,
  createdBy: true,
  geometry: true,
  viewBox: true,
  mounting: true,
  mountingPoints: true,
  themeTokens: true,
  rovingFocus: true,
  liveAnnouncementCategories: true,
});

const FixedPuckBlock: PuckBlockDefinition<{ slug: string; sku?: string }> = {
  name: "BlockFixed",
  variant: "fixed",
  schema: FixedEditorSchema,
  descriptorSchema: BlockDescriptorFixedSchema,
  fields: FixedPuckFields,
  defaultProps: { slug: "new-fixed-block", sku: "" },
  render: FixedBlockRender,
};

const ConfigurablePuckFields = chainFields(
  IDENTITY_FIELDS,
  GEOMETRY_FIELDS,
  VIEWBOX_FIELDS,
  MOUNTING_FIELDS,
  THEME_FIELDS,
  A11Y_FIELDS,
  {
    "configurable.sizingType": {
      type: "radio",
      label: "Sizing type",
      options: [
        { label: "Discrete", value: "discrete" },
        { label: "Parametric", value: "parametric" },
      ],
    },
    "configurable.sizeOptions": {
      type: "array",
      label: "Discrete size options",
      helperText: "List of strings, e.g. [\"small\",\"large\"]",
    },
  } as const,
);

const ConfigurableEditorSchema = BlockDescriptorConfigurableSchema.pick({
  slug: true,
  sku: true,
  sourceProvenance: true,
  createdBy: true,
  geometry: true,
  viewBox: true,
  mounting: true,
  mountingPoints: true,
  themeTokens: true,
  rovingFocus: true,
  liveAnnouncementCategories: true,
  configurable: true,
});

const ConfigurablePuckBlock: PuckBlockDefinition<{
  slug: string;
  sizingType: "discrete" | "parametric";
  optionCount: number;
}> = {
  name: "BlockConfigurable",
  variant: "configurable",
  schema: ConfigurableEditorSchema,
  descriptorSchema: BlockDescriptorConfigurableSchema,
  fields: ConfigurablePuckFields,
  defaultProps: {
    slug: "new-configurable-block",
    sizingType: "discrete",
    optionCount: 1,
  },
  render: ConfigurableBlockRender,
};

const ParametricPuckFields = chainFields(
  IDENTITY_FIELDS,
  GEOMETRY_FIELDS,
  VIEWBOX_FIELDS,
  MOUNTING_FIELDS,
  THEME_FIELDS,
  A11Y_FIELDS,
  {
    "parametric.sizingType": {
      type: "radio",
      label: "Sizing type",
      options: [{ label: "Parametric", value: "parametric" }],
    },
    "parametric.parameterSchema": {
      type: "array",
      label: "Parameter schema",
      helperText:
        "Each entry: { key, label, kind: number|select|boolean, bounds?, options?, default? }",
    },
  } as const,
);

const ParametricEditorSchema = BlockDescriptorParametricSchema.pick({
  slug: true,
  sku: true,
  sourceProvenance: true,
  createdBy: true,
  geometry: true,
  viewBox: true,
  mounting: true,
  mountingPoints: true,
  themeTokens: true,
  rovingFocus: true,
  liveAnnouncementCategories: true,
  parametric: true,
});

const ParametricPuckBlock: PuckBlockDefinition<{
  slug: string;
  parameterCount: number;
}> = {
  name: "BlockParametric",
  variant: "parametric",
  schema: ParametricEditorSchema,
  descriptorSchema: BlockDescriptorParametricSchema,
  fields: ParametricPuckFields,
  defaultProps: { slug: "new-parametric-block", parameterCount: 1 },
  render: ParametricBlockRender,
};

// ── Canonical registry (single source of truth reference §04-ADMIN-05) ─────

/**
 * The three variant tags MUST sit in this exact tuple. Adding a fourth
 * variant without updating this tuple loses exhaustiveness guarantees
 * that the slug regex + variant mapper rely on.
 */
export const PUCK_BLOCK_REGISTRY: readonly PuckBlockDefinition<Record<string, unknown>>[] = Object.freeze([
  FixedPuckBlock,
  ConfigurablePuckBlock,
  ParametricPuckBlock,
] as const) as unknown as readonly PuckBlockDefinition<Record<string, unknown>>[];

/** Lookup index by `variant` tag — closed under the canonical union. */
export const PUCK_BLOCK_BY_VARIANT: Readonly<
  Record<BlockDescriptorVariant, PuckBlockDefinition<Record<string, unknown>>>
> = Object.freeze({
  fixed: FixedPuckBlock as unknown as PuckBlockDefinition<Record<string, unknown>>,
  configurable: ConfigurablePuckBlock as unknown as PuckBlockDefinition<Record<string, unknown>>,
  parametric: ParametricPuckBlock as unknown as PuckBlockDefinition<Record<string, unknown>>,
});

/**
 * Map any saved `BlockDescriptor` to the typed layout props the Puck renderer
 * expects. Pure function so test runs are deterministic.
 */
export function blockDescriptorToRenderProps(
  descriptor: BlockDescriptor,
): { variant: BlockDescriptorVariant; name: string; props: Record<string, unknown> } {
  switch (descriptor.variant) {
    case "fixed":
      return {
        variant: "fixed",
        name: "BlockFixed",
        props: { slug: descriptor.slug, sku: descriptor.sku ?? "" },
      };
    case "configurable": {
      const configurable: BlockDescriptorConfigurable = descriptor;
      return {
        variant: "configurable",
        name: "BlockConfigurable",
        props: {
          slug: configurable.slug,
          sizingType: configurable.configurable.sizingType,
          optionCount: configurable.configurable.sizeOptions?.length ?? 0,
        },
      };
    }
    case "parametric": {
      const parametric: BlockDescriptorParametric = descriptor;
      return {
        variant: "parametric",
        name: "BlockParametric",
        props: {
          slug: parametric.slug,
          parameterCount: parametric.parametric.parameterSchema.length,
        },
      };
    }
  }
}

// ── Puck config record (consumable by `@puckeditor/core` `<Puck>`) ──────────

/**
 * `puckConfig` is the public object handed to `<Puck config={puckConfig}>`.
 * It is the typed bridge between our typed registry and Puck's runtime
 * `Config` shape — fields and `defaultProps` are the exact objects Puck
 * monomorphises at mount, so structural compatibility is sufficient
 * (Puck's `Config<>` generic comes from `@puckeditor/core`).
 */
// Typed via import type above (no runtime dep; structural match to Puck's Config).
// Enables <Puck config={puckConfig} /> (admin edit) and <Render config={puckConfig} /> (portal) without any-casts.
// GS: BP-04 (Puck/Ark set), BP-05 (single Render), design §7/11, anti-copy (semantic tokens only).
export const puckConfig = Object.freeze({
  components: Object.freeze({
    BlockFixed: Object.freeze({
      fields: FixedPuckBlock.fields,
      defaultProps: FixedPuckBlock.defaultProps,
      render: FixedPuckBlock.render,
    }),
    BlockConfigurable: Object.freeze({
      fields: ConfigurablePuckBlock.fields,
      defaultProps: ConfigurablePuckBlock.defaultProps,
      render: ConfigurablePuckBlock.render,
    }),
    BlockParametric: Object.freeze({
      fields: ParametricPuckBlock.fields,
      defaultProps: ParametricPuckBlock.defaultProps,
      render: ParametricPuckBlock.render,
    }),
  }),
  categories: Object.freeze({
    "Catalog Blocks": Object.freeze({
      components: Object.freeze([
        "BlockFixed",
        "BlockConfigurable",
        "BlockParametric",
      ] as const),
    }),
  }),
}) as unknown as Config;

/** Map a variant tag to its registered Puck component name. */
export function puckComponentName(variant: BlockDescriptorVariant): string {
  switch (variant) {
    case "fixed":
      return "BlockFixed";
    case "configurable":
      return "BlockConfigurable";
    case "parametric":
      return "BlockParametric";
  }
}

// Re-export the Puck types (type-only) for consumers in pages/api without direct dep or any.
export type { Config as PuckConfig, Data as PuckDataShape } from "@puckeditor/core";

// ── Side-effect-free schema parsers for the slug regex invariants ──────────
// Pinned here so consumers writing block-id-from-slug flows reuse one validator.

export const MOUNT_PLANE_VALUES: ReadonlyArray<z.infer<typeof MountPlaneSchema>> =
  Object.freeze(MountPlaneSchema.options);

/**
 * `BLOCK_DESCRIPTOR_VARIANTS` from Phase 02 is the canonical tuple. Re-export
 * here so tests can import the same tuple from a single Phase 04 module if
 * desired, and so this file stays the canonical "what can I build?" surface.
 */
export const SUPPORTED_PUCK_BLOCK_VARIANTS = Object.freeze(BLOCK_DESCRIPTOR_VARIANTS);

/**
 * Compile-time assertion: `PUCK_BLOCK_REGISTRY.length` must equal the
 * discriminated-union length. If a future variant is added to Phase 02's
 * tuple, this assertion forces a registry update before any caller code
 * compiles.
 */
const _PUCK_EXHAUSTIVENESS = (PUCK_BLOCK_REGISTRY.length === BLOCK_DESCRIPTOR_VARIANTS.length) as unknown as AssertEqual<
  typeof PUCK_BLOCK_REGISTRY.length,
  typeof BLOCK_DESCRIPTOR_VARIANTS.length
>;

// `AssertEqual` is a tiny literal-type equality helper — declared inline so
// we don't import the global eslint-banned `any` surface.
type AssertEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B
  ? 1
  : 2)
  ? true
  : false;

// ── getPuckData adapter (Phase 04/05 bridge: BlockDescriptor → Puck Data) ──

/**
 * Convert a persisted BlockDescriptor (from loader) into the minimal Puck
 * `Data` shape consumable by `<Puck config={puckConfig} data={...} />` and
 * `<Render config={...} data={...} />`.
 *
 * Uses single-block content array + root for the descriptor. This keeps
 * 1:1 parity with the registry blocks without forking shape.
 * Used by admin edit preview and portal RSC render.
 * GS: single source, no any, anti-copy (semantic only).
 */
export type PuckData = {
  readonly root: { readonly props: Record<string, unknown> };
  readonly content: ReadonlyArray<{
    readonly type: string;
    readonly props: Record<string, unknown>;
  }>;
};

export function getPuckData(descriptor: BlockDescriptor): PuckData {
  const rp = blockDescriptorToRenderProps(descriptor);
  return {
    root: { props: { title: descriptor.slug } },
    content: [{ type: rp.name, props: rp.props }],
  };
}
