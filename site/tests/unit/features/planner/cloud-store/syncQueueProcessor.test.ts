import { describe, expect, it } from "vitest";
import { useSyncQueueProcessor } from "@/features/planner/cloud-store/syncQueueProcessor";

describe("syncQueueProcessor", () => {
  it("should have function useSyncQueueProcessor defined", () => {
    expect(useSyncQueueProcessor).toBeTypeOf("function"); expect(String(useSyncQueueProcessor)).toContain('function');
  });
  it("should have hook useSyncQueueProcessor defined", () => {
    expect(useSyncQueueProcessor).toBeTypeOf("function"); expect(String(useSyncQueueProcessor)).toContain('function');
  });
});
