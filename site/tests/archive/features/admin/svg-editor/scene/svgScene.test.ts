import { describe, expect, it } from "vitest";

import {
  addNode,
  removeNode,
  reorderNode,
  replaceNode,
  validateDocument,
  type SvgSceneDocument,
  type SvgSceneNode,
} from "@/features/admin/svg-editor/scene/svgSceneDocument";
import {
  loadSceneFromDefinition,
  normalizeNumber,
  serializeSceneToDefinition,
} from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import {
  canRedo,
  canUndo,
  commit,
  createHistory,
  redo,
  redoLabel,
  undo,
  undoLabel,
} from "@/features/admin/svg-editor/scene/svgSceneHistory";
import { createHeadlessEngineAdapter } from "@/features/admin/svg-editor/scene/svgEngineAdapter";
import { compileSvgBlockV1 } from "@/features/planner/project/catalog/svg/svgCompiler.server";

function rect(id: string, over: Partial<SvgSceneNode> = {}): SvgSceneNode {
  return {
    kind: "rect",
    id,
    name: id,
    locked: false,
    hidden: false,
    style: { fillToken: "var(--color-surface-raised)" },
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    ...over,
  } as SvgSceneNode;
}

function baseDoc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 600, height: 600 },
    metadata: {
      typeId: "desk-basic",
      name: "Basic Desk",
      category: "desk",
      tags: ["desk", "office"],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 600, depth: 600, height: 480 },
      accessibilityTitle: "Basic desk symbol",
    },
    nodes,
  };
}

describe("svgSceneSerializer — publish boundary", () => {
  it("round-trips a document through the V1 descriptor unchanged", () => {
    // ADM-SVG-08: publish authority only allows rect/circle authoring kinds.
    const doc = baseDoc([
      rect("desk-top"),
      { kind: "circle", id: "knob", name: "knob", locked: false, hidden: false, style: {}, cx: 300, cy: 300, r: 12 },
    ]);

    const back = loadSceneFromDefinition(serializeSceneToDefinition(doc));

    expect(back.nodes.map((n) => n.id)).toEqual(["desk-top", "knob"]);
    expect(back.metadata).toEqual(doc.metadata);
    expect(back.viewBox).toEqual(doc.viewBox);
    // Re-serializing is a fixed point.
    expect(serializeSceneToDefinition(back)).toEqual(serializeSceneToDefinition(doc));
  });

  it("rejects unsupported authoring kinds at serialize (ADM-SVG-08)", () => {
    const doc = baseDoc([
      {
        kind: "path",
        id: "freehand",
        name: "freehand",
        locked: false,
        hidden: false,
        style: { strokeToken: "currentColor", lineWeight: 2 },
        d: "M0 0 L100 0",
      },
    ]);
    expect(() => serializeSceneToDefinition(doc)).toThrow(/Unsupported SVG authoring kinds/);
  });

  it("preserves author z-order through the compiler's id-sort", () => {
    // Author order: bottom → top is [c, a, b]. Plain ids would sort a<b<c and lose it.
    const doc = baseDoc([rect("c-part"), rect("a-part"), rect("b-part")]);
    const def = serializeSceneToDefinition(doc);
    const sortedIds = [...def.parts].map((p) => p.id).sort((l, r) => l.localeCompare(r));
    // After the compiler's lexical sort, paint order still equals author order.
    expect(sortedIds).toEqual(["z0000-c-part", "z0001-a-part", "z0002-b-part"]);
    // And the real compiler accepts it.
    expect(() => compileSvgBlockV1(def)).not.toThrow();
  });

  it("is deterministic: same document → byte-identical descriptor", () => {
    const doc = baseDoc([rect("desk-top", { x: 10.00049 })]);
    expect(JSON.stringify(serializeSceneToDefinition(doc))).toEqual(
      JSON.stringify(serializeSceneToDefinition(doc)),
    );
  });

  it("normalizes numeric precision and avoids negative zero", () => {
    expect(normalizeNumber(10.00049)).toBe(10);
    expect(normalizeNumber(-0)).toBe(0);
    expect(normalizeNumber(1.23456)).toBe(1.235);
    expect(Object.is(normalizeNumber(-0.0001), 0)).toBe(true);
  });

  it("retains hidden nodes as invisible parts so the layer tree round-trips", () => {
    const doc = baseDoc([rect("desk-top", { hidden: true })]);
    const def = serializeSceneToDefinition(doc);
    expect(def.parts[0].visible).toBe(false);
    expect(loadSceneFromDefinition(def).nodes[0].hidden).toBe(true);
  });
});

describe("svgSceneDocument — immutable updates", () => {
  it("replaces a node without mutating the original document", () => {
    const doc = baseDoc([rect("desk-top")]);
    const next = replaceNode(doc, "desk-top", (n) => ({ ...n, x: 42 }) as SvgSceneNode);
    expect(next).not.toBe(doc);
    expect((doc.nodes[0] as { x: number }).x).toBe(10);
    expect((next.nodes[0] as { x: number }).x).toBe(42);
  });

  it("rejects id and kind changes through replaceNode", () => {
    const doc = baseDoc([rect("desk-top")]);
    expect(() => replaceNode(doc, "desk-top", (n) => ({ ...n, id: "other" }) as SvgSceneNode)).toThrow(/must not change node id/);
    expect(() => replaceNode(doc, "desk-top", (n) => ({ ...n, kind: "circle" }) as unknown as SvgSceneNode)).toThrow(/must not change node kind/);
  });

  it("rejects duplicate ids on add", () => {
    const doc = baseDoc([rect("desk-top")]);
    expect(() => addNode(doc, rect("desk-top"))).toThrow(/duplicate node id/);
  });

  it("reorders within bounds and clamps out-of-range targets", () => {
    const doc = baseDoc([rect("a"), rect("b"), rect("c")]);
    expect(reorderNode(doc, "a", 2).nodes.map((n) => n.id)).toEqual(["b", "c", "a"]);
    expect(reorderNode(doc, "c", -5).nodes.map((n) => n.id)).toEqual(["c", "a", "b"]);
  });

  it("removes nodes and flags invalid geometry", () => {
    const doc = baseDoc([rect("a"), rect("b")]);
    expect(removeNode(doc, "a").nodes.map((n) => n.id)).toEqual(["b"]);
    expect(() => validateDocument(baseDoc([rect("a", { width: -1 })]))).toThrow();
  });
});

describe("svgSceneHistory — named undo/redo", () => {
  it("commits, undoes, and redoes with operation labels", () => {
    const doc0 = baseDoc([rect("a")]);
    const doc1 = addNode(doc0, rect("b"));
    let h = createHistory(doc0, "Open");
    expect(canUndo(h)).toBe(false);

    h = commit(h, "Add b", doc1);
    expect(undoLabel(h)).toBe("Add b");
    expect(h.present.document).toBe(doc1);

    h = undo(h);
    expect(h.present.document).toBe(doc0);
    expect(canRedo(h)).toBe(true);
    expect(redoLabel(h)).toBe("Add b");

    h = redo(h);
    expect(h.present.document).toBe(doc1);
  });

  it("clears redo on a fresh commit and bounds depth", () => {
    let h = createHistory(baseDoc([rect("a")]), "Open", 2);
    h = commit(h, "1", baseDoc([rect("a"), rect("b")]));
    h = commit(h, "2", baseDoc([rect("a"), rect("c")]));
    h = commit(h, "3", baseDoc([rect("a"), rect("d")]));
    // limit 2 → only the two most recent past states are retained.
    expect(h.past.length).toBe(2);
    h = undo(h);
    h = commit(h, "branch", baseDoc([rect("a"), rect("e")]));
    expect(canRedo(h)).toBe(false);
  });

  it("treats a reference-equal commit as a no-op", () => {
    const doc = baseDoc([rect("a")]);
    const h = createHistory(doc, "Open");
    expect(commit(h, "noop", doc)).toBe(h);
  });
});

describe("svgEngineAdapter — headless reference", () => {
  it("serializes the current document and honors viewport ops", () => {
    const doc = baseDoc([rect("a")]);
    const adapter = createHeadlessEngineAdapter(doc, { width: 300, height: 300 });
    expect(adapter.serialize().parts[0].id).toBe("z0000-a");

    let seen = 0;
    const off = adapter.on("viewport:change", () => { seen += 1; });
    adapter.setViewport({ zoom: 2 });
    expect(adapter.getViewport().zoom).toBe(2);
    adapter.zoomToFit();
    expect(adapter.getViewport().zoom).toBeCloseTo(0.5); // 300 / 600
    off();
    adapter.resetViewport();
    expect(seen).toBe(2); // listener removed before reset

    adapter.destroy();
    expect(() => adapter.setViewport({ zoom: 1 })).toThrow(/after destroy/);
  });
});
