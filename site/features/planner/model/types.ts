export interface PlannerPoint {
  x: number;
  y: number;
}

/**
 * Wall centreline segment in plan millimetres.
 *
 * - `start` / `end` are centreline endpoints (not face corners).
 * - `thickness` is the full width perpendicular to the centreline (mm);
 *   faces sit at ±thickness/2 from the centreline.
 * - A join is shared centreline coordinates within `WALL_JOIN_EPSILON_MM`
 *   (see `wallContract.ts`). There is no separate join entity on the document.
 * - Openings sit on the host centreline; offset is along the segment length.
 */
export interface PlannerWall {
  id: string;
  start: PlannerPoint;
  end: PlannerPoint;
  thickness: number;
  height: number;
  color: string;
}

export type PlannerDisplayUnit = "mm" | "cm" | "m" | "in" | "ft-in";
export type PlannerRoomCategory = "indoor" | "outdoor" | "garage" | "utility";

export interface PlannerRoom {
  id: string;
  name: string;
  walls: string[];
  floorTexture: string;
  area: number;
  color?: string;
  roomType?: PlannerRoomCategory;
  labelOffset?: PlannerPoint;
}

export interface PlannerDoor {
  id: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  type: "single" | "double" | "sliding" | "french" | "pocket" | "bifold";
  swingDirection: "left" | "right";
  flipSide: boolean;
}

export interface PlannerWindow {
  id: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  sillHeight: number;
  type: "standard" | "fixed" | "casement" | "sliding" | "bay";
}

/** Furniture mesh generation mode (document-serializable; no THREE objects). */
export type PlannerFurnitureGeometryMode =
  | "box"
  | "modular-cabinet-v0"
  | "workstation-v0";

/**
 * Serializable modular cabinet-v0 options (mirrors ModularCabinetV0Options).
 * Stored on furniture for save/load and 3D rebuild without designer GLB.
 */
export interface PlannerModularCabinetV0Options {
  widthMm: number;
  depthMm: number;
  heightMm: number;
  doorStyle: "none" | "slab" | "pair";
  material: "oak" | "white";
}

/**
 * Serializable systems-v0 workstation options (mirrors WorkstationV0MeshOptions).
 * Stored on furniture for multi-part mesh rebuild without designer GLB.
 */
export interface PlannerWorkstationV0Options {
  shape: "linear" | "l-shape";
  lengthMm: number;
  depthMm: number;
  heightMm: number;
  modules: Array<"desk" | "return" | "pedestal" | "panel" | "overhead">;
}

export interface PlannerFurnitureItem {
  id: string;
  catalogId: string;
  position: PlannerPoint;
  rotation: number;
  scale: { x: number; y: number; z: number };
  width?: number;
  depth?: number;
  height?: number;
  color?: string;
  material?: string;
  locked?: boolean;
  sourceCatalogId?: string;
  sourceSlug?: string;
  sourceSku?: string;
  /** When modular-cabinet-v0 / workstation-v0, viewer builds multi-part mesh. */
  geometryMode?: PlannerFurnitureGeometryMode;
  /** Required when geometryMode is modular-cabinet-v0. */
  modularOptions?: PlannerModularCabinetV0Options;
  /** Required when geometryMode is workstation-v0. */
  workstationOptions?: PlannerWorkstationV0Options;
  /**
   * System-generated GLB URL (catalog-assets/generated/* or blob:).
   * Place leaves unset (procedural default). Stamp after G5 via
   * stampFurnitureGeneratedGlb / attachGeneratedGlbToFurniture.
   * Viewer (G8 partial): async GLTF load when shouldLoadGlb allows; else procedural.
   */
  generatedGlbUrl?: string;
  /** Optional catalog/legacy mesh URL — only loaded if policy allows. */
  meshUrl?: string;
  /** Optional GLB URL alias — only loaded if policy allows. */
  glbUrl?: string;
  /**
   * S7 — published catalog preview consumed at place time (e.g. `/svg-catalog/{slug}.svg`).
   * Inventory shows this URL; place stamps it onto the furniture entity.
   * Plan canvas paints this SVG via `getSvgPlanImage`; Block2D is fallback while loading or on miss.
   */
  previewImageUrl?: string;
}

export interface PlannerStair {
  id: string;
  position: PlannerPoint;
  rotation: number;
  width: number;
  depth: number;
  riserCount: number;
  direction: "up" | "down";
  stairType: "straight" | "l-shaped" | "u-shaped" | "spiral";
}

export interface PlannerColumn {
  id: string;
  position: PlannerPoint;
  rotation: number;
  shape: "round" | "square";
  diameter: number;
  height: number;
  color: string;
}

export interface PlannerGuide {
  id: string;
  orientation: "horizontal" | "vertical";
  position: number;
}

export interface PlannerMeasurement {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PlannerAnnotation extends PlannerMeasurement {
  label?: string;
  offset: number;
}

export interface PlannerTextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
}

export interface PlannerElementGroup {
  id: string;
  elementIds: string[];
}

export interface PlannerBackgroundImage {
  dataUrl: string;
  position: PlannerPoint;
  /** Display scale multiplier (1 = natural mm-per-pixel mapping). */
  scale: number;
  opacity: number;
  rotation: number;
  locked: boolean;
  /** Image natural width in pixels (for calibrate / paint). */
  imageWidthPx?: number;
  /** Image natural height in pixels. */
  imageHeightPx?: number;
  /**
   * Millimetres per image pixel after calibration (or default room mapping).
   * Footprint widthMm = imageWidthPx * mmPerPixel * scale.
   */
  mmPerPixel?: number;
}

export interface PlannerFloor {
  id: string;
  name: string;
  level: number;
  walls: PlannerWall[];
  rooms: PlannerRoom[];
  doors: PlannerDoor[];
  windows: PlannerWindow[];
  furniture: PlannerFurnitureItem[];
  stairs: PlannerStair[];
  columns: PlannerColumn[];
  guides: PlannerGuide[];
  measurements: PlannerMeasurement[];
  annotations: PlannerAnnotation[];
  textAnnotations: PlannerTextAnnotation[];
  groups: PlannerElementGroup[];
  backgroundImage?: PlannerBackgroundImage;
}

export interface PlannerProject {
  id: string;
  name: string;
  description?: string;
  floors: PlannerFloor[];
  activeFloorId: string;
  displayUnit: PlannerDisplayUnit;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerSceneEnvelope {
  type: "open3d-floorplan-project";
  version: 1;
  units: "mm";
  displayUnit: PlannerDisplayUnit;
  source: "native-open3d";
  project: PlannerProject;
}
