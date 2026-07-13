/**
 * ADM-SVG-09 — layer select, order, lock, visibility, clear state.
 * ADM-SVG-10 — named undo/redo preserve a valid document.
 *
 * Mirrors SvgStudioCanvas apply() paths: all mutations go through
 * svgSceneDocument + svgSceneHistory (same authority as the UI).
 */

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  addNode,
  findNode,
  removeNode,
  reorderNode,
  replaceNode,
  validateDocument,
  type SvgSceneDocument,
  type SvgSceneNode,
} from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import {
  canRedo,
  canUndo,
  commit,
  createHistory,
  redo,
  redoLabel,
  undo,
  undoLabel,
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

function rect(id: string, over: Partial<SvgSceneNode> = {}): SvgSceneNode {
  return {
    kind: "rect",
    id,
    name: id,
    locked: false,
    hidden: false,
    style: { fillToken: "currentColor", strokeToken: "currentColor", lineWeight: 1 },
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    ...over,
  } as SvgSceneNode;
}

function baseDoc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: "layer-fixture",
      name: "Layer fixture",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "test",
      physicalDimensionsMm: { width: 600, depth: 600, height: 100 },
      accessibilityTitle: "Layer fixture",
    },
    nodes,
  };
}

describe("ADM-SVG-09 layer selection, order, lock, visibility, clear state", () => {
  it("selects by id and reports layer state", () => {
    const doc = baseDoc([rect("a"), rect("b", { locked: true, hidden: true })]);
    expect(findNode(doc, "a")).toMatchObject({ id: "a", locked: false, hidden: false });
    expect(findNode(doc, "b")).toMatchObject({ id: "b", locked: true, hidden: true });
    expect(findNode(doc, "missing")).toBeUndefined();
  });

  it("orders layers (bring to front / send to back)", () => {
    const doc = baseDoc([rect("a"), rect("b"), rect("c")]);
    // Studio: bringToFront = reorder to length-1; sendToBack = reorder to 0.
    expect(reorderNode(doc, "a", 2).nodes.map((n) => n.id)).toEqual(["b", "c", "a"]);
    expect(reorderNode(doc, "c", 0).nodes.map((n) => n.id)).toEqual(["c", "a", "b"]);
  });

  it("toggles lock and visibility with clear explicit state", () => {
    let doc = baseDoc([rect("shape")]);
    doc = replaceNode(doc, "shape", (n) => ({ ...n, locked: true }));
    expect(findNode(doc, "shape")?.locked).toBe(true);
    doc = replaceNode(doc, "shape", (n) => ({ ...n, locked: false }));
    expect(findNode(doc, "shape")?.locked).toBe(false);

    doc = replaceNode(doc, "shape", (n) => ({ ...n, hidden: true }));
    expect(findNode(doc, "shape")?.hidden).toBe(true);
    doc = replaceNode(doc, "shape", (n) => ({ ...n, hidden: false }));
    expect(findNode(doc, "shape")?.hidden).toBe(false);
  });

  it("clears a layer from the document (delete)", () => {
    const doc = baseDoc([rect("keep"), rect("gone")]);
    const next = removeNode(doc, "gone");
    expect(next.nodes.map((n) => n.id)).toEqual(["keep"]);
    expect(findNode(next, "gone")).toBeUndefined();
    expect(() => validateDocument(next)).not.toThrow();
  });
});

describe("ADM-SVG-10 named undo/redo preserve valid document", () => {
  it("names layer ops and restores a valid document on undo/redo", () => {
    const open = baseDoc([rect("a")]);
    let history = createHistory(open, "Open");

    const withB = addNode(open, rect("b"));
    history = commit(history, "Add b", withB);
    expect(undoLabel(history)).toBe("Add b");
    expect(canUndo(history)).toBe(true);

    const locked = replaceNode(withB, "b", (n) => ({ ...n, locked: true }));
    history = commit(history, "Lock b", locked);
    expect(undoLabel(history)).toBe("Lock b");
    expect(findNode(history.present.document, "b")?.locked).toBe(true);

    const reordered = reorderNode(locked, "a", 1);
    history = commit(history, "Bring a to front", reordered);
    expect(history.present.document.nodes.map((n) => n.id)).toEqual(["b", "a"]);

    history = undo(history);
    expect(history.present.document.nodes.map((n) => n.id)).toEqual(["a", "b"]);
    expect(findNode(history.present.document, "b")?.locked).toBe(true);
    expect(redoLabel(history)).toBe("Bring a to front");
    expect(() => validateDocument(history.present.document)).not.toThrow();

    history = undo(history);
    expect(findNode(history.present.document, "b")?.locked).toBe(false);
    expect(undoLabel(history)).toBe("Add b");

    history = undo(history);
    expect(history.present.document.nodes.map((n) => n.id)).toEqual(["a"]);
    expect(canUndo(history)).toBe(false);

    history = redo(history);
    expect(history.present.document.nodes.map((n) => n.id)).toEqual(["a", "b"]);
    history = redo(history);
    expect(findNode(history.present.document, "b")?.locked).toBe(true);
    history = redo(history);
    expect(history.present.document.nodes.map((n) => n.id)).toEqual(["b", "a"]);
    expect(canRedo(history)).toBe(false);
    expect(() => validateDocument(history.present.document)).not.toThrow();
  });

  it("preserves validity after hide + delete + undo", () => {
    let history = createHistory(baseDoc([rect("a"), rect("b")]), "Open");
    const hidden = replaceNode(history.present.document, "b", (n) => ({
      ...n,
      hidden: true,
    }));
    history = commit(history, "Hide b", hidden);
    const deleted = removeNode(hidden, "b");
    history = commit(history, "Delete b", deleted);
    expect(findNode(history.present.document, "b")).toBeUndefined();

    history = undo(history);
    expect(findNode(history.present.document, "b")?.hidden).toBe(true);
    expect(() => validateDocument(history.present.document)).not.toThrow();

    history = undo(history);
    expect(findNode(history.present.document, "b")?.hidden).toBe(false);
    expect(() => validateDocument(history.present.document)).not.toThrow();
  });

  it("SvgStudioCanvas wires layer ops and named undo/redo labels", () => {
    const src = readCanvasSource();
    // ADM-SVG-09: select, order, lock, visibility, clear (delete).
    expect(src).toMatch(/setSelectedId\(node\.id\)/);
    expect(src).toMatch(/reorderNode\(document,\s*selected\.id,\s*document\.nodes\.length - 1\)/);
    expect(src).toMatch(/reorderNode\(document,\s*selected\.id,\s*0\)/);
    expect(src).toMatch(/locked: !n\.locked/);
    expect(src).toMatch(/hidden: !n\.hidden/);
    expect(src).toMatch(/removeNode\(document,\s*selected\.id\)/);
    // ADM-SVG-10: named commits + named undo/redo chrome.
    expect(src).toMatch(/commit\(current,\s*label,\s*next\)/);
    expect(src).toMatch(/`Bring \$\{selected\.name\} to front`/);
    expect(src).toMatch(/`Lock \$\{node\.name\}`|`Unlock \$\{node\.name\}`/);
    expect(src).toMatch(/`Hide \$\{node\.name\}`|`Show \$\{node\.name\}`/);
    expect(src).toMatch(/`Delete \$\{selected\.name\}`/);
    expect(src).toMatch(/undoLabel\(history\)/);
    expect(src).toMatch(/redoLabel\(history\)/);
    expect(src).toMatch(/Undo: \$\{undoLabel\(history\)\}/);
    expect(src).toMatch(/Redo: \$\{redoLabel\(history\)\}/);
  });
});
