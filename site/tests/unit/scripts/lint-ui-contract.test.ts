// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/lint-ui-contract.mjs");

describe("lint-ui-contract (name-mirror)", () => {
  it("runs the UI contract lint and reports scheme freeze status", () => {
    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    try {
      stdout = execFileSync(process.execPath, [scriptPath], {
        cwd: siteRoot,
        encoding: "utf8",
        env: { ...process.env, LINT_UI_STRICT: "0" },
      });
    } catch (error) {
      const err = error as { status?: number; stdout?: string; stderr?: string };
      exitCode = err.status ?? 1;
      stdout = err.stdout ?? "";
      stderr = err.stderr ?? "";
    }

    const combined = `${stdout}\n${stderr}`;
    expect(combined).toMatch(/lint-ui-contract: (ok \(scheme freeze\)|warnings|failed)/);
    // Default non-strict mode must not hard-fail the process.
    expect(exitCode).toBe(0);
  });

  it("encodes the frozen palette and open3d/admin surfaces", () => {
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("app/admin");
    expect(source).toContain("features/admin");
    expect(source).toContain("features/planner/ui");
    expect(source).toContain("features/planner/workspace");
    expect(source).toContain("lucide-react");
    expect(source).toContain("RAW_PALETTE");
    expect(source).toContain("--strict");
  });
});
