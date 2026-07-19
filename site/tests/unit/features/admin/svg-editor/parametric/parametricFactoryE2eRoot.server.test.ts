import {
  existsSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  cleanupParametricFactoryE2eRoot,
  resolveParametricFactoryE2eRoot,
} from "@/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server";
import { resolveSitePackageRoot } from "@/lib/paths/sitePackageRoot";

const siteRoot = resolveSitePackageRoot();
const repoRoot = path.dirname(siteRoot);
const runIds = new Set<string>();

function envFor(runId: string): NodeJS.ProcessEnv {
  runIds.add(runId);
  return {
    PARAMETRIC_FACTORY_E2E_RUN_ID: runId,
    PARAMETRIC_FACTORY_E2E_ROOT: path.join(
      repoRoot,
      ".e2e-runtime",
      "parametric-factory",
      runId,
    ),
  };
}

afterEach(() => {
  for (const runId of runIds) {
    if (/^[a-z0-9-]{8,64}$/.test(runId)) {
      rmSync(
        path.join(repoRoot, ".e2e-runtime", "parametric-factory", runId),
        { recursive: true, force: true },
      );
    }
  }
  rmSync(path.join(repoRoot, ".e2e-runtime", "outside-factory-0005"), {
    recursive: true,
    force: true,
  });
  runIds.clear();
});

describe("parametricFactoryE2eRoot", () => {
  it("stays disabled without a run id", () => {
    expect(
      resolveParametricFactoryE2eRoot({ env: {}, nodeEnv: "test" }),
    ).toBeUndefined();
  });

  it("returns no override in production", () => {
    expect(
      resolveParametricFactoryE2eRoot({
        env: envFor("production-01"),
        nodeEnv: "production",
      }),
    ).toBeUndefined();
  });

  it("resolves the exact noncanonical descriptor and SVG roots", () => {
    const runId = "factory-0001";
    const resolved = resolveParametricFactoryE2eRoot({
      env: envFor(runId),
      nodeEnv: "test",
    });

    expect(resolved).toBeDefined();
    if (!resolved) throw new Error("expected E2E root");
    expect(resolved.runtimeRoot).toBe(
      path.join(repoRoot, ".e2e-runtime", "parametric-factory", runId),
    );
    expect(resolved.descriptorDir).toBe(
      path.join(resolved.runtimeRoot, "inventory", "descriptors"),
    );
    expect(resolved.lifecycleDir).toBe(
      path.join(resolved.runtimeRoot, "inventory", "lifecycle"),
    );
    expect(resolved.svgDir).toBe(
      path.join(siteRoot, "public", ".e2e-svg-catalog", runId),
    );
    expect(resolved.previewUrl("desk-linear-001")).toBe(
      `/.e2e-svg-catalog/${runId}/desk-linear-001.svg`,
    );
  });

  it.each(["short", "UPPERCASE-01", "../escape-01", "invalid_run_01"])(
    "rejects invalid run id %s",
    (runId) => {
      expect(() =>
        resolveParametricFactoryE2eRoot({
          env: envFor(runId),
          nodeEnv: "test",
        }),
      ).toThrow(/run id/i);
    },
  );

  it("rejects a root that differs from the run-scoped root", () => {
    const env = envFor("factory-0002");
    env.PARAMETRIC_FACTORY_E2E_ROOT = path.join(repoRoot, ".e2e-runtime");
    expect(() =>
      resolveParametricFactoryE2eRoot({ env, nodeEnv: "test" }),
    ).toThrow(/exact run root/i);
  });

  it("rejects canonical descriptor and SVG roots", () => {
    const descriptorEnv = envFor("factory-0003");
    descriptorEnv.PARAMETRIC_FACTORY_E2E_ROOT = path.join(
      siteRoot,
      "inventory",
      "descriptors",
    );
    expect(() =>
      resolveParametricFactoryE2eRoot({ env: descriptorEnv, nodeEnv: "test" }),
    ).toThrow();

    const svgEnv = envFor("factory-0004");
    svgEnv.PARAMETRIC_FACTORY_E2E_ROOT = path.join(
      siteRoot,
      "public",
      "svg-catalog",
    );
    expect(() =>
      resolveParametricFactoryE2eRoot({ env: svgEnv, nodeEnv: "test" }),
    ).toThrow();
  });

  it("rejects a reparse escape below the run root", () => {
    const resolved = resolveParametricFactoryE2eRoot({
      env: envFor("factory-0005"),
      nodeEnv: "test",
    });
    if (!resolved) throw new Error("expected E2E root");
    mkdirSync(resolved.runtimeRoot, { recursive: true });
    const outside = path.join(repoRoot, ".e2e-runtime", "outside-factory-0005");
    mkdirSync(outside, { recursive: true });
    const inventoryLink = path.join(resolved.runtimeRoot, "inventory");
    rmSync(inventoryLink, { recursive: true, force: true });
    symlinkSync(outside, inventoryLink, "junction");

    expect(() => resolved.descriptorPath("desk-linear-001")).toThrow(
      /escape|reparse|symbolic/i,
    );
  });

  it("cleanup removes only its validated run directory", () => {
    const resolved = resolveParametricFactoryE2eRoot({
      env: envFor("factory-0006"),
      nodeEnv: "test",
    });
    if (!resolved) throw new Error("expected E2E root");
    mkdirSync(resolved.runtimeRoot, { recursive: true });
    writeFileSync(path.join(resolved.runtimeRoot, "proof.txt"), "isolated", "utf8");

    cleanupParametricFactoryE2eRoot(resolved);
    expect(existsSync(resolved.runtimeRoot)).toBe(false);
    expect(() =>
      cleanupParametricFactoryE2eRoot({
        ...resolved,
        runtimeRoot: path.dirname(resolved.runtimeRoot),
      }),
    ).toThrow(/run root/i);
  });

  it("cleanup rejects a run directory replaced by a junction", () => {
    const resolved = resolveParametricFactoryE2eRoot({
      env: envFor("factory-0007"),
      nodeEnv: "test",
    });
    if (!resolved) throw new Error("expected E2E root");
    mkdirSync(path.dirname(resolved.runtimeRoot), { recursive: true });
    const outside = path.join(repoRoot, ".e2e-runtime", "outside-factory-0007");
    mkdirSync(outside, { recursive: true });
    const sentinel = path.join(outside, "sentinel.txt");
    writeFileSync(sentinel, "keep", "utf8");
    symlinkSync(outside, resolved.runtimeRoot, "junction");

    try {
      expect(() => cleanupParametricFactoryE2eRoot(resolved)).toThrow(
        /reparse|symbolic/i,
      );
      expect(existsSync(sentinel)).toBe(true);
    } finally {
      unlinkSync(resolved.runtimeRoot);
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it("cleanup rejects forged roots before touching parent directories", () => {
    const resolved = resolveParametricFactoryE2eRoot({
      env: envFor("factory-0008"),
      nodeEnv: "test",
    });
    if (!resolved) throw new Error("expected E2E root");
    const parent = path.join(repoRoot, ".e2e-runtime", "parametric-factory");
    mkdirSync(parent, { recursive: true });
    const sentinel = path.join(parent, "sentinel.txt");
    writeFileSync(sentinel, "keep", "utf8");

    expect(() =>
      cleanupParametricFactoryE2eRoot({
        ...resolved,
        runId: "..",
        runtimeRoot: path.join(repoRoot, ".e2e-runtime"),
        svgDir: path.join(siteRoot, "public"),
      }),
    ).toThrow(/run id/i);
    expect(existsSync(sentinel)).toBe(true);
    rmSync(sentinel, { force: true });
  });
});
