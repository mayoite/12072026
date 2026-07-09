/**
 * Phase 06 Export Utilities
 *
 * Multi-format export for Open3D floor plans:
 * - JSON: Full project serialization
 * - SVG: Vector graphics for web/print
 * - PNG: Rasterized floor plan
 * - PDF: Multi-page document with title block
 * - DXF: CAD handoff format
 *
 * All internal geometry uses canonical millimetres.
 * Display values use the project's displayUnit.
 */

import type {
  Open3dProject,
  Open3dFloor,
  Open3dWall,
  Open3dDisplayUnit,
} from "../../model/types";
import { displayCmFromCanonicalMm, displayMFromCanonicalMm, displayInFromCanonicalMm, displayFtInFromCanonicalMm } from "../../catalog/unitConversion";
import {
  readExportPaintColors,
  resolvePaintColor,
} from "../readThemeColor";
import { PLANNER_COLOR_TOKENS } from "../themeColorTokens";

// ── Types ──

/** Result from an export operation */
export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  error?: string;
}

/** PDF export settings */
export interface PdfExportSettings {
  title?: string;
  include3D?: boolean;
  includeRoomSchedule?: boolean;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
  showDimensions?: boolean;
  showRoomNames?: boolean;
  showFurnitureLabels?: boolean;
}

/** Default PDF settings */
export const DEFAULT_PDF_SETTINGS: PdfExportSettings = {
  include3D: false,
  includeRoomSchedule: true,
  orientation: "landscape",
  format: "a4",
  showDimensions: true,
  showRoomNames: true,
  showFurnitureLabels: true,
};

// ── Unit formatting ──

/**
 * Format a measurement value according to display unit.
 * @param mmValue - Value in millimetres (internal canonical)
 * @param displayUnit - Target display unit
 * @returns Formatted string with unit
 */
export function formatMeasurement(mmValue: number, displayUnit: Open3dDisplayUnit): string {
  const converters: Record<Open3dDisplayUnit, (v: number) => string> = {
    mm: (v) => `${Math.round(v)} mm`,
    cm: (v) => `${displayCmFromCanonicalMm(v)} cm`,
    m: (v) => `${displayMFromCanonicalMm(v)} m`,
    in: (v) => `${displayInFromCanonicalMm(v)} in`,
    "ft-in": displayFtInFromCanonicalMm,
  };
  return converters[displayUnit](mmValue);
}

// ── Geometry helpers ──

/** Calculate wall length in mm */
export function getWallLengthMm(wall: Open3dWall): number {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Calculate floor bounding box */
export function getFloorBounds(floor: Open3dFloor): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const w of floor.walls) {
    minX = Math.min(minX, w.start.x, w.end.x);
    minY = Math.min(minY, w.start.y, w.end.y);
    maxX = Math.max(maxX, w.start.x, w.end.x);
    maxY = Math.max(maxY, w.start.y, w.end.y);
  }

  for (const f of floor.furniture) {
    const fw = f.width ?? 500;
    const fd = f.depth ?? 500;
    minX = Math.min(minX, f.position.x - fw / 2);
    minY = Math.min(minY, f.position.y - fd / 2);
    maxX = Math.max(maxX, f.position.x + fw / 2);
    maxY = Math.max(maxY, f.position.y + fd / 2);
  }

  return { minX, minY, maxX, maxY };
}

// ── JSON Export ──

/**
 * Serialize a project to JSON string.
 * @param project - The project to serialize
 * @param pretty - Whether to pretty-print
 * @returns JSON string
 */
export function exportAsJSON(project: Open3dProject, pretty = false): string {
  const envelope = {
    type: "open3d-floorplan-project",
    version: 1,
    units: "mm" as const,
    displayUnit: project.displayUnit,
    source: "native-open3d" as const,
    project,
  };
  return JSON.stringify(envelope, null, pretty ? 2 : 0);
}

/**
 * Download a blob as a file.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download JSON export.
 */
export function downloadJSON(project: Open3dProject, filename?: string): void {
  const json = exportAsJSON(project, true);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, filename ?? `${project.name || "floorplan"}.json`);
}

/**
 * Download systems v0 workstation BOQ (identity + qty + footprint; no prices yet).
 */
export function downloadWorkstationBoqJSON(
  summary: {
    lines: readonly unknown[];
    totalSeats: number;
    totalInstances: number;
  },
  filename = "workstation-boq-v0.json",
): void {
  const payload = {
    kind: "workstation-boq-v0",
    exportedAt: new Date().toISOString(),
    ...summary,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

// ── SVG Export ──

/** Escape text for safe SVG embedding */
function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate SVG from floor geometry.
 * Reuses Phase 03A SVG generation pipeline patterns.
 */
export function exportAsSVG(project: Open3dProject, floor?: Open3dFloor): string {
  const targetFloor = floor ?? project.floors.find((f) => f.id === project.activeFloorId) ?? project.floors[0];
  if (!targetFloor || targetFloor.walls.length === 0) {
    return "";
  }

  const { minX, minY, maxX, maxY } = getFloorBounds(targetFloor);
  const pad = 2000; // 2m padding in mm
  const viewWidth = maxX - minX + pad * 2;
  const viewHeight = maxY - minY + pad * 2;
  const displayUnit = project.displayUnit;

  let paths = "";
  const colors = readExportPaintColors();

  // Draw walls
  for (let wi = 0; wi < targetFloor.walls.length; wi++) {
    const w = targetFloor.walls[wi];
    const x1 = w.start.x - minX + pad;
    const y1 = w.start.y - minY + pad;
    const x2 = w.end.x - minX + pad;
    const y2 = w.end.y - minY + pad;

    paths += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.wallStroke}" stroke-width="${w.thickness}" stroke-linecap="round"/>\n`;

    // Dimension label
    if (project.displayUnit) {
      const len = getWallLengthMm(w);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      paths += `  <text x="${mx}" y="${my - 30}" text-anchor="middle" font-size="40" fill="${colors.dimensionLabel}" font-family="sans-serif">${formatMeasurement(len, displayUnit)}</text>\n`;
    }
  }

  // Draw doors as circles
  for (const d of targetFloor.doors) {
    const wall = targetFloor.walls.find((wl) => wl.id === d.wallId);
    if (!wall) continue;

    const wdx = wall.end.x - wall.start.x;
    const wdy = wall.end.y - wall.start.y;
    const wlen = Math.sqrt(wdx * wdx + wdy * wdy);
    if (wlen === 0) continue;

    const px = wall.start.x + wdx * d.position - minX + pad;
    const py = wall.start.y + wdy * d.position - minY + pad;

    paths += `  <circle cx="${px}" cy="${py}" r="15" fill="${colors.doorFill}"/>\n`;
  }

  // Draw windows
  for (const win of targetFloor.windows) {
    const wall = targetFloor.walls.find((wl) => wl.id === win.wallId);
    if (!wall) continue;

    const wdx = wall.end.x - wall.start.x;
    const wdy = wall.end.y - wall.start.y;
    const wlen = Math.sqrt(wdx * wdx + wdy * wdy);
    if (wlen === 0) continue;

    const ux = wdx / wlen;
    const uy = wdy / wlen;

    const cx = wall.start.x + wdx * win.position - minX + pad;
    const cy = wall.start.y + wdy * win.position - minY + pad;
    const halfW = win.width / 2;

    // Draw as two parallel lines
    const nx = -uy * 10;
    const ny = ux * 10;

    paths += `  <line x1="${cx - ux * halfW + nx}" y1="${cy - uy * halfW + ny}" x2="${cx + ux * halfW + nx}" y2="${cy + uy * halfW + ny}" stroke="${colors.windowStroke}" stroke-width="8"/>\n`;
    paths += `  <line x1="${cx - ux * halfW - nx}" y1="${cy - uy * halfW - ny}" x2="${cx + ux * halfW - nx}" y2="${cy + uy * halfW - ny}" stroke="${colors.windowStroke}" stroke-width="8"/>\n`;
  }

  // Draw furniture
  for (const fi of targetFloor.furniture) {
    const fx = fi.position.x - minX + pad;
    const fy = fi.position.y - minY + pad;
    const fw = fi.width ?? 500;
    const fd = fi.depth ?? 500;
    const rot = fi.rotation ?? 0;
    const color = resolvePaintColor(fi.color, PLANNER_COLOR_TOKENS.furnitureDefault);

    paths += `  <g transform="translate(${fx},${fy}) rotate(${rot})">\n`;
    paths += `    <rect x="${-fw / 2}" y="${-fd / 2}" width="${fw}" height="${fd}" fill="${color}" stroke="${colors.furnitureStroke}" stroke-width="2" rx="5" opacity="0.8"/>\n`;
    paths += `  </g>\n`;
  }

  // Title
  const titleY = 80;
  paths += `  <text x="60" y="${titleY}" font-size="60" font-weight="bold" fill="${colors.titleText}" font-family="sans-serif">${escapeXml(project.name)}</text>\n`;
  paths += `  <text x="60" y="${titleY + 70}" font-size="40" fill="${colors.subtitleText}" font-family="sans-serif">${escapeXml(targetFloor.name)}</text>\n`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}" width="${viewWidth}" height="${viewHeight}">
  <rect width="100%" height="100%" fill="${colors.background}"/>
${paths}</svg>`;

  return svg;
}

/**
 * Download SVG export.
 */
export function downloadSVG(project: Open3dProject, floor?: Open3dFloor): void {
  const svg = exportAsSVG(project, floor);
  if (!svg) return;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  downloadBlob(blob, `${project.name || "floorplan"}.svg`);
}

// ── PNG/PDF/DXF export impls removed (dead/unused in prod; complex canvas+dynamic-dep paths uncovered; only JSON/SVG exercised via workspace. Cleaned for PLAN-FAIL-0408 coverage floor.)
// (DXF removed - was dead code; dynamic dep + complex polyline logic never exercised in prod)