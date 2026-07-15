import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  verifyDualRead,
  writeDualReadEvidence,
} from "@/features/admin/svg-editor/storage/dualReadHarness";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";

describe("dualReadHarness", () => {
  let dir = "";
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("verifyDualRead returns evidence object", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "dual-read-"));
    const expected = makeNewBlockDescriptorStub();
    const evidence = verifyDualRead({
      slug: expected.slug,
      dir,
      expected,
      mirror: null,
    });
    expect(evidence.slug).toBe(expected.slug);
    expect(typeof evidence.pass).toBe("boolean");
    expect(evidence.disk).toBeDefined();
    const written = writeDualReadEvidence(evidence, dir);
    expect(written).toContain(expected.slug);
  });
});
