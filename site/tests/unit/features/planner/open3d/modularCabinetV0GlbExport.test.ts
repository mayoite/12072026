import { describe, expect, it } from "vitest";
import {
  GENERATED_GLB_PATH_MARKER,
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
} from "@/features/planner/open3d/catalog/modularCabinetV0";
import {
  buildModularCabinetV0GlbPlan,
  buildModularCabinetV0PartPlans,
  exportModularCabinetV0ToGeneratedAssetPath,
  modularCabinetV0GeneratedRelativePath,
} from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";

const MM = 0.001;

describe("modularCabinetV0GlbExport — plan-only, policy-safe", () => {
  it("exportModularCabinetV0ToGeneratedAssetPath returns path under catalog-assets/generated/", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    const result = exportModularCabinetV0ToGeneratedAssetPath(opts);

    expect(result.relativePath).toContain(GENERATED_GLB_PATH_MARKER);
    expect(result.relativePath.startsWith(GENERATED_GLB_PATH_MARKER)).toBe(
      true,
    );
    expect(result.relativePath.endsWith(".glb")).toBe(true);
    expect(result.relativePath).toBe(
      modularCabinetV0GeneratedRelativePath(opts),
    );
    expect(result.partCount).toBe(countCabinetV0Parts(opts));
    expect(result.footprint).toBe(generateCabinetV0Footprint(opts));
  });

  it("generated relative path is allowed by glbAssetPolicy (isSystemGeneratedGlbUrl)", () => {
    const result = exportModularCabinetV0ToGeneratedAssetPath({
      doorStyle: "pair",
      material: "oak",
    });

    expect(isSystemGeneratedGlbUrl(result.relativePath)).toBe(true);
    expect(rejectDesignerStaticGlbUrl(result.relativePath)).toBeNull();

    // Full CDN-style URL still matches marker (same rule as policy tests).
    const cdnUrl = `https://cdn.example/storage/v1/object/public/${result.relativePath}`;
    expect(isSystemGeneratedGlbUrl(cdnUrl)).toBe(true);
    expect(rejectDesignerStaticGlbUrl(cdnUrl)).toBeNull();
  });

  it("buildModularCabinetV0GlbPlan is plan-only with toe+carcass metadata", () => {
    const plan = buildModularCabinetV0GlbPlan({ doorStyle: "none" });

    expect(plan.kind).toBe("modular-cabinet-v0");
    expect(plan.binaryExportStatus).toBe("plan-only");
    expect(plan.binaryExportNote).toMatch(/metadata only|exportModularGlbBinary/i);
    expect(plan.partCount).toBe(2);
    expect(plan.parts).toHaveLength(2);
    expect(plan.parts.map((p) => p.name)).toEqual(["toe", "carcass"]);
    expect(plan.parts[0]?.sizeM.y).toBeCloseTo(TOE_HEIGHT_MM * MM);
    expect(plan.parts[1]?.sizeM.x).toBeCloseTo(0.6);
    expect(isSystemGeneratedGlbUrl(plan.relativePath)).toBe(true);
  });

  it("plan partCount tracks door styles (none=2 | slab=3 | pair=4)", () => {
    expect(buildModularCabinetV0GlbPlan({ doorStyle: "none" }).partCount).toBe(
      2,
    );
    expect(buildModularCabinetV0GlbPlan({ doorStyle: "slab" }).partCount).toBe(
      3,
    );
    const pair = buildModularCabinetV0GlbPlan({ doorStyle: "pair" });
    expect(pair.partCount).toBe(4);
    expect(pair.parts.map((p) => p.name)).toEqual([
      "toe",
      "carcass",
      "door-left",
      "door-right",
    ]);
  });

  it("plan parts match mesh children 1:1 (names, sizes, positions)", () => {
    const opts = defaultCabinetV0Options({
      doorStyle: "slab",
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
    });
    const planParts = buildModularCabinetV0PartPlans(opts);
    const group = generateCabinetV0Mesh(opts);
    expect(planParts.map((p) => p.name)).toEqual(
      group.children.map((c) => c.name),
    );
    expect(planParts).toHaveLength(3);

    for (let i = 0; i < planParts.length; i++) {
      const plan = planParts[i]!;
      const mesh = group.children[i] as import("three").Mesh;
      const geom = mesh.geometry as import("three").BoxGeometry;
      expect(plan.name).toBe(mesh.name);
      expect(plan.sizeM.x).toBeCloseTo(geom.parameters.width);
      expect(plan.sizeM.y).toBeCloseTo(geom.parameters.height);
      expect(plan.sizeM.z).toBeCloseTo(geom.parameters.depth);
      expect(plan.positionM.x).toBeCloseTo(mesh.position.x);
      expect(plan.positionM.y).toBeCloseTo(mesh.position.y);
      expect(plan.positionM.z).toBeCloseTo(mesh.position.z);
    }

    const toe = planParts[0]!;
    const inset = TOE_INSET_MM * MM;
    expect(toe.name).toBe("toe");
    expect(toe.positionM.z).toBeCloseTo(-inset / 2);
    expect(toe.sizeM.z).toBeCloseTo(0.58 - inset);

    const door = planParts[2]!;
    const carcassH = (opts.heightMm - TOE_HEIGHT_MM) * MM;
    expect(door.sizeM.y).toBeCloseTo(carcassH * 0.92);
    expect(door.sizeM.z).toBeCloseTo(DOOR_THICKNESS_MM * MM);
  });

  it("does not use designer static GLB paths", () => {
    const result = exportModularCabinetV0ToGeneratedAssetPath();
    expect(result.relativePath).not.toMatch(/\/models\//);
    expect(result.relativePath).not.toMatch(/designer/i);
    expect(
      rejectDesignerStaticGlbUrl("https://cdn.example.com/models/sofa.glb"),
    ).toMatch(/not allowed/i);
  });
});
