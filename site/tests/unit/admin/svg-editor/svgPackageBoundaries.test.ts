import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SVG package boundaries", () => {
  it("keeps planner browser adapter free of admin and server runtime packages", () => {
    const source = readFileSync(path.resolve(process.cwd(), "features/planner/admin/svg-editor/plannerSvgAdapter.ts"), "utf8");
    expect(source).not.toMatch(/@svgdotjs|dompurify|svgo|jsdom|@resvg|sharp/);
  });

  it("marks compiler and authoritative sanitizer server-only", () => {
    for (const file of ["svgCompiler.server.ts", "svgServerSanitizer.ts"]) {
      const source = readFileSync(path.resolve(process.cwd(), "features/planner/open3d/catalog/svg", file), "utf8");
      expect(source).toMatch(/^import "server-only";/);
    }
  });

  it("marks raster and persistence modules server-only", () => {
    for (const file of ["svgArtifactCompiler.server.ts", "svgRevisionRepository.server.ts"]) {
      const source = readFileSync(path.resolve(process.cwd(), "features/planner/admin/svg-editor", file), "utf8");
      expect(source).toMatch(/^import "server-only";/);
    }
  });
});
