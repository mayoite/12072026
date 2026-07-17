/**
 * W3 residual history pack — updatePlannerProject / undo / redo / drag used by select-delete.
 * Keeps residual four-file pack + this suite ≥90% on history.ts without domain.test.
 */
import { describe, expect, it } from "vitest";

import { createPlannerProject } from "@/features/planner/model/project";
import {
  addFurniture,
} from "@/features/planner/model/operations/pureActions";
import type { PlannerProject } from "@/features/planner/model/types";
import {
  beginPlannerDrag,
  commitPlannerDrag,
  createPlannerHistory,
  dispatchPlannerAction,
  dispatchPlannerTransaction,
  redoPlannerAction,
  undoPlannerAction,
  updatePlannerProject,
} from "@/features/planner/store/history";
import { applySelectionDelete } from "@/features/planner/editor/workspaceEntityHelpers";

const FLOOR_ID = "floor-hist";
const PROJECT_ID = "project-hist";
const FURN_A = "furn-a";
const FURN_B = "furn-b";
const STAMP_NOW = "2026-07-10T19:00:00.000Z";
const POS_A = { x: 400, y: 600 } as const;
const POS_B = { x: 900, y: 600 } as const;

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function activeFurniture(project: PlannerProject) {
  const floor = project.floors.find((f) => f.id === project.activeFloorId);
  if (!floor) throw new Error("no active floor");
  return floor.furniture;
}

function projectWithTwoFurniture(): PlannerProject {
  let project = createPlannerProject({
    idFactory: ids(FLOOR_ID, PROJECT_ID),
  });
  ({ project } = addFurniture(project, "cabinet-v0", POS_A, {
    idFactory: ids(FURN_A),
  }));
  ({ project } = addFurniture(project, "cabinet-v0", POS_B, {
    idFactory: ids(FURN_B),
  }));
  return project;
}

describe("open3d history (W3 residual)", () => {
  it("createPlannerHistory starts with empty past/future and null dragStart", () => {
    const project = createPlannerProject({
      idFactory: ids(FLOOR_ID, PROJECT_ID),
    });
    const history = createPlannerHistory(project);
    expect(history.past).toEqual([]);
    expect(history.future).toEqual([]);
    expect(history.dragStart).toBeNull();
    expect(history.present).toBe(project);
  });

  it("updatePlannerProject + undo restores deleted furniture id and position", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);

    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, { type: "furniture", ids: [FURN_A] }),
    );

    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([FURN_B]);
    expect(history.past).toHaveLength(1);
    expect(history.future).toEqual([]);

    history = undoPlannerAction(history);
    const restored = activeFurniture(history.present).find((f) => f.id === FURN_A);
    expect(restored).toBeDefined();
    expect(restored?.position).toEqual(POS_A);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual(
      [FURN_A, FURN_B].sort(),
    );
    expect(history.future).toHaveLength(1);
  });

  it("redo re-applies the deleted state after undo", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, { type: "furniture", ids: [FURN_A] }),
    );
    history = undoPlannerAction(history);
    history = redoPlannerAction(history);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([FURN_B]);
    expect(history.past).toHaveLength(1);
    expect(history.future).toEqual([]);
  });

  it("undo on empty past and redo on empty future return same history reference", () => {
    const project = createPlannerProject({
      idFactory: ids(FLOOR_ID, PROJECT_ID),
    });
    const history = createPlannerHistory(project);
    expect(undoPlannerAction(history)).toBe(history);
    expect(redoPlannerAction(history)).toBe(history);
  });

  it("updatePlannerProject no-ops when updater returns the same project reference", () => {
    const project = projectWithTwoFurniture();
    const history = createPlannerHistory(project);
    const next = updatePlannerProject(history, (current) => current);
    expect(next).toBe(history);
  });

  it("updatePlannerProject clears future and stamps updatedAt when clock is unchanged", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);
    // Seed a future via delete → undo so future is non-empty.
    history = updatePlannerProject(history, (current) =>
      applySelectionDelete(current, { type: "furniture", ids: [FURN_A] }),
    );
    history = undoPlannerAction(history);
    expect(history.future).toHaveLength(1);

    history = updatePlannerProject(
      history,
      (current) => applySelectionDelete(current, { type: "furniture", ids: [FURN_B] }),
      STAMP_NOW,
    );
    expect(history.future).toEqual([]);
    expect(history.present.updatedAt).toBe(STAMP_NOW);
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([FURN_A]);
  });

  it("dispatchPlannerTransaction no-ops on empty actions or no document change", () => {
    const project = projectWithTwoFurniture();
    const history = createPlannerHistory(project);
    expect(dispatchPlannerTransaction(history, [])).toBe(history);
    expect(
      dispatchPlannerTransaction(history, [
        { type: "duplicate", collection: "furniture", id: "absent", newId: "new" },
      ]),
    ).toBe(history);
  });

  it("dispatchPlannerAction records a delete action and undo restores furniture", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);
    history = dispatchPlannerAction(
      history,
      { type: "delete", collection: "furniture", id: FURN_A },
      STAMP_NOW,
    );
    expect(activeFurniture(history.present).map((f) => f.id)).toEqual([FURN_B]);
    expect(history.present.updatedAt).toBe(STAMP_NOW);

    history = undoPlannerAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual(
      [FURN_A, FURN_B].sort(),
    );
  });

  it("dispatchPlannerAction no-ops when action does not change the document", () => {
    const project = projectWithTwoFurniture();
    const history = createPlannerHistory(project);
    const next = dispatchPlannerAction(history, {
      type: "duplicate",
      collection: "furniture",
      id: "absent",
      newId: "new",
    });
    expect(next).toBe(history);
  });

  it("dispatchPlannerTransaction applies multiple actions as one past entry", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);
    history = dispatchPlannerTransaction(
      history,
      [
        { type: "delete", collection: "furniture", id: FURN_A },
        { type: "delete", collection: "furniture", id: FURN_B },
      ],
      STAMP_NOW,
    );
    expect(activeFurniture(history.present)).toEqual([]);
    expect(history.past).toHaveLength(1);
    history = undoPlannerAction(history);
    expect(activeFurniture(history.present).map((f) => f.id).sort()).toEqual(
      [FURN_A, FURN_B].sort(),
    );
  });

  it("beginPlannerDrag snapshots present; commit records one past when project changed", () => {
    const project = projectWithTwoFurniture();
    let history = createPlannerHistory(project);
    history = beginPlannerDrag(history);
    expect(history.dragStart).toBe(project);

    const moved: PlannerProject = {
      ...project,
      floors: project.floors.map((floor) =>
        floor.id === project.activeFloorId
          ? {
              ...floor,
              furniture: floor.furniture.map((item) =>
                item.id === FURN_A
                  ? { ...item, position: { x: POS_A.x + 100, y: POS_A.y } }
                  : item,
              ),
            }
          : floor,
      ),
    };

    history = commitPlannerDrag(history, moved);
    expect(history.dragStart).toBeNull();
    expect(history.past).toEqual([project]);
    expect(history.present).toBe(moved);
    expect(history.future).toEqual([]);
  });

  it("commitPlannerDrag without dragStart or with unchanged project clears drag without past push", () => {
    const project = projectWithTwoFurniture();
    const history = createPlannerHistory(project);

    const noDrag = commitPlannerDrag(history, project);
    expect(noDrag.past).toEqual([]);
    expect(noDrag.dragStart).toBeNull();
    expect(noDrag.present).toBe(project);

    const withDrag = beginPlannerDrag(history);
    const same = commitPlannerDrag(withDrag, project);
    expect(same.past).toEqual([]);
    expect(same.dragStart).toBeNull();
    expect(same.present).toBe(project);
  });
});
