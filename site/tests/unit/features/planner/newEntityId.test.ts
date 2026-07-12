import { describe, expect, it } from "vitest";
import { version as uuidVersion } from "uuid";

import {
  isEntityUuid,
  isPlannerEntityUuidV7,
  newEntityId,
  PLANNER_ENTITY_UUID_VERSION,
} from "@/features/planner/lib/newEntityId";

describe("newEntityId — UUID v7 policy", () => {
  it("mints UUID v7", () => {
    const id = newEntityId();
    expect(isEntityUuid(id)).toBe(true);
    expect(uuidVersion(id)).toBe(PLANNER_ENTITY_UUID_VERSION);
    expect(isPlannerEntityUuidV7(id)).toBe(true);
  });

  it("mints unique ids", () => {
    const a = newEntityId();
    const b = newEntityId();
    expect(a).not.toBe(b);
  });

  it("accepts legacy v4 on read via isEntityUuid", () => {
    const v4 = "f81e3a1b-16f4-4c2a-9e6b-8e1f3b7e1a44";
    expect(isEntityUuid(v4)).toBe(true);
    expect(isPlannerEntityUuidV7(v4)).toBe(false);
  });

  it("rejects non-uuid strings", () => {
    expect(isEntityUuid("not-a-uuid")).toBe(false);
    expect(isPlannerEntityUuidV7("plc-123")).toBe(false);
  });
});
