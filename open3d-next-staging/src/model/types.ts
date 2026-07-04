// Unified types for Open3D Floorplan
// Using consistent naming convention

export type Open3dPoint = Point;
export type Open3dWall = Wall;
export type Open3dRoom = Room;
export type Open3dDoor = Door;
export type Open3dWindow = Window;
export type Open3dFurnitureItem = FurnitureItem;
export type Open3dElementGroup = ElementGroup;
export type Open3dStair = Stair;
export type Open3dColumn = Column;
export type Open3dMeasurement = Measurement;
export type Open3dAnnotation = Annotation;
export type Open3dTextAnnotation = TextAnnotation;
export type Open3dGuide = GuideLine;
export type Open3dBackgroundImage = BackgroundImage;
export type Open3dFloor = Floor;
export type Open3dProject = Project;

// Base interfaces
export interface Point { x: number; y: number; }

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height: number;
  color: string;
  /** Optional quadratic bezier control point for curved walls */
  curvePoint?: Point;
  texture?: string;
  /** Interior-specific overrides (if different from exterior) */
  interiorColor?: string;
  interiorTexture?: string;
  /** Exterior-specific overrides */
  exteriorColor?: string;
  exteriorTexture?: string;
}

export type RoomCategory = 'indoor' | 'outdoor' | 'garage' | 'utility';

export interface Room {
  id: string;
  name: string;
  walls: string[];
  floorTexture: string;
  area: number;
  color?: string;
  roomType?: RoomCategory;
  /** Custom label position offset from centroid (in world units) */
  labelOffset?: Point;
}

export interface Door {
  id: string;
  wallId: string;
  position: number; // 0-1 along wall
  width: number;
  height: number;
  type: 'single' | 'double' | 'sliding' | 'french' | 'pocket' | 'bifold';
  swingDirection: 'left' | 'right';
  flipSide: boolean; // flip which side of wall the door opens to (vertical flip)
}

export interface Window {
  id: string;
  wallId: string;
  position: number; // 0-1 along wall
  width: number;
  height: number;
  sillHeight: number;
  type: 'standard' | 'fixed' | 'casement' | 'sliding' | 'bay';
}

export interface FurnitureItem {
  id: string;
  catalogId: string;
  position: Point;
  rotation: number;
  scale: { x: number; y: number; z: number };
  // Per-item overrides (optional — falls back to catalog defaults)
  color?: string;
  width?: number;   // cm
  depth?: number;   // cm
  height?: number;  // cm
  material?: string; // material name/id
  locked?: boolean;
}

export interface ElementGroup {
  id: string;
  elementIds: string[];
}

export type StairType = 'straight' | 'l-shaped' | 'u-shaped' | 'spiral';

export interface Stair {
  id: string;
  position: Point;
  rotation: number;
  width: number;   // default 100cm
  depth: number;   // default 300cm
  riserCount: number; // default 14
  direction: 'up' | 'down';
  stairType: StairType; // default 'straight'
}

export interface Column {
  id: string;
  position: Point;
  rotation: number;
  shape: 'round' | 'square';
  diameter: number;  // cm (for round) or side length (for square)
  height: number;    // cm
  color: string;
}

export interface Measurement {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Annotation {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  offset: number; // perpendicular offset for dimension line (default 40)
}

export interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
}

export interface GuideLine {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number; // world coordinate (x for vertical, y for horizontal)
}

export interface BackgroundImage {
  dataUrl: string;
  position: Point;
  scale: number;
  opacity: number;
  rotation: number;
  locked: boolean;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  walls: Wall[];
  rooms: Room[];
  doors: Door[];
  windows: Window[];
  furniture: FurnitureItem[];
  stairs: Stair[];
  columns: Column[];
  backgroundImage?: BackgroundImage;
  guides: GuideLine[];
  measurements: Measurement[];
  annotations: Annotation[];
  textAnnotations: TextAnnotation[];
  groups: ElementGroup[];
}

export type Open3dDisplayUnit = "mm" | "cm" | "m" | "in" | "ft-in";

export interface Project {
  id: string;
  name: string;
  description?: string;
  floors: Floor[];
  activeFloorId: string;
  displayUnit?: Open3dDisplayUnit;
  createdAt: Date;
  updatedAt: Date;
}

export interface Open3dPlannerSceneEnvelope {
  type: "open3d-floorplan-project";
  version: 1;
  units: "mm";
  displayUnit: Open3dDisplayUnit;
  source: "native-open3d";
  project: Project;
}
