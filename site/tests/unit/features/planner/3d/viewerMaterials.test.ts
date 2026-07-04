import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  normalizeColor,
  resolveFurnitureKind,
  getFurnitureFinishes,
  getSharedMaterial,
  getTintedMaterial,
  _FOCSS_3D_COLORS,
  FURNITURE_FINISHES,
  SHARED_GEOMETRIES,
} from "@/features/planner/3d/viewerMaterials";

describe("viewerMaterials", () => {
  describe("normalizeColor", () => {
    it("returns color if valid and not a CSS variable", () => {
      expect(normalizeColor("#ff0000", "var(--color-black)")).toBe("#ff0000");
      expect(normalizeColor("red", "var(--color-black)")).toBe("red");
    });

    it("returns fallback if color is undefined, null, or a CSS variable", () => {
      expect(normalizeColor(undefined, "var(--color-black)")).toBe("var(--color-black)");
      expect(normalizeColor(null, "var(--color-black)")).toBe("var(--color-black)");
      expect(normalizeColor("var(--color-primary)", "var(--color-black)")).toBe("var(--color-black)");
    });
  });

  describe("resolveFurnitureKind", () => {
    it("resolves from labels using regex heuristics", () => {
      expect(resolveFurnitureKind("Boardroom Meeting Table")).toBe("meeting");
      expect(resolveFurnitureKind("Office task chair")).toBe("chair");
      expect(resolveFurnitureKind("Filing drawer cabinet")).toBe("storage");
      expect(resolveFurnitureKind("Privacy Desk Screen")).toBe("screen");
      expect(resolveFurnitureKind("Dual SH workstation")).toBe("bench");
      expect(resolveFurnitureKind("sharing workstation")).toBe("bench");
    });

    it("resolves from categories when label regex doesn't match", () => {
      expect(resolveFurnitureKind("", "storage")).toBe("storage");
      expect(resolveFurnitureKind("", "equipment")).toBe("equipment");
    });

    it("resolves wide/deep items as bench desks geometrically", () => {
      expect(
        resolveFurnitureKind("Simple workstation", "desks", 2, 1)
      ).toBe("bench");
      expect(
        resolveFurnitureKind("Simple panel", undefined, 2, 1)
      ).toBe("generic");
    });

    it("resolves desks", () => {
      expect(resolveFurnitureKind("Standard Desk", "desks")).toBe("desk");
      expect(resolveFurnitureKind("L-shaped table")).toBe("desk");
    });

    it("falls back to generic", () => {
      expect(resolveFurnitureKind("Unknown object")).toBe("generic");
    });
  });

  describe("getFurnitureFinishes", () => {
    it("returns the correct finish pair for a kind", () => {
      expect(getFurnitureFinishes("desk")).toEqual(FURNITURE_FINISHES.desk);
      expect(getFurnitureFinishes("chair")).toEqual(FURNITURE_FINISHES.chair);
    });
  });

  describe("getSharedMaterial & getTintedMaterial", () => {
    it("caches materials based on finish properties", () => {
      const finish = { color: "var(--color-white-500)", roughness: 0.5, metalness: 0.1 };
      const mat1 = getSharedMaterial(finish);
      const mat2 = getSharedMaterial(finish);

      expect(mat1).toBeInstanceOf(THREE.MeshStandardMaterial);
      expect(mat1.color.getHexString()).toBe("acbdd1");
      expect(mat1.roughness).toBe(0.5);
      expect(mat1.metalness).toBe(0.1);
      
      // Cache check
      expect(mat1).toBe(mat2);

      // Different opacity
      const transFinish = { ...finish, opacity: 0.5 };
      const transMat = getSharedMaterial(transFinish);
      expect(transMat).not.toBe(mat1);
      expect(transMat.transparent).toBe(true);
      expect(transMat.opacity).toBe(0.5);
      expect(transMat.depthWrite).toBe(false);
    });

    it("tints materials with override colors", () => {
      const finish = { color: "var(--color-white-50)", roughness: 0.5, metalness: 0.1 };
      
      // Undefined or var() overrides
      const defaultMat = getTintedMaterial(finish);
      expect(defaultMat.color.getHexString()).toBe("ffffff");

      const varMat = getTintedMaterial(finish, "var(--override)");
      expect(varMat).toBe(defaultMat);

      // Actual color override
      const tintedMat = getTintedMaterial(finish, "#ff0000");
      expect(tintedMat).not.toBe(defaultMat);
      expect(tintedMat.color.getHexString()).toBe("ff0000");
    });
  });

  describe("SHARED_GEOMETRIES", () => {
    it("exposes the static unit geometries", () => {
      expect(SHARED_GEOMETRIES.unitBox).toBeInstanceOf(THREE.BoxGeometry);
      expect(SHARED_GEOMETRIES.unitCylinder).toBeInstanceOf(THREE.CylinderGeometry);
      expect(SHARED_GEOMETRIES.unitPlane).toBeInstanceOf(THREE.PlaneGeometry);
    });
  });
});
