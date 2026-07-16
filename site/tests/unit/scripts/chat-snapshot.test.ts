// @vitest-environment node
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/chat-snapshot.mjs");

describe("chat-snapshot (name-mirror)", () => {
  it("writes timestamped and latest chat snapshots under .codex-recovery", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chat-snapshot-"));
    try {
      const out = execFileSync(
        process.execPath,
        [scriptPath, "--note=wave1 unit probe"],
        { cwd: tmp, encoding: "utf8" },
      );
      expect(out).toMatch(/WROTE=\.codex-recovery\/chat-snapshots\/chat-/);

      const latest = path.join(tmp, ".codex-recovery/chat-snapshots/latest-chat.md");
      expect(fs.existsSync(latest)).toBe(true);
      const body = fs.readFileSync(latest, "utf8");
      expect(body).toContain("# Chat Snapshot");
      expect(body).toContain("wave1 unit probe");
      expect(body).toContain(".codex-recovery/NEXT-PLAN.md");

      const snapDir = path.join(tmp, ".codex-recovery/chat-snapshots");
      const stamped = fs
        .readdirSync(snapDir)
        .filter((f) => f.startsWith("chat-") && f.endsWith(".md"));
      expect(stamped.length).toBeGreaterThanOrEqual(1);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
