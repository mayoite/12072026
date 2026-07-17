import { describe, expect, it } from "vitest";
import { shouldPlaceModularWithGeneratedGlb } from "@/features/planner/asset-engine/mesh/shouldPlaceModularWithGeneratedGlb";
import { MODULAR_CABINET_V0_CATALOG_ID } from "@/features/planner/catalog/placementAction";

describe("shouldPlaceModularWithGeneratedGlb", () => {
  it("is true for cabinet-v0 id", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: MODULAR_CABINET_V0_CATALOG_ID,
        slug: "other",
      }),
    ).toBe(true);
  });

  it("is true for cabinet-v0 slug when id differs", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "legacy-cab",
        slug: MODULAR_CABINET_V0_CATALOG_ID,
      }),
    ).toBe(true);
  });

  it("is true for demo catalog id+slug pair", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "cabinet-v0",
        slug: "cabinet-v0",
        geometryMode: "modular-cabinet-v0",
      }),
    ).toBe(true);
  });

  it("is false for other modular-looking geometry without cabinet-v0 id/slug", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "future-modular-shelf",
        slug: "shelf-v1",
        geometryMode: "modular-cabinet-v0",
      }),
    ).toBe(false);
  });

  it("is false for ordinary box catalog items", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "desk-basic",
        slug: "desk-basic",
        geometryMode: "box",
      }),
    ).toBe(false);
  });

  it("trims id/slug before match", () => {
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "  cabinet-v0  ",
        slug: "x",
      }),
    ).toBe(true);
    expect(
      shouldPlaceModularWithGeneratedGlb({
        id: "x",
        slug: "  cabinet-v0  ",
      }),
    ).toBe(true);
  });
});
