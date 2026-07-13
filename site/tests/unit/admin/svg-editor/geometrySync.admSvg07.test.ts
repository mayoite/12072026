/**
 * ADM-SVG-07 — direct manipulation and exact numeric geometry stay synchronized.
 * Both drag/resize patches and inspector number patches write SvgSceneDocument
 * through applySceneNodeGeometryPatch (same authority).
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  applySceneNodeGeometryPatch,
  findNode,
  type SvgSceneDocument,
  type SvgSceneNode,
} from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import {
  commit,
  createHistory,
} from "@/features/planner/admin/svg-editor/scene/svgSceneHistory";

function readCanvasSource(): string {
  return fs.readFileSync(
    path.join(
      process.cwd(),
      "features/planner/admin/svg-editor/SvgStudioCanvas.tsx",
    ),
    "utf8",
  );
}

function baseRectDoc(): SvgSceneDocument {
  const rect: SvgSceneNode = {
    kind: "rect",
    id: "desk-top",
    name: "Desk",
    locked: false,
    hidden: false,
    style: { fillToken: "currentColor", strokeToken: "currentColor", lineWeight: 1 },
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  };
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: "desk-basic",
      name: "Basic Desk",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
      accessibilityTitle: "Basic desk",
    },
    nodes: [rect],
  };
}

describe("ADM-SVG-07 geometry synchronization", () => {
  it("drag/resize patch and numeric inspector patches converge on the same document", () => {
    const start = baseRectDoc();

    // Canvas direct manipulation: engine emits a full geometry patch after drag/resize.
    const afterDrag = applySceneNodeGeometryPatch(start, "desk-top", {
      x: 40,
      y: 60,
      width: 180,
      height: 90,
    });

    // Inspector numbers: same values applied field-by-field (blur path).
    let afterNumbers = start;
    afterNumbers = applySceneNodeGeometryPatch(afterNumbers, "desk-top", { x: 40 });
    afterNumbers = applySceneNodeGeometryPatch(afterNumbers, "desk-top", { y: 60 });
    afterNumbers = applySceneNodeGeometryPatch(afterNumbers, "desk-top", {
      width: 180,
    });
    afterNumbers = applySceneNodeGeometryPatch(afterNumbers, "desk-top", {
      height: 90,
    });

    expect(afterDrag).toEqual(afterNumbers);
    const node = findNode(afterDrag, "desk-top");
    expect(node).toMatchObject({
      kind: "rect",
      x: 40,
      y: 60,
      width: 180,
      height: 90,
    });
  });

  it("history commits from either path share one present document for host onDocumentChange", () => {
    const start = baseRectDoc();
    let history = createHistory(start, "Open");

    // Simulate drag commit (node:change → apply).
    history = commit(
      history,
      "Transform Desk",
      applySceneNodeGeometryPatch(history.present.document, "desk-top", {
        x: 15,
        y: 25,
        width: 120,
        height: 60,
      }),
    );
    const afterDragPresent = history.present.document;

    // Reset and apply same geometry via numeric inspector commits.
    history = createHistory(start, "Open");
    history = commit(
      history,
      "Set Desk X",
      applySceneNodeGeometryPatch(history.present.document, "desk-top", { x: 15 }),
    );
    history = commit(
      history,
      "Set Desk Y",
      applySceneNodeGeometryPatch(history.present.document, "desk-top", { y: 25 }),
    );
    history = commit(
      history,
      "Set Desk width",
      applySceneNodeGeometryPatch(history.present.document, "desk-top", {
        width: 120,
      }),
    );
    history = commit(
      history,
      "Set Desk height",
      applySceneNodeGeometryPatch(history.present.document, "desk-top", {
        height: 60,
      }),
    );

    expect(history.present.document).toEqual(afterDragPresent);
    // Host EditView reads documentGetterRef / onDocumentChange from this present.
    expect(findNode(history.present.document, "desk-top")).toMatchObject({
      x: 15,
      y: 25,
      width: 120,
      height: 60,
    });
  });

  it("rejects invalid numeric geometry from either path", () => {
    const start = baseRectDoc();
    expect(() =>
      applySceneNodeGeometryPatch(start, "desk-top", { width: 0 }),
    ).toThrow(/width must be positive/);
    expect(() =>
      applySceneNodeGeometryPatch(start, "desk-top", { height: -1 }),
    ).toThrow(/height must be positive/);
  });

  it("SvgStudioCanvas wires drag node:change and inspector numbers to applySceneNodeGeometryPatch", () => {
    const src = readCanvasSource();
    // Single authority import.
    expect(src).toMatch(/applySceneNodeGeometryPatch/);
    // Direct manipulation path.
    expect(src).toMatch(/adapter\.on\("node:change"/);
    expect(src).toMatch(
      /node:change[\s\S]*?applySceneNodeGeometryPatch\([\s\S]*?event\.nodeId/,
    );
    // Numeric inspector path.
    expect(src).toMatch(
      /patchSelected[\s\S]*?applySceneNodeGeometryPatch\(document,\s*selectedId/,
    );
    // Host notify after history present changes (both paths).
    expect(src).toMatch(/onDocumentChange\?\.\(document\)/);
  });
});
