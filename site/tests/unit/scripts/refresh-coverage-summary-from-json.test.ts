// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  isSiteScopeFile,
  refreshCoverageSummary,
  scopeFromPath,
} from "../../../scripts/refresh-coverage-summary-from-json.mjs";

function emptyCov(hit = 1) {
  return {
    s: { "0": hit },
    statementMap: { "0": { start: { line: 1 }, end: { line: 1 } } },
    f: {},
    fnMap: {},
    b: {},
    branchMap: {},
  };
}

describe("refresh-coverage-summary-from-json (name-mirror)", () => {
  it("scopes paths into planner/lib/app buckets", () => {
    expect(scopeFromPath("E:/repo/site/features/planner/ui/x.ts")).toBe("features/planner");
    expect(scopeFromPath("E:/repo/site/features/admin/y.ts")).toBe("features/other");
    expect(scopeFromPath("E:/repo/site/lib/utils.ts")).toBe("lib");
    expect(scopeFromPath("E:/repo/site/app/page.tsx")).toBe("app");
    expect(scopeFromPath("E:/repo/site/misc.ts")).toBe("other");
  });

  it("classifies site-scope files including configurator and advisor", () => {
    expect(isSiteScopeFile("site/features/site/data/nav.ts")).toBe(true);
    expect(isSiteScopeFile("site/lib/configurator/foo.ts")).toBe(true);
    expect(isSiteScopeFile("site/lib/configurator/foo.d.ts")).toBe(false);
    expect(isSiteScopeFile("site/features/site/advisor/aiadvisor.ts")).toBe(true);
    expect(isSiteScopeFile("site/features/planner/ui/x.ts")).toBe(false);
  });

  it("refreshes summary scopes from fixture coverage-final files", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cov-refresh-"));
    try {
      fs.mkdirSync(path.join(tmp, "results/coverage"), { recursive: true });
      fs.mkdirSync(path.join(tmp, "results/coverage-site"), { recursive: true });

      const planner = {
        "E:/x/site/features/planner/a.ts": emptyCov(1),
        "E:/x/site/lib/b.ts": emptyCov(0),
      };
      const site = {
        "E:/x/site/features/site/data/c.ts": emptyCov(1),
        "E:/x/site/features/planner/skip.ts": emptyCov(1),
      };
      fs.writeFileSync(
        path.join(tmp, "results/coverage/coverage-final.json"),
        JSON.stringify(planner),
      );
      fs.writeFileSync(
        path.join(tmp, "results/coverage-site/coverage-final.json"),
        JSON.stringify(site),
      );
      fs.writeFileSync(
        path.join(tmp, "results/coverage-summary.json"),
        JSON.stringify({ scopes: {} }),
      );

      const summary = refreshCoverageSummary(tmp) as {
        scopes: Record<string, { statements: { total: number; covered: number } }>;
        generatedAt: string;
      };
      expect(summary.generatedAt).toMatch(/^\d{4}-/);
      expect(summary.scopes["features/planner"].statements.total).toBeGreaterThan(0);
      expect(summary.scopes.lib.statements.total).toBeGreaterThan(0);
      expect(summary.scopes.site.statements.total).toBeGreaterThan(0);
      expect(summary.scopes.site.statements.covered).toBeGreaterThan(0);

      const disk = JSON.parse(
        fs.readFileSync(path.join(tmp, "results/coverage-summary.json"), "utf8"),
      ) as typeof summary;
      expect(disk.scopes.site.statements.total).toBe(summary.scopes.site.statements.total);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
