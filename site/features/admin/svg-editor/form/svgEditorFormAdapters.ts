/**
 * No-code SVG editor — pure adapters (A4).
 *
 * - `descriptorToFormState(descriptor)` → controlled form state (prefill).
 * - `formStateToDescriptorInput(original, form)` → descriptor-shaped input for
 *   `freezeFreshDescriptor` / publish.
 *
 * Geometry authority: when `form.sceneParts` is set (visual studio), publish
 * writes **`blocks`** derived from those parts so geometry survives
 * `BlockDescriptorSchema` (no `parts` field). Stale form `blocks` are replaced,
 * not merged. Form-only geometry is used only when the scene never committed.
 *
 * Pure + server-safe (no React, no `any`). `themeTokens` defaults are inlined.
 */

import {
  type BlockDescriptor,
  type BlockDescriptorConfigurable,
  type BlockDescriptorParametric,
  type BlockDescriptorVariant,
} from "@/features/planner/project/catalog/svg/svgTypes";

import type {
  SvgEditorFormState,
  FormTokenRow,
  FormBlock,
  FormMountingPoint,
  FormRovingFocus,
  FormParameter,
} from "./svgEditorFormState";
import type { SvgBlockDefinitionV1 } from "../contracts/svgBlockSchemas";
import { sceneFromDescriptor } from "../scene/sceneFromDescriptor";
import { serializeSceneToDefinition } from "../scene/svgSceneSerializer";

function tokensToRows(tokens: BlockDescriptor["themeTokens"]): FormTokenRow[] {
  const safe: Record<string, string> = {
    currentColor: "currentColor",
    "--fill-primary": "var(--color-surface-raised)",
    ...(tokens && typeof tokens === "object" && !Array.isArray(tokens)
      ? Object.fromEntries(Object.entries(tokens).filter(([, v]) => typeof v === "string" && v.length > 0))
      : {}),
  };
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
  // Never emit an empty token map — supply canonical defaults.
  return Object.keys(out).length > 0 ? out : { currentColor: "currentColor", "--fill-primary": "var(--color-surface-raised)" };
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

  // Seed scene authority from the same geometry the canvas will show so live
  // compile + publish match open without requiring a canvas edit first.
  const seedScene = sceneFromDescriptor(descriptor);
  const seedDefinition = serializeSceneToDefinition(seedScene);

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
    sceneViewBox: seedDefinition.viewBox,
    sceneParts: seedDefinition.parts,
    excalidrawElements: (descriptor as any).excalidrawElements,
  };
}

/**
 * Map V1 scene parts → BlockDescriptor `blocks` (depth = plan Y extent).
 * Circles become axis-aligned bounding rects so the boolean pipeline can paint them.
 * Line/path/text are skipped (no block IR yet) — rect/circle cover the studio tools.
 */
export function scenePartsToBlocks(
  parts: SvgBlockDefinitionV1["parts"],
): FormBlock[] {
  const out: FormBlock[] = [];
  for (const part of parts) {
    if (part.kind === "rect") {
      if (part.visible === false) continue;
      if (!(part.width > 0) || !(part.height > 0)) continue;
      out.push({
        id: part.id,
        x: part.x,
        y: part.y,
        width: part.width,
        depth: part.height,
      });
      continue;
    }
    if (part.kind === "circle") {
      if (part.visible === false) continue;
      if (!(part.r > 0)) continue;
      out.push({
        id: part.id,
        x: part.cx - part.r,
        y: part.cy - part.r,
        width: part.r * 2,
        depth: part.r * 2,
      });
    }
  }
  return out;
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

  // Stable product identity: UUID and parent stay on the original record.
  // Operators may edit slug/SKU/geometry; they must not mint a new product id.
  const base: Record<string, unknown> = {
    ...original,
    id: original.id,
    ...(original.parentProductId !== undefined
      ? { parentProductId: original.parentProductId }
      : {}),
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
    themeTokens: { currentColor: "currentColor", "--fill-primary": "var(--color-surface-raised)", ...rowsToTokens(form.themeTokens) } as BlockDescriptor["themeTokens"],
    variant,
  };

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

  // Scene is sole geometry authority when present (studio open or edited).
  if (form.sceneParts && form.sceneParts.length > 0) {
    if (form.sceneViewBox) {
      base.viewBox = {
        x: form.sceneViewBox.x,
        y: form.sceneViewBox.y,
        width: form.sceneViewBox.width,
        height: form.sceneViewBox.height,
      };
    }
    // Keep parts for raw compile paths that still read them.
    base.parts = form.sceneParts.map((part) => ({ ...part }));
    // Map to blocks so freezeFreshDescriptor / BlockDescriptorSchema retain geometry.
    const sceneBlocks = scenePartsToBlocks(form.sceneParts);
    if (sceneBlocks.length > 0) {
      base.blocks = sceneBlocks.map((b) => ({
        ...(b.id && b.id.trim() !== "" ? { id: b.id.trim() } : {}),
        x: b.x,
        y: b.y,
        width: b.width,
        depth: b.depth,
      }));
    } else {
      delete base.blocks;
    }
  } else if (form.blocks.length > 0) {
    // Legacy form-only path (no studio seed) — keep for non-studio callers.
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

  if (form.excalidrawElements) {
    base.excalidrawElements = form.excalidrawElements;
  }

  // Let freezeFreshDescriptor recompute generatedAt/checksum.
  delete base.checksum;
  return base;
}
