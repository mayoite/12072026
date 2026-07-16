import { describe, expect, it } from "vitest";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";

describe("makeNewBlockDescriptorStub", () => {
  it("returns fixed native stub", () => {
    const stub = makeNewBlockDescriptorStub();
    expect(stub.slug).toBe("new-block");
    expect(stub.variant).toBe("fixed");
    expect(stub.geometry.widthMm).toBeGreaterThan(0);
    expect(stub.geometry.depthMm).toBe(600);
    expect(stub.geometry.heightMm).toBe(480);
    expect(stub.viewBox.width).toBe(stub.geometry.widthMm);
    expect(stub.viewBox.height).toBe(stub.geometry.depthMm);
    expect(stub.mounting).toEqual(["floor"]);
    expect(stub.sourceProvenance).toBe("native");
    expect(stub.checksum).toHaveLength(64);
    expect(stub.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(stub.generatedAt).toBeGreaterThan(0);
  });
});
