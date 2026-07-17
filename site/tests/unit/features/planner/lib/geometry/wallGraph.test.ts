import { describe, expect, it } from "vitest";

import {
  buildWallGraph,
  findEnclosedRooms,
  findJunctions,
} from "@/features/planner/lib/geometry/wallGraph";
import { WALL_JOIN_EPSILON_MM } from "@/features/planner/model/wallContract";

describe("wallGraph", () => {
  it("merges centreline endpoints within the product join epsilon", () => {
    const graph = buildWallGraph([
      { id: "w1", start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      {
        id: "w2",
        start: { x: 4000 + WALL_JOIN_EPSILON_MM * 0.5, y: 0 },
        end: { x: 4000, y: 3000 },
      },
    ]);
    expect(graph.nodes.size).toBe(3);
    expect(graph.edges.get("w1")?.wallId).toBe("w1");
    expect(graph.edges.get("w2")?.wallId).toBe("w2");
  });

  it("finds an enclosed room with wall ids for a closed rectangle", () => {
    const walls = [
      { id: "a", start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      { id: "b", start: { x: 4000, y: 0 }, end: { x: 4000, y: 3000 } },
      { id: "c", start: { x: 4000, y: 3000 }, end: { x: 0, y: 3000 } },
      { id: "d", start: { x: 0, y: 3000 }, end: { x: 0, y: 0 } },
    ];
    const rooms = findEnclosedRooms(buildWallGraph(walls));
    expect(rooms.length).toBeGreaterThan(0);
    const room = rooms[0]!;
    expect(room.wallIds.sort()).toEqual(["a", "b", "c", "d"]);
    expect(room.areaMm2).toBeCloseTo(12_000_000, -2);
  });

  it("reports junctions where degree exceeds 2", () => {
    const junctions = findJunctions(
      buildWallGraph([
        { id: "h1", start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
        { id: "v1", start: { x: 0, y: 0 }, end: { x: 0, y: 2000 } },
        { id: "h2", start: { x: 0, y: 0 }, end: { x: -2000, y: 0 } },
      ]),
    );
    expect(junctions).toEqual([{ x: 0, y: 0 }]);
  });
});
