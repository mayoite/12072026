/**
 * RED: workstation mesh quality — leg posts under desk/return (modular, not photoreal).
 * Intent: floating worktop slabs become readable furniture with named leg parts.
 * Do not implement production legs until these fail for missing feature, then GREEN.
 */
import { describe, expect, it } from "vitest";
import { createWorkstationConfigV0 } from "@/features/planner/project/catalog/workstationSystemV0";
import {
  WORKTOP_THICKNESS_MM,
  countWorkstationV0Parts,
  generateWorkstationV0Mesh,
  generateWorkstationV0MeshPlan,
  type WorkstationV0MeshPartPlan,
  type WorkstationV0MeshPlan,
} from "@/features/planner/project/catalog/workstationMeshV0";

/** Target leg cross-section band (mm). Production may export LEG_SECTION_MM later. */
const LEG_SECTION_MIN_MM = 40;
const LEG_SECTION_MAX_MM = 60;
/** Leg top may sit just under worktop bottom (mm). */
const LEG_TOP_CLEARANCE_MM = 5;

function isLegPart(part: WorkstationV0MeshPartPlan): boolean {
  return part.name.startsWith("leg");
}

function isStructurePart(part: WorkstationV0MeshPartPlan): boolean {
  return (
    part.name.startsWith("leg") || part.name.startsWith("stretcher-")
  );
}

function legPartsOf(plan: WorkstationV0MeshPlan): WorkstationV0MeshPartPlan[] {
  return plan.parts.filter(isLegPart);
}

function nonLegPartsOf(plan: WorkstationV0MeshPlan): WorkstationV0MeshPartPlan[] {
  // Module slabs only — exclude legs and stretchers
  return plan.parts.filter((p) => !isStructurePart(p));
}

function partTopY(part: WorkstationV0MeshPartPlan): number {
  return part.positionMm.y + part.sizeMm.y / 2;
}

function partBottomY(part: WorkstationV0MeshPartPlan): number {
  return part.positionMm.y - part.sizeMm.y / 2;
}

describe("workstationMeshV0 legs (modular posts under worktop)", () => {
  it("linear desk+pedestal plan includes named leg parts (unique names starting with leg)", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const legs = legPartsOf(plan);

    expect(
      legs.length,
      "expected named leg parts under desk (e.g. leg-desk-0..3)",
    ).toBeGreaterThanOrEqual(4);

    const names = legs.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
    for (const leg of legs) {
      expect(leg.name.startsWith("leg")).toBe(true);
      expect(leg.name.length).toBeGreaterThan(3);
    }
  });

  it("leg height equals heightMm - WORKTOP_THICKNESS_MM within 1mm", () => {
    const heightMm = 750;
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal"],
      heightMm,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const legs = legPartsOf(plan);
    expect(legs.length).toBeGreaterThanOrEqual(4);

    const expectedH = heightMm - WORKTOP_THICKNESS_MM;
    for (const leg of legs) {
      expect(Math.abs(leg.sizeMm.y - expectedH)).toBeLessThanOrEqual(1);
    }
  });

  it("leg cross-section is a small positive box (40–60mm), not full desk size", () => {
    const lengthMm = 1500;
    const depthMm = 600;
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm, depthMm },
      modules: ["desk", "pedestal"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const legs = legPartsOf(plan);
    expect(legs.length).toBeGreaterThanOrEqual(4);

    for (const leg of legs) {
      expect(leg.sizeMm.x).toBeGreaterThanOrEqual(LEG_SECTION_MIN_MM);
      expect(leg.sizeMm.x).toBeLessThanOrEqual(LEG_SECTION_MAX_MM);
      expect(leg.sizeMm.z).toBeGreaterThanOrEqual(LEG_SECTION_MIN_MM);
      expect(leg.sizeMm.z).toBeLessThanOrEqual(LEG_SECTION_MAX_MM);
      // Not a full-span slab disguised as a leg
      expect(leg.sizeMm.x).toBeLessThan(lengthMm / 4);
      expect(leg.sizeMm.z).toBeLessThan(depthMm / 2);
    }
  });

  it("legs sit under desk: leg top Y ≈ worktop bottom Y (within small clearance)", () => {
    const heightMm = 750;
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal"],
      heightMm,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const desk = plan.parts.find((p) => p.role === "desk" && p.name === "desk");
    expect(desk, "desk worktop part").toBeDefined();
    const worktopBottomY = partBottomY(desk!);

    const legs = legPartsOf(plan);
    expect(legs.length).toBeGreaterThanOrEqual(4);

    for (const leg of legs) {
      const legTop = partTopY(leg);
      expect(Math.abs(legTop - worktopBottomY)).toBeLessThanOrEqual(
        LEG_TOP_CLEARANCE_MM,
      );
      // Leg rests on floor (bottom near Y=0)
      expect(Math.abs(partBottomY(leg))).toBeLessThanOrEqual(1);
    }
  });

  it("L-shape desk+return has legs under both runs (more legs than linear desk-only)", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
      heightMm: 750,
    });
    const lShape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return"],
      heightMm: 750,
    });

    const linearLegs = legPartsOf(generateWorkstationV0MeshPlan(linear));
    const lLegs = legPartsOf(generateWorkstationV0MeshPlan(lShape));

    expect(linearLegs.length).toBeGreaterThanOrEqual(4);
    expect(lLegs.length).toBeGreaterThan(linearLegs.length);

    const deskLegNames = lLegs.filter((p) => p.name.includes("desk"));
    const returnLegNames = lLegs.filter((p) => p.name.includes("return"));
    expect(
      deskLegNames.length,
      "L-shape should name legs under main desk run",
    ).toBeGreaterThanOrEqual(2);
    expect(
      returnLegNames.length,
      "L-shape should name legs under return run",
    ).toBeGreaterThanOrEqual(2);
  });

  it("generateWorkstationV0Mesh children names are unique (no duplicate mesh.name)", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel"],
      heightMm: 750,
    });
    const group = generateWorkstationV0Mesh(config);
    const names = group.children.map((c) => c.name);
    expect(names.length).toBeGreaterThan(0);
    expect(new Set(names).size, `duplicate mesh names: ${names.join(",")}`).toBe(
      names.length,
    );

    // Mesh must include the leg parts from the plan
    const plan = generateWorkstationV0MeshPlan(config);
    const legNames = legPartsOf(plan).map((p) => p.name);
    expect(legNames.length).toBeGreaterThanOrEqual(4);
    for (const name of legNames) {
      expect(names).toContain(name);
    }
  });

  it("non-leg module parts keep desk/return/pedestal/panel/overhead roles and names", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel", "overhead"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const modules = nonLegPartsOf(plan);

    const roles = modules.map((p) => p.role).sort();
    expect(roles).toEqual([
      "desk",
      "overhead",
      "panel",
      "pedestal",
      "return",
    ]);

    const names = modules.map((p) => p.name).sort();
    expect(names).toEqual([
      "desk",
      "overhead",
      "panel",
      "pedestal",
      "return",
    ]);

    // Legs may exist alongside modules; they must not steal module role names
    const legs = legPartsOf(plan);
    expect(legs.length).toBeGreaterThanOrEqual(4);
    for (const leg of legs) {
      expect(["desk", "return", "pedestal", "panel", "overhead"]).not.toContain(
        leg.name,
      );
    }
  });

  it("countWorkstationV0Parts includes desk/return legs; pedestal/panel/overhead never get legs", () => {
    const linear = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel", "overhead"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(linear);
    const legs = legPartsOf(plan);
    const modules = nonLegPartsOf(plan);

    // 4 modules + 4 desk legs + 2 desk stretchers
    expect(modules).toHaveLength(4);
    expect(legs).toHaveLength(4);
    expect(countWorkstationV0Parts(linear)).toBe(10);
    expect(plan.parts).toHaveLength(10);

    // Only worktop runs get legs — never pedestal / panel / overhead
    for (const leg of legs) {
      expect(leg.name.startsWith("leg-desk-")).toBe(true);
      expect(leg.name).not.toMatch(/leg-(pedestal|panel|overhead)-/);
    }
    expect(plan.parts.some((p) => p.name.startsWith("leg-pedestal"))).toBe(
      false,
    );
    expect(plan.parts.some((p) => p.name.startsWith("leg-panel"))).toBe(false);
    expect(plan.parts.some((p) => p.name.startsWith("leg-overhead"))).toBe(
      false,
    );

    // L-shape: desk + return legs, still no pedestal/panel legs
    const lShape = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel"],
      heightMm: 750,
    });
    const lPlan = generateWorkstationV0MeshPlan(lShape);
    const lLegs = legPartsOf(lPlan);
    expect(lLegs.filter((p) => p.name.startsWith("leg-desk-"))).toHaveLength(4);
    expect(lLegs.filter((p) => p.name.startsWith("leg-return-"))).toHaveLength(
      4,
    );
    // 4 modules + 8 legs + 4 stretchers (2 per worktop run)
    expect(countWorkstationV0Parts(lShape)).toBe(16);
    expect(
      lPlan.parts.some((p) => /leg-(pedestal|panel|overhead)/.test(p.name)),
    ).toBe(false);
  });

  it("countWorkstationV0Parts with desk-only includes exactly 4 legs", () => {
    const deskOnly = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(deskOnly);
    const legs = legPartsOf(plan);
    const modules = nonLegPartsOf(plan);

    expect(modules).toHaveLength(1);
    expect(modules[0]?.name).toBe("desk");
    expect(legs).toHaveLength(4);
    for (const leg of legs) {
      expect(leg.name.startsWith("leg-desk-")).toBe(true);
    }
    // 1 desk worktop + 4 legs + 2 stretchers
    expect(countWorkstationV0Parts(deskOnly)).toBe(7);
    expect(plan.parts).toHaveLength(7);
  });
});
