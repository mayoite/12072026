import type { FurnitureDef } from '$lib/utils/furnitureCatalog';

import { browserApiFetch } from './browserApi';
import type { HostedCatalogItem } from './plannerTypes';

type PlannerCatalogResponse = {
  items?: HostedCatalogItem[];
};

const CATEGORY_META: Record<string, { category: string; icon: string; color: string }> = {
  desks: { category: 'Workstations', icon: '🖥️', color: '#3b82f6' },
  rooms: { category: 'Rooms', icon: '🚪', color: '#8b5cf6' },
  equipment: { category: 'Equipment', icon: '🧰', color: '#f59e0b' },
  storage: { category: 'Storage', icon: '🗄️', color: '#14b8a6' },
  zones: { category: 'Zones', icon: '📐', color: '#10b981' },
  infrastructure: { category: 'Infrastructure', icon: '📡', color: '#ef4444' },
};

function mapCatalogItemToFurnitureDef(item: HostedCatalogItem): FurnitureDef {
  const meta = CATEGORY_META[item.category] ?? {
    category: 'Catalog',
    icon: '📦',
    color: '#64748b',
  };

  return {
    id: item.id,
    name: item.shortName || item.name,
    category: meta.category,
    icon: meta.icon,
    color: meta.color,
    width: Math.max(20, Math.round(item.widthMm)),
    depth: Math.max(20, Math.round(item.heightMm)),
    height: Math.max(1, Math.round(item.depthMm)),
  };
}

export async function fetchPlannerFurnitureCatalog(): Promise<FurnitureDef[]> {
  const response = await browserApiFetch('/api/planner/catalog');
  if (!response.ok) {
    throw new Error(`Planner catalog request failed (${response.status})`);
  }

  const payload = (await response.json().catch(() => ({}))) as PlannerCatalogResponse;
  const items = Array.isArray(payload.items) ? payload.items : [];
  return items.map(mapCatalogItemToFurnitureDef);
}
