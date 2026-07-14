// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const writes: Array<{ file: string; body: string }> = [];

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn((file: string, body: string | NodeJS.ArrayBufferView) => {
      writes.push({ file: String(file), body: String(body) });
    }),
    // keep readFileSync real so CSS inlining works
  };
});

const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

describe("catalog-preview (name-mirror)", () => {
  beforeEach(() => {
    writes.length = 0;
    vi.clearAllMocks();
    logSpy.mockClear();
  });

  it("renders sample blocks into a catalog preview SVG sheet", async () => {
    vi.resetModules();
    await import("@/scripts/catalog-preview");

    await vi.waitFor(() => {
      expect(
        writes.some((w) => w.file.includes("10-BLOCKS-CATALOG-PREVIEW.svg")),
      ).toBe(true);
    });

    const svgWrite = writes.find((w) =>
      w.file.replace(/\\/g, "/").includes("10-BLOCKS-CATALOG-PREVIEW.svg"),
    );
    expect(svgWrite).toBeDefined();
    expect(svgWrite!.body).toContain("<svg");
    expect(svgWrite!.body).toContain("</svg>");
    // sample product labels from the script
    expect(svgWrite!.body.length).toBeGreaterThan(200);
    expect(logSpy).toHaveBeenCalled();
    const logLine = logSpy.mock.calls.map((c) => c.join(" ")).join(" ");
    expect(logLine).toMatch(/Wrote/i);
    expect(logLine).toMatch(/blocks/i);
  });
});
