import { describe, expect, it } from "vitest";

import {
  DEFAULT_FABRIC_STAGE_TRANSFORM,
  DEFAULT_FURNITURE_FOOTPRINT_MM,
  FURNITURE_ENTITY_ID_PROP,
  fabricPoseToDocumentUpdate,
  furnitureFootprintMm,
  furnitureListToFabricPoses,
  furnitureToFabricPose,
  readFurnitureEntityId,
  writeFurnitureEntityId,
} from "@/features/planner/canvas/furnitureFabricMapper";
import {
  PLANNER_FABRIC_FURNITURE_ENV,
  isPlannerFabricFurnitureEnabled,
} from "@/features/planner/canvas/fabricFurnitureFlag";
import type { PlannerFurnitureItem } from "@/features/planner/project/model/types";
import type { CanvasTransform } from "@/features/planner/project/lib/geometry/snapping";

function makeItem(
  overrides: Partial<PlannerFurnitureItem> & Pick<PlannerFurnitureItem, "id">,
): PlannerFurnitureItem {
  return {
    catalogId: "catalog-desk",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    ...overrides,
  };
}

describe("furnitureFabricMapper", () => {
  const transform: CanvasTransform = DEFAULT_FABRIC_STAGE_TRANSFORM;

  it("maps entityId from furniture.id and uses default footprint when width/depth omitted", () => {
    const id = "a1b2c3d4-e5f6-4789-a012-3456789abcde";
    const item = makeItem({
      id,
      position: { x: 1000, y: 500 },
      rotation: 90,
    });

    const pose = furnitureToFabricPose(item, transform);

    expect(pose.entityId).toBe(id);
    expect(pose.widthMm).toBe(DEFAULT_FURNITURE_FOOTPRINT_MM);
    expect(pose.depthMm).toBe(DEFAULT_FURNITURE_FOOTPRINT_MM);
    expect(pose.width).toBeCloseTo(DEFAULT_FURNITURE_FOOTPRINT_MM * transform.scale, 8);
    expect(pose.height).toBeCloseTo(DEFAULT_FURNITURE_FOOTPRINT_MM * transform.scale, 8);
    expect(pose.angle).toBe(90);
    expect(pose.locked).toBe(false);

    // screen: (x - origin) * scale
    expect(pose.left).toBeCloseTo((1000 - transform.origin.x) * transform.scale, 8);
    expect(pose.top).toBeCloseTo((500 - transform.origin.y) * transform.scale, 8);
  });

  it("uses explicit width/depth mm and scale for fabric size", () => {
    const item = makeItem({
      id: "11111111-2222-4333-8444-555555555555",
      width: 1200,
      depth: 800,
      position: { x: 0, y: 0 },
    });
    const pose = furnitureToFabricPose(item, transform);
    expect(pose.widthMm).toBe(1200);
    expect(pose.depthMm).toBe(800);
    expect(pose.width).toBeCloseTo(120, 8);
    expect(pose.height).toBeCloseTo(80, 8);
  });

  it("round-trips position and rotation through fabric pose (project mm)", () => {
    const id = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    const item = makeItem({
      id,
      position: { x: 2500.5, y: -1200.25 },
      rotation: 45,
      width: 900,
      depth: 450,
    });

    const pose = furnitureToFabricPose(item, transform);
    const update = fabricPoseToDocumentUpdate(
      {
        entityId: pose.entityId,
        left: pose.left,
        top: pose.top,
        angle: pose.angle,
      },
      transform,
    );

    expect(update.entityId).toBe(id);
    expect(update.position.x).toBeCloseTo(item.position.x, 8);
    expect(update.position.y).toBeCloseTo(item.position.y, 8);
    expect(update.rotation).toBe(45);
  });

  it("normalizes negative and >360 rotation degrees", () => {
    const item = makeItem({
      id: "99999999-8888-4777-8666-555555555555",
      rotation: -90,
    });
    expect(furnitureToFabricPose(item, transform).angle).toBe(270);

    const update = fabricPoseToDocumentUpdate(
      { entityId: item.id, left: 0, top: 0, angle: 450 },
      transform,
    );
    expect(update.rotation).toBe(90);
  });

  it("marks locked furniture and maps list order", () => {
    const a = makeItem({
      id: "00000000-0000-4000-8000-000000000001",
      locked: true,
      position: { x: 0, y: 0 },
    });
    const b = makeItem({
      id: "00000000-0000-4000-8000-000000000002",
      position: { x: 100, y: 200 },
    });
    const poses = furnitureListToFabricPoses([a, b], transform);
    expect(poses).toHaveLength(2);
    expect(poses[0].entityId).toBe(a.id);
    expect(poses[0].locked).toBe(true);
    expect(poses[1].entityId).toBe(b.id);
    expect(poses[1].locked).toBe(false);
  });

  it("furnitureFootprintMm defaults and overrides", () => {
    expect(furnitureFootprintMm({})).toEqual({
      widthMm: DEFAULT_FURNITURE_FOOTPRINT_MM,
      depthMm: DEFAULT_FURNITURE_FOOTPRINT_MM,
    });
    expect(furnitureFootprintMm({ width: 10, depth: 20 })).toEqual({
      widthMm: 10,
      depthMm: 20,
    });
  });

  it("read/write entityId on fabric-like carriers", () => {
    const store: Record<string, unknown> = {};
    const target = {
      set: (key: string, value: string) => {
        store[key] = value;
      },
      get: (key: string) => store[key],
    };
    writeFurnitureEntityId(target, "uuid-entity");
    expect(store[FURNITURE_ENTITY_ID_PROP]).toBe("uuid-entity");
    expect(readFurnitureEntityId(target)).toBe("uuid-entity");
    expect(readFurnitureEntityId(null)).toBeNull();
    expect(readFurnitureEntityId({ entityId: "direct-field" })).toBe("direct-field");
    expect(readFurnitureEntityId({ get: () => 42 })).toBeNull();
  });

  it("preserves entityId after a synthetic drag (left/top change only)", () => {
    const id = "cccccccc-dddd-4eee-8fff-000000000111";
    const item = makeItem({
      id,
      position: { x: 3000, y: 1500 },
      rotation: 15,
      width: 700,
      depth: 500,
    });
    const before = furnitureToFabricPose(item, transform);
    // User drags 40 screen px right, 10 down
    const afterUpdate = fabricPoseToDocumentUpdate(
      {
        entityId: before.entityId,
        left: before.left + 40,
        top: before.top + 10,
        angle: before.angle,
      },
      transform,
    );
    expect(afterUpdate.entityId).toBe(id);
    expect(afterUpdate.position.x).toBeCloseTo(
      item.position.x + 40 / transform.scale,
      8,
    );
    expect(afterUpdate.position.y).toBeCloseTo(
      item.position.y + 10 / transform.scale,
      8,
    );
    expect(afterUpdate.rotation).toBe(15);
  });

  it("uses DEFAULT_FABRIC_STAGE_TRANSFORM when transform is omitted", () => {
    const id = "dddddddd-eeee-4fff-8000-111111111111";
    const item = makeItem({
      id,
      position: { x: 0, y: 0 },
      rotation: 0,
      width: 600,
      depth: 400,
    });
    const pose = furnitureToFabricPose(item);
    expect(pose.entityId).toBe(id);
    expect(pose.left).toBeCloseTo(
      (0 - DEFAULT_FABRIC_STAGE_TRANSFORM.origin.x) *
        DEFAULT_FABRIC_STAGE_TRANSFORM.scale,
      8,
    );
    expect(pose.top).toBeCloseTo(
      (0 - DEFAULT_FABRIC_STAGE_TRANSFORM.origin.y) *
        DEFAULT_FABRIC_STAGE_TRANSFORM.scale,
      8,
    );
    expect(pose.width).toBeCloseTo(600 * DEFAULT_FABRIC_STAGE_TRANSFORM.scale, 8);
    expect(pose.height).toBeCloseTo(400 * DEFAULT_FABRIC_STAGE_TRANSFORM.scale, 8);

    const update = fabricPoseToDocumentUpdate({
      entityId: pose.entityId,
      left: pose.left,
      top: pose.top,
      angle: pose.angle,
    });
    expect(update.entityId).toBe(id);
    expect(update.position.x).toBeCloseTo(0, 8);
    expect(update.position.y).toBeCloseTo(0, 8);
  });

  it("entityId is furniture.id only — never rewritten on pose round-trip", () => {
    const id = "eeeeeeee-ffff-4000-8000-222222222222";
    const item = makeItem({
      id,
      position: { x: 500, y: 700 },
      rotation: 180,
      width: 1000,
      depth: 500,
    });
    const pose = furnitureToFabricPose(item, transform);
    expect(pose.entityId).toBe(id);
    expect(pose.entityId).toBe(item.id);

    // Rotate + move write-back still carries the same entityId
    const update = fabricPoseToDocumentUpdate(
      {
        entityId: pose.entityId,
        left: pose.left + 10,
        top: pose.top - 5,
        angle: pose.angle + 90,
      },
      transform,
    );
    expect(update.entityId).toBe(id);
    expect(update.rotation).toBe(270);
  });

  it("maps pose under a non-default pan/zoom transform", () => {
    const custom: CanvasTransform = { origin: { x: 100, y: 200 }, scale: 0.5 };
    const id = "ffffffff-0000-4111-8222-333333333333";
    const item = makeItem({
      id,
      position: { x: 300, y: 400 },
      rotation: 30,
      width: 800,
      depth: 600,
    });
    const pose = furnitureToFabricPose(item, custom);
    expect(pose.entityId).toBe(id);
    expect(pose.left).toBeCloseTo((300 - 100) * 0.5, 8);
    expect(pose.top).toBeCloseTo((400 - 200) * 0.5, 8);
    expect(pose.width).toBeCloseTo(400, 8);
    expect(pose.height).toBeCloseTo(300, 8);
    expect(pose.angle).toBe(30);

    const update = fabricPoseToDocumentUpdate(
      {
        entityId: pose.entityId,
        left: pose.left,
        top: pose.top,
        angle: pose.angle,
      },
      custom,
    );
    expect(update.entityId).toBe(id);
    expect(update.position.x).toBeCloseTo(300, 8);
    expect(update.position.y).toBeCloseTo(400, 8);
    expect(update.rotation).toBe(30);
  });

  it("furnitureListToFabricPoses preserves empty list and entity order", () => {
    expect(furnitureListToFabricPoses([], transform)).toEqual([]);
    const ids = [
      "00000000-0000-4000-8000-0000000000aa",
      "00000000-0000-4000-8000-0000000000bb",
      "00000000-0000-4000-8000-0000000000cc",
    ];
    const poses = furnitureListToFabricPoses(
      ids.map((id, index) =>
        makeItem({ id, position: { x: index * 100, y: 0 } }),
      ),
      transform,
    );
    expect(poses.map((p) => p.entityId)).toEqual(ids);
  });

  it("readFurnitureEntityId rejects empty string and non-string carriers", () => {
    expect(readFurnitureEntityId({ entityId: "" })).toBeNull();
    expect(readFurnitureEntityId({ entityId: 99 })).toBeNull();
    expect(
      readFurnitureEntityId({
        get: () => "",
        entityId: "fallback-field",
      }),
    ).toBe("fallback-field");
    expect(
      readFurnitureEntityId({
        get: () => "from-get",
        entityId: "ignored-when-get-works",
      }),
    ).toBe("from-get");
  });
});

describe("isPlannerFabricFurnitureEnabled", () => {
  it("exports PLANNER_FABRIC_FURNITURE_ENV as the public Next env key", () => {
    expect(PLANNER_FABRIC_FURNITURE_ENV).toBe("NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE");
  });

  it("is false by default and for non-1 values", () => {
    expect(isPlannerFabricFurnitureEnabled({})).toBe(false);
    expect(
      isPlannerFabricFurnitureEnabled({
        [PLANNER_FABRIC_FURNITURE_ENV]: "0",
      }),
    ).toBe(false);
    expect(
      isPlannerFabricFurnitureEnabled({
        [PLANNER_FABRIC_FURNITURE_ENV]: "true",
      }),
    ).toBe(false);
  });

  it("is true only when env is exactly 1", () => {
    expect(
      isPlannerFabricFurnitureEnabled({
        [PLANNER_FABRIC_FURNITURE_ENV]: "1",
      }),
    ).toBe(true);
  });

  /**
   * P01 / W-gate product truth: Fabric furniture overlay is opt-in with exact "1" only.
   * Near-miss truthy strings must stay OFF so default product path stays Fabric-sole (no second host).
   */
  it("rejects near-miss enable values (strict === \"1\" only)", () => {
    const nearMiss: Array<string | undefined> = [
      undefined,
      "",
      " ",
      "1 ",
      " 1",
      "01",
      "1.0",
      "yes",
      "on",
      "ON",
      "True",
      "TRUE",
      "enabled",
      "-1",
      "2",
      "\t1",
      "1\n",
    ];
    for (const value of nearMiss) {
      expect(
        isPlannerFabricFurnitureEnabled({ [PLANNER_FABRIC_FURNITURE_ENV]: value }),
        `expected OFF for ${JSON.stringify(value)}`,
      ).toBe(false);
    }
  });

  it("reads only PLANNER_FABRIC_FURNITURE_ENV — ignores wrong keys and non-string 1", () => {
    expect(
      isPlannerFabricFurnitureEnabled({
        PLANNER_FABRIC_FURNITURE: "1",
        NEXT_PUBLIC_OPEN3D_FABRIC: "1",
      }),
    ).toBe(false);
    // Record bags are string | undefined; numeric/boolean must not coerce through === "1"
    const bagWithWrongTypes: Record<string, string | undefined> = {
      [PLANNER_FABRIC_FURNITURE_ENV]: "1",
    };
    expect(isPlannerFabricFurnitureEnabled(bagWithWrongTypes)).toBe(true);
    expect(
      isPlannerFabricFurnitureEnabled({
        [PLANNER_FABRIC_FURNITURE_ENV]: "1",
        SOME_OTHER_FLAG: "0",
      }),
    ).toBe(true);
  });

  it("barrel re-exports flag helpers from canvas index", async () => {
    const barrel = await import("@/features/planner/canvas");
    expect(barrel.PLANNER_FABRIC_FURNITURE_ENV).toBe(PLANNER_FABRIC_FURNITURE_ENV);
    expect(barrel.isPlannerFabricFurnitureEnabled({})).toBe(false);
    expect(
      barrel.isPlannerFabricFurnitureEnabled({
        [PLANNER_FABRIC_FURNITURE_ENV]: "1",
      }),
    ).toBe(true);
  });
});
