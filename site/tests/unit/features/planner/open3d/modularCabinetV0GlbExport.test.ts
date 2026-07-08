import { describe, expect, it } from "vitest";
import {
  GENERATED_GLB_PATH_MARKER,
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import {
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "@/features/planner/open3d/catalog/modularCabinetV0";
import {
  buildModularCabinetV0GlbPlan,
  exportModularCabinetV0ToGeneratedAssetPath,
  modularCabinetV0GeneratedRelativePath,
} from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";

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

  it("buildModularCabinetV0GlbPlan is plan-only with mesh part metadata", () => {
    const plan = buildModularCabinetV0GlbPlan({ doorStyle: "none" });

    expect(plan.kind).toBe("modular-cabinet-v0");
    expect(plan.binaryExportStatus).toBe("plan-only");
    expect(plan.binaryExportNote).toMatch(/Binary GLB not written/i);
    expect(plan.partCount).toBe(1);
    expect(plan.parts).toHaveLength(1);
    expect(plan.parts[0]?.name).toBe("carcass");
    expect(plan.parts[0]?.sizeM.x).toBeCloseTo(0.6);
    expect(isSystemGeneratedGlbUrl(plan.relativePath)).toBe(true);
  });

  it("plan partCount tracks door styles (none | slab | pair)", () => {
    expect(buildModularCabinetV0GlbPlan({ doorStyle: "none" }).partCount).toBe(
      1,
    );
    expect(buildModularCabinetV0GlbPlan({ doorStyle: "slab" }).partCount).toBe(
      2,
    );
    const pair = buildModularCabinetV0GlbPlan({ doorStyle: "pair" });
    expect(pair.partCount).toBe(3);
    expect(pair.parts.map((p) => p.name)).toEqual([
      "carcass",
      "door-left",
      "door-right",
    ]);
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
