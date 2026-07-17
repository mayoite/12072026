import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { exportModularAndWrite } from "@/features/planner/asset-engine";
import * as exportBinary from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import type { ModularGlbBinaryResult } from "@/features/planner/asset-engine/mesh/exportModularGlbBinary";
import { defaultCabinetV0Options } from "@/features/planner/catalog/modularCabinetV0";
import {
  buildModularCabinetV0GlbPlan,
  modularCabinetV0GeneratedRelativePath,
} from "@/features/planner/catalog/modularCabinetV0GlbExport";
import {
  GENERATED_GLB_PATH_MARKER,
  isSystemGeneratedGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import * as assetPipeline from "@/features/planner/lib/assetPipeline";

const tempRoots: string[] = [];

function tempPublicRoot(): string {
  const root = mkdtempSync(path.join(tmpdir(), "export-modular-write-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
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

function sampleBytes(byteLength: number): ArrayBuffer {
  const bytes = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    bytes[i] = i % 256;
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function syntheticBinaryOk(
  overrides: Partial<Extract<ModularGlbBinaryResult, { ok: true }>> = {},
): Extract<ModularGlbBinaryResult, { ok: true }> {
  const options = defaultCabinetV0Options({ doorStyle: "slab", material: "white" });
  const plan = buildModularCabinetV0GlbPlan(options);
  const relativePath =
    overrides.relativePath ?? modularCabinetV0GeneratedRelativePath(options);
  const buffer = overrides.buffer ?? sampleBytes(64);
  const base: Extract<ModularGlbBinaryResult, { ok: true }> = {
    ok: true,
    relativePath,
    buffer,
    byteLength: buffer.byteLength,
    plan,
    validation: {
      valid: true,
      errors: [],
      nodeCount: 3,
      triangleCount: 12,
    },
    stages: [
      "mesh-g1-options",
      "mesh-g4-part-plan",
      "mesh-g3-runtime-mesh",
      "mesh-g5-binary-glb",
      "mesh-g6-validate-glb",
    ],
  };
  return {
    ...base,
    ...overrides,
    relativePath:
      overrides.relativePath ?? base.relativePath,
    buffer: overrides.buffer ?? base.buffer,
    byteLength: (overrides.buffer ?? base.buffer).byteLength,
  };
}

describe("exportModularAndWrite", () => {
  it("success: exports modular GLB, writes file under publicRoot, returns relativePath", async () => {
    const publicRoot = tempPublicRoot();
    const options = {
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab" as const,
      material: "white" as const,
    };
    const expectedPath = modularCabinetV0GeneratedRelativePath(
      defaultCabinetV0Options(options),
    );

    const result = await exportModularAndWrite(options, { publicRoot });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error(`expected ok: ${result.error} @ ${result.failedAt}`);
    }

    expect(result.relativePath).toBe(expectedPath);
    expect(isSystemGeneratedGlbUrl(result.relativePath)).toBe(true);
    expect(result.relativePath.startsWith(GENERATED_GLB_PATH_MARKER)).toBe(true);
    expect(result.publicUrlPath).toBe(`/${expectedPath}`);
    expect(result.byteLength).toBeGreaterThan(100);
    expect(result.buffer.byteLength).toBe(result.byteLength);
    expect(result.validation.valid).toBe(true);
    expect(result.stages).toContain("mesh-g5-binary-glb");
    expect(result.stages).toContain("mesh-g6-validate-glb");
    expect(result.stages).toContain("write-public");
    expect(result.write.relativePath).toBe(expectedPath);
    expect(result.write.publicUrlPath).toBe(`/${expectedPath}`);
    expect(result.write.byteLength).toBe(result.byteLength);
    expect(result.absolutePath).toBe(result.write.absolutePath);
    expect(existsSync(result.absolutePath)).toBe(true);
    const onDisk = readFileSync(result.absolutePath);
    expect(onDisk.byteLength).toBe(result.byteLength);
    expect(Buffer.compare(onDisk, Buffer.from(result.buffer))).toBe(0);
  }, 30_000);

  it("failure: propagates binary export ok:false without writing disk", async () => {
    const publicRoot = tempPublicRoot();
    vi.spyOn(exportBinary, "exportModularCabinetV0GlbBinary").mockResolvedValue({
      ok: false,
      error: "synthetic binary failure",
      failedAt: "mesh-g5-binary-glb",
      stages: ["mesh-g1-options", "mesh-g5-binary-glb"],
    });

    const result = await exportModularAndWrite(
      { doorStyle: "slab" },
      { publicRoot },
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected binary failure");
    }
    expect(result.failedAt).toBe("mesh-g5-binary-glb");
    expect(result.error).toBe("synthetic binary failure");
    expect(result.stages).toEqual([
      "mesh-g1-options",
      "mesh-g5-binary-glb",
    ]);
    expect(result.stages).not.toContain("write-public");
    expect(
      existsSync(path.join(publicRoot, "catalog-assets", "generated")),
    ).toBe(false);
  });

  it("failure: mesh-g6-validate-glb-node when buffer is empty (before write-public)", async () => {
    // Node export path re-validates GLB after binary export; empty bytes fail G6,
    // so write-public is never reached (empty-buffer write policy covered in writeGeneratedGlbToPublic).
    const publicRoot = tempPublicRoot();
    const empty = new ArrayBuffer(0);
    vi.spyOn(exportBinary, "exportModularCabinetV0GlbBinary").mockResolvedValue(
      syntheticBinaryOk({
        buffer: empty,
        byteLength: 0,
      }),
    );

    const result = await exportModularAndWrite(undefined, { publicRoot });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected mesh-g6-validate-glb-node failure");
    }
    expect(result.failedAt).toBe("mesh-g6-validate-glb-node");
    expect(result.error).toMatch(/parse GLB|validation failed|no nodes/i);
    expect(result.stages).toContain("mesh-g6-validate-glb-node");
    expect(result.stages).not.toContain("write-public");
    expect(
      existsSync(path.join(publicRoot, "catalog-assets", "generated")),
    ).toBe(false);
  });

  it("failure: write-public when relativePath is designer static", async () => {
    const publicRoot = tempPublicRoot();
    // Bypass G6 parse so path policy on write-public is the unit under test.
    vi.spyOn(assetPipeline, "validateGlbAsset").mockResolvedValue({
      valid: true,
      errors: [],
      nodeCount: 1,
      triangleCount: 1,
    });
    vi.spyOn(exportBinary, "exportModularCabinetV0GlbBinary").mockResolvedValue(
      syntheticBinaryOk({
        relativePath: "models/designer-sofa.glb",
        buffer: sampleBytes(32),
      }),
    );

    const result = await exportModularAndWrite(undefined, { publicRoot });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected write-public policy failure");
    }
    expect(result.failedAt).toBe("write-public");
    expect(result.error).toMatch(/not allowed|system-generated|Static designer/i);
    expect(result.stages).toContain("write-public");
    expect(existsSync(path.join(publicRoot, "models"))).toBe(false);
  });

  it("failure: write-public when relativePath has path traversal", async () => {
    const publicRoot = tempPublicRoot();
    vi.spyOn(assetPipeline, "validateGlbAsset").mockResolvedValue({
      valid: true,
      errors: [],
      nodeCount: 1,
      triangleCount: 1,
    });
    vi.spyOn(exportBinary, "exportModularCabinetV0GlbBinary").mockResolvedValue(
      syntheticBinaryOk({
        relativePath: `${GENERATED_GLB_PATH_MARKER}../escape.glb`,
        buffer: sampleBytes(32),
      }),
    );

    const result = await exportModularAndWrite(undefined, { publicRoot });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected write-public traversal failure");
    }
    expect(result.failedAt).toBe("write-public");
    expect(result.error).toMatch(/traversal|absolute/i);
    expect(result.stages).toContain("write-public");
  });

  it("failure: write-public when relativePath is blob:", async () => {
    const publicRoot = tempPublicRoot();
    vi.spyOn(assetPipeline, "validateGlbAsset").mockResolvedValue({
      valid: true,
      errors: [],
      nodeCount: 1,
      triangleCount: 1,
    });
    vi.spyOn(exportBinary, "exportModularCabinetV0GlbBinary").mockResolvedValue(
      syntheticBinaryOk({
        relativePath: "blob:http://local/preview",
        buffer: sampleBytes(32),
      }),
    );

    const result = await exportModularAndWrite(undefined, { publicRoot });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("expected write-public blob failure");
    }
    expect(result.failedAt).toBe("write-public");
    expect(result.error).toMatch(/blob/i);
    expect(result.stages).toContain("write-public");
  });
});
