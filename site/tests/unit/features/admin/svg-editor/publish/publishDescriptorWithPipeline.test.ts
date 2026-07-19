/**
 * Fail-closed publish helper: compileSvgForPublish (S1–S3) → pipeline (S4) → persist.
 * Covers success, compile fail, pipeline !ok, pipeline throw, persist-after-pipeline failure,
 * invalid payload (no compile/pipeline/persist calls), real compile authority,
 * and Vitest isolation (no canonical catalog mutation).
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, it, expect, vi } from "vitest";

import { BLOCK_DESCRIPTOR_SCHEMA_VERSION } from "@/features/planner/catalog/svg/svgTypes";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { PipelineResult } from "@/features/admin/svg-editor/publish/svgPipelineRunner";
import { runSvgPipeline } from "@/features/admin/svg-editor/publish/svgPipelineRunner";
import {
  persistBlockDescriptor,
  type PersistResult,
} from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import type { SvgCompileStagesResult } from "@/features/planner/asset-engine/svg/runSvgCompileStages";
import { compileSvgForPublish } from "@/features/planner/asset-engine/svg/compileSvgForPublish";
import {
  publishDescriptorWithPipeline,
  sha256Utf8,
} from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import {
  assertCanonicalCatalogUnchanged,
  snapshotCanonicalCatalog,
} from "../../../../../helpers/adminCatalogIsolation";

const isProductsDatabaseConfigured = vi.hoisted(() => vi.fn(() => false));

vi.mock("@/platform/drizzle/databaseUrls", () => ({
  isProductsDatabaseConfigured: () => isProductsDatabaseConfigured(),
}));

const tempDirs: string[] = [];

/** Default disk authority so ambient .env.local db flip does not poison disk-path tests. */
beforeEach(() => {
  process.env.SVG_RELEASE_AUTHORITY = "disk";
  process.env.SVG_DISK_WRITE = "1";
  isProductsDatabaseConfigured.mockReturnValue(false);
});

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  delete process.env.SVG_RELEASE_AUTHORITY;
  delete process.env.SVG_DISK_WRITE;
  isProductsDatabaseConfigured.mockReturnValue(false);
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

  it("returns quality_gate failure and skips pipeline+persist when SVG has currentColor fill", async () => {
    const compileSvg = vi.fn(async (): Promise<SvgCompileStagesResult> => ({
      ok: true,
      stages: ["svg-s1-normalize", "svg-s2-compile", "svg-s3-sanitize-optimize"],
      normalized: {
        slug: "test-block",
        variant: "union",
        viewBox: { x: 0, y: 0, width: 100, height: 100 },
        blocks: [{ x: 0, y: 0, width: 100, height: 100, id: "body" }],
      },
      svg: '<svg xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0 0h1v1H0z"/></svg>',
    }));
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/^quality_gate:/);
    expect(result.error).toMatch(/image-unsafe paint/);
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
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
 * Dual-write safety on the disk-authority path (enabled dual-write ≠ cutover).
 * When dbRepository+artifactStore are injected: real artifacts + fail-closed rollback.
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
    if (!result.success) throw new Error("expected result.success");
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
    if (!result.success) throw new Error("expected result.success");
    expect(result.idempotent).toBeUndefined();
    expect(runPipeline).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledOnce();
  });

  it("dual-write: invokes dbRepository.publish after disk commit and still succeeds", async () => {
    const publish = vi.fn(async () => undefined);
    const putText = vi.fn(async () => undefined);
    const putBytes = vi.fn(async () => undefined);
    const pngBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const pngChecksum = "d".repeat(64);
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => pipelineOk(),
      persist: () => persistOk(),
      actorId: "admin-42",
      rasterizePng: () => ({ png: pngBuf, checksum: pngChecksum }),
      dbRepository: {
        publish,
        load: async () => null,
        updateProductPointer: vi.fn(async () => undefined),
      } as never,
      artifactStore: { putText, putBytes },
    });
    expect(result.success).toBe(true);
    expect(publish).toHaveBeenCalledOnce();
    const [revision, definition, artifacts] = publish.mock.calls[0] ?? [];
    expect(revision).toMatchObject({
      definitionTypeId: "test-block",
      reason: "publish",
      actorId: "admin-42",
      revisionId: expect.stringMatching(/^test-block-r-[a-f0-9]{20}$/),
      artifactChecksums: expect.objectContaining({
        png: pngChecksum,
        svg: sha256Utf8(compileOk().svg),
      }),
    });
    expect(definition).toMatchObject({ typeId: "test-block" });
    expect(definition).toMatchObject({
      lifecycle: { ownerId: "admin-42", status: "published" },
      parts: [expect.objectContaining({ kind: "rect", width: 100, height: 100 })],
    });
    expect(artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "svg" }),
        expect.objectContaining({ kind: "descriptor" }),
        expect.objectContaining({ kind: "png", checksum: pngChecksum }),
      ]),
    );
    const revisionId = revision?.revisionId as string;
    expect(putText).toHaveBeenCalledTimes(2);
    expect(putText).toHaveBeenCalledWith(
      `svg-revisions/${revisionId}/symbol.svg`,
      compileOk().svg,
      "image/svg+xml",
    );
    expect(putBytes).toHaveBeenCalledWith(
      `svg-revisions/${revisionId}/master.png`,
      pngBuf,
      "image/png",
    );
    expect(artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "svg",
          storageKey: `svg-revisions/${revisionId}/symbol.svg`,
        }),
        expect.objectContaining({
          kind: "png",
          storageKey: `svg-revisions/${revisionId}/master.png`,
        }),
      ]),
    );
  });

  it("fails closed and rolls back when immutable artifact upload fails", async () => {
    const publish = vi.fn(async () => undefined);
    const persistRollback = vi.fn();
    const pipelineRollback = vi.fn();
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), rollback: pipelineRollback }),
      persist: () => ({ ...persistOk(), rollback: persistRollback }),
      rasterizePng: () => ({ png: Buffer.from([1]), checksum: "e".repeat(64) }),
      dbRepository: {
        publish,
        load: async () => null,
      } as never,
      artifactStore: {
        putText: async () => {
          throw new Error("R2 unavailable");
        },
        putBytes: vi.fn(async () => undefined),
      },
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBe(
      "500.storage: Immutable artifact upload failed. R2 unavailable",
    );
    expect(publish).not.toHaveBeenCalled();
    expect(persistRollback).toHaveBeenCalledOnce();
    expect(pipelineRollback).toHaveBeenCalledOnce();
  });

  it("DB-SVG-08: unchanged immutable DB revision is a no-op before disk writes", async () => {
    const compile = compileOk();
    const revisionId = `test-block-r-${sha256Utf8(
      `${validDescriptor.checksum}:${sha256Utf8(compile.svg)}`,
    ).slice(0, 20)}`;
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());
    const updateProductPointer = vi.fn(async () => undefined);

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compile,
      runPipeline,
      persist,
      dbRepository: {
        publish: vi.fn(),
        updateProductPointer,
        load: async () => ({
          revision: {
            schemaVersion: 1,
            revisionId,
            definitionTypeId: validDescriptor.slug,
            definitionVersion: 4,
            compilerVersion: "oando-asset-engine-v1",
            sourceRevision: 3,
            artifactChecksums: {
              descriptor: validDescriptor.checksum,
              svg: sha256Utf8(compile.svg),
              png: sha256Utf8(compile.svg),
              thumbnails: {},
            },
            validation: { valid: true, diagnostics: [] },
            actorId: "admin-1",
            publishedAt: "2026-07-16T00:00:00.000Z",
            reason: "publish",
          },
          definition: {} as never,
          artifacts: [],
        }),
      } as never,
      artifactStore: { putText: vi.fn(async () => undefined) },
    });

    expect(result).toMatchObject({ success: true, idempotent: true });
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
    expect(updateProductPointer).toHaveBeenCalledWith("test-block", revisionId);
  });

  it("dual-write: DB failure fails publish and rolls back disk commit", async () => {
    const persistRollback = vi.fn();
    const pipelineRollback = vi.fn();
    const pipelineCleanup = vi.fn();
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({
        ...pipelineOk(),
        rollback: pipelineRollback,
        cleanup: pipelineCleanup,
      }),
      persist: () => ({
        ...persistOk(),
        rollback: persistRollback,
      }),
      rasterizePng: () => ({ png: Buffer.from([2]), checksum: "f".repeat(64) }),
      dbRepository: {
        publish: async () => {
          throw new Error("db down");
        },
        load: async () => null,
      } as never,
      artifactStore: {
        putText: vi.fn(async () => undefined),
        putBytes: vi.fn(async () => undefined),
      },
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Products DB publish failed");
    expect(result.error).toContain("db down");
    expect(persistRollback).toHaveBeenCalledOnce();
    expect(pipelineRollback).toHaveBeenCalledOnce();
    expect(pipelineCleanup).toHaveBeenCalledOnce();
  });

  it("dual-write: missing putBytes fails closed and rolls back disk", async () => {
    const persistRollback = vi.fn();
    const pipelineRollback = vi.fn();
    const publish = vi.fn(async () => undefined);
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), rollback: pipelineRollback }),
      persist: () => ({ ...persistOk(), rollback: persistRollback }),
      rasterizePng: () => ({ png: Buffer.from([3]), checksum: "a".repeat(64) }),
      dbRepository: {
        publish,
        load: async () => null,
      } as never,
      artifactStore: {
        putText: vi.fn(async () => undefined),
        // putBytes intentionally absent — binary PNG masters require it
      },
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("putBytes");
    expect(publish).not.toHaveBeenCalled();
    expect(persistRollback).toHaveBeenCalledOnce();
    expect(pipelineRollback).toHaveBeenCalledOnce();
  });

  it("dual-write without artifactStore fails closed (not silent disk-only success)", async () => {
    const persistRollback = vi.fn();
    const pipelineRollback = vi.fn();
    const publish = vi.fn(async () => undefined);
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), rollback: pipelineRollback }),
      persist: () => ({ ...persistOk(), rollback: persistRollback }),
      dbRepository: {
        publish,
        load: async () => null,
      } as never,
      // artifactStore omitted while dbRepository present = misconfigured dual-write
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Immutable SVG artifact storage is not configured");
    expect(publish).not.toHaveBeenCalled();
    expect(persistRollback).toHaveBeenCalledOnce();
    expect(pipelineRollback).toHaveBeenCalledOnce();
  });

  it("rolls back when persist throws after pipeline success", async () => {
    const rollback = vi.fn();
    const cleanup = vi.fn();
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({ ...pipelineOk(), rollback, cleanup }),
      persist: () => {
        throw new Error("persist exploded");
      },
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Descriptor persistence threw");
    expect(result.error).toContain("persist exploded");
    expect(rollback).toHaveBeenCalledOnce();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("rolls back when pipeline.commit throws after persist", async () => {
    const persistRollback = vi.fn();
    const pipelineRollback = vi.fn();
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => ({
        ...pipelineOk(),
        commit: () => {
          throw new Error("commit denied");
        },
        rollback: pipelineRollback,
      }),
      persist: () => ({
        ...persistOk(),
        rollback: persistRollback,
      }),
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("Publication commit failed");
    expect(result.error).toContain("commit denied");
    expect(persistRollback).toHaveBeenCalledOnce();
    expect(pipelineRollback).toHaveBeenCalledOnce();
  });

  it("SVG_RELEASE_AUTHORITY=db fails closed before disk when dual-write deps missing (API path share)", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(false);
    const compileSvg = vi.fn(async () => compileOk());
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg,
      runPipeline,
      persist,
    });

    expect(result).toEqual({
      success: false,
      error: "DB release authority requires PRODUCTS_DATABASE_URL",
    });
    expect(compileSvg).not.toHaveBeenCalled();
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db fails closed when DB configured but R2 deps missing", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(true);
    const compileSvg = vi.fn(async () => compileOk());

    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg,
      runPipeline: async () => pipelineOk(),
      persist: () => persistOk(),
    });

    expect(result).toEqual({
      success: false,
      error: "DB release authority requires reachable R2 catalog storage",
    });
    expect(compileSvg).not.toHaveBeenCalled();
  });

  it("SVG_RELEASE_AUTHORITY=db proceeds when dual-write deps are injected (still ≠ cutover)", async () => {
    process.env.SVG_RELEASE_AUTHORITY = "db";
    isProductsDatabaseConfigured.mockReturnValue(true);
    const putText = vi.fn(async () => undefined);
    const putBytes = vi.fn(async () => undefined);
    const publish = vi.fn(async () => undefined);
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileOk(),
      runPipeline: async () => pipelineOk(),
      persist: () => persistOk(),
      rasterizePng: () => ({ png: Buffer.from([9]), checksum: "b".repeat(64) }),
      dbRepository: {
        publish,
        load: async () => null,
      } as never,
      artifactStore: { putText, putBytes },
    });
    expect(result.success).toBe(true);
    expect(publish).toHaveBeenCalledOnce();
    expect(putText).toHaveBeenCalled();
    expect(putBytes).toHaveBeenCalled();
  });
});

/**
 * Residual A-W1: real compileSvgForPublish authority + isolation fail-closed.
 * Temp inventory only — never mutate committed descriptors / svg-catalog.
 */
describe("publishDescriptorWithPipeline real compile + isolation (A-W1)", () => {
  it("real compile failure is fail-closed: no S4 pipeline and no persist", async () => {
    const before = snapshotCanonicalCatalog();
    const runPipeline = vi.fn(async () => pipelineOk());
    const persist = vi.fn(() => persistOk());

    // Real asset-engine entry: empty slug fails S1 normalize → ok:false.
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: async () => compileSvgForPublish({ ...validDescriptor, slug: "" }),
      runPipeline,
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_failed");
    expect(result.error).toMatch(/slug|normalize/i);
    expect(runPipeline).not.toHaveBeenCalled();
    expect(persist).not.toHaveBeenCalled();
    assertCanonicalCatalogUnchanged(before);
  });

  it("real compile success then isolated S4 + persist does not touch canonical catalog", async () => {
    const before = snapshotCanonicalCatalog();
    const projectRoot = mkdtempSync(path.join(tmpdir(), "aw1-publish-root-"));
    const descriptorDir = mkdtempSync(path.join(tmpdir(), "aw1-publish-desc-"));
    tempDirs.push(projectRoot, descriptorDir);
    mkdirSync(path.join(projectRoot, "site", "public", "svg-catalog"), {
      recursive: true,
    });
    mkdirSync(path.join(projectRoot, "results", "admin", "svg-pipeline-fixtures"), {
      recursive: true,
    });

    // Strip checksum so persist freeze recomputes cleanly for temp dir write.
    const input = { ...validDescriptor, checksum: undefined as unknown as string };

    const result = await publishDescriptorWithPipeline(input, {
      parsePayload: (raw) => {
        const parsed = raw as BlockDescriptor;
        return { ok: true, value: { ...parsed, checksum: validDescriptor.checksum } };
      },
      compileSvg: compileSvgForPublish,
      runPipeline: (descriptor, options) =>
        runSvgPipeline(descriptor, { ...options, projectRoot }),
      persist: (raw) => persistBlockDescriptor(raw, { dir: descriptorDir }),
    });

    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    expect(result.descriptor.slug).toBe("test-block");
    const svgOnDisk = path.join(
      projectRoot,
      "site",
      "public",
      "svg-catalog",
      "test-block.svg",
    );
    expect(existsSync(svgOnDisk)).toBe(true);
    expect(readFileSync(svgOnDisk, "utf8")).toMatch(/<svg/i);
    expect(existsSync(path.join(descriptorDir, "test-block.latest.json"))).toBe(
      true,
    );
    assertCanonicalCatalogUnchanged(before);
  });

  it("default (canonical) S4 after real compile fails isolation under Vitest", async () => {
    const before = snapshotCanonicalCatalog();
    const persist = vi.fn(() => persistOk());

    // compile real; pipeline defaults to monorepo public/svg-catalog → guard fails.
    const result = await publishDescriptorWithPipeline(validDescriptor, {
      parsePayload: () => ({ ok: true, value: validDescriptor }),
      compileSvg: compileSvgForPublish,
      // runPipeline: default runSvgPipeline
      persist,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toContain("compiler_failed");
    expect(result.error).toMatch(/Catalog isolation violation/);
    expect(persist).not.toHaveBeenCalled();
    assertCanonicalCatalogUnchanged(before);
  });
});
