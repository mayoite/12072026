import { describe, expect, it } from "vitest";
import {
  PARAMETRIC_BLOCKS,
  createParametricBlock,
  subdivideStorageRun,
} from "@/features/planner/lib/parametricBlocks";

describe("parametricBlocks", () => {
  it("defines worktop/bench/storage/partition/workstation blocks", () => {
    expect(PARAMETRIC_BLOCKS.map((b) => b.type)).toEqual(
      expect.arrayContaining([
        "worktop",
        "bench",
        "storage-run",
        "partition",
        "workstation-assembly",
      ]),
    );
  });

  it("clamps dimensions when creating catalog items", () => {
    const worktop = PARAMETRIC_BLOCKS.find((b) => b.type === "worktop")!;
    const item = createParametricBlock(worktop, 100, 400);
    expect(item.widthMm).toBe(worktop.minWidthMm);
    expect(item.depthMm).toBe(400);
    expect(item.category).toBe("desks");
    expect(item.id).toContain("parametric-worktop");
  });

  it("subdivides storage runs", () => {
    expect(subdivideStorageRun(1600, 400)).toBe(4);
    expect(subdivideStorageRun(0, 400)).toBe(0);
    expect(subdivideStorageRun(1600, 0)).toBe(0);
  });
});
