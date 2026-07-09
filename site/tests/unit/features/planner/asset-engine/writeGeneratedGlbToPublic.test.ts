import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertWritableGeneratedGlbRelativePath,
  writeGeneratedGlbToPublic,
} from "@/features/planner/asset-engine";
import { GENERATED_GLB_PATH_MARKER } from "@/features/planner/lib/glbAssetPolicy";

const tempRoots: string[] = [];

function tempPublicRoot(): string {
  const root = mkdtempSync(path.join(tmpdir(), "p0-2-glb-public-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      try {
        rmSync(root, { recursive: true, force: true });
      } catch {
        // best-effort cleanup
      }
    }
  }
});

function sampleGlbBuffer(): ArrayBuffer {
  // Minimal non-empty bytes (not a full GLB; write helper does not re-validate).
  const bytes = new Uint8Array([0x67, 0x6c, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00]);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

describe("assertWritableGeneratedGlbRelativePath", () => {
  it("accepts catalog-assets/generated/*.glb", () => {
    const rel = `${GENERATED_GLB_PATH_MARKER}modular-cabinet-v0-test.glb`;
    expect(assertWritableGeneratedGlbRelativePath(rel)).toBe(rel);
  });

  it("rejects designer static and traversal", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath("models/designer-sofa.glb"),
    ).toThrow(/not allowed|system-generated|catalog-assets/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        `${GENERATED_GLB_PATH_MARKER}../escape.glb`,
      ),
    ).toThrow(/traversal|absolute/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath("blob:http://local/x"),
    ).toThrow(/blob/i);
  });
});

describe("writeGeneratedGlbToPublic", () => {
  it("writes bytes under publicRoot and returns publicUrlPath", () => {
    const publicRoot = tempPublicRoot();
    const relativePath = `${GENERATED_GLB_PATH_MARKER}unit-write-cab.glb`;
    const buffer = sampleGlbBuffer();

    const result = writeGeneratedGlbToPublic(buffer, relativePath, {
      publicRoot,
    });

    expect(result.relativePath).toBe(relativePath);
    expect(result.publicUrlPath).toBe(`/${relativePath}`);
    expect(result.byteLength).toBe(buffer.byteLength);
    expect(result.absolutePath).toBe(
      path.resolve(publicRoot, ...relativePath.split("/")),
    );
    const onDisk = readFileSync(result.absolutePath);
    expect(onDisk.byteLength).toBe(buffer.byteLength);
    expect(Buffer.compare(onDisk, Buffer.from(buffer))).toBe(0);
  });

  it("rejects empty buffer", () => {
    expect(() =>
      writeGeneratedGlbToPublic(new ArrayBuffer(0), `${GENERATED_GLB_PATH_MARKER}x.glb`, {
        publicRoot: tempPublicRoot(),
      }),
    ).toThrow(/non-empty/i);
  });
});
