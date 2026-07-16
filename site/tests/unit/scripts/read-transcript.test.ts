// @vitest-environment node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/read-transcript.mjs",
);

describe("read-transcript (name-mirror)", () => {
  it("prints usage and exits non-zero without a file path", () => {
    let status = 0;
    let stderr = "";
    try {
      execFileSync(process.execPath, [scriptPath], { encoding: "utf8" });
    } catch (err) {
      const e = err as { status?: number; stderr?: string };
      status = e.status ?? 1;
      stderr = e.stderr ?? "";
    }
    expect(status).toBe(1);
    expect(stderr).toContain("Usage: node read-transcript.mjs");
  });

  it("prints last N role messages from JSONL transcript", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "read-transcript-"));
    try {
      const file = path.join(tmp, "chat.jsonl");
      const lines = [
        JSON.stringify({
          message: { role: "user", content: "hello from user" },
        }),
        JSON.stringify({
          message: {
            role: "assistant",
            content: [
              { type: "text", text: "assistant reply text" },
              { type: "tool_use", name: "search_tool" },
            ],
          },
        }),
        "not-json",
        JSON.stringify({ message: { role: "system", content: "ignored noise" } }),
      ];
      fs.writeFileSync(file, lines.join("\n"), "utf8");
      const out = execFileSync(process.execPath, [scriptPath, file, "10"], {
        encoding: "utf8",
      });
      expect(out).toContain("[user] hello from user");
      expect(out).toContain("[assistant] assistant reply text");
      expect(out).toContain("[assistant:tool] search_tool");
      expect(out).toContain("[system] ignored noise");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
