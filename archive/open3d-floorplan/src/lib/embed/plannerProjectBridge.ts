import type { Floor, FurnitureItem, Point, Project, Wall } from '$lib/models/types';
import { createDefaultProject } from '$lib/stores/project';
import { getCatalogItem } from '$lib/utils/furnitureCatalog';

import type { HostedPlannerDocument } from './plannerTypes';

const OPEN3D_SCENE_TYPE = 'open3d-floorplan-project';
const OPEN3D_SCENE_VERSION = 1;

type LegacyPlannerSceneItem = {
  id?: string;
  productId?: string;
  productSlug?: string;
  plannerSourceSlug?: string;
  name?: string;
  category?: string;
  centerMm?: { xMm?: number; yMm?: number };
  sizeMm?: { widthMm?: number; depthMm?: number; heightMm?: number };
  rotationDeg?: number;
};

type LegacyPlannerSceneEnvelope = {
  type: 'cad-suite-planner-scene';
  version: 1;
  room?: {
    widthMm?: number;
    depthMm?: number;
    originMm?: { xMm?: number; yMm?: number };
  };
  items?: LegacyPlannerSceneItem[];
};

type ProjectMetadata = Pick<
  HostedPlannerDocument,
  | 'projectName'
  | 'clientName'
  | 'preparedBy'
  | 'seatTarget'
  | 'unitSystem'
  | 'thumbnailUrl'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
>;

const projectMetadataById = new Map<string, ProjectMetadata>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function reviveProject(project: Project): Project {
  const revived = {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
    floors: (project.floors ?? []).map((floor) => ({
      ...floor,
      rooms: floor.rooms ?? [],
      doors: floor.doors ?? [],
      windows: floor.windows ?? [],
      furniture: floor.furniture ?? [],
      stairs: floor.stairs ?? [],
      columns: floor.columns ?? [],
      guides: floor.guides ?? [],
      measurements: floor.measurements ?? [],
      annotations: floor.annotations ?? [],
      textAnnotations: floor.textAnnotations ?? [],
      groups: floor.groups ?? [],
    })),
  } satisfies Project;
  return revived;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function createRectangularWalls(widthCm: number, depthCm: number): Wall[] {
  const corners: Point[] = [
    { x: 0, y: 0 },
    { x: widthCm, y: 0 },
    { x: widthCm, y: depthCm },
    { x: 0, y: depthCm },
  ];

  return corners.map((start, index) => {
    const end = corners[(index + 1) % corners.length];
    return {
      id: `wall-${index + 1}`,
      start,
      end,
      thickness: 15,
      height: 280,
      color: '#444444',
    };
  });
}

function createProjectFromRoomSize(
  name: string,
  id: string,
  widthCm: number,
  depthCm: number,
): Project {
  const project = createDefaultProject(name);
  project.id = id;
  project.name = name;
  const floor = project.floors[0];
  floor.walls = createRectangularWalls(widthCm, depthCm);
  return project;
}

function resolveLegacyCatalogId(item: LegacyPlannerSceneItem): string {
  const blob = `${item.name ?? ''} ${item.category ?? ''}`.toLowerCase();
  if (blob.includes('chair') || blob.includes('seat')) return 'office_chair';
  if (blob.includes('meeting') || blob.includes('table')) return 'dining_table';
  if (blob.includes('cabinet') || blob.includes('locker') || blob.includes('storage')) return 'storage';
  if (blob.includes('sofa') || blob.includes('lounge')) return 'sofa';
  if (blob.includes('plant')) return 'potted_plant';
  return 'desk';
}

function getLegacySceneEnvelope(sceneJson: unknown): LegacyPlannerSceneEnvelope | null {
  if (isRecord(sceneJson) && sceneJson.type === 'cad-suite-planner-scene' && sceneJson.version === 1) {
    return sceneJson as LegacyPlannerSceneEnvelope;
  }
  if (isRecord(sceneJson) && isRecord(sceneJson.plannerScene)) {
    const nested = sceneJson.plannerScene;
    if (nested.type === 'cad-suite-planner-scene' && nested.version === 1) {
      return nested as LegacyPlannerSceneEnvelope;
    }
  }
  return null;
}

function convertLegacySceneDocument(document: HostedPlannerDocument): Project {
  const envelope = getLegacySceneEnvelope(document.sceneJson);
  const widthCm = Math.max(100, Math.round((envelope?.room?.widthMm ?? document.roomWidthMm ?? 6000) / 10));
  const depthCm = Math.max(100, Math.round((envelope?.room?.depthMm ?? document.roomDepthMm ?? 8000) / 10));
  const originX = Math.round(readNumber(envelope?.room?.originMm?.xMm, 0) / 10);
  const originY = Math.round(readNumber(envelope?.room?.originMm?.yMm, 0) / 10);
  const project = createProjectFromRoomSize(document.name, document.id ?? document.name, widthCm, depthCm);
  const floor = project.floors[0];

  const items = Array.isArray(envelope?.items) ? envelope!.items : [];
  floor.furniture = items.map((item, index): FurnitureItem => {
    const catalogId = resolveLegacyCatalogId(item);
    const fallbackCatalog = getCatalogItem(catalogId);
    const width = Math.max(20, Math.round(readNumber(item.sizeMm?.widthMm, (fallbackCatalog?.width ?? 120) * 10) / 10));
    const depth = Math.max(20, Math.round(readNumber(item.sizeMm?.depthMm, (fallbackCatalog?.depth ?? 60) * 10) / 10));
    const height = Math.max(1, Math.round(readNumber(item.sizeMm?.heightMm, (fallbackCatalog?.height ?? 75) * 10) / 10));
    return {
      id: item.id?.trim() || `legacy-item-${index + 1}`,
      catalogId,
      position: {
        x: Math.round(readNumber(item.centerMm?.xMm, width * 5) / 10) - originX,
        y: Math.round(readNumber(item.centerMm?.yMm, depth * 5) / 10) - originY,
      },
      rotation: readNumber(item.rotationDeg, 0),
      scale: { x: 1, y: 1, z: 1 },
      width,
      depth,
      height,
    };
  });

  return project;
}

function getProjectBounds(project: Project): { widthMm: number; depthMm: number } {
  const floor = project.floors.find((entry) => entry.id === project.activeFloorId) ?? project.floors[0];
  if (!floor) {
    return { widthMm: 6000, depthMm: 8000 };
  }

  const xs: number[] = [];
  const ys: number[] = [];
  for (const wall of floor.walls) {
    xs.push(wall.start.x, wall.end.x);
    ys.push(wall.start.y, wall.end.y);
    if (wall.curvePoint) {
      xs.push(wall.curvePoint.x);
      ys.push(wall.curvePoint.y);
    }
  }

  if (xs.length === 0 || ys.length === 0) {
    return { widthMm: 6000, depthMm: 8000 };
  }

  return {
    widthMm: Math.max(1000, Math.round((Math.max(...xs) - Math.min(...xs)) * 10)),
    depthMm: Math.max(1000, Math.round((Math.max(...ys) - Math.min(...ys)) * 10)),
  };
}

function countProjectItems(project: Project): number {
  return project.floors.reduce((total, floor) => (
    total
    + floor.walls.length
    + floor.doors.length
    + floor.windows.length
    + floor.furniture.length
    + floor.stairs.length
    + floor.columns.length
    + floor.annotations.length
    + floor.measurements.length
    + floor.textAnnotations.length
  ), 0);
}

export function rememberPlannerDocumentMetadata(document: HostedPlannerDocument): void {
  const normalizedId = document.id?.trim();
  if (!normalizedId) return;
  projectMetadataById.set(normalizedId, {
    projectName: document.projectName ?? null,
    clientName: document.clientName ?? null,
    preparedBy: document.preparedBy ?? null,
    seatTarget: document.seatTarget,
    unitSystem: document.unitSystem,
    thumbnailUrl: document.thumbnailUrl ?? null,
    status: document.status ?? 'draft',
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  });
}

export function plannerDocumentToProject(document: HostedPlannerDocument): Project {
  rememberPlannerDocumentMetadata(document);

  const sceneJson = document.sceneJson;
  if (isRecord(sceneJson) && sceneJson.type === OPEN3D_SCENE_TYPE && sceneJson.version === OPEN3D_SCENE_VERSION && isRecord(sceneJson.project)) {
    const embeddedProject = sceneJson.project as Project;
    const revivedProject = reviveProject({
      ...embeddedProject,
      id: document.id ?? embeddedProject.id,
      name: document.name || embeddedProject.name,
    });
    return revivedProject;
  }

  return convertLegacySceneDocument(document);
}

export function projectToPlannerDocument(project: Project): HostedPlannerDocument {
  const bounds = getProjectBounds(project);
  const preserved = projectMetadataById.get(project.id);

  return {
    id: project.id,
    name: project.name || 'Untitled plan',
    title: project.name || 'Untitled plan',
    projectName: preserved?.projectName ?? null,
    clientName: preserved?.clientName ?? null,
    preparedBy: preserved?.preparedBy ?? null,
    roomWidthMm: bounds.widthMm,
    roomDepthMm: bounds.depthMm,
    seatTarget: preserved?.seatTarget ?? 0,
    unitSystem: preserved?.unitSystem ?? 'metric',
    sceneJson: {
      type: OPEN3D_SCENE_TYPE,
      version: OPEN3D_SCENE_VERSION,
      project,
    },
    itemCount: countProjectItems(project),
    thumbnailUrl: preserved?.thumbnailUrl ?? null,
    status: preserved?.status ?? 'draft',
    createdAt: preserved?.createdAt ?? project.createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
