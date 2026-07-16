// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/recovery-handover.mjs",
);

describe("recovery-handover (name-mirror)", () => {
  it("writes timestamped handover and latest-handover from recovery inputs", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "recovery-handover-"));
    try {
      const recovery = path.join(tmp, ".codex-recovery");
      fs.mkdirSync(recovery, { recursive: true });
      fs.writeFileSync(path.join(recovery, "NEXT-CHAT-PROMPT.txt"), "Continue phase probes", "utf8");
      fs.writeFileSync(path.join(recovery, "NEXT-PLAN.md"), "- Finish wave6 tests", "utf8");
      fs.writeFileSync(path.join(recovery, "latest.md"), "# Latest recovery", "utf8");
      fs.mkdirSync(path.join(recovery, "chat-snapshots"), { recursive: true });
      fs.writeFileSync(
        path.join(recovery, "chat-snapshots", "latest-chat.md"),
        "chat body",
        "utf8",
      );

      const out = execFileSync(
        process.execPath,
        [scriptPath, "--note=wave6-unit"],
        { cwd: tmp, encoding: "utf8" },
      );
      expect(out).toMatch(/^WROTE=\.codex-recovery\/handover\/handover-/m);

      const latest = path.join(recovery, "handover", "latest-handover.md");
      expect(fs.existsSync(latest)).toBe(true);
      const content = fs.readFileSync(latest, "utf8");
      expect(content).toContain("# Recovery Handover");
      expect(content).toContain("wave6-unit");
      expect(content).toContain("Continue phase probes");
      expect(content).toContain("Finish wave6 tests");
      expect(content).toContain("## Latest Chat Snapshot");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
