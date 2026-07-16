import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  verifyDualRead,
  writeDualReadEvidence,
} from "@/features/admin/svg-editor/storage/dualReadHarness";
import { makeNewBlockDescriptorStub } from "@/features/admin/svg-editor/publish/newBlockDescriptorStub";
import { persistBlockDescriptor } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { computeBlockDescriptorChecksum } from "@/features/planner/project/catalog/svg/svgTypes";

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
    expect(evidence.mirror.enabled).toBe(false);
    expect(evidence.note).toMatch(/Disk-only/);
    const written = writeDualReadEvidence(evidence, dir);
    expect(written).toContain(expected.slug);
    expect(existsSync(written)).toBe(true);
    const parsed = JSON.parse(readFileSync(written, "utf8")) as { slug: string };
    expect(parsed.slug).toBe(expected.slug);
  });

  it("fails mirror when checksum/schema diverge from expected", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "dual-read-mirror-"));
    const expected = makeNewBlockDescriptorStub();
    const evidence = verifyDualRead({
      slug: expected.slug,
      dir,
      expected,
      mirror: {
        slug: expected.slug,
        checksum: "f".repeat(64),
        schemaVersion: "wrong",
        source: "supabase",
      },
    });
    expect(evidence.mirror.enabled).toBe(true);
    expect(evidence.mirror.pass).toBe(false);
    expect(evidence.pass).toBe(false);
    expect(evidence.note).toMatch(/must match/);
  });

  it("passes disk+mirror when both match the persisted descriptor", () => {
    dir = mkdtempSync(path.join(os.tmpdir(), "dual-read-ok-"));
    const stub = makeNewBlockDescriptorStub();
    const stamped = {
      ...stub,
      checksum: computeBlockDescriptorChecksum(stub),
    };
    const persisted = persistBlockDescriptor(stamped, {
      dir,
      clock: () => 1_700_000_000,
    });
    expect(persisted.ok).toBe(true);
    if (!persisted.ok) throw new Error("persist failed");

    const evidence = verifyDualRead({
      slug: stamped.slug,
      dir,
      expected: persisted.descriptor,
      mirror: {
        slug: stamped.slug,
        checksum: persisted.descriptor.checksum,
        schemaVersion: persisted.descriptor.schemaVersion,
        source: "disk",
      },
    });
    expect(evidence.disk.pass).toBe(true);
    expect(evidence.mirror.pass).toBe(true);
    expect(evidence.pass).toBe(true);
  });
});
