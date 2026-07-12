import { describe, expect, it, beforeEach } from "vitest";
import type { Open3dProject, Open3dPlannerSceneEnvelope } from "@/features/planner/project/model/types";
import {
  createOpen3dProject,
  createRectangularRoomProject,
} from "@/features/planner/project/model/project";
import {
  addWall,
  removeWall,
  updateWall,
  moveWallEndpoint,
  moveWallParallel,
  splitWall,
  duplicateWall,
  addDoor,
  removeDoor,
  updateDoor,
  duplicateDoor,
  addWindow,
  removeWindow,
  updateWindow,
  duplicateWindow,
  addFurniture,
  removeFurniture,
  updateFurniture,
  moveFurniture,
  rotateFurniture,
  setFurnitureRotation,
  scaleFurniture,
  duplicateFurniture,
  toggleFurnitureLock,
  setFurnitureLocked,
  addStair,
  removeStair,
  updateStair,
  moveStair,
  addColumn,
  removeColumn,
  updateColumn,
  moveColumn,
  removeElement,
  addFloor,
  removeFloor,
  setActiveFloor,
  updateProjectName,
  updateDisplayUnit,
  addGuide,
  removeGuide,
  moveGuide,
  addMeasurement,
  removeMeasurement,
  addAnnotation,
  removeAnnotation,
  updateAnnotation,
  addTextAnnotation,
  removeTextAnnotation,
  updateTextAnnotation,
  moveTextAnnotation,
  setBackgroundImage,
  updateBackgroundImage,
  createGroup,
  ungroup,
  ungroupElements,
  updateRoom,
  importFloorIntoCurrentProject,
} from "@/features/planner/project/model/operations/pureActions";
import {
  createHistoryState,
  pushHistory,
  updatePresent,
  canUndo,
  undo,
  canRedo,
  redo,
  jumpToHistoryIndex,
  getHistoryEntries,
} from "@/features/planner/project/model/operations/history";
import {
  registerMigration,
  getRegisteredMigrations,
  migrateEnvelope,
  createEnvelopeV1,
  validateEnvelope,
  resetMigrations,
} from "@/features/planner/project/model/operations/migration";

function envelopeWithVersion(project: Open3dProject, version: number): Open3dPlannerSceneEnvelope {
  return { ...createEnvelopeV1(project), version } as unknown as Open3dPlannerSceneEnvelope;
}

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

describe("pureActions â€” wall operations", () => {
  it("adds a wall", () => {
    const p = createOpen3dProject({ idFactory: ids("floor", "project") });
    const r = addWall(p, { x: 0, y: 0 }, { x: 1000, y: 0 }, { idFactory: ids("w1") });
    expect(r.action.type).toBe("ADD_WALL");
    expect(r.project.floors[0].walls).toHaveLength(1);
    expect(r.project.floors[0].walls[0].thickness).toBe(150);
    expect(r.project.floors[0].walls[0].height).toBe(2800);
  });

  it("removes a wall and cascades doors/windows", () => {
    let p = room();
    p = addWall(p, { x: 0, y: 0 }, { x: 1000, y: 0 }, { idFactory: ids("w1") }).project;
    p = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") }).project;
    p = addWindow(p, "wall-1", 0.3, "standard", { idFactory: ids("win1") }).project;
    const r = removeWall(p, "wall-1");
    expect(r.project.floors[0].walls).toHaveLength(4); // original 4, w1 was on wall-1
    expect(r.project.floors[0].doors).toHaveLength(0);
    expect(r.project.floors[0].windows).toHaveLength(0);
  });

  it("updates a wall", () => {
    const p = room();
    const r = updateWall(p, "wall-1", { color: "red" });
    expect(r.project.floors[0].walls[0].color).toBe("red");
    expect(r.action.type).toBe("UPDATE_WALL");
  });

  it("moves wall endpoints", () => {
    const p = room();
    const r = moveWallEndpoint(p, "wall-1", "end", { x: 9999, y: 9999 });
    expect(r.project.floors[0].walls[0].end).toEqual({ x: 9999, y: 9999 });
  });

  it("moves a wall parallel", () => {
    const p = room();
    const r = moveWallParallel(p, "wall-1", 100, 200);
    const wall = r.project.floors[0].walls.find((w) => w.id === "wall-1")!;
    expect(wall.start.x).toBe(100);
    expect(wall.start.y).toBe(200);
    expect(r.action.type).toBe("MOVE_WALL_PARALLEL");
  });

  it("splits a wall and reassigns openings", () => {
    let p = room();
    p = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") }).project;
    p = addWindow(p, "wall-1", 0.8, "standard", { idFactory: ids("win1") }).project;
    const r = splitWall(p, "wall-1", 0.6, { idFactory: ids("w1-new") });
    expect(r.project.floors[0].walls).toHaveLength(5);
    const oldDoor = r.project.floors[0].doors.find((d) => d.id === "d1")!;
    expect(oldDoor.position).toBeLessThan(1);
    expect(r.action.type).toBe("SPLIT_WALL");
  });

  it("splits a wall with openings on both sides of the split point", () => {
    let p = room();
    p = addDoor(p, "wall-1", 0.3, "single", { idFactory: ids("d1") }).project;
    p = addWindow(p, "wall-1", 0.7, "standard", { idFactory: ids("win1") }).project;
    const r = splitWall(p, "wall-1", 0.5, { idFactory: ids("w1-new") });
    // door at 0.3 (< 0.5) stays on old wall, window at 0.7 (> 0.5) moves to new wall
    const oldDoor = r.project.floors[0].doors.find((d) => d.id === "d1")!;
    const oldWindow = r.project.floors[0].windows.find((w) => w.id === "win1")!;
    expect(oldDoor.wallId).toBe("wall-1");
    expect(oldWindow.wallId).toBe("w1-new");
  });

  it("splits a wall moving a door to the new wall and keeping a window on the old wall", () => {
    let p = room();
    p = addDoor(p, "wall-1", 0.7, "single", { idFactory: ids("d1") }).project;
    p = addWindow(p, "wall-1", 0.3, "standard", { idFactory: ids("win1") }).project;
    const r = splitWall(p, "wall-1", 0.5, { idFactory: ids("w1-new") });
    // door at 0.7 (> 0.5) moves to new wall, window at 0.3 (< 0.5) stays on old wall
    const oldDoor = r.project.floors[0].doors.find((d) => d.id === "d1")!;
    const oldWindow = r.project.floors[0].windows.find((w) => w.id === "win1")!;
    expect(oldDoor.wallId).toBe("w1-new");
    expect(oldWindow.wallId).toBe("wall-1");
  });

  it("rejects split at extremes", () => {
    const p = room();
    expect(() => splitWall(p, "wall-1", 0.0001)).toThrow("between 0.001 and 0.999");
    expect(() => splitWall(p, "wall-1", 0.9999)).toThrow("between 0.001 and 0.999");
  });

  it("duplicates a wall", () => {
    const p = room();
    const r = duplicateWall(p, "wall-1", { idFactory: ids("w1-dup") });
    expect(r.project.floors[0].walls).toHaveLength(5);
    expect(r.action.type).toBe("DUPLICATE_WALL");
  });

  it("throws for missing wall", () => {
    const p = room();
    expect(() => updateWall(p, "missing", {})).toThrow("Wall missing not found");
    expect(() => moveWallEndpoint(p, "missing", "end", { x: 0, y: 0 })).toThrow("Wall missing not found");
    expect(() => moveWallParallel(p, "missing", 1, 1)).toThrow("Wall missing not found");
    expect(() => splitWall(p, "missing", 0.5)).toThrow("Wall missing not found");
    expect(() => duplicateWall(p, "missing")).toThrow("Wall missing not found");
  });
});

describe("pureActions â€” door operations", () => {
  it("adds doors with defaults", () => {
    const p = room();
    const r = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") });
    expect(r.project.floors[0].doors[0].width).toBe(900);
    expect(r.project.floors[0].doors[0].height).toBe(2100);
    const r2 = addDoor(p, "wall-1", 0.5, "double", { idFactory: ids("d2") });
    expect(r2.project.floors[0].doors[0].width).toBe(1500);
  });

  it("removes, updates, and duplicates doors", () => {
    let p = room();
    p = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") }).project;
    p = removeDoor(p, "d1").project;
    expect(p.floors[0].doors).toHaveLength(0);
    p = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") }).project;
    p = updateDoor(p, "d1", { swingDirection: "right" }).project;
    expect(p.floors[0].doors[0].swingDirection).toBe("right");
    p = duplicateDoor(p, "d1", { idFactory: ids("d2") }).project;
    expect(p.floors[0].doors).toHaveLength(2);
  });

  it("throws for missing door", () => {
    const p = room();
    expect(() => updateDoor(p, "missing", {})).toThrow("Door missing not found");
    expect(() => duplicateDoor(p, "missing")).toThrow("Door missing not found");
  });
});

describe("pureActions â€” window operations", () => {
  it("adds windows with defaults", () => {
    const p = room();
    const r = addWindow(p, "wall-1", 0.5, "standard", { idFactory: ids("w1") });
    expect(r.project.floors[0].windows[0].width).toBe(1200);
    expect(r.project.floors[0].windows[0].sillHeight).toBe(900);
  });

  it("removes, updates, and duplicates windows", () => {
    let p = room();
    p = addWindow(p, "wall-1", 0.5, "standard", { idFactory: ids("w1") }).project;
    p = removeWindow(p, "w1").project;
    expect(p.floors[0].windows).toHaveLength(0);
    p = addWindow(p, "wall-1", 0.5, "standard", { idFactory: ids("w1") }).project;
    p = updateWindow(p, "w1", { sillHeight: 1000 }).project;
    expect(p.floors[0].windows[0].sillHeight).toBe(1000);
    p = duplicateWindow(p, "w1", { idFactory: ids("w2") }).project;
    expect(p.floors[0].windows).toHaveLength(2);
  });

  it("throws for missing window", () => {
    const p = room();
    expect(() => updateWindow(p, "missing", {})).toThrow("Window missing not found");
    expect(() => duplicateWindow(p, "missing")).toThrow("Window missing not found");
  });
});

describe("pureActions â€” furniture operations", () => {
  it("adds, moves, rotates, scales, and duplicates furniture", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 100, y: 200 }, { idFactory: ids("f1") }).project;
    expect(p.floors[0].furniture[0].rotation).toBe(0);
    p = rotateFurniture(p, "f1", 90).project;
    expect(p.floors[0].furniture[0].rotation).toBe(90);
    p = setFurnitureRotation(p, "f1", -10).project;
    expect(p.floors[0].furniture[0].rotation).toBe(350);
    p = moveFurniture(p, "f1", { x: 500, y: 600 }).project;
    expect(p.floors[0].furniture[0].position).toEqual({ x: 500, y: 600 });
    p = scaleFurniture(p, "f1", { x: 2, y: 3 }).project;
    expect(p.floors[0].furniture[0].scale).toEqual({ x: 2, y: 3, z: 1 });
    p = scaleFurniture(p, "f1", { x: 0.1, y: 0.1 }).project;
    expect(p.floors[0].furniture[0].scale.x).toBe(0.2); // clamped
    p = duplicateFurniture(p, "f1", { idFactory: ids("f2") }).project;
    expect(p.floors[0].furniture).toHaveLength(2);
  });

  it("locks and unlocks furniture", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = toggleFurnitureLock(p, "f1").project;
    expect(p.floors[0].furniture[0].locked).toBe(true);
    p = toggleFurnitureLock(p, "f1").project;
    expect(p.floors[0].furniture[0].locked).toBe(false);
    p = setFurnitureLocked(p, "f1", true).project;
    expect(p.floors[0].furniture[0].locked).toBe(true);
  });

  it("removes and updates furniture", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = updateFurniture(p, "f1", { color: "blue" }).project;
    expect(p.floors[0].furniture[0].color).toBe("blue");
    p = removeFurniture(p, "f1").project;
    expect(p.floors[0].furniture).toHaveLength(0);
  });

  it("throws for missing furniture", () => {
    const p = room();
    expect(() => updateFurniture(p, "missing", {})).toThrow("Furniture missing not found");
    expect(() => moveFurniture(p, "missing", { x: 0, y: 0 })).toThrow("Furniture missing not found");
    expect(() => rotateFurniture(p, "missing", 10)).toThrow("Furniture missing not found");
    expect(() => setFurnitureRotation(p, "missing", 10)).toThrow("Furniture missing not found");
    expect(() => scaleFurniture(p, "missing", { x: 1, y: 1 })).toThrow("Furniture missing not found");
    expect(() => duplicateFurniture(p, "missing")).toThrow("Furniture missing not found");
    expect(() => toggleFurnitureLock(p, "missing")).toThrow("Furniture missing not found");
    expect(() => setFurnitureLocked(p, "missing", true)).toThrow("Furniture missing not found");
  });
});

describe("pureActions â€” stair operations", () => {
  it("adds, moves, updates, and removes stairs", () => {
    let p = room();
    p = addStair(p, { x: 100, y: 100 }, { idFactory: ids("s1") }).project;
    expect(p.floors[0].stairs[0].width).toBe(1000);
    expect(p.floors[0].stairs[0].riserCount).toBe(14);
    p = moveStair(p, "s1", { x: 200, y: 200 }).project;
    expect(p.floors[0].stairs[0].position).toEqual({ x: 200, y: 200 });
    p = updateStair(p, "s1", { direction: "down" }).project;
    expect(p.floors[0].stairs[0].direction).toBe("down");
    p = removeStair(p, "s1").project;
    expect(p.floors[0].stairs).toHaveLength(0);
  });

  it("throws for missing stair", () => {
    const p = room();
    expect(() => updateStair(p, "missing", {})).toThrow("Stair missing not found");
    expect(() => moveStair(p, "missing", { x: 0, y: 0 })).toThrow("Stair missing not found");
  });
});

describe("pureActions â€” column operations", () => {
  it("adds, moves, updates, and removes columns", () => {
    let p = room();
    p = addColumn(p, { x: 100, y: 100 }, "round", { idFactory: ids("c1") }).project;
    expect(p.floors[0].columns[0].diameter).toBe(300);
    p = moveColumn(p, "c1", { x: 200, y: 200 }).project;
    expect(p.floors[0].columns[0].position).toEqual({ x: 200, y: 200 });
    p = updateColumn(p, "c1", { color: "blue" }).project;
    expect(p.floors[0].columns[0].color).toBe("blue");
    p = removeColumn(p, "c1").project;
    expect(p.floors[0].columns).toHaveLength(0);
  });

  it("adds square columns", () => {
    const p = room();
    const r = addColumn(p, { x: 100, y: 100 }, "square", { idFactory: ids("c1") });
    expect(r.project.floors[0].columns[0].shape).toBe("square");
  });

  it("throws for missing column", () => {
    const p = room();
    expect(() => updateColumn(p, "missing", {})).toThrow("Column missing not found");
    expect(() => moveColumn(p, "missing", { x: 0, y: 0 })).toThrow("Column missing not found");
  });
});

describe("pureActions â€” generic element removal", () => {
  it("removes any element by id with cascade for walls", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = addDoor(p, "wall-1", 0.5, "single", { idFactory: ids("d1") }).project;
    p = removeElement(p, "f1").project;
    expect(p.floors[0].furniture).toHaveLength(0);
    p = removeElement(p, "wall-1").project;
    expect(p.floors[0].walls.find((w) => w.id === "wall-1")).toBeUndefined();
    expect(p.floors[0].doors).toHaveLength(0);
  });
});

describe("pureActions â€” floor operations", () => {
  it("adds a floor and sets it active", () => {
    const p = room();
    const r = addFloor(p, "Second Floor", { idFactory: ids("floor2") });
    expect(r.project.floors).toHaveLength(2);
    expect(r.project.activeFloorId).toBe("floor2");
    expect(r.project.floors[1].name).toBe("Second Floor");
  });

  it("copies current floor layout", () => {
    const p = room();
    const r = addFloor(p, "Copy", { idFactory: ids("floor2"), copyCurrentLayout: true });
    expect(r.project.floors[1].walls).toHaveLength(4);
  });

  it("removes a floor and switches active", () => {
    let p = room();
    p = addFloor(p, "Second", { idFactory: ids("floor2") }).project;
    p = removeFloor(p, "floor2").project;
    expect(p.floors).toHaveLength(1);
    expect(p.activeFloorId).toBe("floor");
  });

  it("removes a non-active floor without changing active", () => {
    let p = room();
    p = addFloor(p, "Second", { idFactory: ids("floor2") }).project;
    p = setActiveFloor(p, "floor").project;
    p = removeFloor(p, "floor2").project;
    expect(p.floors).toHaveLength(1);
    expect(p.activeFloorId).toBe("floor");
  });

  it("rejects removing the only floor", () => {
    const p = room();
    expect(() => removeFloor(p, "floor")).toThrow("Cannot remove the only floor");
  });

  it("sets active floor", () => {
    let p = room();
    p = addFloor(p, "Second", { idFactory: ids("floor2") }).project;
    const r = setActiveFloor(p, "floor");
    expect(r.project.activeFloorId).toBe("floor");
    expect(() => setActiveFloor(p, "missing")).toThrow("Floor missing not found");
  });

  it("updates project name and display unit", () => {
    const p = room();
    const r1 = updateProjectName(p, "New Name");
    expect(r1.project.name).toBe("New Name");
    const r2 = updateDisplayUnit(p, "cm");
    expect(r2.project.displayUnit).toBe("cm");
    expect(r2.project.floors[0].walls).toHaveLength(4); // unchanged
  });
});

describe("pureActions â€” guide operations", () => {
  it("adds, moves, and removes guides", () => {
    let p = room();
    p = addGuide(p, "vertical", 1000, { idFactory: ids("g1") }).project;
    expect(p.floors[0].guides[0].orientation).toBe("vertical");
    p = moveGuide(p, "g1", 2000).project;
    expect(p.floors[0].guides[0].position).toBe(2000);
    p = removeGuide(p, "g1").project;
    expect(p.floors[0].guides).toHaveLength(0);
  });

  it("throws for missing guide", () => {
    const p = room();
    expect(() => moveGuide(p, "missing", 100)).toThrow("Guide missing not found");
  });
});

describe("pureActions â€” measurement operations", () => {
  it("adds and removes measurements", () => {
    let p = room();
    p = addMeasurement(p, 0, 0, 1000, 1000, { idFactory: ids("m1") }).project;
    expect(p.floors[0].measurements).toHaveLength(1);
    p = removeMeasurement(p, "m1").project;
    expect(p.floors[0].measurements).toHaveLength(0);
  });
});

describe("pureActions â€” annotation operations", () => {
  it("adds, updates, and removes annotations", () => {
    let p = room();
    p = addAnnotation(p, 0, 0, 1000, 1000, 400, "Label", { idFactory: ids("a1") }).project;
    expect(p.floors[0].annotations[0].label).toBe("Label");
    expect(p.floors[0].annotations[0].offset).toBe(400);
    p = updateAnnotation(p, "a1", { offset: 500 }).project;
    expect(p.floors[0].annotations[0].offset).toBe(500);
    p = removeAnnotation(p, "a1").project;
    expect(p.floors[0].annotations).toHaveLength(0);
  });

  it("throws for missing annotation", () => {
    const p = room();
    expect(() => updateAnnotation(p, "missing", {})).toThrow("Annotation missing not found");
  });
});

describe("pureActions â€” text annotation operations", () => {
  it("adds, updates, moves, and removes text annotations", () => {
    let p = room();
    p = addTextAnnotation(p, 100, 100, "Hello", 160, "red", 0, { idFactory: ids("t1") }).project;
    expect(p.floors[0].textAnnotations[0].text).toBe("Hello");
    p = updateTextAnnotation(p, "t1", { fontSize: 200 }).project;
    expect(p.floors[0].textAnnotations[0].fontSize).toBe(200);
    p = moveTextAnnotation(p, "t1", { x: 200, y: 200 }).project;
    expect(p.floors[0].textAnnotations[0].x).toBe(200);
    p = removeTextAnnotation(p, "t1").project;
    expect(p.floors[0].textAnnotations).toHaveLength(0);
  });

  it("throws for missing text annotation", () => {
    const p = room();
    expect(() => updateTextAnnotation(p, "missing", {})).toThrow("Text annotation missing not found");
    expect(() => moveTextAnnotation(p, "missing", { x: 0, y: 0 })).toThrow("Text annotation missing not found");
  });
});

describe("pureActions â€” background image operations", () => {
  it("sets and updates background image", () => {
    let p = room();
    const bg = { dataUrl: "data:...", position: { x: 0, y: 0 }, scale: 1, opacity: 1, rotation: 0, locked: false };
    p = setBackgroundImage(p, bg).project;
    expect(p.floors[0].backgroundImage).toEqual(bg);
    p = updateBackgroundImage(p, { opacity: 0.5 }).project;
    expect(p.floors[0].backgroundImage!.opacity).toBe(0.5);
    p = setBackgroundImage(p, undefined).project;
    expect(p.floors[0].backgroundImage).toBeUndefined();
  });

  it("throws updating non-existent background image", () => {
    const p = room();
    expect(() => updateBackgroundImage(p, { opacity: 0.5 })).toThrow("No background image to update");
  });
});

describe("pureActions â€” group operations", () => {
  it("creates and removes groups", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = addFurniture(p, "table", { x: 100, y: 100 }, { idFactory: ids("f2") }).project;
    p = createGroup(p, ["f1", "f2"], { idFactory: ids("g1") }).project;
    expect(p.floors[0].groups).toHaveLength(1);
    expect(p.floors[0].groups[0].elementIds).toEqual(["f1", "f2"]);
    p = ungroup(p, "g1").project;
    expect(p.floors[0].groups).toHaveLength(0);
  });

  it("rejects groups with fewer than 2 elements", () => {
    const p = room();
    expect(() => createGroup(p, ["f1"], { idFactory: ids("g1") })).toThrow("at least 2 elements");
  });

  it("ungroups by element ids", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = addFurniture(p, "table", { x: 100, y: 100 }, { idFactory: ids("f2") }).project;
    p = createGroup(p, ["f1", "f2"], { idFactory: ids("g1") }).project;
    p = ungroupElements(p, ["f1"]).project;
    expect(p.floors[0].groups).toHaveLength(0);
  });

  it("createGroup filters out groups that become too small", () => {
    let p = room();
    p = addFurniture(p, "chair", { x: 0, y: 0 }, { idFactory: ids("f1") }).project;
    p = addFurniture(p, "table", { x: 100, y: 100 }, { idFactory: ids("f2") }).project;
    p = addFurniture(p, "lamp", { x: 200, y: 200 }, { idFactory: ids("f3") }).project;
    p = createGroup(p, ["f1", "f2"], { idFactory: ids("g1") }).project;
    p = createGroup(p, ["f1", "f3"], { idFactory: ids("g2") }).project;
    // g1 should be filtered out because f1 was removed, leaving only f2
    expect(p.floors[0].groups).toHaveLength(1);
    expect(p.floors[0].groups[0].id).toBe("g2");
  });
});

describe("pureActions â€” room operations", () => {
  it("updates a room", () => {
    let p = room();
    p = { ...p, floors: [{ ...p.floors[0], rooms: [{ id: "room1", name: "Room", walls: p.floors[0].walls.map((w) => w.id), floorTexture: "wood", area: 24 }] }] };
    p = updateRoom(p, "room1", { name: "Living Room" }).project;
    expect(p.floors[0].rooms[0].name).toBe("Living Room");
  });

  it("throws for missing room", () => {
    const p = room();
    expect(() => updateRoom(p, "missing", {})).toThrow("Room missing not found");
  });
});

describe("pureActions â€” import floor", () => {
  it("imports floor data into active floor", () => {
    const p = room();
    const importedFloor = createOpen3dProject({ idFactory: ids("imp-floor", "imp-proj") }).floors[0];
    importedFloor.walls = [{ id: "imp-wall", start: { x: 0, y: 0 }, end: { x: 1000, y: 0 }, thickness: 150, height: 2800, color: "red" }];
    importedFloor.doors = [{ id: "imp-door", wallId: "imp-wall", position: 0.5, width: 900, height: 2100, type: "single", swingDirection: "left", flipSide: false }];
    const r = importFloorIntoCurrentProject(p, importedFloor);
    expect(r.project.floors[0].walls).toHaveLength(5);
    expect(r.project.floors[0].doors).toHaveLength(1);
    expect(r.action.type).toBe("IMPORT_FLOOR");
  });

  it("imports floor with stairs and columns into active floor", () => {
    const p = room();
    const importedFloor = createOpen3dProject({ idFactory: ids("imp-floor", "imp-proj") }).floors[0];
    importedFloor.stairs = [{ id: "imp-stair", position: { x: 100, y: 100 }, rotation: 0, width: 1000, depth: 3000, riserCount: 14, direction: "up", stairType: "straight" }];
    importedFloor.columns = [{ id: "imp-col", position: { x: 200, y: 200 }, rotation: 0, shape: "round", diameter: 300, height: 2800, color: "red" }];
    const r = importFloorIntoCurrentProject(p, importedFloor);
    expect(r.project.floors[0].stairs).toHaveLength(1);
    expect(r.project.floors[0].columns).toHaveLength(1);
  });

  it("throws when active floor is missing", () => {
    const p = room();
    const badProject = { ...p, activeFloorId: "missing" };
    const importedFloor = createOpen3dProject({ idFactory: ids("imp-floor", "imp-proj") }).floors[0];
    expect(() => importFloorIntoCurrentProject(badProject, importedFloor)).toThrow("Active floor not found");
  });
});

describe("pureActions â€” immutability", () => {
  it("does not mutate the original project", () => {
    const p = room();
    const original = JSON.stringify(p);
    addWall(p, { x: 0, y: 0 }, { x: 1, y: 1 }, { idFactory: ids("w1") });
    expect(JSON.stringify(p)).toBe(original);
    updateProjectName(p, "New");
    expect(JSON.stringify(p)).toBe(original);
  });

  it("updates timestamp on every mutating action", () => {
    const p = room();
    const r = addWall(p, { x: 0, y: 0 }, { x: 1, y: 1 }, { idFactory: ids("w1") });
    expect(r.project.updatedAt).not.toBe(p.updatedAt);
  });
});

describe("history", () => {
  it("creates initial state", () => {
    const p = room();
    const h = createHistoryState(p, 10);
    expect(h.past).toHaveLength(0);
    expect(h.future).toHaveLength(0);
    expect(h.maxHistory).toBe(10);
    expect(h.present).toEqual(p);
  });

  it("pushes and undoes", () => {
    const p = room();
    let h = createHistoryState(p);
    h = pushHistory(h, "Add wall");
    expect(canUndo(h)).toBe(true);
    h = undo(h);
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(true);
    expect(h.present).toEqual(p);
  });

  it("redoes", () => {
    const p = room();
    let h = createHistoryState(p);
    h = pushHistory(h, "Add wall");
    const afterPush = h.past[0].state;
    h = undo(h);
    h = redo(h);
    expect(canRedo(h)).toBe(false);
    expect(h.present).toEqual(afterPush);
  });

  it("clears future on new push", () => {
    const p = room();
    let h = createHistoryState(p);
    h = pushHistory(h, "First");
    h = undo(h);
    h = pushHistory(h, "Second");
    expect(h.future).toHaveLength(0);
    expect(h.past).toHaveLength(1); // present before "Second" push
  });

  it("truncates past at maxHistory", () => {
    const p = room();
    let h = createHistoryState(p, 3);
    h = pushHistory(h, "1");
    h = pushHistory(h, "2");
    h = pushHistory(h, "3");
    h = pushHistory(h, "4");
    expect(h.past).toHaveLength(3);
    expect(h.past[0].description).toBe("2");
    expect(h.past[2].description).toBe("4");
  });

  it("updates present without pushing", () => {
    const p = room();
    let h = createHistoryState(p);
    const modified = { ...p, name: "Modified" };
    h = updatePresent(h, modified);
    expect(h.present.name).toBe("Modified");
    expect(h.past).toHaveLength(0);
  });

  it("jumps to history index", () => {
    const p = room();
    let h = createHistoryState(p);
    h = pushHistory(h, "1");
    h = pushHistory(h, "2");
    h = pushHistory(h, "3");
    h = jumpToHistoryIndex(h, 1);
    expect(h.past).toHaveLength(1);
    expect(h.future).toHaveLength(2);
    h = jumpToHistoryIndex(h, 1); // present (totalPast is now 1)
    expect(h.future).toHaveLength(0);
    expect(h.past).toHaveLength(3);
    h = jumpToHistoryIndex(h, -1); // invalid
    expect(h.past).toHaveLength(3);
    h = jumpToHistoryIndex(h, 10); // invalid
    expect(h.past).toHaveLength(3);
    // jump to present when future is already empty (no-op branch)
    h = jumpToHistoryIndex(h, 3); // totalPast=3, future=0 â†’ no-op
    expect(h.future).toHaveLength(0);
    expect(h.past).toHaveLength(3);
  });

  it("returns history entries", () => {
    const p = room();
    let h = createHistoryState(p);
    h = pushHistory(h, "A");
    h = pushHistory(h, "B");
    expect(getHistoryEntries(h)).toEqual([
      { description: "A", timestamp: expect.any(Number) },
      { description: "B", timestamp: expect.any(Number) },
    ]);
  });

  it("no-op on undo/redo when not available", () => {
    const p = room();
    const h = createHistoryState(p);
    expect(undo(h)).toBe(h);
    expect(redo(h)).toBe(h);
  });
});

describe("migration", () => {
  it("validates envelopes", () => {
    expect(validateEnvelope({})).toEqual({ valid: false, errors: expect.arrayContaining([expect.stringContaining("type")]) });
    const valid: Open3dPlannerSceneEnvelope = {
      type: "open3d-floorplan-project",
      version: 1,
      units: "mm",
      displayUnit: "mm",
      source: "native-open3d",
      project: room(),
    };
    expect(validateEnvelope(valid)).toEqual({ valid: true, errors: [] });
    expect(validateEnvelope(null)).toEqual({ valid: false, errors: ["Envelope must be an object"] });
  });

  it("creates envelope v1", () => {
    const p = room();
    const e = createEnvelopeV1(p);
    expect(e.version).toBe(1);
    expect(e.units).toBe("mm");
    expect(e.type).toBe("open3d-floorplan-project");
    expect(e.project).toBe(p);
  });

  it("migrates through registered migrations", () => {
    const p = room();
    const envelope = envelopeWithVersion(p, 0);
    registerMigration(0, 1, (project) => ({ project, report: ["Added displayUnit default"] }));
    const result = migrateEnvelope(envelope, 1);
    expect(result.success).toBe(true);
    expect(result.report).toContain("Migrated from v0 to v1");
    expect(result.report).toContain("Added displayUnit default");
    expect(result.backup.version).toBe(0);
  });

  it("fails when no migration path", () => {
    const p = room();
    const envelope = envelopeWithVersion(p, 999);
    const result = migrateEnvelope(envelope, 1000);
    expect(result.success).toBe(false);
    expect(result.errors).toContain("No migration path from version 999 to 1000");
  });

  it("fails when migration throws", () => {
    const p = room();
    const envelope = envelopeWithVersion(p, 0);
    registerMigration(0, 1, () => { throw new Error("bad migration"); });
    const result = migrateEnvelope(envelope, 1);
    expect(result.success).toBe(false);
    expect(result.errors![0]).toContain("bad migration");
  });

  it("returns registered migrations", () => {
    registerMigration(1, 2, (project) => ({ project, report: [] }));
    const migs = getRegisteredMigrations();
    expect(migs.length).toBeGreaterThanOrEqual(1);
  });
});

beforeEach(() => {
  resetMigrations();
});
