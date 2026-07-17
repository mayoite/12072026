import type { Point2D, Polygon } from "./types";
import { WALL_JOIN_EPSILON_MM } from "@/features/planner/model/wallContract";

/** A node in the wall graph (junction or endpoint) */
export interface WallNode {
  id: string;
  position: Point2D;
  edges: string[]; // edge IDs
}

/** An edge in the wall graph (a wall centreline segment) */
export interface WallEdge {
  id: string;
  /** Document wall id when provided; otherwise a synthetic edge id. */
  wallId: string;
  startNodeId: string;
  endNodeId: string;
}

/** The wall graph structure */
export interface WallGraph {
  nodes: Map<string, WallNode>;
  edges: Map<string, WallEdge>;
}

/** Closed centreline cycle with document wall ids and area in mm². */
export interface EnclosedRoomCycle {
  vertices: Point2D[];
  wallIds: string[];
  areaMm2: number;
}

function pointKey(p: Point2D, epsilonMm = WALL_JOIN_EPSILON_MM): string {
  const rx = Math.round(p.x / epsilonMm) * epsilonMm;
  const ry = Math.round(p.y / epsilonMm) * epsilonMm;
  return `${rx.toFixed(4)},${ry.toFixed(4)}`;
}

function findNearbyNode(
  nodes: Map<string, WallNode>,
  p: Point2D,
  epsilonMm = WALL_JOIN_EPSILON_MM,
): WallNode | null {
  for (const node of nodes.values()) {
    if (Math.hypot(node.position.x - p.x, node.position.y - p.y) <= epsilonMm) {
      return node;
    }
  }
  return null;
}

export type WallGraphInput = {
  start: Point2D;
  end: Point2D;
  id?: string;
};

/**
 * Build a wall graph from centreline segments.
 * Merges endpoints within `WALL_JOIN_EPSILON_MM`.
 */
export function buildWallGraph(walls: readonly WallGraphInput[]): WallGraph {
  const nodes = new Map<string, WallNode>();
  const edges = new Map<string, WallEdge>();

  function getOrCreateNode(p: Point2D): WallNode {
    const nearby = findNearbyNode(nodes, p);
    if (nearby) {
      return nearby;
    }
    const key = `${pointKey(p)}#${nodes.size}`;
    const created: WallNode = { id: key, position: { x: p.x, y: p.y }, edges: [] };
    nodes.set(key, created);
    return created;
  }

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    if (!wall) continue;
    const startNode = getOrCreateNode(wall.start);
    const endNode = getOrCreateNode(wall.end);

    if (startNode.id === endNode.id) continue; // skip zero-length walls

    const wallId = wall.id?.trim() || `edge_${i}`;
    const edgeId = wallId;
    if (edges.has(edgeId)) {
      // Duplicate wall ids: keep a unique edge key for graph walk.
      const uniqueId = `${edgeId}#${i}`;
      edges.set(uniqueId, {
        id: uniqueId,
        wallId,
        startNodeId: startNode.id,
        endNodeId: endNode.id,
      });
      startNode.edges.push(uniqueId);
      endNode.edges.push(uniqueId);
      continue;
    }

    edges.set(edgeId, {
      id: edgeId,
      wallId,
      startNodeId: startNode.id,
      endNodeId: endNode.id,
    });

    startNode.edges.push(edgeId);
    endNode.edges.push(edgeId);
  }

  return { nodes, edges };
}

/**
 * Find all minimal enclosed rooms (cycles) in the wall graph.
 * Returns centreline cycles with wall ids and signed positive area (mm²).
 */
export function findEnclosedRooms(graph: WallGraph): EnclosedRoomCycle[] {
  const rooms: EnclosedRoomCycle[] = [];
  const visitedEdges = new Set<string>();
  const angleEpsilon = 1e-9;

  const adjacency = new Map<string, { nodeId: string; edgeId: string; angle: number }[]>();

  for (const [nodeId, node] of graph.nodes) {
    const neighbors: { nodeId: string; edgeId: string; angle: number }[] = [];

    for (const edgeId of node.edges) {
      const edge = graph.edges.get(edgeId);
      if (!edge) {
        continue;
      }
      const otherNodeId = edge.startNodeId === nodeId ? edge.endNodeId : edge.startNodeId;
      const otherNode = graph.nodes.get(otherNodeId);
      if (!otherNode) {
        continue;
      }

      const angle = Math.atan2(
        otherNode.position.y - node.position.y,
        otherNode.position.x - node.position.x,
      );

      neighbors.push({ nodeId: otherNodeId, edgeId, angle });
    }

    neighbors.sort((a, b) => a.angle - b.angle);
    adjacency.set(nodeId, neighbors);
  }

  for (const [edgeId, edge] of graph.edges) {
    for (const direction of [0, 1] as const) {
      const dirKey = `${edgeId}_${direction}`;
      if (visitedEdges.has(dirKey)) continue;

      const startNodeId = direction === 0 ? edge.startNodeId : edge.endNodeId;
      const cycleNodes: string[] = [startNodeId];
      const cycleEdgeIds: string[] = [];
      let prevNodeId = startNodeId;
      let currentNodeId = direction === 0 ? edge.endNodeId : edge.startNodeId;
      cycleEdgeIds.push(edgeId);

      visitedEdges.add(dirKey);
      let valid = true;

      const maxSteps = graph.nodes.size + 1;
      let steps = 0;

      while (currentNodeId !== startNodeId && steps < maxSteps) {
        cycleNodes.push(currentNodeId);
        steps++;

        const neighbors = adjacency.get(currentNodeId);
        if (!neighbors || neighbors.length === 0) {
          valid = false;
          break;
        }

        const prevNode = graph.nodes.get(prevNodeId);
        const currentNode = graph.nodes.get(currentNodeId);
        if (!prevNode || !currentNode) {
          valid = false;
          break;
        }
        const incomingAngle = Math.atan2(
          prevNode.position.y - currentNode.position.y,
          prevNode.position.x - currentNode.position.x,
        );

        let nextIdx = -1;
        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i];
          if (!neighbor) continue;
          if (neighbor.angle > incomingAngle + angleEpsilon) {
            nextIdx = i;
            break;
          }
        }
        if (nextIdx === -1) nextIdx = 0;

        const next = neighbors[nextIdx];
        if (!next) {
          valid = false;
          break;
        }
        const nextEdge = graph.edges.get(next.edgeId);
        if (!nextEdge) {
          valid = false;
          break;
        }
        const nextDirKey = `${next.edgeId}_${nextEdge.startNodeId === currentNodeId ? 0 : 1}`;
        visitedEdges.add(nextDirKey);
        cycleEdgeIds.push(next.edgeId);

        prevNodeId = currentNodeId;
        currentNodeId = next.nodeId;
      }

      if (!valid || currentNodeId !== startNodeId || cycleNodes.length < 3) continue;

      const vertices: Point2D[] = [];
      for (const nid of cycleNodes) {
        const node = graph.nodes.get(nid);
        if (!node) {
          valid = false;
          break;
        }
        vertices.push(node.position);
      }
      if (!valid) continue;

      let area = 0;
      for (let i = 0; i < vertices.length; i++) {
        const j = (i + 1) % vertices.length;
        const vi = vertices[i];
        const vj = vertices[j];
        if (!vi || !vj) continue;
        area += vi.x * vj.y;
        area -= vj.x * vi.y;
      }
      const areaMm2 = Math.abs(area) / 2;

      if (area > angleEpsilon) {
        const wallIds = cycleEdgeIds
          .map((id) => graph.edges.get(id)?.wallId)
          .filter((id): id is string => Boolean(id));
        rooms.push({
          vertices,
          wallIds: [...new Set(wallIds)],
          areaMm2,
        });
      }
    }
  }

  return rooms;
}

/** @deprecated Prefer EnclosedRoomCycle; kept for callers that only need vertices. */
export function enclosedRoomPolygons(graph: WallGraph): Polygon[] {
  return findEnclosedRooms(graph).map((room) => ({ vertices: room.vertices }));
}

/**
 * Find all junction points (nodes with degree > 2) in the wall graph.
 */
export function findJunctions(graph: WallGraph): Point2D[] {
  const junctions: Point2D[] = [];

  for (const [, node] of graph.nodes) {
    if (node.edges.length > 2) {
      junctions.push(node.position);
    }
  }

  return junctions;
}
