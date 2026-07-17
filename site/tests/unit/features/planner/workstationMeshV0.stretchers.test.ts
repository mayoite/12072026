/**
 * RED→GREEN: under-desk stretchers for workstation-v0 readability raise.
 * Legs already landed; stretchers connect posts under worktops (not photoreal).
 */
import { describe, expect, it } from "vitest";
import { createWorkstationConfigV0 } from "@/features/planner/catalog/workstationSystemV0";
import {
  WORKTOP_THICKNESS_MM,
  generateWorkstationV0Mesh,
  generateWorkstationV0MeshPlan,
  type WorkstationV0MeshPartPlan,
  type WorkstationV0MeshPlan,
} from "@/features/planner/catalog/workstationMeshV0";

function stretchersOf(plan: WorkstationV0MeshPlan): WorkstationV0MeshPartPlan[] {
  return plan.parts.filter((p) => p.name.startsWith("stretcher-"));
}

function partBottomY(part: WorkstationV0MeshPartPlan): number {
  return part.positionMm.y - part.sizeMm.y / 2;
}

function partTopY(part: WorkstationV0MeshPartPlan): number {
  return part.positionMm.y + part.sizeMm.y / 2;
}

describe("workstationMeshV0 stretchers (rails under worktop)", () => {
  it("linear desk plan includes ≥2 named stretchers under the desk run", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const stretchers = stretchersOf(plan);

    expect(
      stretchers.length,
      "expected stretcher-desk-* rails under worktop",
    ).toBeGreaterThanOrEqual(2);

    for (const s of stretchers) {
      expect(s.name.startsWith("stretcher-desk-")).toBe(true);
    }
    const names = plan.parts.map((p) => p.name);
    expect(new Set(names).size, "all mesh part names unique").toBe(names.length);
  });

  it("L-shape desk+return includes stretchers for both runs", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const deskS = stretchersOf(plan).filter((p) =>
      p.name.startsWith("stretcher-desk-"),
    );
    const retS = stretchersOf(plan).filter((p) =>
      p.name.startsWith("stretcher-return-"),
    );
    expect(deskS.length).toBeGreaterThanOrEqual(2);
    expect(retS.length).toBeGreaterThanOrEqual(2);
  });

  it("stretchers sit above floor and at or below worktop bottom", () => {
    const heightMm = 750;
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
      heightMm,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const stretchers = stretchersOf(plan);
    expect(stretchers.length).toBeGreaterThanOrEqual(2);
    const worktopBottom = heightMm - WORKTOP_THICKNESS_MM;

    for (const s of stretchers) {
      expect(partBottomY(s)).toBeGreaterThanOrEqual(-0.5);
      expect(partTopY(s)).toBeLessThanOrEqual(worktopBottom + 1);
      // Readable rail — not a hairline
      expect(s.sizeMm.y).toBeGreaterThanOrEqual(30);
      expect(s.sizeMm.x * s.sizeMm.z).toBeGreaterThan(0);
    }
  });

  it("Three mesh group includes stretcher child names", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
      heightMm: 750,
    });
    const group = generateWorkstationV0Mesh(config);
    const names = group.children.map((c) => c.name);
    const stretchers = names.filter((n) => n.startsWith("stretcher-"));
    expect(stretchers.length).toBeGreaterThanOrEqual(2);
  });
});
