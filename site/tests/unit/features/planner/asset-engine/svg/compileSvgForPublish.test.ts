import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  compileSvgForPublish,
  PUBLISH_COMPILE_AUTHORITY,
} from "@/features/planner/asset-engine/svg/compileSvgForPublish";

// tests/unit/features/planner/asset-engine/svg → site/
const siteRoot = path.resolve(__dirname, "../../../../../../");

/** Absolute Y samples from Maker-style absolute M/L path data. */
function absoluteYsFromPathD(dPath: string): number[] {
  const tokens = dPath.match(/[MmLlHhVvZzAa]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  const ys: number[] = [];
  let i = 0;
  let cmd = "";
  let penY = 0;

  while (i < tokens.length) {
    const token = tokens[i]!;
    if (/^[MmLlHhVvZzAa]$/i.test(token) && Number.isNaN(Number(token))) {
      cmd = token;
      i += 1;
      if (cmd === "Z" || cmd === "z") continue;
      continue;
    }

    const value = Number(token);
    if (!Number.isFinite(value)) {
      i += 1;
      continue;
    }

    switch (cmd) {
      case "M":
      case "L": {
        i += 1;
        const y = Number(tokens[i]);
        if (Number.isFinite(y)) {
          penY = y;
          ys.push(y);
        }
        if (cmd === "M") cmd = "L";
        break;
      }
      case "m":
      case "l": {
        i += 1;
        const dy = Number(tokens[i]);
        if (Number.isFinite(dy)) {
          penY += dy;
          ys.push(penY);
        }
        if (cmd === "m") cmd = "l";
        break;
      }
      case "V":
        penY = value;
        ys.push(penY);
        break;
      case "v":
        penY += value;
        ys.push(penY);
        break;
      case "H":
      case "h":
        break;
      case "A":
      case "a": {
        const y = Number(tokens[i + 6]);
        if (Number.isFinite(y)) {
          penY = cmd === "A" ? y : penY + y;
          ys.push(penY);
        }
        i += 6;
        break;
      }
      default:
        break;
    }
    i += 1;
  }
  return ys;
}

function pathDAttrs(svg: string): string[] {
  const out: string[] = [];
  const re = /\bd="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg)) !== null) {
    if (m[1]) out.push(m[1]);
  }
  return out;
}

describe("compileSvgForPublish", () => {
  it("exports publish authority tag", () => {
    expect(PUBLISH_COMPILE_AUTHORITY).toBe("pipelineCore+normalize");
  });

  it("compiles admin descriptor without disk I/O", async () => {
    // Fixture-only: brand seed no longer keeps OFL side-table in inventory/.
    const adminPath = path.join(
      siteRoot,
      "scripts",
      "generate-svg",
      "_fixtures",
      "side-table.json",
    );
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.svg).toContain("<svg");
    expect(result.stages.length).toBeGreaterThan(0);
  });

  /**
   * W3 hard regression: maker linear-desk 1600 publish compile has no negative Y
   * and path bbox fits viewBox height (depthMm).
   */
  it("linear-desk 1600 maker path: no negative Y, bbox fits viewBox depth", async () => {
    const widthMm = 1600;
    const depthMm = 800;
    const raw = {
      schemaVersion: "2026-07-04.v2",
      id: "test-desk-linear-1600-w3",
      slug: "desk-linear-1600-w3-test",
      geometry: { widthMm, depthMm, heightMm: 750 },
      viewBox: { x: 0, y: 0, width: widthMm, height: depthMm },
      maker: {
        recipe: "linear-desk",
        widthMm,
        depthMm,
        topThicknessMm: 80,
      },
      variant: "fixed",
      fixed: { sizingType: "fixed" },
    };

    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);

    expect(result.stages).toContain("svg-s2-maker-compile");
    expect(result.svg).toMatch(/viewBox="0 0 1600 800"/);
    expect(result.svg).not.toMatch(/L\s+0\s+-/);
    expect(result.svg).not.toMatch(/[ML]\s+[-\d.]+\s+-/);

    const dAttrs = pathDAttrs(result.svg);
    expect(dAttrs.length).toBeGreaterThanOrEqual(3);

    for (const d of dAttrs) {
      const ys = absoluteYsFromPathD(d);
      expect(ys.length).toBeGreaterThan(0);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      expect(minY).toBeGreaterThanOrEqual(0);
      expect(maxY).toBeLessThanOrEqual(depthMm);
    }
  });

  it("committed oando-fluid-desk-1600.svg has no negative-Y line-to patterns", () => {
    const svgPath = path.join(
      siteRoot,
      "public",
      "svg-catalog",
      "oando-fluid-desk-1600.svg",
    );
    expect(existsSync(svgPath)).toBe(true);
    const svg = readFileSync(svgPath, "utf8");
    expect(svg).toMatch(/viewBox="0 0 1600 800"/);
    expect(svg).not.toMatch(/L\s+0\s+-/);
    expect(svg).not.toMatch(/[ML]\s+[-\d.]+\s+-/);

    const dAttrs = pathDAttrs(svg);
    expect(dAttrs.length).toBeGreaterThanOrEqual(1);
    for (const d of dAttrs) {
      const ys = absoluteYsFromPathD(d);
      expect(ys.length).toBeGreaterThan(0);
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...ys)).toBeLessThanOrEqual(800);
    }
  });
});
