import { describe, expect, it } from "vitest";
import {
  createMeasurementItem,
  createStructuralElement,
  createTextLabel,
  createZone,
} from "@/features/planner/cloud-store/plannerEntityFactories";
import { ZONE_COLORS } from "@/features/planner/cloud-store/plannerTypes";

describe("plannerEntityFactories", () => {
  it("creates measurement with start and end points", () => {
    const m = createMeasurementItem("m1", { x: 0, y: 0 }, { x: 100, y: 50 });
    expect(m).toEqual({ id: "m1", start: { x: 0, y: 0 }, end: { x: 100, y: 50 } });
  });

  it("creates text label with defaults", () => {
    const t = createTextLabel("t1", 10, 20, "Hello");
    expect(t.id).toBe("t1");
    expect(t.x).toBe(10);
    expect(t.y).toBe(20);
    expect(t.text).toBe("Hello");
    expect(t.fontSize).toBe(14);
    expect(t.rotation).toBe(0);
  });

  it("creates structural column with default footprint", () => {
    const col = createStructuralElement("c1", "column", 40, 60);
    expect(col.type).toBe("column");
    expect(col.width).toBe(30);
    expect(col.height).toBe(30);
    expect(col.label).toBe("Column");
    expect(col.x).toBe(40);
    expect(col.y).toBe(60);
  });

  it("creates stair with larger defaults", () => {
    const stair = createStructuralElement("s1", "stair", 0, 0);
    expect(stair.width).toBe(120);
    expect(stair.height).toBe(200);
    expect(stair.label).toBe("Stairs");
  });

  it("creates zone with color from palette", () => {
    const zone = createZone(
      "z1",
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 80 },
      ],
      "Open",
      "Open Plan",
      ZONE_COLORS,
    );
    expect(zone.id).toBe("z1");
    expect(zone.name).toBe("Open");
    expect(zone.type).toBe("Open Plan");
    expect(zone.color).toBe(ZONE_COLORS["Open Plan"]);
    expect(zone.opacity).toBe(0.25);
    expect(zone.points).toHaveLength(3);
  });
});
