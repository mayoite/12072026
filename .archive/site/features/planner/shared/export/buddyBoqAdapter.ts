/**
 * ARCHIVED 2026-07-14 — reference only. Do not import from `site/`.
 *
 * Former path: `site/features/planner/shared/export/buddyBoqAdapter.ts`
 * Live BOQ: `site/features/planner/project/shared/export/projectFurnitureBoq.ts`
 */

/** Minimal PdfBoqRow shape (inlined for archive self-containment). */
type PdfBoqRow = {
  name: string;
  category: string;
  quantity: number;
  widthCm: number;
  depthCm: number;
  heightCm: number;
};

type ExportLayout = {
  projectName: string;
  clientName?: string;
  roomWidthMm: number;
  roomDepthMm: number;
  unitSystem: "metric" | "imperial";
  generatedAt: string;
};

/**
 * Minimal shape expected from Buddy's element store.
 * Matches what `useBuddyElementsStore` exposed for placed elements.
 */
export type BuddyExportElement = {
  id: string;
  type: string;
  label?: string;
  name?: string;
  category?: string;
  width: number;
  height: number;
  depth?: number;
  shape?: string;
  catalogId?: string;
};

const TYPE_TO_CATEGORY: Record<string, string> = {
  "table-rect": "Tables",
  "table-conference": "Tables",
  "table-round": "Tables",
  "table-oval": "Tables",
  desk: "Desks",
  "hot-desk": "Desks",
  workstation: "Desks",
  "private-office": "Desks",
  "conference-room": "Rooms",
  "phone-booth": "Rooms",
  "common-area": "Rooms",
  chair: "Seating",
  sofa: "Furniture",
  plant: "Furniture",
  printer: "Equipment",
  whiteboard: "Equipment",
  divider: "Structure",
  planter: "Furniture",
  counter: "Facilities",
  decor: "Furniture",
  "custom-shape": "Custom",
  "text-label": "Labels",
};

const EXCLUDED_TYPES = new Set(["text-label", "custom-svg"]);

export function buddyElementsToBoqRows(elements: BuddyExportElement[]): PdfBoqRow[] {
  const filtered = elements.filter((el) => !EXCLUDED_TYPES.has(el.type));

  const grouped = new Map<string, { element: BuddyExportElement; count: number }>();

  for (const el of filtered) {
    const key = `${el.type}|${el.shape ?? ""}|${el.width}x${el.height}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.count++;
    } else {
      grouped.set(key, { element: el, count: 1 });
    }
  }

  const rows: PdfBoqRow[] = [];
  for (const { element, count } of grouped.values()) {
    rows.push({
      name: element.label ?? element.name ?? element.type,
      category: element.category ?? TYPE_TO_CATEGORY[element.type] ?? "Other",
      quantity: count,
      widthCm: Math.round(element.width / 10),
      depthCm: Math.round((element.depth ?? element.height) / 10),
      heightCm: 75,
    });
  }

  return rows;
}

export function buildBuddyExportLayout(opts: {
  projectName: string;
  clientName?: string;
  roomWidthMm?: number;
  roomDepthMm?: number;
}): ExportLayout {
  return {
    projectName: opts.projectName || "Buddy Workspace Plan",
    clientName: opts.clientName,
    roomWidthMm: opts.roomWidthMm ?? 6000,
    roomDepthMm: opts.roomDepthMm ?? 4000,
    unitSystem: "metric",
    generatedAt: new Date().toISOString(),
  };
}
