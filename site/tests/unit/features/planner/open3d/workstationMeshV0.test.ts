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

function partByRole(
  plan: ReturnType<typeof generateWorkstationV0MeshPlan>,
  role: string,
) {
  const part = plan.parts.find((p) => p.role === role);
  expect(part, `missing role ${role}`).toBeDefined();
  return part!;
}

describe("generateWorkstationV0MeshPlan", () => {
  it("linear desk+pedestal+panel yields three named parts with role colors", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const plan = generateWorkstationV0MeshPlan(config);
    expect(plan.footprint).toEqual(workstationFootprintMm(config));
    expect(plan.parts.map((p) => p.role).sort()).toEqual([
      "desk",
      "panel",
      "pedestal",
    ]);
    expect(countWorkstationV0Parts(config)).toBe(3);
    expect(plan.parts).toHaveLength(3);

    const desk = partByRole(plan, "desk");
    expect(desk.name).toBe("desk");
    expect(desk.sizeMm.x).toBe(1500);
    expect(desk.sizeMm.z).toBe(600);
    expect(desk.sizeMm.y).toBe(WORKTOP_THICKNESS_MM);
    expect(desk.color).toMatch(/^#/);

    const pedestal = partByRole(plan, "pedestal");
    expect(pedestal.sizeMm.x).toBeGreaterThan(0);
    expect(pedestal.sizeMm.y).toBeLessThan(config.heightMm);
    expect(pedestal.color).not.toBe(desk.color);

    const panel = partByRole(plan, "panel");
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
    expect(plan.parts.map((p) => p.role).sort()).toEqual(["desk", "return"]);
    const ret = partByRole(plan, "return");
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
    expect(plan.parts.map((p) => p.role).sort()).toEqual(["desk", "overhead"]);
    const overhead = partByRole(plan, "overhead");
    expect(overhead.sizeMm.y).toBe(OVERHEAD_HEIGHT_MM);
    // Bottom of overhead above worktop
    const desk = partByRole(plan, "desk");
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
    const desk = partByRole(plan, "desk");
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
    const desk = partByRole(plan, "desk");
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
    expect(plan.parts.length).toBeGreaterThanOrEqual(5);
  });
});
