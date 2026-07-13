/**
 * Fail-closed publish helper: compileSvgForPublish (S1–S3) → pipeline (S4) → persist.
 * Covers success, compile fail, pipeline !ok, pipeline throw, persist-after-pipeline failure,
 * and invalid payload (no compile/pipeline/persist calls).
 */

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, it, expect, vi } from "vitest";

import { BLOCK_DESCRIPTOR_SCHEMA_VERSION } from "@/features/planner/project/catalog/svg/svgTypes";
import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";
import type { PipelineResult } from "@/features/planner/admin/svg-editor/svgPipelineRunner";
import type { PersistResult } from "@/features/planner/admin/svg-editor/persistBlockDescriptor";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import {
  publishDescriptorWithPipeline,
  sha256Utf8,
} from "@/features/planner/admin/svg-editor/publishDescriptorWithPipeline";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

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

function compileOk(): SvgCompileStagesResult {
  return {
    ok: true,
    stages: ["svg-s1-normalize", "svg-s2-compile", "svg-s3-sanitize-optimize"],
    normalized: {
      slug: "test-block",
      variant: "union",
      viewBox: { x: 0, y: 0, width: 100, height: 100 },
      blocks: [{ x: 0, y: 0, width: 100, height: 100 }],
    },
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0 0h100v100H0z"/></svg>',
  };
}

function compileErr(message = "normalize boom"): SvgCompileStagesResult {
  return {
    ok: false,
    stages: ["svg-s1-normalize"],
    failedAt: "svg-s1-normalize",
    error: message,
  };
}

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
  it("rejects incomplete/contradictory products before compile (Phase 2 released contract)", async () => {
    const broken = {
      ...validDescriptor,
      geometry: { ...validDescriptor.geometry, widthMm: 0 },
    };
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    const result = await publishDescriptorWithPipeline(broken, {
      parsePayload: () => ({ ok: true, value: broken }),
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/released_contract/);
    expect(compileSvg).not.toHaveBeenCalled();
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it("runs compileSvg then pipeline before persist and returns success when all ok", async () => {
    const order: string[] = [];
    const compileSvg = vi.fn(async () => {
      order.push("compile");
      return compileOk();
    });
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
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result).toEqual({ success: true, descriptor: validDescriptor });
    expect(order).toEqual(["compile", "pipeline", "persist"]);
    expect(compileSvg).toHaveBeenCalledWith(validDescriptor);
    // S4 must reuse validated SVG — skip S1–S3 recompile on pipeline.
    expect(runPipeline).toHaveBeenCalledWith(validDescriptor, {
      skipCompile: true,
      precompiledSvg: compileOk().svg,
    });
    expect(persist).toHaveBeenCalledWith(validDescriptor);
  });

  it("returns failure when post-commit cleanup fails", async () => {
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), cleanup: () => { throw new Error("backup cleanup denied"); } }),
      persist: () => persistOk(),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("cleanup incomplete");
    expect(result.error).toContain("backup cleanup denied");
  });

  it("returns success:false and skips pipeline+persist when compileSvg !ok", async () => {
    const compileSvg = vi.fn(async () => compileErr("empty blocks"));
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_failed");
    expect(result.error).toContain("empty blocks");
    expect(result.error).toContain("failedAt=svg-s1-normalize");
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it("returns success:false and skips persist when pipeline !ok", async () => {
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineErr("geometry invalid"));
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_failed");
    expect(result.error).toContain("geometry invalid");
    expect(compileSvg).toHaveBeenCalledOnce();
    expect(persist).not.toHaveBeenCalled();
  });

  it("returns success:false and skips persist when pipeline throws", async () => {
    const compileSvg = vi.fn(async () => compileOk());
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
      compileSvg,
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
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistErr("lock busy"));
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(compileSvg).toHaveBeenCalledOnce();
    expect(runPipeline).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("500.io");
    expect(result.error).toContain("lock busy");
  });

  it("restores prior SVG and descriptor bytes when descriptor persistence fails after the pipeline writes", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "atomic-svg-publish-"));
    tempDirs.push(dir);
    const svgPath = path.join(dir, "test-block.svg");
    const descriptorPath = path.join(dir, "test-block.latest.json");
    const priorSvg = '<svg data-revision="old"/>\n';
    const priorDescriptor = '{"revision":7,"checksum":"old"}\n';
    writeFileSync(svgPath, priorSvg, "utf8");
    writeFileSync(descriptorPath, priorDescriptor, "utf8");

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => {
        writeFileSync(svgPath, '<svg data-revision="new"/>\n', "utf8");
        return { ...pipelineOk(), svgPath, rollback: () => writeFileSync(svgPath, priorSvg, "utf8") };
      },
      persist: () => {
        writeFileSync(descriptorPath, '{"revision":8,"checksum":"new"}\n', "utf8");
        return {
          ...persistErr("descriptor fsync failed"),
          rollback: () => writeFileSync(descriptorPath, priorDescriptor, "utf8"),
        };
      },
    });

    expect(result.success).toBe(false);
    expect(readFileSync(svgPath, "utf8")).toBe(priorSvg);
    expect(readFileSync(descriptorPath, "utf8")).toBe(priorDescriptor);
  });

  it("still rolls back the SVG when descriptor rollback itself throws", async () => {
    const rollbackSvg = vi.fn();
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), rollback: rollbackSvg }),
      persist: () => ({
        ...persistErr("descriptor write failed"),
        rollback: () => { throw new Error("descriptor rollback failed"); },
      }),
    });

    expect(result.success).toBe(false);
    expect(rollbackSvg).toHaveBeenCalledOnce();
    if (result.success) return;
    expect(result.error).toContain("rollback incomplete");
  });

  it("returns success:false on invalid payload without calling compile, pipeline or persist", async () => {
    const compileSvg = vi.fn(async () => compileOk());
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
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("422.invalid");
    expect(compileSvg).not.toHaveBeenCalled();
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it("returns success:false and skips pipeline+persist when compileSvg throws", async () => {
    const compileSvg = vi.fn(async () => {
      throw new Error("compile stages crashed");
    });
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_exception");
    expect(result.error).toContain("compile stages crashed");
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });
});

describe("publishDescriptorWithPipeline skipCompile path (S4 reuses S1–S3 SVG)", () => {
  it("always passes skipCompile:true and exact precompiledSvg from compile result", async () => {
    const compiledSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle r="25"/></svg>';
    const compileSvg = vi.fn(async (): Promise<SvgCompileStagesResult> => ({
      ...compileOk(),
      svg: compiledSvg,
    }));
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(true);
    expect(runPipeline).toHaveBeenCalledOnce();
    expect(runPipeline).toHaveBeenCalledWith(validDescriptor, {
      skipCompile: true,
      precompiledSvg: compiledSvg,
    });
    // Must not re-invoke compile via pipeline options (no skipCompile:false / omitted).
    const pipelineOpts = runPipeline.mock.calls[0]?.[1];
    expect(pipelineOpts).toEqual({
      skipCompile: true,
      precompiledSvg: compiledSvg,
    });
    expect(pipelineOpts).not.toHaveProperty("skipCompile", false);
  });

  it("still passes skipCompile options when pipeline fails after successful compile", async () => {
    const compiledSvg = compileOk().svg;
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineErr("S4 write failed"));
    const persist = vi.fn(() => persistOk());
    const parsePayload = vi.fn(() => ({
      ok: true as const,
      value: validDescriptor,
    }));

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload,
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    expect(runPipeline).toHaveBeenCalledWith(validDescriptor, {
      skipCompile: true,
      precompiledSvg: compiledSvg,
    });
    expect(persist).not.toHaveBeenCalled();
  });
});

/**
 * Disk-path mapping for dual publish safety (not Products DB transaction yet).
 * ADM-PUB-03 / DB-SVG-06 (ordered dual write) · DB-SVG-07 (prior live) · DB-SVG-08 (idempotent).
 */
describe("publishDescriptorWithPipeline dual-write safety (ADM-PUB-03 / DB-SVG-06..08 disk path)", () => {
  it("ADM-PUB-03 / DB-SVG-06: success only after compile then pipeline then persist (one operation)", async () => {
    const order: string[] = [];
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => {
        order.push("compile");
        return compileOk();
      },
      runPipeline: async () => {
        order.push("pipeline");
        return pipelineOk();
      },
      persist: () => {
        order.push("persist");
        return persistOk();
      },
    });
    expect(result.success).toBe(true);
    expect(order).toEqual(["compile", "pipeline", "persist"]);
  });

  it("ADM-PUB-03: never succeeds when any dual-write step fails (partial impossible)", async () => {
    const cases = await Promise.all([
      publishDescriptorWithPipeline(validDescriptor, {
        parsePayload: () => ({ ok: true, value: validDescriptor }),
        compileSvg: async () => compileErr(),
        runPipeline: async () => pipelineOk(),
        persist: () => persistOk(),
      }),
      publishDescriptorWithPipeline(validDescriptor, {
        parsePayload: () => ({ ok: true, value: validDescriptor }),
        compileSvg: async () => compileOk(),
        runPipeline: async () => pipelineErr(),
        persist: () => persistOk(),
      }),
      publishDescriptorWithPipeline(validDescriptor, {
        parsePayload: () => ({ ok: true, value: validDescriptor }),
        compileSvg: async () => compileOk(),
        runPipeline: async () => pipelineOk(),
        persist: () => persistErr(),
      }),
    ]);
    for (const result of cases) {
      expect(result.success).toBe(false);
    }
  });

  it("DB-SVG-07: failed persist after pipeline leaves prior SVG and descriptor pointer live", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "db-svg-07-"));
    tempDirs.push(dir);
    const svgPath = path.join(dir, "test-block.svg");
    const descriptorPath = path.join(dir, "test-block.latest.json");
    const priorSvg = '<svg data-revision="live-prior"/>\n';
    const priorDescriptor = '{"revision":3,"checksum":"prior-live"}\n';
    writeFileSync(svgPath, priorSvg, "utf8");
    writeFileSync(descriptorPath, priorDescriptor, "utf8");

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => {
        writeFileSync(svgPath, '<svg data-revision="new-partial"/>\n', "utf8");
        return {
          ...pipelineOk(),
          svgPath,
          rollback: () => writeFileSync(svgPath, priorSvg, "utf8"),
        };
      },
      persist: () => {
        writeFileSync(descriptorPath, '{"revision":4,"checksum":"new"}\n', "utf8");
        return {
          ...persistErr("pointer update failed"),
          rollback: () => writeFileSync(descriptorPath, priorDescriptor, "utf8"),
        };
      },
    });

    expect(result.success).toBe(false);
    expect(readFileSync(svgPath, "utf8")).toBe(priorSvg);
    expect(readFileSync(descriptorPath, "utf8")).toBe(priorDescriptor);
  });

  it("DB-SVG-08: unchanged released SVG + descriptor is idempotent (no pipeline/persist)", async () => {
    const compiled = compileOk();
    const svgChecksum = sha256Utf8(compiled.svg);
    const compileSvg = vi.fn(async () => compiled);
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg,
      runPipeline,
      persist,
      readReleasedSnapshot: (slug) => {
        expect(slug).toBe("test-block");
        return {
          svgChecksum,
          descriptorChecksum: validDescriptor.checksum,
        };
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.idempotent).toBe(true);
    expect(result.descriptor).toEqual(validDescriptor);
    expect(compileSvg).toHaveBeenCalledOnce();
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it("DB-SVG-08: changed SVG still runs full dual write (not idempotent)", async () => {
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg,
      runPipeline,
      persist,
      readReleasedSnapshot: () => ({
        svgChecksum: "0".repeat(64),
        descriptorChecksum: validDescriptor.checksum,
      }),
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.idempotent).toBeUndefined();
    expect(runPipeline).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
  });
});
