export interface Open3dPoint {
  x: number;
  y: number;
}

export interface Open3dWall {
  id: string;
  start: Open3dPoint;
  end: Open3dPoint;
  thickness: number;
  height: number;
  color: string;
}

export type Open3dDisplayUnit = "mm" | "cm" | "m" | "in" | "ft-in";
export type Open3dRoomCategory = "indoor" | "outdoor" | "garage" | "utility";

export interface Open3dRoom {
  id: string;
  name: string;
  walls: string[];
  floorTexture: string;
  area: number;
  color?: string;
  roomType?: Open3dRoomCategory;
  labelOffset?: Open3dPoint;
}

export interface Open3dDoor {
  id: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  type: "single" | "double" | "sliding" | "french" | "pocket" | "bifold";
  swingDirection: "left" | "right";
  flipSide: boolean;
}

export interface Open3dWindow {
  id: string;
  wallId: string;
  position: number;
  width: number;
  height: number;
  sillHeight: number;
  type: "standard" | "fixed" | "casement" | "sliding" | "bay";
}

/** Furniture mesh generation mode (document-serializable; no THREE objects). */
export type Open3dFurnitureGeometryMode =
  | "box"
  | "modular-cabinet-v0"
  | "workstation-v0";

/**
 * Serializable modular cabinet-v0 options (mirrors ModularCabinetV0Options).
 * Stored on furniture for save/load and 3D rebuild without designer GLB.
 */
export interface Open3dModularCabinetV0Options {
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
export interface Open3dWorkstationV0Options {
  shape: "linear" | "l-shape";
  lengthMm: number;
  depthMm: number;
  heightMm: number;
  modules: Array<"desk" | "return" | "pedestal" | "panel" | "overhead">;
}

export interface Open3dFurnitureItem {
  id: string;
  catalogId: string;
  position: Open3dPoint;
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
  geometryMode?: Open3dFurnitureGeometryMode;
  /** Required when geometryMode is modular-cabinet-v0. */
  modularOptions?: Open3dModularCabinetV0Options;
  /** Required when geometryMode is workstation-v0. */
  workstationOptions?: Open3dWorkstationV0Options;
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
}

export interface Open3dStair {
  id: string;
  position: Open3dPoint;
  rotation: number;
  width: number;
  depth: number;
  riserCount: number;
  direction: "up" | "down";
  stairType: "straight" | "l-shaped" | "u-shaped" | "spiral";
}

export interface Open3dColumn {
  id: string;
  position: Open3dPoint;
  rotation: number;
  shape: "round" | "square";
  diameter: number;
  height: number;
  color: string;
}

export interface Open3dGuide {
  id: string;
  orientation: "horizontal" | "vertical";
  position: number;
}

export interface Open3dMeasurement {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Open3dAnnotation extends Open3dMeasurement {
  label?: string;
  offset: number;
}

export interface Open3dTextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
}

export interface Open3dElementGroup {
  id: string;
  elementIds: string[];
}

export interface Open3dBackgroundImage {
  dataUrl: string;
  position: Open3dPoint;
  scale: number;
  opacity: number;
  rotation: number;
  locked: boolean;
}

export interface Open3dFloor {
  id: string;
  name: string;
  level: number;
  walls: Open3dWall[];
  rooms: Open3dRoom[];
  doors: Open3dDoor[];
  windows: Open3dWindow[];
  furniture: Open3dFurnitureItem[];
  stairs: Open3dStair[];
  columns: Open3dColumn[];
  guides: Open3dGuide[];
  measurements: Open3dMeasurement[];
  annotations: Open3dAnnotation[];
  textAnnotations: Open3dTextAnnotation[];
  groups: Open3dElementGroup[];
  backgroundImage?: Open3dBackgroundImage;
}

export interface Open3dProject {
  id: string;
  name: string;
  description?: string;
  floors: Open3dFloor[];
  activeFloorId: string;
  displayUnit: Open3dDisplayUnit;
  createdAt: string;
  updatedAt: string;
}

export interface Open3dPlannerSceneEnvelope {
  type: "open3d-floorplan-project";
  version: 1;
  units: "mm";
  displayUnit: Open3dDisplayUnit;
  source: "native-open3d";
  project: Open3dProject;
}
