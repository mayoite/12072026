import { describe, expect, it } from "vitest";

import {
  createBlockColorResolver,
  resolveSvgForRaster,
} from "@/lib/catalog/resolveBlockColors";

describe("resolve block colors", () => {
  it("resolves CSS variable tokens to concrete colors", () => {
    const resolve = createBlockColorResolver();
    expect(resolve("var(--block-surface)")).toBe("var(--color-ecru-300)");
    expect(resolve("var(--color-dark-midnight-blue-650)")).toBe("var(--color-dark-midnight-blue-650)");
    expect(resolve("var(--shadow-tint-pdp-22)")).toBe("var(--shadow-tint-pdp-22)");
    expect(resolve(undefined)).toBe("none");
    expect(resolve("none")).toBe("none");
  });

  it("overrides tokens from provided CSS and follows var chains", () => {
    const css = `
      :root {
        --block-surface: var(--custom-surface, var(--color-ocean-boat-blue-250));
        --custom-surface: var(--color-ecru-200);
      }
    `;
    const resolve = createBlockColorResolver(css);
    expect(resolve("var(--block-surface)")).toBe("var(--color-ecru-200)");
  });

  it("inlines variables for raster export", () => {
    const css = ":root { --block-seat: var(--color-dark-midnight-blue-850); }";
    const svg = '<rect fill="var(--block-seat)" stroke="var(--block-unknown, var(--color-ecru-950))"/>';
    const resolved = resolveSvgForRaster(svg, css);
    expect(resolved).toContain('fill="var(--color-dark-midnight-blue-850)"');
    expect(resolved).toContain('stroke="var(--color-ecru-950)"');
    expect(resolved).not.toContain("var(--block-seat)");
  });

  it("replaces unsupported color-mix declarations", () => {
    const resolved = resolveSvgForRaster(
      '<rect fill="color-mix(in srgb, white 50%, black)"/>',
      "",
    );
    expect(resolved).toContain('fill="var(--color-ecru-200)"');
  });

  it("stops resolving deeply nested var chains", () => {
    let css = ":root {";
    for (let i = 0; i < 30; i += 1) {
      css += `--level-${i}: var(--level-${i + 1}, var(--color-black));`;
    }
    css += "--level-30: var(--color-dark-midnight-blue-950); }";

    const resolve = createBlockColorResolver(css);
    const resolved = resolve("var(--level-0)");
    expect(resolved).toContain("var(--color-black)");
    expect(resolved.length).toBeLessThan(80);
  });
});