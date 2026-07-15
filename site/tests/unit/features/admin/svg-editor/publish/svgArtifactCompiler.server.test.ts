import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@resvg/resvg-js", () => ({
  Resvg: class {
    constructor(_svg: string, _opts: unknown) {}
    render() {
      return {
        asPng: () => Buffer.from("png"),
      };
    }
  },
}));

vi.mock("@/features/planner/project/catalog/svg/svgCompiler.server", () => ({
  compileSvgBlockV1: vi.fn(() => ({
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>',
    checksum: "abc",
    diagnostics: [],
  })),
}));

vi.mock("@/features/planner/project/catalog/svg/svgPreviewAssets", () => ({
  SVG_RASTER_MASTER_WIDTH: 10,
  SVG_THUMBNAIL_WIDTHS: [10],
}));

describe("compileSvgArtifacts", () => {
  it("returns png derivatives from compile pipeline", async () => {
    const { compileSvgArtifacts } = await import(
      "@/features/admin/svg-editor/publish/svgArtifactCompiler.server"
    );
    const result = await compileSvgArtifacts({ typeId: "x" });
    expect(result.svg).toMatch(/<svg/);
    expect(Buffer.isBuffer(result.png)).toBe(true);
    expect(result.pngChecksum).toBeTruthy();
    expect(result.thumbnails.length).toBeGreaterThan(0);
  });
});
