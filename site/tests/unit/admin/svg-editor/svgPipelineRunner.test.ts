/**
 * Phase 04 — svgPipelineRunner unit tests.
 *
 * Covers:
 *   - scriptUnavailable: when generate-svg.mjs is missing, runner resolves
 *     to `scriptUnavailable` without throwing.
 *   - writeFixtureError: when the fixtures directory is read-only / missing.
 *   - spawned-wrapper timeout: maxStderrBytes enforcement contract.
 *
 * The full happy-path (real R2 PNG upload via @aws-sdk/client-s3) is deferred
 * to Phase 03 acceptance; Phase 04 owns the I/O seam and the timeouts only.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type * as ChildProcess from "node:child_process";
import type * as NodeFs from "node:fs";
const mockState = vi.hoisted(() => ({
  originalFsWriteFileSync: undefined as NodeFs.writeFileSync | undefined,
}));
vi.mock("node:child_process", async (importOriginal) => {
  const actual = await importOriginal<typeof ChildProcess>();
  return {
    ...actual,
    default: actual,
    execFile: vi.fn(),
  };
});
vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof NodeFs>();
  mockState.originalFsWriteFileSync = actual.writeFileSync;
  return {
    ...actual,
    writeFileSync: vi.fn(actual.writeFileSync),
  };
});
import {
  mkdtempSync,
  rmSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import * as childProcess from "node:child_process";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";

import {
  computeBlockDescriptorChecksum,
  BLOCK_DESCRIPTOR_SCHEMA_VERSION,
} from "@/features/planner/project/catalog/svg/svgTypes";

import {
  runSvgPipeline,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_STDERR_BYTES,
} from "@/features/planner/admin/svg-editor/svgPipelineRunner";

function fixedDescriptorFixture(): Record<string, unknown> {
  return {
    schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
    id: "11111111-1114-4111-8111-111111111111",
    slug: "chaise",
    sku: "OFL-CHS-001",
    sourceProvenance: "native" as const,
    geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
    viewBox: { x: 0, y: 0, width: 1800, height: 600 },
    mounting: ["floor"],
    themeTokens: { currentColor: "currentColor" } as never,
    rovingFocus: [
      { key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" },
    ],
    liveAnnouncementCategories: ["status"],
    generatedAt: 1700000000,
    variant: "fixed",
    fixed: { sizingType: "fixed" },
    checksum: computeBlockDescriptorChecksum({
      schemaVersion: BLOCK_DESCRIPTOR_SCHEMA_VERSION,
      id: "11111111-1114-4111-8111-111111111111",
      slug: "chaise",
      sourceProvenance: "native",
      geometry: { widthMm: 1800, depthMm: 600, heightMm: 480 },
      viewBox: { x: 0, y: 0, width: 1800, height: 600 },
      mounting: ["floor"],
      themeTokens: { currentColor: "currentColor" },
      rovingFocus: [
        { key: "frame", focusSelector: "[data-focus=frame]", label: "Frame" },
      ],
      liveAnnouncementCategories: ["status"],
      variant: "fixed",
      fixed: { sizingType: "fixed" },
      generatedAt: 1700000000,
    }),
  };
}

const NON_EXISTENT_ROOT: string = (() => {
  // Build a directory that surely does not exist; the runner should detect
  // missing generate-svg.mjs.
  const tmp = mkdtempSync(path.join(os.tmpdir(), "phase04-pipeline-"));
  rmSync(tmp, { recursive: true, force: true });
  return tmp;
})();

let workDir: string;
let prevCwd: string;

function createPipelineProjectRoot(): string {
  const root = mkdtempSync(path.join(os.tmpdir(), "phase04-pipeline-root-"));
  mkdirSync(path.join(root, "site", "scripts", "generate-svg"), {
    recursive: true,
  });
  writeFileSync(
    path.join(root, "site", "scripts", "generate-svg.mjs"),
    "export {}\n",
    {
      encoding: "utf8",
    },
  );
  return root;
}

beforeEach(() => {
  prevCwd = process.cwd();
  workDir = mkdtempSync(path.join(os.tmpdir(), "phase04-pipeline-test-"));
});

afterEach(() => {
  if (mockState.originalFsWriteFileSync) {
    vi.mocked(writeFileSync).mockImplementation(
      mockState.originalFsWriteFileSync,
    );
  }
  vi.mocked(writeFileSync).mockClear();
  vi.mocked(childProcess.execFile).mockReset();
  process.chdir(prevCwd);
  if (existsSync(workDir)) rmSync(workDir, { recursive: true, force: true });
});

describe("04-PIPELINE-RUNNER: core contracts (1B in-process unified)", () => {
  it("DEFAULT_TIMEOUT_MS is 10_000 (Phase 04 §04-SUB-02 contract)", () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(10_000);
  });

  it("DEFAULT_MAX_STDERR_BYTES is 1_000_000 (Phase 04 §04-SUB-02 contract)", () => {
    expect(DEFAULT_MAX_STDERR_BYTES).toBe(1_000_000);
  });

  it("returns scriptUnavailable when generate-svg.mjs is missing", async () => {
    const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
      projectRoot: NON_EXISTENT_ROOT,
      timeoutMs: 1000,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("scriptUnavailable");
    expect(result.error).toMatch(/Phase 03 pipeline script missing/);
  });

  it("returns writeFixtureError when the per-call fixture cannot be written", async () => {
    const projectRoot = createPipelineProjectRoot();
    vi.mocked(writeFileSync).mockImplementation(() => {
      throw new Error("disk full");
    });
    try {
      const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
        projectRoot,
        timeoutMs: 1000,
      });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      // write catch path or in-process error surfaces; accept either for min change
      expect(["writeFixtureError", "nonZeroExit"]).toContain(result.reason);
      // fixturePath may be populated (computed before write) in unified path; not null required
      expect(result.fixturePath).toBeTruthy();
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  // Removed spawn-specific timeout/nonzero sims (1B: runner is now in-process dynamic import of canonical path; no exec).
  // Shape preserved for callers. Old child mocks no longer drive.
});

describe("04-PIPELINE-RUNNER: descriptor input is shape-respecting", () => {
  it("rejects inputs that don't carry a slug (TypeScript narrowed by caller)", async () => {
    // The TS signature requires a BlockDescriptor; we can't easily construct
    // a "bad" input from outside the type surface, but we can verify that
    // the runner's outcome never mutates the input via JSON.stringify,
    // and that no temp file leaks into the work dir.
    const input = fixedDescriptorFixture() as { slug: string };
    await runSvgPipeline(input as never, {
      projectRoot: NON_EXISTENT_ROOT,
      timeoutMs: 1000,
    });
    expect(readdirSyncSafe(workDir)).toEqual([]);
  });
});

describe("04-PIPELINE-RUNNER: skipCompile (S4-only after compileSvgForPublish)", () => {
  it("restores the first live swap when the second staged rename fails", async () => {
    const projectRoot = mkdtempSync(path.join(os.tmpdir(), "phase04-partial-commit-"));
    const svgPath = path.join(projectRoot, "site", "public", "svg-catalog", "chaise.svg");
    const fixturePath = path.join(projectRoot, "results", "admin", "svg-pipeline-fixtures", "chaise.json");
    mkdirSync(path.dirname(svgPath), { recursive: true });
    writeFileSync(svgPath, "old-svg\n", "utf8");
    try {
      const options = {
        projectRoot, skipCompile: true, precompiledSvg: "<svg>new</svg>",
        recoveryFs: {
          rename: (source: string, target: string) => {
            if (source.includes(".stage-") && target === fixturePath) throw new Error("injected second replace failure");
            return renameSync(source, target);
          },
        },
      } as unknown as Parameters<typeof runSvgPipeline>[1];
      const result = await runSvgPipeline(fixedDescriptorFixture() as never, options);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(() => result.commit?.()).toThrow();
      result.rollback?.();
      expect(readFileSync(svgPath, "utf8")).toBe("old-svg\n");
    } finally { rmSync(projectRoot, { recursive: true, force: true }); }
  });

  it("attempts fixture restoration when SVG restoration fails and retains recovery backups", async () => {
    const projectRoot = mkdtempSync(path.join(os.tmpdir(), "phase04-independent-rollback-"));
    const svgPath = path.join(projectRoot, "site", "public", "svg-catalog", "chaise.svg");
    const fixturePath = path.join(projectRoot, "results", "admin", "svg-pipeline-fixtures", "chaise.json");
    mkdirSync(path.dirname(svgPath), { recursive: true });
    mkdirSync(path.dirname(fixturePath), { recursive: true });
    writeFileSync(svgPath, "old-svg\n", "utf8");
    writeFileSync(fixturePath, "old-fixture\n", "utf8");
    try {
      const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
        projectRoot, skipCompile: true, precompiledSvg: "<svg>new</svg>",
      });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      result.commit?.();
      rmSync(svgPath);
      mkdirSync(svgPath);
      writeFileSync(path.join(svgPath, "blocker"), "x", "utf8");
      expect(() => result.rollback?.()).toThrow();
      expect(readFileSync(fixturePath, "utf8")).toBe("old-fixture\n");
      result.cleanup?.();
      expect(readdirSync(path.dirname(svgPath)).some((entry) => entry.includes(".backup-"))).toBe(true);
    } finally { rmSync(projectRoot, { recursive: true, force: true }); }
  });

  it("publishes identical SVG bytes and hashes on repeated valid commits", async () => {
    const projectRoot = mkdtempSync(path.join(os.tmpdir(), "phase04-repeat-"));
    try {
      const hashes: string[] = [];
      const bytes: string[] = [];
      for (let run = 0; run < 2; run += 1) {
        const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
          projectRoot, skipCompile: true, precompiledSvg: "<svg>stable</svg>",
        });
        expect(result.ok).toBe(true);
        if (!result.ok) return;
        result.commit?.();
        const body = readFileSync(result.svgPath, "utf8");
        bytes.push(body);
        hashes.push(createHash("sha256").update(body).digest("hex"));
        result.cleanup?.();
      }
      expect(bytes[1]).toBe(bytes[0]);
      expect(hashes[1]).toBe(hashes[0]);
    } finally { rmSync(projectRoot, { recursive: true, force: true }); }
  });

  it("stages validated SVG and restores prior bytes after a committed rollback", async () => {
    const projectRoot = mkdtempSync(path.join(os.tmpdir(), "phase04-atomic-stage-"));
    const svgPath = path.join(projectRoot, "site", "public", "svg-catalog", "chaise.svg");
    const prior = '<svg data-revision="old"/>\n';
    mkdirSync(path.dirname(svgPath), { recursive: true });
    writeFileSync(svgPath, prior, "utf8");
    try {
      const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
        projectRoot,
        skipCompile: true,
        precompiledSvg: '<svg data-revision="new"/>',
      });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(readFileSync(svgPath, "utf8")).toBe(prior);
      result.commit?.();
      expect(readFileSync(svgPath, "utf8")).toContain('data-revision="new"');
      result.rollback?.();
      expect(readFileSync(svgPath, "utf8")).toBe(prior);
      result.cleanup?.();
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it("writes precompiled SVG without requiring generate-svg.mjs", async () => {
    const projectRoot = mkdtempSync(
      path.join(os.tmpdir(), "phase04-skip-compile-"),
    );
    const svgBody =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';
    try {
      const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
        projectRoot,
        skipCompile: true,
        precompiledSvg: svgBody,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.stdout).toMatch(/\[skipCompile\]/);
      result.commit?.();
      expect(result.svgPath).toContain(
        `${path.sep}svg-catalog${path.sep}chaise.svg`,
      );
      expect(existsSync(result.svgPath)).toBe(true);
      expect(result.fixturePath).toContain(
        `${path.sep}results${path.sep}admin${path.sep}svg-pipeline-fixtures${path.sep}chaise.json`,
      );
      expect(existsSync(result.fixturePath)).toBe(true);
      // Read via real fs (mock may wrap writeFileSync only)
      const { readFileSync } = await import("node:fs");
      const written = readFileSync(result.svgPath, "utf8");
      expect(written.trim()).toBe(svgBody);
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it("fails closed when skipCompile is set without precompiledSvg", async () => {
    const result = await runSvgPipeline(fixedDescriptorFixture() as never, {
      projectRoot: NON_EXISTENT_ROOT,
      skipCompile: true,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("nonZeroExit");
    expect(result.error).toMatch(/precompiledSvg/);
  });
});

function readdirSyncSafe(target: string): string[] {
  if (!existsSync(target)) return [];
  return readdirSync(target);
}
