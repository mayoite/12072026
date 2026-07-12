import { describe, expect, it, vi } from "vitest";

import { convertLegacyRectScene } from "@/features/planner/project/shared/document/legacyProject";
import { parsePlannerProject, parsePlannerSceneEnvelope } from "@/features/planner/project/shared/document/projectParser";
import { feasibilityCommands, getFeasibilityCommand } from "@/features/planner/project/lib/commands/registry";
import {
  projectToScreen,
  screenToProject,
  snapDrawingPoint,
  zoomTransformAt,
} from "@/features/planner/project/lib/geometry/snapping";
import { assertPlannerProject, inspectPlannerProject } from "@/features/planner/project/model/invariants";
import {
  createPlannerProject,
  createPlannerSceneEnvelope,
  createRectangularRoomProject,
} from "@/features/planner/project/model/project";
import type { PlannerProject } from "@/features/planner/project/model/types";
import {
  boundsMmToPlannerCm,
  boundsplannerCmToMm,
  displayValueToMm,
  formatFeetAndInches,
  mmToDisplayValue,
  mmToPlannerCm,
  normalizeDegrees,
  plannerCmToMm,
  parseFeetAndInches,
} from "@/features/planner/project/model/units";
import { addPlannerFurniture, rotatePlannerFurniture } from "@/features/planner/project/model/actions/furniture";
import { addPlannerDoor, addPlannerWindow } from "@/features/planner/project/model/actions/openings";
import {
  applyPlannerProjectAction,
  applyPlannerProjectTransaction,
  movePlannerEntity,
} from "@/features/planner/project/model/actions/projectActions";
import { addPlannerWall } from "@/features/planner/project/model/actions/walls";
import {
  beginPlannerDrag,
  commitPlannerDrag,
  createPlannerHistory,
  dispatchPlannerAction,
  dispatchPlannerTransaction,
  redoPlannerAction,
  undoPlannerAction,
} from "@/features/planner/project/store/history";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function room(): PlannerProject {
  return createRectangularRoomProject({
    idFactory: ids("floor", "project", "wall-1", "wall-2", "wall-3", "wall-4"),
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
}

describe("project model and units", () => {
  it("creates projects, rooms, and envelopes with defaults and overrides", () => {
    const project = createPlannerProject();
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
    expect(createPlannerSceneEnvelope(rectangular).project).toBe(rectangular);
    // Entity ids mint via newEntityId() → uuid v7 (getRandomValues), not crypto.randomUUID.
    const originalCrypto = globalThis.crypto;
    vi.stubGlobal("crypto", {});
    expect(() => createPlannerProject()).toThrow(/getRandomValues/i);
    expect(() => createRectangularRoomProject({ widthMm: 1, depthMm: 1 })).toThrow(
      /getRandomValues/i,
    );
    vi.stubGlobal("crypto", originalCrypto);
  });

  it("converts every supported measurement representation", () => {
    expect(mmToPlannerCm(20)).toBe(2);
    expect(plannerCmToMm(2)).toBe(20);
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
    expect(boundsplannerCmToMm(boundsMmToPlannerCm(bounds))).toEqual(bounds);
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
    const project = createPlannerProject({ idFactory: ids("floor", "project") });
    expect(addPlannerWall(project, { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, ids("wall"), "now").updatedAt).toBe("now");
    expect(() => addPlannerWall({ ...project, activeFloorId: "missing" }, { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, ids("wall"))).toThrow();
  });

  it("adds and validates openings", () => {
    const project = room();
    const door = { wallId: "wall-1", position: 0.5, width: 900, height: 2100, type: "single" as const, swingDirection: "left" as const, flipSide: false };
    const withDoor = addPlannerDoor(project, door, ids("door"));
    const window = { wallId: "wall-1", position: 0.4, width: 1000, height: 1200, sillHeight: 900, type: "fixed" as const };
    expect(addPlannerWindow(withDoor, window, ids("window")).floors[0].windows).toHaveLength(1);
    for (const invalid of [
      { ...door, wallId: "missing" },
      { ...door, position: -1 },
      { ...door, width: 0 },
      { ...door, width: 6000 },
    ]) expect(() => addPlannerDoor(project, invalid, ids("x"))).toThrow();
  });

  it("adds, rotates, moves, duplicates, updates, and deletes entities", () => {
    const project = room();
    const furniture = { catalogId: "chair", position: { x: 1, y: 2 }, rotation: -10, scale: { x: 1, y: 1, z: 1 } };
    expect(() => addPlannerFurniture(project, { ...furniture, catalogId: " " }, ids("f"))).toThrow();
    expect(() => addPlannerFurniture(project, { ...furniture, scale: { x: 0, y: 1, z: 1 } }, ids("f"))).toThrow();
    const added = addPlannerFurniture(project, furniture, ids("f"), "one");
    expect(added.floors[0].furniture[0].rotation).toBe(350);
    const rotated = rotatePlannerFurniture(added, "f", 370, "two");
    const moved = movePlannerEntity(rotated, "furniture", "f", { x: 4, y: 5 }, "three");
    const duplicated = applyPlannerProjectAction(moved, { type: "duplicate", collection: "furniture", id: "f", newId: "f2" });
    expect(duplicated.floors[0].furniture).toHaveLength(2);
    expect(() => applyPlannerProjectAction(duplicated, { type: "duplicate", collection: "furniture", id: "f", newId: "f2" })).toThrow();
    expect(applyPlannerProjectAction(project, { type: "duplicate", collection: "furniture", id: "absent", newId: "new" })).toBe(project);
    expect(() => applyPlannerProjectAction(added, { type: "add", collection: "furniture", entity: added.floors[0].furniture[0] })).toThrow();
    const removedWall = applyPlannerProjectAction(addPlannerDoor(project, { wallId: "wall-1", position: 0.5, width: 900, height: 2100, type: "single", swingDirection: "left", flipSide: false }, ids("door")), { type: "delete", collection: "walls", id: "wall-1" });
    expect(removedWall.floors[0].doors).toEqual([]);
    expect(() => applyPlannerProjectAction({ ...project, activeFloorId: "none" }, { type: "delete", collection: "walls", id: "wall-1" })).toThrow();
    const secondFloor = { ...project.floors[0], id: "floor-2", name: "Second" };
    const twoFloors = { ...project, floors: [project.floors[0], secondFloor] };
    expect(applyPlannerProjectAction(twoFloors, { type: "update", collection: "walls", id: "wall-1", updates: { color: "blue" } }).floors[1]).toBe(secondFloor);
    expect(applyPlannerProjectAction(project, { type: "delete", collection: "furniture", id: "absent" }).floors[0].walls).toHaveLength(4);
    const withBoth = addPlannerWindow(
      addPlannerDoor(project, { wallId: "wall-1", position: .2, width: 500, height: 2000, type: "single", swingDirection: "left", flipSide: false }, ids("door-2")),
      { wallId: "wall-1", position: .7, width: 500, height: 500, sillHeight: 500, type: "fixed" },
      ids("window-2"),
    );
    expect(applyPlannerProjectAction(withBoth, { type: "delete", collection: "walls", id: "wall-1" }).floors[0].windows).toEqual([]);
    const empty = createPlannerProject({ idFactory: ids("empty-floor", "empty-project") });
    const extraFloor = { ...empty.floors[0], id: "other" };
    expect(addPlannerWall({ ...empty, floors: [empty.floors[0], extraFloor] }, { start: { x: 0, y: 0 }, end: { x: 2, y: 2 }, height: 3, thickness: 4, color: "red" }, ids("custom-wall")).floors[1].walls).toEqual([]);
  });

  it("applies transactions and all history transitions", () => {
    const project = room();
    const action = { type: "delete", collection: "walls", id: "wall-1" } as const;
    expect(applyPlannerProjectTransaction(project, [action], "now").updatedAt).toBe("now");
    const initial = createPlannerHistory(project);
    expect(dispatchPlannerTransaction(initial, [])).toBe(initial);
    expect(dispatchPlannerTransaction(initial, [{ type: "duplicate", collection: "furniture", id: "absent", newId: "new" }])).toBe(initial);
    expect(dispatchPlannerTransaction(initial, [action], "transaction").present.updatedAt).toBe("transaction");
    expect(dispatchPlannerAction(initial, { type: "duplicate", collection: "furniture", id: "absent", newId: "new" })).toBe(initial);
    const changed = dispatchPlannerAction(initial, action, "now");
    expect(undoPlannerAction(changed).present).toBe(project);
    expect(undoPlannerAction(initial)).toBe(initial);
    expect(redoPlannerAction(undoPlannerAction(changed)).present.floors[0].walls).toHaveLength(3);
    expect(redoPlannerAction(initial)).toBe(initial);
    const drag = beginPlannerDrag(initial);
    expect(commitPlannerDrag(initial, changed.present).past).toEqual([]);
    expect(commitPlannerDrag(drag, project).past).toEqual([]);
    expect(commitPlannerDrag(drag, changed.present).past).toEqual([project]);
  });

  it("reports every invariant class", () => {
    const project = room();
    const wall = project.floors[0].walls[0];
    const invalid: PlannerProject = {
      ...project,
      activeFloorId: "missing",
      floors: [{
        ...project.floors[0],
        walls: [{ ...wall, end: wall.start }],
        doors: [{ id: wall.id, wallId: "missing", position: 0.5, width: 1, height: 1, type: "single", swingDirection: "left", flipSide: false }],
      }],
    };
    expect(inspectPlannerProject(invalid).map((issue) => issue.code)).toEqual([
      "missing-active-floor", "duplicate-id", "invalid-dimension", "missing-wall",
    ]);
    expect(() => assertPlannerProject(invalid)).toThrow("Active floor");
    expect(() => assertPlannerProject(project)).not.toThrow();
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
    const complete: PlannerProject = {
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
    expect(parsePlannerProject(JSON.parse(JSON.stringify(complete)))).toEqual(complete);
    expect(parsePlannerSceneEnvelope(createPlannerSceneEnvelope(complete)).project).toEqual(complete);
    expect(() => parsePlannerSceneEnvelope({})).toThrow("Unsupported");
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
    for (const value of cases) expect(() => parsePlannerProject(value)).toThrow();
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
    expect(parsePlannerProject(sparse).displayUnit).toBe("mm");

    const optional: PlannerProject = {
      ...project,
      floors: [{
        ...baseFloor,
        rooms: [{ id: "room-min", name: "Minimal", walls: [], floorTexture: "plain", area: 0 }],
        furniture: [{ id: "f-min", catalogId: "chair", position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1, z: 1 } }],
        annotations: [{ id: "a-min", x1: 0, y1: 0, x2: 1, y2: 1, offset: 0 }],
      }],
    };
    expect(parsePlannerProject(optional)).toEqual(optional);

    const malformed: PlannerProject = {
      ...project,
      floors: [{
        ...baseFloor,
        doors: [{ id: "door-bad", wallId: "wall-1", position: .5, width: 1, height: 1, type: "single", swingDirection: "left", flipSide: false }],
      }],
    };
    const badBoolean = JSON.parse(JSON.stringify(malformed)) as { floors: Array<{ doors: Array<Record<string, unknown>> }> };
    badBoolean.floors[0].doors[0].flipSide = "false";
    expect(() => parsePlannerProject(badBoolean)).toThrow("must be a boolean");
    const badMinimum = JSON.parse(JSON.stringify(project)) as { floors: Array<{ walls: Array<Record<string, unknown>> }> };
    badMinimum.floors[0].walls[0].thickness = 0;
    expect(() => parsePlannerProject(badMinimum)).toThrow(">= 0.001");
    expect(() => parsePlannerProject({ ...project, floors: [{ ...baseFloor, level: "zero" }] })).toThrow("finite number");
  });
});
