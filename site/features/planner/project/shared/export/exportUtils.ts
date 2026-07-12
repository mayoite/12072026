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
  PlannerProject,
  PlannerFloor,
  PlannerWall,
  PlannerDisplayUnit,
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
export function formatMeasurement(mmValue: number, displayUnit: PlannerDisplayUnit): string {
  const converters: Record<PlannerDisplayUnit, (v: number) => string> = {
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
export function getWallLengthMm(wall: PlannerWall): number {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Calculate floor bounding box */
export function getFloorBounds(floor: PlannerFloor): {
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
export function exportAsJSON(project: PlannerProject, pretty = false): string {
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
export function downloadJSON(project: PlannerProject, filename?: string): void {
  const json = exportAsJSON(project, true);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, filename ?? `${project.name || "floorplan"}.json`);
}

/**
 * Download systems v0 workstation BOQ (identity + qty + footprint + INR list + GST).
 */
export function downloadWorkstationBoqJSON(
  summary: {
    lines: readonly unknown[];
    totalSeats: number;
    totalInstances: number;
    currencyCode?: string;
    gstRate?: number;
    subtotalInr?: number;
    gstInr?: number;
    totalInr?: number;
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

/**
 * Download first-class project furniture BOQ as JSON (all placed furniture).
 */
export function downloadFurnitureBoqJSON(json: string, filename: string): void {
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, filename);
}

/**
 * Download first-class project furniture BOQ as CSV.
 */
export function downloadFurnitureBoqCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
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
export function exportAsSVG(project: PlannerProject, floor?: PlannerFloor): string {
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
export function downloadSVG(project: PlannerProject, floor?: PlannerFloor): void {
  const svg = exportAsSVG(project, floor);
  if (!svg) return;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  downloadBlob(blob, `${project.name || "floorplan"}.svg`);
}

// ── Raster / document export (procedural geometry — no borrowed SVG/GLB) ──

interface PdfDocument {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  setDrawColor: (color: number) => void;
  setLineWidth: (width: number) => void;
  rect: (x: number, y: number, w: number, h: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  setFontSize: (size: number) => void;
  setFont: (family: string, style: string) => void;
  text: (text: string, x: number, y: number) => void;
  addImage: (data: string, format: string, x: number, y: number, w: number, h: number) => void;
  addPage: () => void;
  output: (type: "blob") => Blob;
}

type PdfConstructor = new (options?: {
  orientation?: string;
  unit?: string;
  format?: string;
}) => PdfDocument;

interface DxfDrawing {
  setUnits(unit: string): void;
  addLayer(name: string, color: number, style: string): void;
  setActiveLayer(name: string): void;
  drawPolyline(points: [number, number][]): void;
  drawText(
    x: number,
    y: number,
    size: number,
    angle: number,
    text: string,
    halign: string,
    valign: string,
  ): void;
  drawArc(x: number, y: number, r: number, startAngle: number, endAngle: number): void;
  drawLine(x1: number, y1: number, x2: number, y2: number): void;
  toDxfString(): string;
}

type DxfConstructor = new () => DxfDrawing;

function drawFloorToCanvas2d(
  ctx: CanvasRenderingContext2D,
  project: PlannerProject,
  floor: PlannerFloor,
  pad: number,
): { width: number; height: number } {
  const { minX, minY, maxX, maxY } = getFloorBounds(floor);
  const width = maxX - minX + pad * 2;
  const height = maxY - minY + pad * 2;
  const colors = readExportPaintColors();

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = colors.wallStroke;
  ctx.lineCap = "round";
  for (const wall of floor.walls) {
    ctx.lineWidth = wall.thickness;
    ctx.beginPath();
    ctx.moveTo(wall.start.x - minX + pad, wall.start.y - minY + pad);
    ctx.lineTo(wall.end.x - minX + pad, wall.end.y - minY + pad);
    ctx.stroke();

    const len = getWallLengthMm(wall);
    const mx = (wall.start.x + wall.end.x) / 2 - minX + pad;
    const my = (wall.start.y + wall.end.y) / 2 - minY + pad;
    ctx.fillStyle = colors.dimensionLabel;
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatMeasurement(len, project.displayUnit), mx, my - 40);
  }

  for (const d of floor.doors) {
    const wall = floor.walls.find((wl) => wl.id === d.wallId);
    if (!wall) continue;
    const wdx = wall.end.x - wall.start.x;
    const wdy = wall.end.y - wall.start.y;
    const px = wall.start.x + wdx * d.position - minX + pad;
    const py = wall.start.y + wdy * d.position - minY + pad;
    ctx.fillStyle = colors.doorFill;
    ctx.beginPath();
    ctx.arc(px, py, 15, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const win of floor.windows) {
    const wall = floor.walls.find((wl) => wl.id === win.wallId);
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
    const nx = -uy * 10;
    const ny = ux * 10;
    ctx.strokeStyle = colors.windowStroke;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - ux * halfW + nx, cy - uy * halfW + ny);
    ctx.lineTo(cx + ux * halfW + nx, cy + uy * halfW + ny);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - ux * halfW - nx, cy - uy * halfW - ny);
    ctx.lineTo(cx + ux * halfW - nx, cy + uy * halfW - ny);
    ctx.stroke();
  }

  for (const fi of floor.furniture) {
    const fx = fi.position.x - minX + pad;
    const fy = fi.position.y - minY + pad;
    const fw = fi.width ?? 500;
    const fd = fi.depth ?? 500;
    const rot = ((fi.rotation ?? 0) * Math.PI) / 180;
    const color = resolvePaintColor(fi.color, PLANNER_COLOR_TOKENS.furnitureDefault);
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(rot);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = color;
    ctx.fillRect(-fw / 2, -fd / 2, fw, fd);
    ctx.strokeStyle = colors.furnitureStroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(-fw / 2, -fd / 2, fw, fd);
    ctx.restore();
  }

  ctx.fillStyle = colors.titleText;
  ctx.font = "bold 60px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${project.name} — ${floor.name}`, 80, 100);

  return { width, height };
}

export async function exportAsPNG(
  canvas: HTMLCanvasElement,
  project?: PlannerProject,
  floorIndex = 0,
): Promise<Blob | null> {
  if (!project) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob));
    });
  }

  const floor =
    project.floors[floorIndex] ??
    project.floors.find((f) => f.id === project.activeFloorId) ??
    project.floors[0];
  if (!floor || (floor.walls.length === 0 && floor.furniture.length === 0)) {
    return null;
  }

  const pad = 2000;
  const scale = 2;
  const { minX, minY, maxX, maxY } = getFloorBounds(floor);
  const width = maxX - minX + pad * 2;
  const height = maxY - minY + pad * 2;

  const offscreen = document.createElement("canvas");
  offscreen.width = Math.max(1, Math.round(width * scale));
  offscreen.height = Math.max(1, Math.round(height * scale));
  const ctx = offscreen.getContext("2d");
  if (!ctx) return null;

  ctx.scale(scale, scale);
  drawFloorToCanvas2d(ctx, project, floor, pad);

  return new Promise((resolve) => {
    offscreen.toBlob((blob) => resolve(blob));
  });
}

export async function downloadPNG(
  canvas: HTMLCanvasElement,
  project?: PlannerProject,
  filename?: string,
): Promise<void> {
  const blob = await exportAsPNG(canvas, project);
  if (blob) {
    downloadBlob(blob, filename ?? `${project?.name ?? "floorplan"}.png`);
  }
}

export async function exportAsPDF(
  project: PlannerProject,
  settings: PdfExportSettings = DEFAULT_PDF_SETTINGS,
): Promise<Blob | null> {
  let jsPDF: PdfConstructor | null = null;
  try {
    const mod = await import("jspdf");
    jsPDF = mod.default as PdfConstructor;
  } catch {
    console.warn("jspdf not available for PDF export");
    return null;
  }

  const floor =
    project.floors.find((f) => f.id === project.activeFloorId) ?? project.floors[0];
  if (!floor || floor.walls.length === 0) {
    return null;
  }

  const pad = 2000;
  const scale = 2;
  const { minX, minY, maxX, maxY } = getFloorBounds(floor);
  const planW = maxX - minX + pad * 2;
  const planH = maxY - minY + pad * 2;

  const offscreen = document.createElement("canvas");
  offscreen.width = Math.max(1, Math.round(planW * scale));
  offscreen.height = Math.max(1, Math.round(planH * scale));
  const ctx = offscreen.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);
  drawFloorToCanvas2d(ctx, project, floor, pad);

  const orientation = settings.orientation ?? "landscape";
  const format = settings.format ?? "a4";
  const pdf = new jsPDF({ orientation, unit: "mm", format });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const titleBlockH = 25;

  pdf.setDrawColor(40);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  const tbY = pageHeight - margin - titleBlockH;
  const tbW = pageWidth - margin * 2;
  pdf.setLineWidth(0.4);
  pdf.rect(margin, tbY, tbW, titleBlockH);
  const col1 = margin + tbW * 0.45;
  const col2 = margin + tbW * 0.7;
  pdf.line(col1, tbY, col1, tbY + titleBlockH);
  pdf.line(col2, tbY, col2, tbY + titleBlockH);

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(project.name ?? "Untitled Project", margin + 5, tbY + 10);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(floor.name, margin + 5, tbY + 18);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  pdf.text(`Date: ${today}`, col1 + 5, tbY + 10);
  pdf.text(`Units: ${project.displayUnit}`, col1 + 5, tbY + 18);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("O&O Planner", col2 + 5, tbY + 10);

  const drawAreaW = pageWidth - margin * 2 - 4;
  const drawAreaH = pageHeight - margin * 2 - titleBlockH - 6;
  const aspect = planW / planH;
  let imgW = drawAreaW;
  let imgH = drawAreaW / aspect;
  if (imgH > drawAreaH) {
    imgH = drawAreaH;
    imgW = drawAreaH * aspect;
  }
  const imgX = margin + 2 + (drawAreaW - imgW) / 2;
  const imgY = margin + 2 + (drawAreaH - imgH) / 2;
  pdf.addImage(offscreen.toDataURL("image/png"), "PNG", imgX, imgY, imgW, imgH);

  if (settings.includeRoomSchedule) {
    pdf.addPage();
    pdf.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Room Schedule", margin + 6, margin + 12);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const statsY = margin + 25;
    pdf.text(`Total walls: ${floor.walls.length}`, margin + 6, statsY);
    pdf.text(`Total doors: ${floor.doors.length}`, margin + 40, statsY);
    pdf.text(`Total windows: ${floor.windows.length}`, margin + 70, statsY);
    pdf.text(`Total furniture: ${floor.furniture.length}`, margin + 105, statsY);
  }

  return pdf.output("blob");
}

export async function downloadPDF(
  project: PlannerProject,
  settings?: PdfExportSettings,
  filename?: string,
): Promise<void> {
  const blob = await exportAsPDF(project, settings);
  if (blob) {
    downloadBlob(blob, filename ?? `${project.name ?? "floorplan"}.pdf`);
  }
}

export async function exportAsDXF(project: PlannerProject): Promise<string | null> {
  let Drawing: DxfConstructor | null = null;
  try {
    const mod = await import("dxf-writer");
    Drawing = mod.default as DxfConstructor;
  } catch {
    console.warn("dxf-writer not available for DXF export");
    return null;
  }

  const floor =
    project.floors.find((f) => f.id === project.activeFloorId) ?? project.floors[0];
  if (!floor || floor.walls.length === 0) {
    return null;
  }

  const d = new Drawing();
  d.setUnits("Millimeters");
  d.addLayer("WALLS", 7, "CONTINUOUS");
  d.addLayer("DOORS", 30, "CONTINUOUS");
  d.addLayer("WINDOWS", 5, "CONTINUOUS");
  d.addLayer("FURNITURE", 3, "CONTINUOUS");
  d.addLayer("DIMENSIONS", 8, "CONTINUOUS");

  d.setActiveLayer("WALLS");
  for (const w of floor.walls) {
    const dx = w.end.x - w.start.x;
    const dy = w.end.y - w.start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;
    const half = w.thickness / 2;
    const nx = (-dy / len) * half;
    const ny = (dx / len) * half;
    const corners: [number, number][] = [
      [w.start.x + nx, w.start.y + ny],
      [w.end.x + nx, w.end.y + ny],
      [w.end.x - nx, w.end.y - ny],
      [w.start.x - nx, w.start.y - ny],
      [w.start.x + nx, w.start.y + ny],
    ];
    d.drawPolyline(corners);
  }

  d.setActiveLayer("DIMENSIONS");
  for (const w of floor.walls) {
    const len = getWallLengthMm(w);
    const mx = (w.start.x + w.end.x) / 2;
    const my = (w.start.y + w.end.y) / 2;
    const angle = (Math.atan2(w.end.y - w.start.y, w.end.x - w.start.x) * 180) / Math.PI;
    d.drawText(mx, my + 50, 20, angle, `${Math.round(len)} mm`, "center", "bottom");
  }

  d.setActiveLayer("DOORS");
  for (const door of floor.doors) {
    const wall = floor.walls.find((w) => w.id === door.wallId);
    if (!wall) continue;
    const wdx = wall.end.x - wall.start.x;
    const wdy = wall.end.y - wall.start.y;
    const wlen = Math.sqrt(wdx * wdx + wdy * wdy);
    if (wlen === 0) continue;
    const hx = wall.start.x + wdx * door.position;
    const hy = wall.start.y + wdy * door.position;
    const r = door.width / 2;
    const wallAngle = (Math.atan2(wdy, wdx) * 180) / Math.PI;
    const startAngle = door.swingDirection === "left" ? wallAngle : wallAngle - 90;
    const endAngle = door.swingDirection === "left" ? wallAngle + 90 : wallAngle;
    d.drawArc(hx, hy, r, startAngle, endAngle);
  }

  d.setActiveLayer("WINDOWS");
  for (const win of floor.windows) {
    const wall = floor.walls.find((w) => w.id === win.wallId);
    if (!wall) continue;
    const wdx = wall.end.x - wall.start.x;
    const wdy = wall.end.y - wall.start.y;
    const wlen = Math.sqrt(wdx * wdx + wdy * wdy);
    if (wlen === 0) continue;
    const ux = wdx / wlen;
    const uy = wdy / wlen;
    const nx = -uy;
    const ny = ux;
    const cx = wall.start.x + wdx * win.position;
    const cy = wall.start.y + wdy * win.position;
    const halfW = win.width / 2;
    for (const offset of [-10, 10]) {
      const ox = nx * offset;
      const oy = ny * offset;
      d.drawLine(
        cx - ux * halfW + ox,
        cy - uy * halfW + oy,
        cx + ux * halfW + ox,
        cy + uy * halfW + oy,
      );
    }
  }

  d.setActiveLayer("FURNITURE");
  for (const fi of floor.furniture) {
    const fw = fi.width ?? 500;
    const fd = fi.depth ?? 500;
    const fx = fi.position.x;
    const fy = fi.position.y;
    const rot = ((fi.rotation ?? 0) * Math.PI) / 180;
    const hw = fw / 2;
    const hd = fd / 2;
    const corners: [number, number][] = [
      [-hw, -hd],
      [hw, -hd],
      [hw, hd],
      [-hw, hd],
    ];
    const rotated = corners.map(([cx, cy]) => {
      const rx = cx * Math.cos(rot) - cy * Math.sin(rot);
      const ry = cx * Math.sin(rot) + cy * Math.cos(rot);
      return [fx + rx, fy + ry] as [number, number];
    });
    rotated.push(rotated[0]);
    d.drawPolyline(rotated);
  }

  return d.toDxfString();
}

export async function downloadDXF(project: PlannerProject, filename?: string): Promise<void> {
  const dxf = await exportAsDXF(project);
  if (dxf) {
    downloadBlob(new Blob([dxf], { type: "application/dxf" }), filename ?? `${project.name ?? "floorplan"}.dxf`);
  }
}