/**
 * No-code SVG editor — pure adapters (A4).
 *
 * Replaces the Puck adapters `getPuckEditorData` / `puckEditorDataToDescriptorInput`.
 * - `descriptorToFormState(descriptor)` → controlled form state (prefill).
 * - `formStateToDescriptorInput(original, form)` → descriptor-shaped input for
 *   `freezeFreshDescriptor` / publish. Preserves the original's id, schemaVersion,
 *   variant discriminator, `maker`, and any non-editable fields; strips `checksum`
 *   so it is recomputed. Same merge semantics as the retired Puck adapter.
 *
 * Pure + server-safe (no React, no `any`). `themeTokens` defended by
 * `safeThemeTokens`.
 */

import {
  type BlockDescriptor,
  type BlockDescriptorConfigurable,
  type BlockDescriptorParametric,
  type BlockDescriptorVariant,
} from "@/features/planner/open3d/catalog/svg/svgTypes";
import { safeThemeTokens } from "./themeTokens";
import type {
  SvgEditorFormState,
  FormTokenRow,
  FormBlock,
  FormMountingPoint,
  FormRovingFocus,
  FormParameter,
} from "./svgEditorFormState";

function tokensToRows(tokens: BlockDescriptor["themeTokens"]): FormTokenRow[] {
  const safe = safeThemeTokens(tokens);
  return Object.entries(safe).map(([key, value]) => ({ key, value: String(value) }));
}

function rowsToTokens(rows: readonly FormTokenRow[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const row of rows) {
    const key = row.key.trim();
    const value = row.value.trim();
    if (key.length > 0 && value.length > 0) {
      out[key] = value;
    }
  }
  // Never emit an empty token map — safeThemeTokens supplies canonical defaults.
  return Object.keys(out).length > 0 ? out : { ...safeThemeTokens(undefined) };
}

/** Prefill controlled form state from a persisted descriptor. */
export function descriptorToFormState(descriptor: BlockDescriptor): SvgEditorFormState {
  const blocks: FormBlock[] = (descriptor.blocks ?? []).map((b) => ({
    id: b.id,
    x: b.x,
    y: b.y,
    width: b.width,
    depth: b.depth,
  }));
  const mountingPoints: FormMountingPoint[] = (descriptor.mountingPoints ?? []).map((m) => ({
    plane: m.plane,
    offset: { x: m.offset.x, y: m.offset.y },
  }));
  const rovingFocus: FormRovingFocus[] = (descriptor.rovingFocus ?? []).map((r) => ({
    key: r.key,
    focusSelector: r.focusSelector,
    label: r.label,
  }));

  let configurableSizingType: SvgEditorFormState["configurableSizingType"] = "discrete";
  let configurableSizeOptions: string[] = [];
  if (descriptor.variant === "configurable") {
    const c = descriptor as BlockDescriptorConfigurable;
    configurableSizingType = c.configurable.sizingType;
    configurableSizeOptions = [...(c.configurable.sizeOptions ?? [])];
  }

  let parameterSchema: FormParameter[] = [];
  if (descriptor.variant === "parametric") {
    const p = descriptor as BlockDescriptorParametric;
    parameterSchema = p.parametric.parameterSchema.map((param) => ({
      key: param.key,
      label: param.label,
      kind: param.kind,
    }));
  }

  const assets =
    descriptor.variant === "fixed" && "assets" in descriptor ? descriptor.assets : undefined;

  return {
    variant: descriptor.variant,
    slug: descriptor.slug,
    sku: descriptor.sku ?? "",
    sourceProvenance: descriptor.sourceProvenance,
    createdBy: descriptor.createdBy ?? "",
    geometry: {
      widthMm: descriptor.geometry.widthMm,
      depthMm: descriptor.geometry.depthMm,
      heightMm: descriptor.geometry.heightMm,
      seatHeightMm: descriptor.geometry.seatHeightMm,
      weightKg: descriptor.geometry.weightKg,
    },
    viewBox: {
      x: descriptor.viewBox.x,
      y: descriptor.viewBox.y,
      width: descriptor.viewBox.width,
      height: descriptor.viewBox.height,
    },
    mounting: [...descriptor.mounting],
    liveAnnouncementCategories: [...(descriptor.liveAnnouncementCategories ?? ["status"])],
    rovingFocus,
    mountingPoints,
    blocks,
    themeTokens: tokensToRows(descriptor.themeTokens),
    configurableSizingType,
    configurableSizeOptions,
    parameterSchema,
    assetsGlbUrl: assets?.glbUrl ?? "",
    assetsSvgUrl: assets?.svgUrl ?? "",
    sceneViewBox: descriptor.viewBox,
    sceneParts: "parts" in descriptor ? (descriptor as unknown as { parts: unknown[] }).parts as never : undefined,
  };
}

function cleanNumber(value: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * Merge edited form state over the original descriptor, producing a
 * descriptor-shaped input (checksum stripped). Mirrors the retired
 * `puckEditorDataToDescriptorInput` semantics: original wins for untouched
 * fields; variant discriminator + sub-object are rebuilt from the current
 * variant so a variant change stays structurally valid.
 */
export function formStateToDescriptorInput(
  original: BlockDescriptor,
  form: SvgEditorFormState,
): unknown {
  const variant: BlockDescriptorVariant = form.variant;

  const base: Record<string, unknown> = {
    ...original,
    slug: form.slug,
    sku: form.sku.trim() === "" ? undefined : form.sku.trim(),
    sourceProvenance: form.sourceProvenance,
    createdBy: form.createdBy.trim() === "" ? undefined : form.createdBy.trim(),
    geometry: {
      widthMm: form.geometry.widthMm,
      depthMm: form.geometry.depthMm,
      heightMm: form.geometry.heightMm,
      ...(cleanNumber(form.geometry.seatHeightMm) !== undefined
        ? { seatHeightMm: form.geometry.seatHeightMm }
        : {}),
      ...(cleanNumber(form.geometry.weightKg) !== undefined
        ? { weightKg: form.geometry.weightKg }
        : {}),
    },
    viewBox: {
      x: form.viewBox.x,
      y: form.viewBox.y,
      width: form.viewBox.width,
      height: form.viewBox.height,
    },
    mounting: [...form.mounting],
    liveAnnouncementCategories:
      form.liveAnnouncementCategories.length > 0
        ? [...form.liveAnnouncementCategories]
        : ["status"],
    rovingFocus: form.rovingFocus.map((r) => ({
      key: r.key,
      focusSelector: r.focusSelector,
      label: r.label,
    })),
    themeTokens: safeThemeTokens(rowsToTokens(form.themeTokens)),
    variant,
  };

  // blocks: omit the key entirely when empty (schema treats it as optional).
  if (form.blocks.length > 0) {
    base.blocks = form.blocks.map((b) => ({
      ...(b.id && b.id.trim() !== "" ? { id: b.id.trim() } : {}),
      x: b.x,
      y: b.y,
      width: b.width,
      depth: b.depth,
    }));
  } else {
    delete base.blocks;
  }

  // mountingPoints: required for parametric; omit if empty for others.
  if (form.mountingPoints.length > 0) {
    base.mountingPoints = form.mountingPoints.map((m) => ({
      plane: m.plane,
      offset: { x: m.offset.x, y: m.offset.y },
    }));
  } else {
    delete base.mountingPoints;
  }

  // Drop stale variant sub-objects, then set the current one.
  delete base.fixed;
  delete base.configurable;
  delete base.parametric;
  delete base.assets;

  if (variant === "fixed") {
    base.fixed = { sizingType: "fixed" };
    const glb = form.assetsGlbUrl.trim();
    const svg = form.assetsSvgUrl.trim();
    if (glb !== "" || svg !== "") {
      base.assets = {
        ...(glb !== "" ? { glbUrl: glb } : {}),
        ...(svg !== "" ? { svgUrl: svg } : {}),
      };
    }
  } else if (variant === "configurable") {
    base.configurable = {
      sizingType: form.configurableSizingType,
      ...(form.configurableSizeOptions.filter((s) => s.trim() !== "").length > 0
        ? { sizeOptions: form.configurableSizeOptions.map((s) => s.trim()).filter((s) => s !== "") }
        : {}),
    };
  } else {
    base.parametric = {
      sizingType: "parametric",
      parameterSchema: form.parameterSchema.map((p) => ({
        key: p.key,
        label: p.label,
        kind: p.kind,
      })),
    };
  }

  if (form.sceneViewBox) {
    base.viewBox = {
      x: form.sceneViewBox.x,
      y: form.sceneViewBox.y,
      width: form.sceneViewBox.width,
      height: form.sceneViewBox.height,
    };
  }

  if (form.sceneParts && form.sceneParts.length > 0) {
    base.parts = form.sceneParts.map((part) => ({ ...part }));
  }

  // Let freezeFreshDescriptor recompute generatedAt/checksum.
  delete base.checksum;
  return base;
}
