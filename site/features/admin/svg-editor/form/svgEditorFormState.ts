/**
 * No-code SVG editor — client form state (A4).
 *
 * `SvgEditorFormState` is the single client-side state object AND the payload
 * for both the live-preview and publish server actions. It mirrors the editable
 * `BlockDescriptor` fields in a shape convenient for controlled form inputs:
 * flat scalars where possible, structured arrays for object-array fields, and a
 * `Record<string,string>` for theme tokens. Adapters translate it to/from a
 * real `BlockDescriptor` (`svgEditorFormAdapters.ts`).
 *
 * It carries NO `checksum`/`generatedAt` — those are recomputed by
 * `freezeFreshDescriptor` at compile/publish time.
 */

import type {
  BlockDescriptorVariant,
  MountPlane,
  BlockDescriptorLiveAnnouncementCategory,
} from "@/features/planner/project/catalog/svg/svgTypes";
import type { SvgBlockDefinitionV1 } from "../contracts/svgBlockSchemas";

export interface FormVec2 {
  x: number;
  y: number;
}

export interface FormGeometry {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  seatHeightMm?: number;
  weightKg?: number;
}

export interface FormViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FormRovingFocus {
  key: string;
  focusSelector: string;
  label: string;
}

export interface FormMountingPoint {
  plane: MountPlane;
  offset: FormVec2;
}

export interface FormBlock {
  id?: string;
  x: number;
  y: number;
  width: number;
  depth: number;
}

export interface FormParameter {
  key: string;
  label: string;
  kind: "number" | "select" | "boolean";
}

/** One theme-token row (kept as an ordered array for stable row editing). */
export interface FormTokenRow {
  key: string;
  value: string;
}

export interface SvgEditorFormState {
  /** Preserved, not user-editable except via the variant control. */
  variant: BlockDescriptorVariant;
  slug: string;
  sku: string;
  sourceProvenance: "donor" | "native" | "migrated";
  createdBy: string;
  geometry: FormGeometry;
  viewBox: FormViewBox;
  mounting: MountPlane[];
  liveAnnouncementCategories: BlockDescriptorLiveAnnouncementCategory[];
  rovingFocus: FormRovingFocus[];
  mountingPoints: FormMountingPoint[];
  blocks: FormBlock[];
  themeTokens: FormTokenRow[];
  /** configurable-only */
  configurableSizingType: "discrete" | "parametric";
  configurableSizeOptions: string[];
  /** parametric-only */
  parameterSchema: FormParameter[];
  /** fixed-only */
  assetsGlbUrl: string;
  assetsSvgUrl: string;
  /** A4.0.1: visual scene is the publish authority for SVG geometry. */
  sceneViewBox?: SvgBlockDefinitionV1["viewBox"];
  sceneParts?: SvgBlockDefinitionV1["parts"];
  excalidrawElements?: unknown;
  compiledSvg?: string;
  /**
   * DB-SVG-09: the generatedAt stamp of the descriptor when the editor session opened.
   * Sent with every publish so the server can reject a stale draft without data loss.
   */
  openedBaselineGeneratedAt?: number;
}

/** Field issue shape shared with `parseBlockDescriptor` / `freezeFreshDescriptor`. */
export interface FieldIssue {
  path: string;
  message: string;
}
