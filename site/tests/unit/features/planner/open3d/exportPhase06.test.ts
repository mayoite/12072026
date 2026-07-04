import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createRectangularRoomProject } from "@/features/planner/open3d/model/project";
import {
  buildExportFilename,
  cancelExportJob,
  createOpen3dExportJob,
  formatExportJobAnnouncement,
  isSupportedExportFormat,
  preflightOpen3dExport,
  SUPPORTED_EXPORT_FORMATS,
  updateExportJobProgress,
} from "@/features/planner/open3d/shared/export/exportPreflight";
import {
  downloadDXF,
  downloadJSON,
  downloadPDF,
  downloadPNG,
  downloadSVG,
  exportAsDXF,
  exportAsJSON,
  exportAsPDF,
  exportAsPNG,
  exportAsSVG,
  formatArea,
  formatMeasurement,
  getFloorBounds,
} from "@/features/planner/open3d/shared/export/exportUtils";
import {
  autoImport,
  detectFormat,
  importFromJSON,
  importFromJSONWithRecovery,
  importRoomPlan,
  importRoomPlanFromJson,
} from "@/features/planner/open3d/shared/export/importUtils";
import { PLANNER_COLOR_TOKENS } from "@/features/planner/open3d/shared/themeColorTokens";

/** Seed theme.css token values for export color resolution in happy-dom. */
function seedExportThemeTokens() {
  const tokens: Record<string, string> = {
    [PLANNER_COLOR_TOKENS.wallStroke]: "#333333",
    [PLANNER_COLOR_TOKENS.dimensionLabel]: "#666666",
    [PLANNER_COLOR_TOKENS.doorFill]: "#8B4513",
    [PLANNER_COLOR_TOKENS.windowStroke]: "#4a90d9",
    [PLANNER_COLOR_TOKENS.furnitureDefault]: "#a0c4e8",
    [PLANNER_COLOR_TOKENS.furnitureStroke]: "#555555",
    [PLANNER_COLOR_TOKENS.titleText]: "#222222",
    [PLANNER_COLOR_TOKENS.subtitleText]: "#666666",
    [PLANNER_COLOR_TOKENS.exportBackground]: "#ffffff",
    [PLANNER_COLOR_TOKENS.wallDefault]: "#111111",
    [PLANNER_COLOR_TOKENS.columnDefault]: "#cccccc",
    [PLANNER_COLOR_TOKENS.textAnnotation]: "#333333",
    [PLANNER_COLOR_TOKENS.importWall]: "#333333",
  };
  const css = `:root { ${Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ")} }`;
  let style = document.getElementById("open3d-export-theme-tokens");
  if (!style) {
    style = document.createElement("style");
    style.id = "open3d-export-theme-tokens";
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function project() {
  const result = createRectangularRoomProject({
    idFactory: ids("floor-main", "project-main", "wall-a", "wall-b", "wall-c", "wall-d"),
    name: "Client Plan A",
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
  return { ...result, displayUnit: "m" as const };
}

function richProject() {
  const base = project();
  const floor = base.floors[0];
  const wall = floor.walls[0];
  return {
    ...base,
    floors: [
      {
        ...floor,
        doors: [
          {
            id: "door-1",
            wallId: wall.id,
            position: 0.5,
            width: 900,
            height: 2100,
            type: "double" as const,
            swingDirection: "right" as const,
            flipSide: false,
          },
        ],
        windows: [
          {
            id: "win-1",
            wallId: wall.id,
            position: 0.3,
            width: 1200,
            height: 1200,
            sillHeight: 900,
            type: "sliding" as const,
          },
        ],
        furniture: [
          {
            id: "fi-1",
            catalogId: "sofa",
            position: { x: 3000, y: 2000 },
            rotation: 45,
            scale: { x: 1, y: 1, z: 1 },
            width: 2000,
            depth: 900,
            height: 850,
            color: "#a0c4e8",
          },
        ],
      },
    ],
  };
}

function mockDownloadHarness() {
  const click = vi.fn();
  const appendChild = vi.fn();
  const removeChild = vi.fn();
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
  const create = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export");
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tag) => {
    if (tag === "a") {
      return { href: "", download: "", click } as unknown as HTMLAnchorElement;
    }
    return originalCreateElement(tag);
  });
  vi.spyOn(document.body, "appendChild").mockImplementation(appendChild);
  vi.spyOn(document.body, "removeChild").mockImplementation(removeChild);
  return { click, revoke, create };
}

describe("Phase 06 export preflight", () => {
  it("accepts only implemented export formats and rejects DWG", () => {
    expect(SUPPORTED_EXPORT_FORMATS).toEqual(["json", "svg", "png", "pdf", "dxf"]);
    expect(isSupportedExportFormat("dxf")).toBe(true);
    expect(isSupportedExportFormat("dwg")).toBe(false);

    const result = preflightOpen3dExport(project(), "dwg");

    expect(result.status).toBe("unsupported");
    expect(result.messages[0]).toContain("DWG is unsupported");
  });

  it("builds deterministic export job metadata", () => {
    const p = project();
    const job = createOpen3dExportJob(p, "svg", "2026-07-03T12:00:00.000Z");

    expect(job).toEqual({
      token: "svg:project-main:floor-main:2026-07-03T12:00:00.000Z",
      format: "svg",
      filename: "client-plan-a-ground-floor.svg",
      status: "queued",
      progress: 0,
      createdAt: "2026-07-03T12:00:00.000Z",
    });
  });

  it("preflights JSON without requiring drawn geometry", () => {
    const p = project();
    const empty = { ...p, floors: [{ ...p.floors[0], walls: [], furniture: [] }] };

    expect(preflightOpen3dExport(empty, "json").status).toBe("ready");
    expect(preflightOpen3dExport(empty, "svg").status).toBe("blocked");
  });

  it("uses project and active floor names in filenames", () => {
    expect(buildExportFilename(project(), "pdf")).toBe("client-plan-a-ground-floor.pdf");
  });

  it("blocks export when project has no floors", () => {
    const empty = { ...project(), floors: [] };
    const result = preflightOpen3dExport(empty, "json");
    expect(result.status).toBe("blocked");
    expect(result.messages[0]).toContain("no floors");
  });

  it("reports unsupported formats with generic message", () => {
    const result = preflightOpen3dExport(project(), "obj");
    expect(result.status).toBe("unsupported");
    expect(result.messages[0]).toContain("Unsupported export format");
  });

  it("tracks export job progress, cancel, and live-region announcements", () => {
    const job = createOpen3dExportJob(project(), "pdf", "2026-07-03T12:00:00.000Z");
    const progressEvents: number[] = [];

    const running = updateExportJobProgress(job, 40, (next) => {
      progressEvents.push(next.progress);
    });
    expect(running.status).toBe("running");
    expect(running.progress).toBe(40);
    expect(progressEvents).toEqual([40]);
    expect(formatExportJobAnnouncement(running).kind).toBe("progress");

    const done = updateExportJobProgress(job, 150);
    expect(done.status).toBe("complete");
    expect(done.progress).toBe(100);
    expect(formatExportJobAnnouncement(done).message).toContain("complete");

    const cancelled = cancelExportJob(job);
    expect(cancelled.status).toBe("cancelled");
    expect(formatExportJobAnnouncement(cancelled).kind).toBe("cancelled");
    expect(formatExportJobAnnouncement({ ...job, status: "failed", message: "Disk full" }).politeness).toBe(
      "assertive",
    );
    expect(formatExportJobAnnouncement(job).kind).toBe("started");
  });
});

describe("Phase 06 JSON and SVG exports", () => {
  beforeEach(() => {
    seedExportThemeTokens();
  });

  it("round-trips JSON through the import contract", () => {
    const p = project();
    const imported = importFromJSON(exportAsJSON(p));

    expect(imported.success).toBe(true);
    expect(imported.project?.id).toBe("project-main");
    expect(imported.project?.displayUnit).toBe("m");
  });

  it("keeps SVG physical dimensions in canonical geometry while displaying selected unit", () => {
    const svg = exportAsSVG(project());

    expect(svg).toContain('viewBox="0 0 10000 8000"');
    expect(svg).toContain(">6 m</text>");
    expect(svg).toContain(">4 m</text>");
    expect(svg).not.toContain("6000 cm");
  });

  it("renders SVG doors, windows, furniture, and escaped titles", () => {
    const svg = exportAsSVG(richProject());
    expect(svg).toContain("<circle");
    expect(svg).toContain("#4a90d9");
    expect(svg).toContain("rotate(45)");
    expect(svg).toContain("Client Plan A");
  });

  it("pretty-prints JSON and formats area across display units", () => {
    const pretty = exportAsJSON(project(), true);
    expect(pretty).toContain("\n");
    expect(formatArea(1_000_000, "m")).toContain("m²");
    expect(formatArea(10_000, "cm")).toContain("cm²");
    expect(formatArea(645_16, "in")).toContain("in²");
    expect(formatArea(92_903, "ft-in")).toContain("ft²");

    const bounds = getFloorBounds(richProject().floors[0]);
    expect(bounds.maxX).toBeGreaterThan(bounds.minX);
  });
});

const VALID_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function mockCanvasContext() {
  const ctx = {
    scale: vi.fn(),
    fillStyle: "",
    fillRect: vi.fn(),
    strokeStyle: "",
    lineCap: "",
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    font: "",
    textAlign: "",
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    globalAlpha: 1,
    strokeRect: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
    callback?.(new Blob(["png-bytes"], { type: "image/png" }));
  });
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(VALID_PNG_DATA_URL);
  return ctx;
}

describe("Phase 06 raster and CAD exports", () => {
  beforeEach(() => {
    seedExportThemeTokens();
    mockCanvasContext();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("preflights PNG, PDF, and DXF when geometry exists", () => {
    const p = project();
    expect(preflightOpen3dExport(p, "png").status).toBe("ready");
    expect(preflightOpen3dExport(p, "pdf").status).toBe("ready");
    expect(preflightOpen3dExport(p, "dxf").status).toBe("ready");
    expect(preflightOpen3dExport(p, "png").filename).toBe("client-plan-a-ground-floor.png");
  });

  it("exports PNG from project geometry with display-unit labels", async () => {
    const p = project();
    const canvas = document.createElement("canvas");
    const blob = await exportAsPNG(canvas, p);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe("image/png");
    expect(formatMeasurement(6000, "m")).toBe("6 m");
  });

  it("returns null PNG when floor has no walls", async () => {
    const p = project();
    const empty = { ...p, floors: [{ ...p.floors[0], walls: [] }] };
    const canvas = document.createElement("canvas");
    expect(await exportAsPNG(canvas, empty)).toBeNull();
  });

  it("exports PDF with title block and selected display unit", async () => {
    const blob = await exportAsPDF(project(), { includeRoomSchedule: true });
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe("application/pdf");
    expect(blob?.size).toBeGreaterThan(100);
  });

  it("exports DXF with CAD layers and canonical millimetre geometry", async () => {
    const dxf = await exportAsDXF(project());
    expect(dxf).toBeTruthy();
    expect(dxf).toContain("LAYER");
    expect(dxf).toContain("WALLS");
    expect(dxf).toContain("DIMENSIONS");
    expect(dxf).toContain("FURNITURE");
    expect(dxf).toContain("$INSUNITS");
  });

  it("exports PNG directly from canvas when project is omitted", async () => {
    const canvas = document.createElement("canvas");
    const blob = await exportAsPNG(canvas);
    expect(blob).toBeInstanceOf(Blob);
  });

  it("returns null PNG when canvas context is unavailable", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const canvas = document.createElement("canvas");
    expect(await exportAsPNG(canvas, project())).toBeNull();
  });

  it("exports PDF with portrait letter settings and skips room schedule", async () => {
    const blob = await exportAsPDF(richProject(), {
      orientation: "portrait",
      format: "letter",
      includeRoomSchedule: false,
    });
    expect(blob).toBeInstanceOf(Blob);
  });

  it("exports DXF with doors, windows, and rotated furniture", async () => {
    const dxf = await exportAsDXF(richProject());
    expect(dxf).toContain("DOORS");
    expect(dxf).toContain("WINDOWS");
  });

  it("triggers download helpers for all export formats", async () => {
    const harness = mockDownloadHarness();
    const p = richProject();
    const canvas = document.createElement("canvas");

    downloadJSON(p, "custom.json");
    downloadSVG(p);
    await downloadPNG(canvas, p, "custom.png");
    await downloadPDF(p, undefined, "custom.pdf");
    await downloadDXF(p, "custom.dxf");

    expect(harness.click).toHaveBeenCalled();
    harness.revoke.mockRestore();
    harness.create.mockRestore();
  });

  it("skips SVG download when geometry is empty", () => {
    const harness = mockDownloadHarness();
    const empty = { ...project(), floors: [{ ...project().floors[0], walls: [] }] };
    downloadSVG(empty);
    expect(harness.click).not.toHaveBeenCalled();
    harness.revoke.mockRestore();
    harness.create.mockRestore();
  });
});

const ROOMPLAN_FIXTURE = {
  walls: [
    {
      identifier: "rp-wall-1",
      dimensions: [4, 2.5, 0.15],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    },
  ],
  doors: [
    {
      parentIdentifier: "rp-wall-1",
      dimensions: [0.9, 2.1],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      category: "slidingDoor",
    },
  ],
  windows: [
    {
      parentIdentifier: "rp-wall-1",
      dimensions: [1.2, 1.2],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      category: "bayWindow",
    },
  ],
  objects: [
    {
      category: "sofa",
      dimensions: [2, 0.8, 0.9],
      transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, 1, 1],
    },
  ],
  sections: [{ label: "livingRoom" }],
};

describe("Phase 06 RoomPlan import", () => {
  it("imports RoomPlan walls in millimetres with recoverable parse errors", () => {
    const floor = importRoomPlan(ROOMPLAN_FIXTURE);
    expect(floor.walls).toHaveLength(1);
    expect(floor.walls[0].start.x).toBe(-2000);
    expect(floor.walls[0].end.x).toBe(2000);
    expect(floor.rooms[0].name).toBe("Living Room");
  });

  it("returns recoverable errors for invalid RoomPlan JSON", () => {
    const bad = importRoomPlanFromJson("{not-json");
    expect(bad.floor).toBeNull();
    expect(bad.error).toBeTruthy();
  });

  it("detects RoomPlan vs native JSON formats", () => {
    const roomPlan = detectFormat(JSON.stringify(ROOMPLAN_FIXTURE));
    expect(roomPlan.format).toBe("roomplan");
    expect(roomPlan.confidence).toBeGreaterThan(0.8);

    const native = detectFormat(exportAsJSON(project()));
    expect(native.format).toBe("json");
  });

  it("auto-imports RoomPlan into a project envelope", () => {
    const result = autoImport(JSON.stringify(ROOMPLAN_FIXTURE));
    expect("success" in result && result.success).toBe(true);
    if ("project" in result && result.project) {
      expect(result.project.floors[0].walls.length).toBeGreaterThan(0);
      expect(result.project.displayUnit).toBe("mm");
    }
  });

  it("detects legacy native JSON and unknown payloads", () => {
    const legacy = JSON.stringify({ id: "legacy", name: "Legacy", floors: [] });
    expect(detectFormat(legacy)).toEqual({ format: "json", confidence: 0.7 });
    expect(detectFormat('{"foo":1}')).toEqual({ format: "unknown", confidence: 0 });
  });

  it("imports RoomPlan doors, windows, furniture, and section labels", () => {
    const floor = importRoomPlan(ROOMPLAN_FIXTURE, { straighten: true, mergeDistance: 20 });
    expect(floor.doors[0].type).toBe("sliding");
    expect(floor.windows[0].type).toBe("bay");
    expect(floor.furniture[0].catalogId).toBe("sofa");
    expect(floor.rooms[0].name).toBe("Living Room");
  });

  it("auto-import returns errors for unknown formats and failed RoomPlan parse", () => {
    const unknown = autoImport('{"foo":1}');
    expect("success" in unknown && unknown.success).toBe(false);

    const badRoomPlan = autoImport("{not-json", { roomPlanOptions: { straighten: false } });
    expect("success" in badRoomPlan && badRoomPlan.success).toBe(false);
  });

  it("reports recovery metadata when JSON import has errors but envelope parses", () => {
    const recovered = importFromJSONWithRecovery("{broken");
    expect(recovered.success).toBe(false);
    expect(recovered.recovered).toEqual([]);
  });
});
