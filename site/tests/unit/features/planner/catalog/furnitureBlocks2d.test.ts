import { describe, it, expect } from "vitest";
import {
  resolveFurnitureBlockKind,
  isLShapedDesk,
} from "@/features/planner/catalog/furnitureBlocks2d";

describe("furnitureBlocks2d", () => {
  it("resolves furniture block kind by catalog category first", () => {
    const props: any = { furnitureCategory: "custom", furnitureType: "" };
    expect(resolveFurnitureBlockKind(props, { category: "desks" } as any)).toBe("desk-workstation");
    expect(resolveFurnitureBlockKind(props, { category: "seating" } as any)).toBe("seating-chair");
    expect(resolveFurnitureBlockKind(props, { category: "tables" } as any)).toBe("table");
    expect(resolveFurnitureBlockKind(props, { category: "storage" } as any)).toBe("storage-cabinet");
    expect(resolveFurnitureBlockKind(props, { category: "soft-seating" } as any)).toBe("soft-seating-sofa");
    expect(resolveFurnitureBlockKind(props, { category: "misc" } as any)).toBe("partition-accessory");
  });

  it("resolves block kind by props.furnitureCategory next", () => {
    const getProps = (cat: string): any => ({ furnitureCategory: cat, furnitureType: "" });
    expect(resolveFurnitureBlockKind(getProps("workstation"))).toBe("desk-workstation");
    expect(resolveFurnitureBlockKind(getProps("seating"))).toBe("seating-chair");
    expect(resolveFurnitureBlockKind(getProps("table"))).toBe("table");
    expect(resolveFurnitureBlockKind(getProps("storage"))).toBe("storage-cabinet");
    expect(resolveFurnitureBlockKind(getProps("softSeating"))).toBe("soft-seating-sofa");
    expect(resolveFurnitureBlockKind(getProps("partition"))).toBe("partition-accessory");
  });

  it("resolves block kind by keyword match in shape", () => {
    const props: any = { furnitureCategory: "custom", furnitureType: "curved-chair" };
    expect(resolveFurnitureBlockKind(props)).toBe("seating-chair");

    const propsCabinet: any = { furnitureCategory: "custom", furnitureType: "large-cabinet" };
    expect(resolveFurnitureBlockKind(propsCabinet)).toBe("storage-cabinet");
  });

  it("checks if shapes are L-shaped desks", () => {
    expect(isLShapedDesk("workstation-l")).toBe(true);
    expect(isLShapedDesk("desk-l")).toBe(true);
    expect(isLShapedDesk("linear")).toBe(false);
  });
});
