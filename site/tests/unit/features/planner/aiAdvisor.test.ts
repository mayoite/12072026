import { describe, expect, it } from "vitest";
import {
  DEFAULT_CATALOG_IDS,
  summarizeProjectState,
  validateAiProposal,
  createAiPrivacyNotice,
  formatDimensionWithUnit,
} from "@/features/planner/project/ai/aiAdvisor";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";
import type { AiProposal } from "@/features/planner/project/ai/aiAdvisor";
import type { PlannerDisplayUnit } from "@/features/planner/project/model/types";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

function room(): ReturnType<typeof createRectangularRoomProject> {
  return createRectangularRoomProject({
    idFactory: ids("floor", "project", "wall-1", "wall-2", "wall-3", "wall-4"),
    widthMm: 6000,
    depthMm: 4000,
    now: "2026-07-03T00:00:00.000Z",
  });
}

describe("aiAdvisor", () => {
  describe("summarizeProjectState", () => {
    it("summarizes a basic project", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      expect(summary.projectId).toBe("project");
      expect(summary.projectName).toBe("Untitled Project");
      expect(summary.displayUnit).toBe("mm");
      expect(summary.floors).toHaveLength(1);
      expect(summary.totalWalls).toBe(4);
      expect(summary.totalRooms).toBe(0);
    });

    it("includes selected item when provided", () => {
      const p = room();
      const summary = summarizeProjectState(p, "wall-1", "wall");
      expect(summary.selectedItemId).toBe("wall-1");
      expect(summary.selectedItemType).toBe("wall");
    });

    it("calculates wall dimensions correctly", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const wall = summary.floors[0].walls[0];
      // A 6000mm wall
      expect(wall.lengthMm).toBe(6000);
    });

    it("provides available catalog IDs", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      expect(summary.availableCatalogIds).toContain("chair-standard");
      expect(summary.availableCatalogIds).toContain("table-dining");
    });

    it("calculates floor bounds", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const bounds = summary.floors[0].bounds;
      expect(bounds.minX).toBe(0);
      expect(bounds.minY).toBe(0);
      expect(bounds.maxX).toBe(6000);
      expect(bounds.maxY).toBe(4000);
    });
  });

  describe("validateAiProposal", () => {
    it("accepts valid placement proposal", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 0.8,
        description: "Place a chair here",
        details: {
          catalogId: "chair-standard",
          position: { x: 1000, y: 1000 },
          rotation: 0,
        },
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects proposal with invalid confidence", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 1.5, // Invalid: > 1
        description: "Test",
        details: { catalogId: "chair-standard", position: { x: 0, y: 0 } },
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Confidence must be between 0 and 1");
    });

    it("rejects placement without catalogId", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 0.8,
        description: "Test",
        details: { position: { x: 0, y: 0 } }, // Missing catalogId
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Placement proposal must have a catalogId");
    });

    it("rejects placement without position", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 0.8,
        description: "Test",
        details: { catalogId: "chair-standard" }, // Missing position
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Placement proposal must have a position");
    });

    it("warns for unknown catalog ID", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 0.8,
        description: "Test",
        details: {
          catalogId: "unknown-item",
          position: { x: 0, y: 0 },
        },
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(true);
      expect(result.warnings.some((w) => w.includes("not in the default list"))).toBe(true);
    });

    it("rejects modification without target", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "modification",
        confidence: 0.8,
        description: "Test",
        details: {}, // Missing targetId and targetType
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Modification proposal must have a targetId");
      expect(result.errors).toContain("Modification proposal must have a targetType");
    });

    it("accepts valid summary proposal", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "summary",
        confidence: 0.9,
        description: "Project summary",
        details: {
          summary: "A 6m x 4m room",
          roomCount: 1,
          dimensions: "24mÂ²",
          furnitureCount: 0,
          recommendations: ["Consider adding more furniture"],
        },
        units: "mm",
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(true);
    });

    it("rejects invalid units", () => {
      const p = room();
      const summary = summarizeProjectState(p);
      const proposal: AiProposal = {
        id: "proposal-1",
        type: "placement",
        confidence: 0.8,
        description: "Test",
        details: { catalogId: "chair-standard", position: { x: 0, y: 0 } },
        units: "invalid" as PlannerDisplayUnit,
      };
      const result = validateAiProposal(proposal, summary);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe("Invalid units: invalid");
    });
  });

  describe("createAiPrivacyNotice", () => {
    it("returns privacy and retention notices", () => {
      const notice = createAiPrivacyNotice();
      expect(notice.privacy).toBeDefined();
      expect(notice.retention).toBeDefined();
      expect(notice.privacy.length).toBeGreaterThan(0);
      expect(notice.retention.length).toBeGreaterThan(0);
    });
  });

  describe("formatDimensionWithUnit", () => {
    it("formats millimeters correctly", () => {
      const result = formatDimensionWithUnit(1000, "mm");
      expect(result).toBe("1000.00 mm");
    });

    it("formats centimeters correctly", () => {
      const result = formatDimensionWithUnit(1000, "cm");
      expect(result).toBe("100.00 cm");
    });

    it("formats meters correctly", () => {
      const result = formatDimensionWithUnit(1000, "m");
      expect(result).toBe("1.00 m");
    });

    it("formats inches correctly", () => {
      const result = formatDimensionWithUnit(25400, "in"); // ~1000mm = ~39.37in
      expect(result).toContain("in");
    });

    it("formats feet-inches correctly", () => {
      const result = formatDimensionWithUnit(1676.4, "ft-in"); // ~66 inches = 5' 6"
      expect(result).toContain("'");
      expect(result).toContain('"');
    });
  });

  describe("DEFAULT_CATALOG_IDS", () => {
    it("contains expected catalog items", () => {
      expect(DEFAULT_CATALOG_IDS).toContain("chair-standard");
      expect(DEFAULT_CATALOG_IDS).toContain("table-dining");
      expect(DEFAULT_CATALOG_IDS).toContain("bed-single");
      expect(DEFAULT_CATALOG_IDS).toContain("bed-double");
    });

    it("has reasonable number of items", () => {
      expect(DEFAULT_CATALOG_IDS.length).toBeGreaterThanOrEqual(10);
    });
  });
});