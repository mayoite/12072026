// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/analyze-coverage-report.mjs");

function loadHelpers() {
  const source = fs.readFileSync(scriptPath, "utf8");
  const helpers = [
    source.match(/function relPath\(filePath\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function fileMetrics\(cov\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function emptyBucket\(\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function addToBucket\(bucket, m\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function finalizeBucket\(bucket\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function plannerBucket\(rel\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function siteBucket\(rel\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function mdTableRow\(cells\) \{[\s\S]*?\n\}/)?.[0],
    source.match(/function formatMetric\(m\) \{[\s\S]*?\n\}/)?.[0],
  ];
  if (helpers.some((h) => !h)) {
    throw new Error("Failed to extract pure helpers from analyze-coverage-report.mjs");
  }

  const sandbox: Record<string, unknown> = {
    fileCounts: (cov: { s?: Record<string, number>; f?: Record<string, number>; b?: Record<string, number[]>; l?: Record<string, number>; statementMap?: Record<string, { start: { line: number } }> }) => {
      const s = cov.s ?? {};
      const f = cov.f ?? {};
      const b = cov.b ?? {};
      const stmtTotal = Object.keys(s).length;
      const stmtCovered = Object.values(s).filter((v) => v > 0).length;
      const fnTotal = Object.keys(f).length;
      const fnCovered = Object.values(f).filter((v) => v > 0).length;
      let brTotal = 0;
      let brCovered = 0;
      for (const arms of Object.values(b)) {
        brTotal += arms.length;
        brCovered += arms.filter((v) => v > 0).length;
      }
      const l = cov.l ?? {};
      const lineKeys = Object.keys(l);
      let lineCovered = 0;
      let lineTotal = lineKeys.length;
      if (lineTotal === 0 && cov.statementMap) {
        const byLine = new Map<number, boolean>();
        for (const id of Object.keys(s)) {
          const line = cov.statementMap[id]?.start?.line;
          if (line == null) continue;
          byLine.set(line, Boolean(byLine.get(line) || s[id] > 0));
        }
        lineTotal = byLine.size;
        for (const hit of byLine.values()) if (hit) lineCovered++;
      } else {
        for (const k of lineKeys) if (l[k] > 0) lineCovered++;
      }
      return {
        stmtCovered,
        stmtTotal,
        fnCovered,
        fnTotal,
        brCovered,
        brTotal,
        lineCovered,
        lineTotal,
      };
    },
    pct: (n: number, d: number) => (d ? Math.round((1000 * n) / d) / 10 : 0),
    SITE_RULES: [
      ["features/site/data", /^features\/site\/data/],
      ["lib/catalog", /^lib\/catalog/],
      ["lib/configurator", /^lib\/configurator/],
      ["lib/catalog/site", /^features\/catalog/],
      ["features/shared", /^features\/shared/],
      ["features/site/assistant", /^features\/site\/assistant/],
      ["features/ops", /^features\/ops/],
      ["features/site/advisor", /^features\/site\/advisor\/aiadvisor/],
    ],
  };

  vm.runInNewContext(`${helpers.join("\n")}; this.exports = { relPath, fileMetrics, emptyBucket, addToBucket, finalizeBucket, plannerBucket, siteBucket, mdTableRow, formatMetric };`, sandbox);
  return sandbox.exports as {
    relPath: (p: string) => string;
    fileMetrics: (cov: Record<string, unknown>) => {
      stmtCovered: number;
      stmtTotal: number;
      stmtPct: number;
      linePct: number;
    };
    emptyBucket: () => { statements: { covered: number; total: number; pct: number }; files: number };
    addToBucket: (bucket: ReturnType<typeof sandbox extends never ? never : never>, m: { stmtCovered: number; stmtTotal: number; fnCovered: number; fnTotal: number; brCovered: number; brTotal: number; lineCovered: number; lineTotal: number }) => void;
    finalizeBucket: (bucket: { statements: { covered: number; total: number; pct: number }; functions: { covered: number; total: number; pct: number }; branches: { covered: number; total: number; pct: number }; lines: { covered: number; total: number; pct: number } }) => unknown;
    plannerBucket: (rel: string) => string;
    siteBucket: (rel: string) => string;
    mdTableRow: (cells: string[]) => string;
    formatMetric: (m: { pct: number; covered: number; total: number }) => string;
  };
}

describe("analyze-coverage-report", () => {
  it("exists and wires dual rollup + coverage policy gates", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("dualRollupFromFinal");
    expect(source).toContain("COVERAGE_GATE_PLANNER");
    expect(source).toContain("COVERAGE_GATE_SITE");
    expect(source).toContain("function analyze(");
  });

  it("extracts pure path/bucket helpers that classify planner and site paths", () => {
    const {
      relPath,
      plannerBucket,
      siteBucket,
      mdTableRow,
      formatMetric,
      emptyBucket,
      addToBucket,
      finalizeBucket,
      fileMetrics,
    } = loadHelpers();

    expect(relPath("E:/repo/site/features/planner/open3d/foo.ts")).toBe(
      "features/planner/open3d/foo.ts",
    );
    expect(plannerBucket("features/planner/open3d/foo.ts")).toBe("open3d");
    expect(plannerBucket("features/planner/store/x.ts")).toBe("store");
    expect(siteBucket("features/site/data/products.ts")).toBe("features/site/data");
    expect(siteBucket("lib/catalog/index.ts")).toBe("lib/catalog");
    expect(siteBucket("features/unknown/x.ts")).toBe("unscoped");

    expect(mdTableRow(["A", "B"])).toBe("| A | B |");
    expect(formatMetric({ pct: 80, covered: 8, total: 10 })).toBe("80% (8/10)");

    const bucket = emptyBucket();
    const metrics = fileMetrics({
      s: { "0": 1, "1": 0 },
      f: { "0": 1 },
      b: { "0": [1, 0] },
      statementMap: {
        "0": { start: { line: 1 } },
        "1": { start: { line: 2 } },
      },
    });
    expect(metrics.stmtTotal).toBe(2);
    expect(metrics.stmtCovered).toBe(1);
    expect(metrics.stmtPct).toBe(50);

    addToBucket(bucket as never, {
      stmtCovered: metrics.stmtCovered,
      stmtTotal: metrics.stmtTotal,
      fnCovered: 1,
      fnTotal: 1,
      brCovered: 1,
      brTotal: 2,
      lineCovered: 1,
      lineTotal: 2,
    });
    finalizeBucket(bucket as never);
    expect(bucket.statements.pct).toBe(50);
    expect(bucket.files).toBe(1);
  });

  it("fails fast when required coverage artifacts are missing", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cov-report-missing-"));
    try {
      try {
        execFileSync(process.execPath, [scriptPath], {
          cwd: tmp,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });
        expect.fail("expected script to throw without coverage artifacts");
      } catch (error) {
        const err = error as { status?: number; message?: string; stderr?: string };
        expect(err.status === 1 || String(err.message ?? err.stderr ?? "").length > 0).toBe(true);
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
