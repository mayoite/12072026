// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    readFileSync: vi.fn((file: fs.PathOrFileDescriptor, encoding?: unknown) => {
      const p = String(file);
      if (p.endsWith(".css")) {
        return "/* fixture */\n@import url('x.css');\n.block { color: red; }\n";
      }
      return actual.readFileSync(file, encoding as BufferEncoding);
    }),
  };
});

vi.mock("sharp", () => {
  const pipe = {
    flatten: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    clone: vi.fn().mockReturnThis(),
    png: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue(undefined),
  };
  const sharpFn = vi.fn(() => pipe);
  (sharpFn as unknown as { kernel: { lanczos3: string } }).kernel = {
    lanczos3: "lanczos3",
  };
  return { default: sharpFn };
});

vi.mock("@/lib/catalog/resolveBlockColors", () => ({
  resolveSvgForRaster: (svg: string) => svg,
}));

import {
  RASTER_BG,
  RASTER_DENSITY,
  loadBlockCss,
  rasterizeSvg,
  styleTag,
} from "@/scripts/blockRenderUtils";

describe("blockRenderUtils (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports raster constants", () => {
    expect(RASTER_BG).toBe("var(--color-white-150)");
    expect(RASTER_DENSITY).toBe(400);
  });

  it("wraps css in a CDATA style tag", () => {
    expect(styleTag(".x{color:red}")).toBe(
      "<style><![CDATA[.x{color:red}]]></style>",
    );
  });

  it("loads block css and strips @import rules", () => {
    const css = loadBlockCss();
    expect(css).toContain(".block { color: red; }");
    expect(css).not.toMatch(/^\s*@import\s+/m);
    expect(css.split(".block").length).toBeGreaterThan(5);
  });

  it("rasterizes svg to png via sharp", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "block-render-"));
    const png = path.join(tmp, "out.png");
    try {
      await rasterizeSvg(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"></svg>',
        png,
        200,
        ".x{}",
      );
      const sharp = (await import("sharp")).default as unknown as ReturnType<
        typeof vi.fn
      > & {
        mock: { results: Array<{ value: { toFile: ReturnType<typeof vi.fn> } }> };
      };
      expect(sharp).toHaveBeenCalled();
      const pipe = sharp.mock.results[0]?.value;
      expect(pipe?.toFile).toHaveBeenCalledWith(png);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
