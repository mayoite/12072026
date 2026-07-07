import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  DEFAULT_IMAGE_LIMITS,
  validateImageFile,
  loadImageFile,
  createBackgroundImage,
  importImageAsBackground,
} from "@/features/planner/open3d/lib/imageImport";

describe("imageImport", () => {
  describe("validateImageFile", () => {
    it("accepts valid JPEG", () => {
      const file = new File([""], "test.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("accepts valid PNG", () => {
      const file = new File([""], "test.png", { type: "image/png" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("accepts valid WebP", () => {
      const file = new File([""], "test.webp", { type: "image/webp" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("accepts valid GIF", () => {
      const file = new File([""], "test.gif", { type: "image/gif" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("rejects unsupported file types", () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Unsupported file type");
    });

    it("rejects files exceeding size limit", () => {
      const largeContent = "x".repeat(DEFAULT_IMAGE_LIMITS.maxFileSizeBytes + 1);
      const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("File too large");
    });

    it("accepts files within size limit", () => {
      const smallContent = new Array(1024).join("x"); // ~1KB
      const file = new File([smallContent], "small.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("uses custom limits when provided", () => {
      const customLimits = { maxFileSizeBytes: 3, maxWidthPx: 100, maxHeightPx: 100 };
      const file = new File(["xxxxx"], "test.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file, customLimits);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("too large");
    });
  });

  describe("loadImageFile", () => {
    beforeEach(() => {
      // Mock Image constructor
      vi.stubGlobal("Image", vi.fn().mockImplementation(() => ({
        onload: null,
        onerror: null,
        src: "",
      })));
    });

    it("returns error for invalid file type", async () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const result = await loadImageFile(file);
      expect(result.image).toBeNull();
      expect(result.error).toContain("Unsupported file type");
    });

    it("returns error for file exceeding size", async () => {
      const largeContent = "x".repeat(DEFAULT_IMAGE_LIMITS.maxFileSizeBytes + 1);
      const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
      const result = await loadImageFile(file);
      expect(result.image).toBeNull();
      expect(result.error).toContain("too large");
    });
  });

  describe("createBackgroundImage", () => {
    it("creates background image with defaults", () => {
      const image = {
        dataUrl: "data:image/jpeg;base64,/test",
        width: 100,
        height: 100,
        mimeType: "image/jpeg",
        fileName: "test.jpg",
        fileSize: 1000,
      };
      const bg = createBackgroundImage({ image });
      expect(bg.dataUrl).toBe(image.dataUrl);
      expect(bg.position).toEqual({ x: 0, y: 0 });
      expect(bg.scale).toBe(1);
      expect(bg.opacity).toBe(1);
      expect(bg.rotation).toBe(0);
      expect(bg.locked).toBe(false);
    });

    it("creates background image with custom options", () => {
      const image = {
        dataUrl: "data:image/jpeg;base64,/test",
        width: 100,
        height: 100,
        mimeType: "image/jpeg",
        fileName: "test.jpg",
        fileSize: 1000,
      };
      const bg = createBackgroundImage({
        image,
        position: { x: 100, y: 200 },
        scale: 2,
        opacity: 0.5,
        rotation: 90,
        locked: true,
      });
      expect(bg.position).toEqual({ x: 100, y: 200 });
      expect(bg.scale).toBe(2);
      expect(bg.opacity).toBe(0.5);
      expect(bg.rotation).toBe(90);
      expect(bg.locked).toBe(true);
    });
  });

  describe("importImageAsBackground", () => {
    it("returns error for unsupported file type", async () => {
      const file = new File([""], "test.pdf", { type: "application/pdf" });
      const result = await importImageAsBackground(file);
      expect(result.backgroundImage).toBeNull();
      expect(result.error).toContain("Unsupported file type");
    });
  });
});