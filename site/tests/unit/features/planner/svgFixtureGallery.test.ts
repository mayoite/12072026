/**
 * PLAN-FAIL-018 â€” SVG fixture gallery behavioral coverage.
 */

import { describe, expect, it } from "vitest";
import { buildSvgFixtureGallery } from "@/features/planner/catalog/svg/svgFixtureGallery";

describe("SVG fixture gallery (PLAN-FAIL-018)", () => {
  it("renders themed fixtures with stable physical dimensions", () => {
    const gallery = buildSvgFixtureGallery();
    expect(gallery).toHaveLength(6);

    const byId = new Map(gallery.map((entry) => [entry.id, entry]));
    const chair = byId.get("chair-light-0");
    const desk = byId.get("desk-dark-90");
    const fallback = byId.get("fallback-missing-svg");

    expect(chair?.theme).toBe("light");
    expect(chair?.rotation).toBe(0);
    expect(chair?.widthMm).toBeGreaterThan(0);
    expect(chair?.svg).toContain("<svg");

    expect(desk?.theme).toBe("dark");
    expect(desk?.rotation).toBe(90);
    expect(desk?.viewBox.split(" ").length).toBe(4);

    expect(fallback?.theme).toBe("fallback");
    expect(fallback?.svg).toContain("Gallery Missing SVG");
  });

  it("covers categories, rotations, and themes used by visual review", () => {
    const gallery = buildSvgFixtureGallery();
    expect(new Set(gallery.map((entry) => entry.category))).toEqual(
      new Set(["Furniture", "Decor", "Symbols"]),
    );
    expect(new Set(gallery.map((entry) => entry.rotation))).toEqual(new Set([0, 90, 180, 270]));
    expect(new Set(gallery.map((entry) => entry.theme))).toEqual(
      new Set(["light", "dark", "selected", "print", "high-contrast", "fallback"]),
    );
  });
});
