// @vitest-environment node
/**
 * Name-mirror: scripts/ws-v0-visual-smoke.mjs
 */
import { describe, expect, it } from "vitest";
import {
  LEG_INSET_MM,
  LEG_SECTION_MM,
  WORKTOP_THICKNESS_MM,
  buildParts,
  legsForWorktopPrim,
  planPrimsLinear,
  renderSvg,
  stretchersForWorktopPrim,
} from "../../../scripts/ws-v0-visual-smoke.mjs";

describe("ws-v0-visual-smoke (name-mirror)", () => {
  it("locks mesh constants that must match workstationMeshV0", () => {
    expect(WORKTOP_THICKNESS_MM).toBe(30);
    expect(LEG_SECTION_MM).toBe(50);
    expect(LEG_INSET_MM).toBe(40);
  });

  it("plans linear desk + pedestal prims", () => {
    const plan = planPrimsLinear(1500, 600, ["desk", "pedestal"]);
    expect(plan.footprint).toEqual({ widthMm: 1500, depthMm: 600 });
    expect(plan.prims.map((p) => p.role)).toEqual(["desk", "pedestal"]);
    expect(plan.prims[0]).toMatchObject({ x: 0, y: 0, w: 1500, h: 600 });
    expect(plan.prims[1].w).toBeLessThanOrEqual(400);
  });

  it("creates four legs and two stretchers for a desk prim", () => {
    const prim = { x: 0, y: 0, w: 1500, h: 600, role: "desk" };
    const footprint = { widthMm: 1500, depthMm: 600 };
    const legs = legsForWorktopPrim(prim, footprint, 750, "desk");
    const stretchers = stretchersForWorktopPrim(prim, footprint, 750, "desk");
    expect(legs).toHaveLength(4);
    expect(stretchers).toHaveLength(2);
    expect(legs[0].sizeMm.x).toBe(LEG_SECTION_MM);
    expect(legs[0].sizeMm.y).toBe(750 - WORKTOP_THICKNESS_MM);
  });

  it("builds part graph and renders svg for three-quarter view", () => {
    const parts = buildParts();
    const names = parts.map((p) => p.name);
    expect(names).toContain("desk");
    expect(names.filter((n) => n.startsWith("leg-")).length).toBeGreaterThanOrEqual(4);
    expect(names.filter((n) => n.startsWith("stretcher-")).length).toBeGreaterThanOrEqual(2);
    const svg = renderSvg(parts, "three-quarter");
    expect(svg).toContain("<svg");
    expect(svg).toContain("workstation-v0");
    expect(svg).toContain("<polygon");
  });
});
