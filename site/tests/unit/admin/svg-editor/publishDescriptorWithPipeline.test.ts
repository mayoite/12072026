/**
 * Fail-closed publish helper: pipeline before persist.
 * Covers success, pipeline !ok, pipeline throw, persist-after-pipeline failure,
 * and invalid payload (no pipeline/persist calls).
 */

import { describe, it, expect, vi } from "vitest";

import { BLOCK_DESCRIPTOR_SCHEMA_VERSION } from "@/features/planner/open3d/catalog/svg/svgTypes";
import type { BlockDescriptor } from "@/features/planner/open3d/catalog/svg/svgTypes";
import type { PipelineResult } from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import type { PersistResult } from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import { publishDescriptorWithPipeline } from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";

const validDescriptor = {
  schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
  id: "11111111-1111-4111-8111-111111111111",
  slug: "test-block",
  sourceProvenance: "native" as const,
  geometry: { widthMm: 100, depthMm: 100, heightMm: 100 },
  viewBox: { x: 0, y: 0, width: 100, height: 100 },
  mounting: ["floor"] as const,
  themeTokens: { currentColor: "currentColor" },
  rovingFocus: [],
  liveAnnouncementCategories: ["status"] as const,
  variant: "fixed" as const,
  fixed: { sizingType: "fixed" as const },
  checksum: "a".repeat(64),
  generatedAt: 1700000000,
} satisfies BlockDescriptor;

function pipelineOk(): PipelineResult {
  return {
    ok: true,
    exitCode: 0,
    stdout: "ok",
    stderr: "",
    fixturePath: "/f",
    svgPath: "/s",
    durationMs: 1,
  };
}

function pipelineErr(message = "compile boom"): PipelineResult {
  return {
    ok: false,
    reason: "nonZeroExit",
    stderr: message,
    stdout: "",
    exitCode: 1,
    error: message,
    fixturePath: null,
  };
}

function persistOk(descriptor: BlockDescriptor = validDescriptor): PersistResult {
  return {
    ok: true,
    descriptor,
    path: "/tmp/test-block.json",
    historyPath: "/tmp/test-block.latest.json",
    replaced: false,
    version: 1,
  };
}

function persistErr(message = "disk full"): PersistResult {
  return {
    ok: false,
    error: {
      reason: "ioError",
      code: "500.io",
      fieldPath: "",
      message,
    },
  };
}

describe("publishDescriptorWithPipeline (fail-closed)", () => {
  it("runs pipeline before persist and returns success when both ok", async () => {
    const order: string[] = [];
    const runPipeline = vi.fn(async () => {
      order.push("pipeline");
      return pipelineOk();
    });
    const persist = vi.fn(() => {
      order.push("persist");
      return persistOk();
    });
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      runPipeline,
      persist,
    });

    expect(result).toEqual({ success: true, descriptor: validDescriptor });
    expect(order).toEqual(["pipeline", "persist"]);
    expect(runPipeline).toHaveBeenCalledWith(validDescriptor);
    expect(persist).toHaveBeenCalledWith(validDescriptor);
  });

  it("returns success:false and skips persist when pipeline !ok", async () => {
    const runPipeline = vi.fn(async () => pipelineErr("geometry invalid"));
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_failed");
    expect(result.error).toContain("geometry invalid");
    expect(persist).not.toHaveBeenCalled();
  });

  it("returns success:false and skips persist when pipeline throws", async () => {
    const runPipeline = vi.fn(async () => {
      throw new Error("spawn crashed");
    });
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_exception");
    expect(result.error).toContain("spawn crashed");
    expect(persist).not.toHaveBeenCalled();
  });

  it("returns success:false when persist fails after successful pipeline (SVG may already be on disk)", async () => {
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistErr("lock busy"));
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      runPipeline,
      persist,
    });

    expect(runPipeline).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("500.io");
    expect(result.error).toContain("lock busy");
  });

  it("returns success:false on invalid payload without calling pipeline or persist", async () => {
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: false as const,
      error: {
        kind: "invalid" as const,
        code: "422.invalid",
        fieldPath: "slug",
        message: "slug must match kebab",
      },
    }));

    const result = await publishDescriptorWithPipeline({ bad: true }, {
      parsePayload,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("422.invalid");
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });
});
