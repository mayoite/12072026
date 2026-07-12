import { describe, expect, it } from "vitest";
import type { Open3dDisplayUnit } from "@/features/planner/project/model/types";
import {
  validateSketchToPlanRequest,
  executeSketchToPlan,
  cancelSketchToPlan,
  isSketchToPlanAvailable,
  estimateProcessingTime,
  SKETCH_TO_PLAN_API_ROUTE,
} from "@/features/planner/project/ai/sketchToPlan";

describe("sketchToPlan", () => {
  describe("validateSketchToPlanRequest", () => {
    it("accepts valid request with data URL", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors).toHaveLength(0);
    });

    it("rejects missing image data URL", () => {
      const request = { imageDataUrl: "" };
      const errors = validateSketchToPlanRequest(request);
      expect(errors).toContain("Image data URL is required");
    });

    it("rejects invalid data URL", () => {
      const request = { imageDataUrl: "not-a-data-url" };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("data URL"))).toBe(true);
    });

    it("rejects non-image data URL", () => {
      const request = { imageDataUrl: "data:text/plain;base64,SGVsbG8=" };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("image format"))).toBe(true);
    });

    it("accepts valid display unit", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        displayUnit: "cm" as const,
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors).toHaveLength(0);
    });

    it("rejects invalid display unit", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        displayUnit: "miles" as Open3dDisplayUnit,
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("Invalid display unit"))).toBe(true);
    });

    it("validates room count hint", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        hints: { roomCount: 25 },
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("Room count"))).toBe(true);
    });

    it("validates known dimensions hint", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        hints: { knownDimensions: { widthMm: -100, depthMm: 5000 } },
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("positive"))).toBe(true);
    });

    it("validates maximum known dimensions", () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        hints: { knownDimensions: { widthMm: 200000, depthMm: 5000 } },
      };
      const errors = validateSketchToPlanRequest(request);
      expect(errors.some((e) => e.includes("exceed maximum"))).toBe(true);
    });
  });

  describe("executeSketchToPlan", () => {
    it("returns failure for invalid request", async () => {
      const request = { imageDataUrl: "" };
      const result = await executeSketchToPlan(request);
      expect(result.success).toBe(false);
      expect(result.status).toBe("failed");
    });

    it("returns success for valid request", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
      const result = await executeSketchToPlan(request);
      expect(result.success).toBe(true);
      expect(result.status).toBe("completed");
      expect(result.project).toBeDefined();
      expect(result.floor).toBeDefined();
    });

    it("uses provided project name", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        projectName: "My Sketch",
      };
      const result = await executeSketchToPlan(request);
      expect(result.project?.name).toBe("My Sketch");
    });

    it("uses provided display unit", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        displayUnit: "cm" as const,
      };
      const result = await executeSketchToPlan(request);
      expect(result.project?.displayUnit).toBe("cm");
    });

    it("reports progress via callback", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
      const progressUpdates: Array<{ status: string; progressPercent: number }> = [];
      await executeSketchToPlan(request, (progress) => {
        progressUpdates.push({ status: progress.status, progressPercent: progress.progressPercent });
      });
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[0].status).toBe("pending");
      expect(progressUpdates[progressUpdates.length - 1].status).toBe("completed");
    });

    it("uses hints for known dimensions", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        hints: { knownDimensions: { widthMm: 10000, depthMm: 8000 } },
      };
      const result = await executeSketchToPlan(request);
      expect(result.success).toBe(true);
      // The placeholder project uses hints for room dimensions
      expect(result.project).toBeDefined();
    });

    it("returns processing time", async () => {
      const request = {
        imageDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
      const result = await executeSketchToPlan(request);
      expect(result.processingTimeMs).toBeDefined();
      expect(result.processingTimeMs).toBeGreaterThan(0);
    });
  });

  describe("cancelSketchToPlan", () => {
    it("returns cancelled status", () => {
      const result = cancelSketchToPlan();
      expect(result.status).toBe("cancelled");
      expect(result.success).toBe(false);
    });
  });

  describe("isSketchToPlanAvailable", () => {
    it("returns false (API not connected)", async () => {
      const available = await isSketchToPlanAvailable();
      expect(available).toBe(false);
    });
  });

  describe("estimateProcessingTime", () => {
    it("returns base time for small images", () => {
      const smallImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const time = estimateProcessingTime(smallImage);
      expect(time).toBeGreaterThanOrEqual(2000);
    });

    it("increases time for larger images", () => {
      const smallImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      // Create a larger base64 string by repeating
      const largeImage = smallImage.repeat(100);
      const smallTime = estimateProcessingTime(smallImage);
      const largeTime = estimateProcessingTime(largeImage);
      expect(largeTime).toBeGreaterThan(smallTime);
    });
  });

  describe("SKETCH_TO_PLAN_API_ROUTE", () => {
    it("returns correct API path", () => {
      expect(SKETCH_TO_PLAN_API_ROUTE).toBe("/api/planner/sketch-to-plan");
    });
  });
});