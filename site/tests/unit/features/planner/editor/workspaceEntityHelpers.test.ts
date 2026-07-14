import { describe, expect, it } from "vitest";
import {
  resolveSelectedEntity,
  updateEntityInProject,
  deleteEntityFromProject,
  selectionAfterBatchPlace,
  applySelectionDelete,
} from "@/features/planner/editor/workspaceEntityHelpers";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";
import { addPlannerFurniture } from "@/features/planner/project/model/actions/furniture";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

function room() {
  return createRectangularRoomProject({
    widthMm: 5000,
    depthMm: 4000,
    idFactory: ids("floor", "project", "w1", "w2", "w3", "w4"),
  });
}

const furnitureBase = {
  catalogId: "desk-1",
  position: { x: 100, y: 200 },
  rotation: 0,
  scale: { x: 1, y: 1, z: 1 },
  width: 1200,
  depth: 600,
  height: 750,
};

describe("workspaceEntityHelpers", () => {
  it("resolves wall selection from floor", () => {
    const project = room();
    const floor = project.floors[0]!;
    const wallId = floor.walls[0]!.id;
    const entity = resolveSelectedEntity({ type: "wall", ids: [wallId] }, floor);
    expect(entity?.collection).toBe("walls");
    expect(entity?.id).toBe(wallId);
    expect(resolveSelectedEntity({ type: "none", ids: [] }, floor)).toBeNull();
  });

  it("updates and deletes furniture; rejects locked", () => {
    let idSeq = 0;
    const idFactory = () => `furn-${++idSeq}`;
    let project = room();
    project = addPlannerFurniture(project, furnitureBase, idFactory);
    const furnId = project.floors[0]!.furniture[0]!.id;

    const updated = updateEntityInProject(project, "furniture", furnId, { width: 1400 });
    expect(updated.floors[0]!.furniture[0]!.width).toBe(1400);

    const lockedProject = updateEntityInProject(project, "furniture", furnId, { locked: true });
    const blocked = updateEntityInProject(lockedProject, "furniture", furnId, { width: 9999 });
    expect(blocked.floors[0]!.furniture[0]!.width).not.toBe(9999);

    const deleted = deleteEntityFromProject(project, "furniture", furnId);
    expect(deleted.floors[0]!.furniture).toHaveLength(0);
  });

  it("selectionAfterBatchPlace keeps only last id; applySelectionDelete removes selection", () => {
    expect(selectionAfterBatchPlace(["a", "b"])).toEqual({ type: "furniture", ids: ["b"] });
    expect(selectionAfterBatchPlace([])).toEqual({ type: "none", ids: [] });

    let idSeq = 0;
    const idFactory = () => `furn-${++idSeq}`;
    let project = room();
    project = addPlannerFurniture(project, furnitureBase, idFactory);
    project = addPlannerFurniture(
      project,
      { ...furnitureBase, catalogId: "desk-2", position: { x: 400, y: 200 } },
      idFactory,
    );
    const idsOnFloor = project.floors[0]!.furniture.map((f) => f.id);
    expect(idsOnFloor).toHaveLength(2);
    const next = applySelectionDelete(project, { type: "furniture", ids: idsOnFloor as [string, ...string[]] });
    expect(next.floors[0]!.furniture).toHaveLength(0);
  });
});
