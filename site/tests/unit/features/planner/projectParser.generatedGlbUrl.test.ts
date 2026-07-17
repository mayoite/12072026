/**
 * projectParser furniture.generatedGlbUrl accept/reject via glbAssetPolicy.
 * Accept: catalog-assets/generated/* and blob: previews.
 * Reject: designer/CDN static GLB and query/hash marker spoofing.
 */

import { describe, expect, it } from "vitest";
import { parsePlannerProject } from "@/features/planner/shared/document/projectParser";
import type { PlannerProject } from "@/features/planner/model/types";

function baseProject(): PlannerProject {
  return {
    id: "project-glb-url",
    name: "generatedGlbUrl parser",
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z",
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        level: 0,
        walls: [],
        rooms: [],
        doors: [],
        windows: [],
        furniture: [
          {
            id: "furn-1",
            catalogId: "cabinet-v0",
            position: { x: 100, y: 200 },
            rotation: 0,
            scale: { x: 1, y: 1, z: 1 },
          },
        ],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
  };
}

function rawWithGeneratedGlbUrl(url: string): unknown {
  const raw = JSON.parse(JSON.stringify(baseProject())) as {
    floors: Array<{ furniture: Array<Record<string, unknown>> }>;
  };
  raw.floors[0]!.furniture[0]!.generatedGlbUrl = url;
  return raw;
}

describe("projectParser furniture.generatedGlbUrl accept", () => {
  it.each([
    {
      name: "relative catalog-assets/generated path",
      url: "catalog-assets/generated/modular/cab-v0.glb",
    },
    {
      name: "leading-slash catalog-assets/generated path",
      url: "/catalog-assets/generated/modular/cab-v0.glb",
    },
    {
      name: "absolute URL under catalog-assets/generated",
      url: "https://cdn.example/storage/v1/object/public/catalog-assets/generated/x.glb",
    },
    {
      name: "blob: preview URL",
      url: "blob:http://localhost/abc-123",
    },
  ] as const)("accepts $name", ({ url }) => {
    const parsed = parsePlannerProject(rawWithGeneratedGlbUrl(url));
    expect(parsed.floors[0]?.furniture[0]?.generatedGlbUrl).toBe(url);
  });

  it("round-trips previewImageUrl on furniture (S7 SVG persist)", () => {
    const raw = JSON.parse(JSON.stringify(baseProject())) as {
      floors: Array<{ furniture: Array<Record<string, unknown>> }>;
    };
    raw.floors[0]!.furniture[0]!.previewImageUrl =
      "/svg-catalog/chaise-lounge-001.svg";

    const parsed = parsePlannerProject(raw);
    expect(parsed.floors[0]?.furniture[0]?.previewImageUrl).toBe(
      "/svg-catalog/chaise-lounge-001.svg",
    );
  });

  it("omits generatedGlbUrl when field is absent", () => {
    const parsed = parsePlannerProject(baseProject());
    expect(parsed.floors[0]?.furniture[0]?.generatedGlbUrl).toBeUndefined();
    expect(
      Object.prototype.hasOwnProperty.call(
        parsed.floors[0]?.furniture[0] ?? {},
        "generatedGlbUrl",
      ),
    ).toBe(false);
  });
});

describe("projectParser furniture.generatedGlbUrl reject", () => {
  it.each([
    {
      name: "CDN designer static GLB",
      url: "https://cdn.example.com/models/sofa-hero.glb",
    },
    {
      name: "relative designer path without generated marker",
      url: "models/static/chair.glb",
    },
    {
      name: "query-string spoof of catalog-assets/generated marker",
      url: "https://evil.example/models/x.glb?catalog-assets/generated/",
    },
    {
      name: "hash spoof of catalog-assets/generated marker",
      url: "https://evil.example/models/x.glb#catalog-assets/generated/",
    },
    {
      name: "path segment lookalike without generated/",
      url: "catalog-assets/static/not-generated.glb",
    },
  ] as const)("rejects $name", ({ url }) => {
    expect(() => parsePlannerProject(rawWithGeneratedGlbUrl(url))).toThrow(
      /not allowed|Static designer/i,
    );
  });
});
