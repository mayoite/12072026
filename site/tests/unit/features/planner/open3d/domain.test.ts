import { describe, expect, it, vi } from "vitest";

import { convertLegacyRectScene } from "@/features/planner/open3d/shared/document/legacyProject";
import { parseOpen3dProject, parseOpen3dSceneEnvelope } from "@/features/planner/open3d/shared/document/projectParser";
import { feasibilityCommands, getFeasibilityCommand } from "@/features/planner/open3d/lib/commands/registry";
import {
  projectToScreen,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
} from "@/features/planner/open3d/lib/geometry/snapping";
import { assertOpen3dProject, inspectOpen3dProject } from "@/features/planner/open3d/model/invariants";
import {
  createOpen3dProject,
  createOpen3dSceneEnvelope,
  createRectangularRoomProject,
} from "@/features/planner/open3d/model/project";
import type { Open3dProject } from "@/features/planner/open3d/model/types";
import {
  boundsMmToOpen3dCm,
  boundsOpen3dCmToMm,
  displayValueToMm,
  formatFeetAndInches,
  mmToDisplayValue,
  mmToOpen3dCm,
  normalizeDegrees,
  open3dCmToMm,
  parseFeetAndInches,
} from "@/features/planner/open3d/model/units";
import { addOpen3dFurniture, rotateOpen3dFurniture } from "@/features/planner/open3d/model/actions/furniture";
import { addOpen3dDoor, addOpen3dWindow } from "@/features/planner/open3d/model/actions/openings";
import {
  applyOpen3dProjectAction,
  applyOpen3dProjectTransaction,
  moveOpen3dEntity,
} from "@/features/planner/open3d/model/actions/projectActions";
import { addOpen3dWall } from "@/features/planner/open3d/model/actions/walls";
import {
  beginOpen3dDrag,
  commitOpen3dDrag,
  createOpen3dHistory,
  dispatchOpen3dAction,
  dispatchOpen3dTransaction,
  redoOpen3dAction,
  undoOpen3dAction,
} from "@/features/planner/open3d/store/history";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function room(): Open3dProject {
  return createRectangularRoomProject({
    idFactory: ids("floor", "project", "wall-1", "wall-2", "wall-3", "wall-4"),
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
}

describe("project model and units", () => {
  it("creates projects, rooms, and envelopes with defaults and overrides", () => {
    const project = createOpen3dProject();
    expect(project.floors).toHaveLength(1);
    expect(project.id).toBeTruthy();
    const rectangular = createRectangularRoomProject({
      widthMm: 20,
      depthMm: 10,
      wallHeightMm: 5,
      wallThicknessMm: 2,
      name: "Room",
      idFactory: ids("floor", "project", "a", "b", "c", "d"),
    });
    expect(rectangular.floors[0].walls).toHaveLength(4);
    expect(rectangular.floors[0].walls[0]).toMatchObject({ height: 5, thickness: 2 });
    expect(createOpen3dSceneEnvelope(rectangular).project).toBe(rectangular);
    const originalCrypto = globalThis.crypto;
    vi.stubGlobal("crypto", {});
    expect(createOpen3dProject().id).toBeTruthy();
    expect(createRectangularRoomProject({ widthMm: 1, depthMm: 1 }).floors[0].walls).toHaveLength(4);
    vi.stubGlobal("crypto", originalCrypto);
  });

  it("converts every supported measurement representation", () => {
    expect(mmToOpen3dCm(20)).toBe(2);
    expect(open3dCmToMm(2)).toBe(20);
    expect(normalizeDegrees(-10)).toBe(350);
    expect([displayValueToMm(2, "mm"), displayValueToMm(2, "cm"), displayValueToMm(2, "m"), displayValueToMm(2, "in")])
      .toEqual([2, 20, 2000, 50.8]);
    expect([mmToDisplayValue(25.4, "mm"), mmToDisplayValue(20, "cm"), mmToDisplayValue(2000, "m"), mmToDisplayValue(50.8, "in")])
      .toEqual([25.4, 2, 2, 2]);
    expect(parseFeetAndInches("- 2ft 6in")).toBe(-762);
    expect(parseFeetAndInches("5ft")).toBe(1524);
    expect(parseFeetAndInches("6")).toBe(152.39999999999998);
    expect(() => parseFeetAndInches("nonsense")).toThrow("Use feet and inches");
    expect(formatFeetAndInches(-304.8)).toBe("-1' 0\"");
    expect(formatFeetAndInches(304.79, 0)).toBe("1' 0\"");
    const bounds = { minX: 10, minY: 20, maxX: 30, maxY: 40 };
    expect(boundsOpen3dCmToMm(boundsMmToOpen3dCm(bounds))).toEqual(bounds);
  });
});

describe("geometry and commands", () => {
  it("round-trips transforms and clamps zoom around the cursor", () => {
    const transform = { origin: { x: 10, y: 20 }, scale: 2 };
    expect(screenToProject(projectToScreen({ x: 30, y: 40 }, transform), transform)).toEqual({ x: 30, y: 40 });
    expect(zoomTransformAt(transform, { x: 10, y: 10 }, 100).scale).toBe(2);
    expect(zoomTransformAt(transform, { x: 10, y: 10 }, 0.001).scale).toBe(0.02);
  });

  it("covers suppression, endpoint, grid, zero-length, and angular snaps", () => {
    const base = { raw: { x: 106, y: 104 }, endpoints: [{ x: 105, y: 105 }], zoom: 1 };
    expect(snapDrawingPoint({ ...base, start: null, suppress: true }).kind).toBe("none");
    expect(snapDrawingPoint({ ...base, start: null, suppress: false }).kind).toBe("endpoint");
    expect(snapDrawingPoint({ raw: { x: 106, y: 104 }, endpoints: [], start: null, zoom: 1, suppress: false }).kind).toBe("grid");
    expect(snapDrawingPoint({ raw: { x: 0, y: 0 }, endpoints: [], start: { x: 0, y: 0 }, zoom: 1, suppress: false }).kind).toBe("grid");
    expect(snapDrawingPoint({ raw: { x: 100, y: 60 }, endpoints: [], start: { x: 0, y: 0 }, zoom: 1, suppress: false }).kind).toBe("angle");
  });

  it("chooses the nearest endpoint deterministically and breaks exact ties by id then order", () => {
    const common = {
      raw: { x: 0, y: 0 },
      start: null,
      endpoints: [],
      zoom: 1,
      suppress: false,
      screenTolerancePx: 20,
    };
    expect(snapDrawingPoint({
      ...common,
      endpointTargets: [
        { id: "far", point: { x: 10, y: 0 } },
        { id: "near", point: { x: 2, y: 0 } },
      ],
    })).toMatchObject({ targetId: "near", point: { x: 2, y: 0 } });
    expect(snapDrawingPoint({
      ...common,
      endpointTargets: [
        { id: "z", point: { x: -2, y: 0 } },
        { id: "a", point: { x: 2, y: 0 } },
      ],
    }).targetId).toBe("a");
    expect(snapDrawingPoint({
      ...common,
      endpointTargets: [
        { id: "same", point: { x: 0, y: 2 } },
        { id: "same", point: { x: 2, y: 0 } },
      ],
    }).point).toEqual({ x: 0, y: 2 });
  });

  it("finds commands and rejects impossible command ids at runtime", () => {
    expect(getFeasibilityCommand("draw-wall").label).toBe("Draw wall");
    expect(() => getFeasibilityCommand("missing" as "draw-wall")).toThrow("Unknown feasibility command");
  });

  it("executes every command and returns explicit workflow outcomes", () => {
    const calls: string[] = [];
    const context = {
      activateDrawWall: () => { calls.push("draw"); },
      cancel: () => { calls.push("cancel"); },
      undo: vi.fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true),
      zoomBy: (factor: number) => { calls.push(`zoom:${factor}`); },
      resetZoom: () => { calls.push("reset"); },
    };
    expect(getFeasibilityCommand("draw-wall").execute(context)).toEqual({
      status: "activated",
      commandId: "draw-wall",
    });
    expect(getFeasibilityCommand("cancel").execute(context).status).toBe("completed");
    expect(getFeasibilityCommand("undo").execute(context).status).toBe("unavailable");
    expect(getFeasibilityCommand("undo").execute(context).status).toBe("completed");
    expect(getFeasibilityCommand("zoom-in").execute(context).status).toBe("completed");
    expect(getFeasibilityCommand("zoom-out").execute(context).status).toBe("completed");
    expect(getFeasibilityCommand("zoom-reset").execute(context).status).toBe("completed");
    expect(feasibilityCommands.map((command) => command.id)).toHaveLength(6);
    expect(calls).toEqual(["draw", "cancel", "zoom:1.2", `zoom:${1 / 1.2}`, "reset"]);
  });
});

describe("operations, invariants, and history", () => {
  it("adds walls and rejects projects without an active floor", () => {
    const project = createOpen3dProject({ idFactory: ids("floor", "project") });
    expect(addOpen3dWall(project, { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, ids("wall"), "now").updatedAt).toBe("now");
    expect(() => addOpen3dWall({ ...project, activeFloorId: "missing" }, { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, ids("wall"))).toThrow();
  });

  it("adds and validates openings", () => {
    const project = room();
    const door = { wallId: "wall-1", position: 0.5, width: 900, height: 2100, type: "single" as const, swingDirection: "left" as const, flipSide: false };
    const withDoor = addOpen3dDoor(project, door, ids("door"));
    const window = { wallId: "wall-1", position: 0.4, width: 1000, height: 1200, sillHeight: 900, type: "fixed" as const };
    expect(addOpen3dWindow(withDoor, window, ids("window")).floors[0].windows).toHaveLength(1);
    for (const invalid of [
      { ...door, wallId: "missing" },
      { ...door, position: -1 },
      { ...door, width: 0 },
      { ...door, width: 6000 },
    ]) expect(() => addOpen3dDoor(project, invalid, ids("x"))).toThrow();
  });

  it("adds, rotates, moves, duplicates, updates, and deletes entities", () => {
    const project = room();
    const furniture = { catalogId: "chair", position: { x: 1, y: 2 }, rotation: -10, scale: { x: 1, y: 1, z: 1 } };
    expect(() => addOpen3dFurniture(project, { ...furniture, catalogId: " " }, ids("f"))).toThrow();
    expect(() => addOpen3dFurniture(project, { ...furniture, scale: { x: 0, y: 1, z: 1 } }, ids("f"))).toThrow();
    const added = addOpen3dFurniture(project, furniture, ids("f"), "one");
    expect(added.floors[0].furniture[0].rotation).toBe(350);
    const rotated = rotateOpen3dFurniture(added, "f", 370, "two");
    const moved = moveOpen3dEntity(rotated, "furniture", "f", { x: 4, y: 5 }, "three");
    const duplicated = applyOpen3dProjectAction(moved, { type: "duplicate", collection: "furniture", id: "f", newId: "f2" });
    expect(duplicated.floors[0].furniture).toHaveLength(2);
    expect(() => applyOpen3dProjectAction(duplicated, { type: "duplicate", collection: "furniture", id: "f", newId: "f2" })).toThrow();
    expect(applyOpen3dProjectAction(project, { type: "duplicate", collection: "furniture", id: "absent", newId: "new" })).toBe(project);
    expect(() => applyOpen3dProjectAction(added, { type: "add", collection: "furniture", entity: added.floors[0].furniture[0] })).toThrow();
    const removedWall = applyOpen3dProjectAction(addOpen3dDoor(project, { wallId: "wall-1", position: 0.5, width: 900, height: 2100, type: "single", swingDirection: "left", flipSide: false }, ids("door")), { type: "delete", collection: "walls", id: "wall-1" });
    expect(removedWall.floors[0].doors).toEqual([]);
    expect(() => applyOpen3dProjectAction({ ...project, activeFloorId: "none" }, { type: "delete", collection: "walls", id: "wall-1" })).toThrow();
    const secondFloor = { ...project.floors[0], id: "floor-2", name: "Second" };
    const twoFloors = { ...project, floors: [project.floors[0], secondFloor] };
    expect(applyOpen3dProjectAction(twoFloors, { type: "update", collection: "walls", id: "wall-1", updates: { color: "blue" } }).floors[1]).toBe(secondFloor);
    expect(applyOpen3dProjectAction(project, { type: "delete", collection: "furniture", id: "absent" }).floors[0].walls).toHaveLength(4);
    const withBoth = addOpen3dWindow(
      addOpen3dDoor(project, { wallId: "wall-1", position: .2, width: 500, height: 2000, type: "single", swingDirection: "left", flipSide: false }, ids("door-2")),
      { wallId: "wall-1", position: .7, width: 500, height: 500, sillHeight: 500, type: "fixed" },
      ids("window-2"),
    );
    expect(applyOpen3dProjectAction(withBoth, { type: "delete", collection: "walls", id: "wall-1" }).floors[0].windows).toEqual([]);
    const empty = createOpen3dProject({ idFactory: ids("empty-floor", "empty-project") });
    const extraFloor = { ...empty.floors[0], id: "other" };
    expect(addOpen3dWall({ ...empty, floors: [empty.floors[0], extraFloor] }, { start: { x: 0, y: 0 }, end: { x: 2, y: 2 }, height: 3, thickness: 4, color: "red" }, ids("custom-wall")).floors[1].walls).toEqual([]);
  });

  it("applies transactions and all history transitions", () => {
    const project = room();
    const action = { type: "delete", collection: "walls", id: "wall-1" } as const;
    expect(applyOpen3dProjectTransaction(project, [action], "now").updatedAt).toBe("now");
    const initial = createOpen3dHistory(project);
    expect(dispatchOpen3dTransaction(initial, [])).toBe(initial);
    expect(dispatchOpen3dTransaction(initial, [{ type: "duplicate", collection: "furniture", id: "absent", newId: "new" }])).toBe(initial);
    expect(dispatchOpen3dTransaction(initial, [action], "transaction").present.updatedAt).toBe("transaction");
    expect(dispatchOpen3dAction(initial, { type: "duplicate", collection: "furniture", id: "absent", newId: "new" })).toBe(initial);
    const changed = dispatchOpen3dAction(initial, action, "now");
    expect(undoOpen3dAction(changed).present).toBe(project);
    expect(undoOpen3dAction(initial)).toBe(initial);
    expect(redoOpen3dAction(undoOpen3dAction(changed)).present.floors[0].walls).toHaveLength(3);
    expect(redoOpen3dAction(initial)).toBe(initial);
    const drag = beginOpen3dDrag(initial);
    expect(commitOpen3dDrag(initial, changed.present).past).toEqual([]);
    expect(commitOpen3dDrag(drag, project).past).toEqual([]);
    expect(commitOpen3dDrag(drag, changed.present).past).toEqual([project]);
  });

  it("reports every invariant class", () => {
    const project = room();
    const wall = project.floors[0].walls[0];
    const invalid: Open3dProject = {
      ...project,
      activeFloorId: "missing",
      floors: [{
        ...project.floors[0],
        walls: [{ ...wall, end: wall.start }],
        doors: [{ id: wall.id, wallId: "missing", position: 0.5, width: 1, height: 1, type: "single", swingDirection: "left", flipSide: false }],
      }],
    };
    expect(inspectOpen3dProject(invalid).map((issue) => issue.code)).toEqual([
      "missing-active-floor", "duplicate-id", "invalid-dimension", "missing-wall",
    ]);
    expect(() => assertOpen3dProject(invalid)).toThrow("Active floor");
    expect(() => assertOpen3dProject(project)).not.toThrow();
  });
});

describe("legacy conversion and parser", () => {
  it("converts valid legacy rooms and rejects invalid dimensions", () => {
    expect(convertLegacyRectScene({ type: "cad-suite-planner-scene", version: 1, room: { widthMm: 2, depthMm: 3 } }, ids("f", "p", "1", "2", "3", "4")).report.backupRequired).toBe(true);
    expect(() => convertLegacyRectScene({ type: "cad-suite-planner-scene", version: 1, room: { widthMm: 0, depthMm: 3 } }, ids())).toThrow();
  });

  it("parses a complete project and envelope", () => {
    const project = room();
    const floor = project.floors[0];
    const complete: Open3dProject = {
      ...project,
      description: "Complete",
      displayUnit: "cm",
      floors: [{
        ...floor,
        rooms: [{ id: "room", name: "Room", walls: floor.walls.map((wall) => wall.id), floorTexture: "wood", area: 24, color: "red", roomType: "indoor", labelOffset: { x: 1, y: 2 } }],
        doors: [{ id: "door", wallId: "wall-1", position: .5, width: 900, height: 2100, type: "double", swingDirection: "right", flipSide: true }],
        windows: [{ id: "window", wallId: "wall-2", position: .5, width: 900, height: 1200, sillHeight: 900, type: "bay" }],
        furniture: [{ id: "f", catalogId: "chair", position: { x: 1, y: 2 }, rotation: 2, scale: { x: 1, y: 1, z: 1 }, color: "red", material: "wood", sourceCatalogId: "c", sourceSlug: "s", sourceSku: "k", locked: true, width: 1, depth: 2, height: 3 }],
        stairs: [{ id: "stair", position: { x: 1, y: 2 }, rotation: 0, width: 1, depth: 2, riserCount: 2, direction: "up", stairType: "spiral" }],
        columns: [{ id: "column", position: { x: 1, y: 2 }, rotation: 0, shape: "round", diameter: 1, height: 2, color: "red" }],
        guides: [{ id: "guide", orientation: "vertical", position: 1 }],
        measurements: [{ id: "measure", x1: 0, y1: 0, x2: 1, y2: 1 }],
        annotations: [{ id: "annotation", x1: 0, y1: 0, x2: 1, y2: 1, offset: 2, label: "A" }],
        textAnnotations: [{ id: "text", x: 1, y: 2, text: "Text", fontSize: 12, color: "red", rotation: 0 }],
        groups: [{ id: "group", elementIds: ["f"] }],
      }],
    };
    expect(parseOpen3dProject(JSON.parse(JSON.stringify(complete)))).toEqual(complete);
    expect(parseOpen3dSceneEnvelope(createOpen3dSceneEnvelope(complete)).project).toEqual(complete);
    expect(() => parseOpen3dSceneEnvelope({})).toThrow("Unsupported");
  });

  it("rejects malformed values through every primitive parser", () => {
    const valid = room();
    const cases: unknown[] = [
      null,
      { ...valid, id: "" },
      { ...valid, floors: "bad" },
      { ...valid, floors: [] },
      { ...valid, displayUnit: "yards" },
      { ...valid, floors: [{ ...valid.floors[0], level: Number.NaN }] },
      { ...valid, floors: [{ ...valid.floors[0], walls: [{ ...valid.floors[0].walls[0], color: false }] }] },
    ];
    for (const value of cases) expect(() => parseOpen3dProject(value)).toThrow();
  });

  it("covers parser defaults and invalid optional primitive branches", () => {
    const project = room();
    const baseFloor = project.floors[0];
    const sparse = JSON.parse(JSON.stringify(project)) as Record<string, unknown>;
    delete sparse.displayUnit;
    const sparseFloor = sparse.floors as Array<Record<string, unknown>>;
    for (const key of ["walls", "rooms", "doors", "windows", "furniture", "stairs", "columns", "guides", "measurements", "annotations", "textAnnotations", "groups"]) {
      delete sparseFloor[0][key];
    }
    expect(parseOpen3dProject(sparse).displayUnit).toBe("mm");

    const optional: Open3dProject = {
      ...project,
      floors: [{
        ...baseFloor,
        rooms: [{ id: "room-min", name: "Minimal", walls: [], floorTexture: "plain", area: 0 }],
        furniture: [{ id: "f-min", catalogId: "chair", position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1, z: 1 } }],
        annotations: [{ id: "a-min", x1: 0, y1: 0, x2: 1, y2: 1, offset: 0 }],
      }],
    };
    expect(parseOpen3dProject(optional)).toEqual(optional);

    const malformed: Open3dProject = {
      ...project,
      floors: [{
        ...baseFloor,
        doors: [{ id: "door-bad", wallId: "wall-1", position: .5, width: 1, height: 1, type: "single", swingDirection: "left", flipSide: false }],
      }],
    };
    const badBoolean = JSON.parse(JSON.stringify(malformed)) as { floors: Array<{ doors: Array<Record<string, unknown>> }> };
    badBoolean.floors[0].doors[0].flipSide = "false";
    expect(() => parseOpen3dProject(badBoolean)).toThrow("must be a boolean");
    const badMinimum = JSON.parse(JSON.stringify(project)) as { floors: Array<{ walls: Array<Record<string, unknown>> }> };
    badMinimum.floors[0].walls[0].thickness = 0;
    expect(() => parseOpen3dProject(badMinimum)).toThrow(">= 0.001");
    expect(() => parseOpen3dProject({ ...project, floors: [{ ...baseFloor, level: "zero" }] })).toThrow("finite number");
  });
});
