import { describe, expect, it } from "vitest";

import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";
import { addNode } from "@/features/admin/svg-editor/scene/svgSceneDocument";

/**
 * A4.0 — real-DOM proof of the SVG.js engine adapter: mount, render, re-render,
 * and clean teardown (the plan's "React cleanup / CSP" gate). The adapter is
 * imported lazily so this test is skipped gracefully if the DOM environment
 * cannot host SVG.js; when it can, it must draw one element per visible node and
 * leave the container empty after destroy().
 */

function baseDoc(): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 200, height: 200 },
    metadata: {
      typeId: "dom-block",
      name: "DOM block",
      category: "test",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 200, depth: 200, height: 100 },
      accessibilityTitle: "DOM test symbol",
    },
    nodes: [
      { kind: "rect", id: "a", name: "a", locked: false, hidden: false, style: {}, x: 10, y: 10, width: 50, height: 50 },
    ],
  };
}

describe("svgJsEngineAdapter — real DOM lifecycle", () => {
  it("mounts, renders one node, re-renders, and cleans up on destroy", async () => {
    if (typeof document === "undefined") {
      // No DOM environment — nothing to prove here.
      return;
    }
    const { createSvgJsEngineAdapter } = await import(
      "@/features/admin/svg-editor/scene/svgJsEngineAdapter"
    );

    const host = document.createElement("div");
    document.body.appendChild(host);

    const doc = baseDoc();
    const adapter = createSvgJsEngineAdapter(host, doc, { panZoom: false });

    // One <rect> drawn for the single visible node.
    expect(host.querySelectorAll("[data-scene-node]").length).toBe(1);

    // Re-render with a second node → two tagged elements.
    const next = addNode(doc, {
      kind: "circle",
      id: "b",
      name: "b",
      locked: true,
      hidden: false,
      style: {},
      cx: 100,
      cy: 100,
      r: 20,
    });
    adapter.render(next, "b");
    expect(host.querySelectorAll("[data-scene-node]").length).toBe(2);
    expect(host.querySelector('[data-scene-node="a"]')).toHaveClass(
      "svg-studio__node",
    );
    expect(host.querySelector('[data-scene-node="b"]')).toHaveClass(
      "svg-studio__node--selected",
    );

    // Serialization reflects the current document.
    expect(adapter.serialize().parts.map((p) => p.id)).toEqual(["z0000-a", "z0001-b"]);

    adapter.destroy();
    expect(host.querySelector("svg")).toBeNull();
    // Second destroy is a safe no-op.
    expect(() => adapter.destroy()).not.toThrow();

    host.remove();
  });
});
