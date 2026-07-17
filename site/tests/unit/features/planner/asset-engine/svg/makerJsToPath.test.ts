import { describe, expect, it } from "vitest";
import {
  compileMakerRecipeToPath,
  compileMakerRecipeToPaths,
} from "@/features/planner/asset-engine/svg/makerJsToPath";

/**
 * Collect absolute Y coordinates from Maker-style path data (M/L/H/V absolute).
 * Enough for rectilinear desk recipes.
 */
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
      if (cmd === "Z" || cmd === "z") {
        continue;
      }
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
        // Implicit line-to after first M pair.
        if (cmd === "M") {
          cmd = "L";
        }
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
        if (cmd === "m") {
          cmd = "l";
        }
        break;
      }
      case "V": {
        penY = value;
        ys.push(penY);
        break;
      }
      case "v": {
        penY += value;
        ys.push(penY);
        break;
      }
      case "H":
      case "h":
        break;
      case "A":
      case "a": {
        // A rx ry x-axis-rotation large-arc sweep x y
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

function yBBox(dPath: string): { minY: number; maxY: number } {
  const ys = absoluteYsFromPathD(dPath);
  expect(ys.length).toBeGreaterThan(0);
  return {
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

describe("makerJsToPath", () => {
  it("exports non-empty SVG path data for linear desk", () => {
    const { dPath, viewBox } = compileMakerRecipeToPath({
      recipe: "linear-desk",
      widthMm: 900,
      depthMm: 600,
    });
    expect(dPath.length).toBeGreaterThan(5);
    expect(viewBox.width).toBe(900);
  });

  it("exports multipath parts", () => {
    const { parts } = compileMakerRecipeToPaths({
      recipe: "linear-desk",
      widthMm: 1200,
      depthMm: 600,
    });
    expect(parts.length).toBeGreaterThanOrEqual(3);
    expect(parts.map((p) => p.id)).toEqual(
      expect.arrayContaining(["desk-top", "desk-body", "desk-knee-space"]),
    );
  });

  it("compiles L-desk path", () => {
    const { dPath } = compileMakerRecipeToPath({
      recipe: "l-desk",
      widthMm: 1200,
      depthMm: 600,
      returnWidthMm: 500,
    });
    expect(dPath.length).toBeGreaterThan(5);
  });

  it("linear-desk path Y fits viewBox plan Y-down (no negative Y)", () => {
    const depthMm = 600;
    const recipe = {
      recipe: "linear-desk" as const,
      widthMm: 1200,
      depthMm,
      topThicknessMm: 80,
    };
    const { parts, viewBox } = compileMakerRecipeToPaths(recipe);
    const { dPath } = compileMakerRecipeToPath(recipe);

    expect(viewBox).toEqual({ x: 0, y: 0, width: 1200, height: depthMm });
    expect(parts.length).toBeGreaterThanOrEqual(3);

    for (const part of parts) {
      const { minY, maxY } = yBBox(part.dPath);
      expect(minY, `${part.id} minY`).toBeGreaterThanOrEqual(0);
      expect(maxY, `${part.id} maxY`).toBeLessThanOrEqual(depthMm);
      for (const y of absoluteYsFromPathD(part.dPath)) {
        expect(y, `${part.id} y=${y}`).toBeGreaterThanOrEqual(0);
      }
    }

    const joined = yBBox(dPath);
    expect(joined.minY).toBeGreaterThanOrEqual(0);
    expect(joined.maxY).toBeLessThanOrEqual(depthMm);
  });

  it("l-desk path Y fits viewBox plan Y-down (no negative Y)", () => {
    const depthMm = 600;
    const { dPath, viewBox } = compileMakerRecipeToPath({
      recipe: "l-desk",
      widthMm: 1200,
      depthMm,
      returnWidthMm: 500,
    });
    const height = viewBox.height;
    expect(height).toBe(depthMm + depthMm);

    const { minY, maxY } = yBBox(dPath);
    expect(minY).toBeGreaterThanOrEqual(0);
    expect(maxY).toBeLessThanOrEqual(height);
  });
});
