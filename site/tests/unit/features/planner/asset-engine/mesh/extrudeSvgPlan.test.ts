import { describe, expect, it } from "vitest";
import {
  GENERATED_GLB_PATH_MARKER,
  isSystemGeneratedGlbUrl,
  rejectDesignerStaticGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import {
  DEFAULT_EXTRUDE_MATERIAL_COLOR,
  DEFAULT_EXTRUDE_THICKNESS_MM,
  buildExtrudeSvgPartPlans,
  buildExtrudeSvgPlan,
  buildExtrudeSvgPlanFromPath,
  buildExtrudeSvgPlanFromRect,
  exportExtrudeSvgToGeneratedAssetPath,
  extrudeSvgFingerprint,
  extrudeSvgGeneratedRelativePath,
  extrudeSvgGeneratedSlug,
  simpleRectPathD,
} from "@/features/planner/asset-engine/mesh/extrudeSvgPlan";

describe("extrudeSvgPlan — plan-only, policy-safe (P1 skeleton)", () => {
  it("exportExtrudeSvgToGeneratedAssetPath returns path under catalog-assets/generated/", () => {
    const result = exportExtrudeSvgToGeneratedAssetPath({
      profile: { kind: "rect", widthMm: 800, heightMm: 400 },
      thicknessMm: 30,
      materialColor: "#aabbcc",
    });

    expect(result.relativePath).toContain(GENERATED_GLB_PATH_MARKER);
    expect(result.relativePath.startsWith(GENERATED_GLB_PATH_MARKER)).toBe(
      true,
    );
    expect(result.relativePath.endsWith(".glb")).toBe(true);
    expect(result.relativePath).toBe(
      extrudeSvgGeneratedRelativePath({
        profile: { kind: "rect", widthMm: 800, heightMm: 400 },
        thicknessMm: 30,
        materialColor: "#aabbcc",
      }),
    );
    expect(result.partCount).toBe(1);
    expect(result.thicknessMm).toBe(30);
    expect(result.materialColor).toBe("#aabbcc");
  });

  it("generated relative path is allowed by glbAssetPolicy", () => {
    const result = exportExtrudeSvgToGeneratedAssetPath({
      profile: { kind: "path", svgPath: "M 0 0 H 100 V 50 H 0 Z" },
      thicknessMm: 18,
      materialColor: "#ffffff",
    });

    expect(isSystemGeneratedGlbUrl(result.relativePath)).toBe(true);
    expect(rejectDesignerStaticGlbUrl(result.relativePath)).toBeNull();

    const cdnUrl = `https://cdn.example/storage/v1/object/public/${result.relativePath}`;
    expect(isSystemGeneratedGlbUrl(cdnUrl)).toBe(true);
    expect(rejectDesignerStaticGlbUrl(cdnUrl)).toBeNull();
  });

  it("buildExtrudeSvgPlan is plan-only with rect part metadata", () => {
    const plan = buildExtrudeSvgPlanFromRect(600, 300, {
      thicknessMm: 40,
      materialColor: "#112233",
    });

    expect(plan.kind).toBe("extrude-svg");
    expect(plan.binaryExportStatus).toBe("plan-only");
    expect(plan.binaryExportNote).toMatch(
      /metadata only|GlbExtruderPreview/i,
    );
    expect(plan.partCount).toBe(1);
    expect(plan.parts).toHaveLength(1);
    expect(plan.parts[0]?.name).toBe("extruded-rect");
    expect(plan.parts[0]?.profileKind).toBe("rect");
    expect(plan.parts[0]?.sizeMm).toEqual({ x: 600, y: 300, z: 40 });
    expect(plan.thicknessMm).toBe(40);
    expect(plan.materialColor).toBe("#112233");
    expect(isSystemGeneratedGlbUrl(plan.relativePath)).toBe(true);
  });

  it("buildExtrudeSvgPlanFromPath accepts path d and full SVG string", () => {
    const pathD = "M 10 10 L 110 10 L 110 60 L 10 60 Z";
    const fromPath = buildExtrudeSvgPlanFromPath(pathD, {
      thicknessMm: 25,
      materialColor: "#ff0000",
    });

    expect(fromPath.profile.kind).toBe("path");
    expect(fromPath.parts[0]?.name).toBe("extruded-path");
    expect(fromPath.parts[0]?.pathMeta?.charLength).toBe(pathD.length);
    expect(fromPath.parts[0]?.pathMeta?.fingerprint).toBe(
      extrudeSvgFingerprint(pathD),
    );
    expect(fromPath.relativePath).toContain("extrude-svg");
    expect(fromPath.relativePath.startsWith(GENERATED_GLB_PATH_MARKER)).toBe(
      true,
    );

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathD}"/></svg>`;
    const fromSvg = buildExtrudeSvgPlanFromPath(fullSvg, { thicknessMm: 25 });
    expect(fromSvg.parts[0]?.pathMeta?.fingerprint).toBe(
      extrudeSvgFingerprint(fullSvg),
    );
    // Different source strings → different slugs (deterministic).
    expect(fromSvg.relativePath).not.toBe(fromPath.relativePath);
  });

  it("defaults match GlbExtruderPreview (30mm, #ffffff)", () => {
    const plan = buildExtrudeSvgPlan({
      profile: { kind: "rect", widthMm: 100, heightMm: 50 },
    });
    expect(plan.thicknessMm).toBe(DEFAULT_EXTRUDE_THICKNESS_MM);
    expect(plan.materialColor).toBe(DEFAULT_EXTRUDE_MATERIAL_COLOR);
    expect(DEFAULT_EXTRUDE_THICKNESS_MM).toBe(30);
    expect(DEFAULT_EXTRUDE_MATERIAL_COLOR).toBe("#ffffff");
  });

  it("simpleRectPathD builds a closed path; slug is stable", () => {
    const d = simpleRectPathD(200, 100);
    expect(d).toMatch(/^M /);
    expect(d.endsWith("Z")).toBe(true);

    const input = {
      profile: { kind: "path" as const, svgPath: d },
      thicknessMm: 30,
      materialColor: "#fff",
    };
    expect(extrudeSvgGeneratedSlug(input)).toBe(extrudeSvgGeneratedSlug(input));
    expect(extrudeSvgGeneratedRelativePath(input)).toBe(
      `${GENERATED_GLB_PATH_MARKER}${extrudeSvgGeneratedSlug(input)}.glb`,
    );
  });

  it("optional id influences slug; part plans stay length 1", () => {
    const withId = buildExtrudeSvgPlan({
      profile: { kind: "rect", widthMm: 10, heightMm: 20 },
      id: "Counter Top/A",
      materialColor: "#00ff00",
    });
    expect(withId.relativePath).toMatch(/counter-top-a/i);
    expect(buildExtrudeSvgPartPlans({
      profile: { kind: "path", svgPath: "M0 0H1V1H0Z" },
    })).toHaveLength(1);
  });

  it("rejects empty path and non-positive rect; does not use designer static paths", () => {
    expect(() =>
      buildExtrudeSvgPlan({ profile: { kind: "path", svgPath: "  " } }),
    ).toThrow(/non-empty/i);
    expect(() =>
      buildExtrudeSvgPlan({
        profile: { kind: "rect", widthMm: 0, heightMm: 10 },
      }),
    ).toThrow(/> 0/i);

    const result = exportExtrudeSvgToGeneratedAssetPath({
      profile: { kind: "rect", widthMm: 50, heightMm: 50 },
    });
    expect(result.relativePath).not.toMatch(/\/models\//);
    expect(result.relativePath).not.toMatch(/designer/i);
    expect(
      rejectDesignerStaticGlbUrl("https://cdn.example.com/models/sofa.glb"),
    ).toMatch(/not allowed/i);
  });
});
