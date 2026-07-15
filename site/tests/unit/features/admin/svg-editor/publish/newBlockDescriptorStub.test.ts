import { describe, expect, it } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";

describe("makeNewBlockDescriptorStub", () => {
  it("returns fixed native stub", () => {
    const stub = makeNewBlockDescriptorStub();
    expect(stub.slug).toBe("new-block");
    expect(stub.variant).toBe("fixed");
    expect(stub.geometry.widthMm).toBeGreaterThan(0);
    expect(stub.checksum).toHaveLength(64);
  });
});
