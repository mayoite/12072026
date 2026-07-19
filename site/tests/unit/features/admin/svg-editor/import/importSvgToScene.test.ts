import { describe, expect, it } from "vitest";

import { importSvgToScene } from "@/features/admin/svg-editor/import/importSvgToScene";
import { serializeSceneToDefinition } from "@/features/admin/svg-editor/scene/svgSceneSerializer";

const OPTS = { slug: "custom-sofa-2400" } as const;

function wrap(inner: string, attrs = `viewBox="0 0 240 90"`): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${inner}</svg>`;
}

describe("importSvgToScene", () => {
  it("imports a multi-shape furniture SVG and preserves paint order", () => {
    const svg = wrap(
      `<rect x="0" y="0" width="240" height="90" />` +
        `<path d="M10 10 C 40 0, 65 0, 95 10 L 95 80 L 10 80 Z" />` +
        `<circle cx="30" cy="45" r="8" />`,
    );
    const result = importSvgToScene(svg, OPTS);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.nodeCount).toBe(3);
    expect(result.document.nodes.map((n) => n.kind)).toEqual(["rect", "path", "circle"]);
    expect(result.document.viewBox).toEqual({ x: 0, y: 0, width: 240, height: 90 });
  });

  it("flattens ellipse/polygon/polyline into path geometry", () => {
    const svg = wrap(
      `<ellipse cx="50" cy="45" rx="40" ry="20" />` +
        `<polygon points="0,0 20,0 20,20 0,20" />` +
        `<polyline points="0,0 10,10 20,0" />`,
    );
    const result = importSvgToScene(svg, OPTS);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.document.nodes.map((n) => n.kind)).toEqual(["path", "path", "path"]);
    // polygon closes (Z), polyline does not.
    const [, polygon, polyline] = result.document.nodes;
    expect(polygon.kind === "path" && polygon.d.endsWith("Z")).toBe(true);
    expect(polyline.kind === "path" && polyline.d.endsWith("Z")).toBe(false);
  });

  it("publishes end-to-end through the existing serializer (path authority)", () => {
    const svg = wrap(`<path d="M0 0 L240 0 L240 90 L0 90 Z" />`);
    const result = importSvgToScene(svg, { slug: "custom-credenza", sku: "OFL-CRD-001" });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    const definition = serializeSceneToDefinition(result.document);
    expect(definition.typeId).toBe("custom-credenza");
    expect(definition.sku).toBe("OFL-CRD-001");
    expect(definition.parts).toHaveLength(1);
    expect(definition.parts[0]).toMatchObject({ kind: "path", d: "M0 0 L240 0 L240 90 L0 90 Z" });
  });

  it("infers dimensions from viewBox when none supplied, and honors explicit mm", () => {
    const svg = wrap(`<path d="M0 0 L100 0 L100 50 Z" />`, `viewBox="0 0 100 50"`);
    const inferred = importSvgToScene(svg, { slug: "custom-shelf" });
    expect(inferred.ok).toBe(true);
    if (!inferred.ok) throw new Error(inferred.error);
    expect(inferred.document.metadata.physicalDimensionsMm).toEqual({ width: 100, depth: 50, height: 50 });

    const explicit = importSvgToScene(svg, {
      slug: "custom-shelf",
      physicalDimensionsMm: { width: 1200, depth: 400, height: 2000 },
    });
    expect(explicit.ok).toBe(true);
    if (!explicit.ok) throw new Error(explicit.error);
    expect(explicit.document.metadata.physicalDimensionsMm).toEqual({
      width: 1200,
      depth: 400,
      height: 2000,
    });
  });

  it("falls back to root width/height when there is no viewBox", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150"><path d="M0 0 L300 0 L300 150 Z" /></svg>`;
    const result = importSvgToScene(svg, { slug: "custom-bench" });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.document.viewBox).toEqual({ x: 0, y: 0, width: 300, height: 150 });
  });

  it("rejects unsafe markup via the shared sanitizer", () => {
    const svg = wrap(`<path d="M0 0 L10 10" /><script>alert(1)</script>`);
    const result = importSvgToScene(svg, OPTS);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected rejection");
    expect(result.issues?.some((i) => i.includes("script"))).toBe(true);
  });

  it("rejects an SVG with no usable geometry", () => {
    const result = importSvgToScene(wrap(`<title>empty</title>`), OPTS);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected rejection");
    expect(result.error).toMatch(/No supported geometry/);
  });

  it("rejects an invalid slug before parsing", () => {
    const result = importSvgToScene(wrap(`<path d="M0 0 L1 1" />`), { slug: "Bad Slug!" });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected rejection");
    expect(result.error).toMatch(/Invalid slug/);
  });

  it("skips degenerate shapes (zero-size rect, empty path)", () => {
    const svg = wrap(`<rect x="0" y="0" width="0" height="10" /><path d="M5 5 L60 5 L60 60 Z" />`);
    const result = importSvgToScene(svg, { slug: "custom-table" });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.nodeCount).toBe(1);
    expect(result.document.nodes[0].kind).toBe("path");
  });
});
