import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
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
  const root = mkdtempSync(path.join(tmpdir(), "write-glb-public-"));
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

function sampleGlbBuffer(byteLength = 8): ArrayBuffer {
  // Minimal non-empty bytes (not a full GLB; write helper does not re-validate).
  const bytes = new Uint8Array(byteLength);
  bytes[0] = 0x67;
  bytes[1] = 0x6c;
  bytes[2] = 0x54;
  bytes[3] = 0x46;
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

describe("assertWritableGeneratedGlbRelativePath", () => {
  it("accepts catalog-assets/generated/*.glb", () => {
    const rel = `${GENERATED_GLB_PATH_MARKER}modular-cabinet-v0-test.glb`;
    expect(assertWritableGeneratedGlbRelativePath(rel)).toBe(rel);
  });

  it("normalizes leading slash and backslashes", () => {
    const bare = `${GENERATED_GLB_PATH_MARKER}nested/unit.glb`;
    expect(assertWritableGeneratedGlbRelativePath(`/${bare}`)).toBe(bare);
    expect(
      assertWritableGeneratedGlbRelativePath(
        bare.replace(/\//g, "\\"),
      ),
    ).toBe(bare);
  });

  it("rejects empty / whitespace relativePath", () => {
    expect(() => assertWritableGeneratedGlbRelativePath("")).toThrow(
      /non-empty relativePath/i,
    );
    expect(() => assertWritableGeneratedGlbRelativePath("   ")).toThrow(
      /non-empty relativePath/i,
    );
    expect(() => assertWritableGeneratedGlbRelativePath("///")).toThrow(
      /non-empty relativePath/i,
    );
  });

  it("rejects blob: URLs", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath("blob:http://local/x"),
    ).toThrow(/blob/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath("blob:https://cdn.example/preview"),
    ).toThrow(/blob/i);
  });

  it("rejects designer static GLB paths", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath("models/designer-sofa.glb"),
    ).toThrow(/not allowed|system-generated|Static designer/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        "https://cdn.example.com/models/sofa-hero.glb",
      ),
    ).toThrow(/not allowed|system-generated|Static designer/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        "catalog-assets/static/sofa.glb",
      ),
    ).toThrow(/isSystemGeneratedGlbUrl|catalog-assets\/generated/i);
  });

  it("rejects path traversal", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        `${GENERATED_GLB_PATH_MARKER}../escape.glb`,
      ),
    ).toThrow(/traversal|absolute/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        `${GENERATED_GLB_PATH_MARKER}foo/../../etc/passwd.glb`,
      ),
    ).toThrow(/traversal|absolute/i);
  });

  it("rejects absolute paths (windows drive / UNC-style)", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath("C:/catalog-assets/generated/x.glb"),
    ).toThrow(/traversal|absolute/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath("D:\\catalog-assets\\generated\\x.glb"),
    ).toThrow(/traversal|absolute/i);
  });

  it("rejects non-.glb extension", () => {
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        `${GENERATED_GLB_PATH_MARKER}unit.bin`,
      ),
    ).toThrow(/\.glb/i);
    expect(() =>
      assertWritableGeneratedGlbRelativePath(
        `${GENERATED_GLB_PATH_MARKER}unit.gltf`,
      ),
    ).toThrow(/\.glb/i);
  });

  it("accepts .GLB case-insensitively for extension check", () => {
    const rel = `${GENERATED_GLB_PATH_MARKER}Unit-Case.GLB`;
    expect(assertWritableGeneratedGlbRelativePath(rel)).toBe(rel);
  });
});

describe("writeGeneratedGlbToPublic", () => {
  it("writes bytes under injectable publicRoot and returns publicUrlPath", () => {
    const publicRoot = tempPublicRoot();
    const relativePath = `${GENERATED_GLB_PATH_MARKER}unit-write-cab.glb`;
    const buffer = sampleGlbBuffer(16);

    const result = writeGeneratedGlbToPublic(buffer, relativePath, {
      publicRoot,
    });

    expect(result.relativePath).toBe(relativePath);
    expect(result.publicUrlPath).toBe(`/${relativePath}`);
    expect(result.byteLength).toBe(buffer.byteLength);
    expect(result.absolutePath).toBe(
      path.resolve(publicRoot, ...relativePath.split("/")),
    );
    expect(existsSync(result.absolutePath)).toBe(true);
    const onDisk = readFileSync(result.absolutePath);
    expect(onDisk.byteLength).toBe(buffer.byteLength);
    expect(Buffer.compare(onDisk, Buffer.from(buffer))).toBe(0);
  });

  it("creates nested directories under catalog-assets/generated/", () => {
    const publicRoot = tempPublicRoot();
    const relativePath = `${GENERATED_GLB_PATH_MARKER}nested/deep/unit-nested.glb`;
    const buffer = sampleGlbBuffer();

    const result = writeGeneratedGlbToPublic(buffer, relativePath, {
      publicRoot,
    });

    expect(result.relativePath).toBe(relativePath);
    expect(existsSync(result.absolutePath)).toBe(true);
    expect(
      result.absolutePath.startsWith(path.resolve(publicRoot)),
    ).toBe(true);
  });

  it("strips leading slash on relativePath before write", () => {
    const publicRoot = tempPublicRoot();
    const bare = `${GENERATED_GLB_PATH_MARKER}leading-slash.glb`;
    const buffer = sampleGlbBuffer();

    const result = writeGeneratedGlbToPublic(buffer, `/${bare}`, {
      publicRoot,
    });

    expect(result.relativePath).toBe(bare);
    expect(result.publicUrlPath).toBe(`/${bare}`);
    expect(existsSync(result.absolutePath)).toBe(true);
  });

  it("rejects empty buffer", () => {
    expect(() =>
      writeGeneratedGlbToPublic(
        new ArrayBuffer(0),
        `${GENERATED_GLB_PATH_MARKER}x.glb`,
        { publicRoot: tempPublicRoot() },
      ),
    ).toThrow(/non-empty ArrayBuffer/i);
  });

  it("rejects designer static / path traversal / blob: on write", () => {
    const publicRoot = tempPublicRoot();
    const buffer = sampleGlbBuffer();

    expect(() =>
      writeGeneratedGlbToPublic(buffer, "models/designer-sofa.glb", {
        publicRoot,
      }),
    ).toThrow(/not allowed|system-generated|Static designer/i);

    expect(() =>
      writeGeneratedGlbToPublic(
        buffer,
        `${GENERATED_GLB_PATH_MARKER}../escape.glb`,
        { publicRoot },
      ),
    ).toThrow(/traversal|absolute/i);

    expect(() =>
      writeGeneratedGlbToPublic(buffer, "blob:http://local/x", {
        publicRoot,
      }),
    ).toThrow(/blob/i);
  });

  it("does not create files when path policy rejects", () => {
    const publicRoot = tempPublicRoot();
    const buffer = sampleGlbBuffer();

    expect(() =>
      writeGeneratedGlbToPublic(buffer, "models/nope.glb", { publicRoot }),
    ).toThrow();

    expect(existsSync(path.join(publicRoot, "models"))).toBe(false);
    expect(
      existsSync(path.join(publicRoot, "catalog-assets", "generated")),
    ).toBe(false);
  });
});
