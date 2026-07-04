export interface HostedPlannerDocument {
  id?: string;
  name: string;
  title?: string;
  projectName?: string | null;
  clientName?: string | null;
  preparedBy?: string | null;
  roomWidthMm: number;
  roomDepthMm: number;
  seatTarget: number;
  unitSystem: 'metric' | 'imperial';
  sceneJson: unknown;
  itemCount: number;
  thumbnailUrl?: string | null;
  status?: 'draft' | 'active' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface HostedPlannerSummary {
  id: string;
  name: string;
  updated_at: string;
}

export interface HostedCatalogItem {
  id: string;
  name: string;
  category: string;
  shapeType: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  description: string;
  shortName?: string;
  imageUrl?: string;
  material?: string;
  tags: string[];
}
