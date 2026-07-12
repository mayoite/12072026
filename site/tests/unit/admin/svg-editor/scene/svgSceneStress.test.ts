import { describe, expect, it } from "vitest";

import {
  serializeSceneToDefinition,
  loadSceneFromDefinition,
} from "@/features/planner/admin/svg-editor/scene/svgSceneSerializer";
import type {
  SvgSceneDocument,
  SvgSceneNode,
} from "@/features/planner/admin/svg-editor/scene/svgSceneDocument";
import { compileSvgBlockV1 } from "@/features/planner/open3d/catalog/svg/svgCompiler.server";

/**
 * A4.0 proof — deterministic round-trip and serialization performance at the
 * schema's 1000-part ceiling (the plan's "500-shape stress test"). The real
 * compiler is the oracle: a 500-shape scene must serialize, round-trip, and
 * compile.
 */

function stressScene(count: number): SvgSceneDocument {
  const nodes: SvgSceneNode[] = [];
  const grid = Math.ceil(Math.sqrt(count));
  const cell = 1000 / grid;
  for (let i = 0; i < count; i += 1) {
    const col = i % grid;
    const row = Math.floor(i / grid);
    nodes.push({
      kind: "rect",
      id: `shape-${i}`,
      name: `Shape ${i}`,
      locked: false,
      hidden: false,
      style: { fillToken: "var(--color-surface-raised)", strokeToken: "currentColor", lineWeight: 1 },
      x: col * cell + 1,
      y: row * cell + 1,
      width: Math.max(1, cell - 2),
      height: Math.max(1, cell - 2),
    });
  }
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
    metadata: {
      typeId: "stress-block",
      name: "Stress block",
      category: "test",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 1000, depth: 1000, height: 100 },
      accessibilityTitle: "Stress test symbol",
    },
    nodes,
  };
}

describe("A4.0 stress + determinism", () => {
  it("serializes 500 shapes and round-trips node identity + order", () => {
    const doc = stressScene(500);
    const def = serializeSceneToDefinition(doc);
    expect(def.parts).toHaveLength(500);

    const back = loadSceneFromDefinition(def);
    expect(back.nodes).toHaveLength(500);
    expect(back.nodes.map((n) => n.id)).toEqual(doc.nodes.map((n) => n.id));
  });

  it("compiles a 500-shape scene through the real V1 compiler", () => {
    const def = serializeSceneToDefinition(stressScene(500));
    const compiled = compileSvgBlockV1(def);
    expect(compiled.svg.startsWith("<svg")).toBe(true);
    expect(compiled.svgChecksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("serializes 500 shapes within a real-time budget", () => {
    const doc = stressScene(500);
    // Warm the path once, then time a fresh serialize.
    serializeSceneToDefinition(doc);
    const started = performance.now();
    serializeSceneToDefinition(doc);
    const elapsed = performance.now() - started;
    // Generous ceiling: serialization is the interactive publish step; keep it snappy.
    expect(elapsed).toBeLessThan(250);
  });

  it("produces byte-identical descriptors across repeated serialization", () => {
    const doc = stressScene(500);
    const a = JSON.stringify(serializeSceneToDefinition(doc));
    const b = JSON.stringify(serializeSceneToDefinition(doc));
    expect(a).toEqual(b);
  });
});
