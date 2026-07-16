// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/recovery-state.mjs",
);

describe("recovery-state (name-mirror)", () => {
  it("writes recovery snapshot and latest.md with git summary fields", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "recovery-state-"));
    try {
      const recovery = path.join(tmp, ".codex-recovery");
      fs.mkdirSync(recovery, { recursive: true });
      fs.writeFileSync(
        path.join(recovery, "NEXT-PLAN.md"),
        "- Ship name-mirror scripts wave6",
        "utf8",
      );

      const out = execFileSync(
        process.execPath,
        [scriptPath, "--note=unit-state"],
        { cwd: tmp, encoding: "utf8" },
      );
      expect(out).toMatch(/^WROTE=\.codex-recovery\/snapshots\/recovery-state-/m);

      const latest = path.join(recovery, "latest.md");
      expect(fs.existsSync(latest)).toBe(true);
      const content = fs.readFileSync(latest, "utf8");
      expect(content).toContain("# Recovery State");
      expect(content).toContain("unit-state");
      expect(content).toContain("## Git Status");
      expect(content).toContain("## Next 45 Minutes Plan");
      expect(content).toContain("Ship name-mirror scripts wave6");
      expect(content).toMatch(/- Branch: /);
      expect(content).toMatch(/- Modified: \d+/);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
