/**
 * Systems v0 — multi-part workstation mesh plan (desk/return/pedestal/panel/overhead).
 * Readable modular boxes, not photoreal GLB.
 */
import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  createWorkstationConfigV0,
  workstationFootprintMm,
} from "@/features/planner/open3d/catalog/workstationSystemV0";
import {
  WORKTOP_THICKNESS_MM,
  PANEL_HEIGHT_MM,
  OVERHEAD_HEIGHT_MM,
  countWorkstationV0Parts,
  generateWorkstationV0Mesh,
  generateWorkstationV0MeshPlan,
  workstationOptionsFromConfig,
} from "@/features/planner/open3d/catalog/workstationMeshV0";

const MM = 0.001;

/** Module slabs only (not leg-* posts or stretcher-* rails). */
function moduleParts(
  plan: ReturnType<typeof generateWorkstationV0MeshPlan>,
) {
  return plan.parts.filter(
    (p) => !p.name.startsWith("leg") && !p.name.startsWith("stretcher-"),
  );
}

function moduleByName(
  plan: ReturnType<typeof generateWorkstationV0MeshPlan>,
  name: string,
) {
  const part = moduleParts(plan).find((p) => p.name === name);
  expect(part, `missing module ${name}`).toBeDefined();
  return part!;
}

describe("generateWorkstationV0MeshPlan", () => {
  it("linear desk+pedestal+panel yields three module parts with role colors (+ legs)", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    expect(plan.footprint).toEqual(workstationFootprintMm(config));
    const modules = moduleParts(plan);
    expect(modules.map((p) => p.role).sort()).toEqual([
      "desk",
      "panel",
      "pedestal",
    ]);
    // 3 modules + 4 desk legs + 2 desk stretchers
    expect(countWorkstationV0Parts(config)).toBe(9);
    expect(plan.parts).toHaveLength(9);
    expect(plan.parts.filter((p) => p.name.startsWith("leg-desk-"))).toHaveLength(
      4,
    );
    expect(
      plan.parts.filter((p) => p.name.startsWith("stretcher-desk-")),
    ).toHaveLength(2);

    const desk = moduleByName(plan, "desk");
    expect(desk.name).toBe("desk");
    expect(desk.sizeMm.x).toBe(1500);
    expect(desk.sizeMm.z).toBe(600);
    expect(desk.sizeMm.y).toBe(WORKTOP_THICKNESS_MM);
    expect(desk.color).toMatch(/^#/);

    const pedestal = moduleByName(plan, "pedestal");
    expect(pedestal.sizeMm.x).toBeGreaterThan(0);
    expect(pedestal.sizeMm.y).toBeLessThan(config.heightMm);
    expect(pedestal.color).not.toBe(desk.color);

    const panel = moduleByName(plan, "panel");
    expect(panel.sizeMm.y).toBe(PANEL_HEIGHT_MM);
    expect(panel.color).not.toBe(desk.color);
  });

  it("l-shape adds return wing part with same worktop thickness", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    expect(moduleParts(plan).map((p) => p.role).sort()).toEqual([
      "desk",
      "return",
    ]);
    const ret = moduleByName(plan, "return");
    expect(ret.sizeMm.y).toBe(WORKTOP_THICKNESS_MM);
    expect(ret.sizeMm.x).toBe(600);
    // Return wing depth in plan is L - D = 900
    expect(ret.sizeMm.z).toBe(900);
  });

  it("overhead module adds elevated bin above worktop", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "overhead"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    expect(moduleParts(plan).map((p) => p.role).sort()).toEqual([
      "desk",
      "overhead",
    ]);
    const overhead = moduleByName(plan, "overhead");
    expect(overhead.sizeMm.y).toBe(OVERHEAD_HEIGHT_MM);
    // Bottom of overhead above worktop
    const desk = moduleByName(plan, "desk");
    const deskTopY = desk.positionMm.y + desk.sizeMm.y / 2;
    const overheadBottomY = overhead.positionMm.y - overhead.sizeMm.y / 2;
    expect(overheadBottomY).toBeGreaterThan(deskTopY);
  });

  it("desk worktop sits at config heightMm (top face)", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 900, depthMm: 600 },
      modules: ["desk"],
      heightMm: 750,
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const desk = moduleByName(plan, "desk");
    const topY = desk.positionMm.y + desk.sizeMm.y / 2;
    expect(topY).toBeCloseTo(750, 5);
  });

  it("parts are centered on footprint AABB origin", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const desk = moduleByName(plan, "desk");
    // Full desk fills footprint → center at origin in XZ
    expect(desk.positionMm.x).toBeCloseTo(0, 5);
    expect(desk.positionMm.z).toBeCloseTo(0, 5);
  });

  it("workstationOptionsFromConfig is serializable round-trip shape", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1200, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel"],
      heightMm: 720,
    });
    const opts = workstationOptionsFromConfig(config);
    expect(opts).toEqual({
      shape: "l-shape",
      lengthMm: 1200,
      depthMm: 600,
      heightMm: 720,
      modules: expect.arrayContaining(["desk", "return", "pedestal", "panel"]),
    });
  });
});

describe("generateWorkstationV0Mesh", () => {
  it("builds THREE.Group with one mesh child per plan part and role names", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const group = generateWorkstationV0Mesh(config);

    expect(group.type).toBe("Group");
    expect(group.name).toBe("workstation-v0");
    expect(group.userData.modular).toBe("workstation-v0");
    expect(group.children).toHaveLength(plan.parts.length);
    expect(group.children.map((c) => c.name).sort()).toEqual(
      plan.parts.map((p) => p.name).sort(),
    );

    for (const part of plan.parts) {
      const mesh = group.children.find((c) => c.name === part.name);
      expect(mesh).toBeInstanceOf(THREE.Mesh);
      const m = mesh as THREE.Mesh;
      const geom = m.geometry as THREE.BoxGeometry;
      expect(geom.parameters.width).toBeCloseTo(part.sizeMm.x * MM, 5);
      expect(geom.parameters.height).toBeCloseTo(part.sizeMm.y * MM, 5);
      expect(geom.parameters.depth).toBeCloseTo(part.sizeMm.z * MM, 5);
      expect(m.position.x).toBeCloseTo(part.positionMm.x * MM, 5);
      expect(m.position.y).toBeCloseTo(part.positionMm.y * MM, 5);
      expect(m.position.z).toBeCloseTo(part.positionMm.z * MM, 5);
    }
  });

  it("mesh plan === mesh dims for L-shape with all modules", () => {
    const config = createWorkstationConfigV0({
      shape: "l-shape",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "return", "pedestal", "panel", "overhead"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    const group = generateWorkstationV0Mesh(config);
    expect(group.children).toHaveLength(countWorkstationV0Parts(config));
    expect(group.children).toHaveLength(plan.parts.length);
    // 5 modules + 8 legs + 4 stretchers ≥ 17
    expect(plan.parts.length).toBeGreaterThanOrEqual(17);
    expect(moduleParts(plan)).toHaveLength(5);
  });
});
