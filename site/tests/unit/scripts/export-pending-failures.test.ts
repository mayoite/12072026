// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import { describe, expect, it } from "vitest";

import {
  cleanField,
  csvEscape,
  exportPendingFailures,
  isPendingState,
  parseFailuresMarkdown,
  resolutionStateFromStatus,
  rowsToCsv,
} from "../../../scripts/export-pending-failures.mjs";

describe("export-pending-failures (name-mirror)", () => {
  it("maps status text to resolution states", () => {
    expect(resolutionStateFromStatus("OPEN — needs fix")).toBe("open");
    expect(resolutionStateFromStatus("Resolved 2026-07-01")).toBe("resolved");
    expect(resolutionStateFromStatus("blocked on secrets")).toBe("blocked");
    expect(resolutionStateFromStatus("in progress")).toBe("in-progress");
    expect(isPendingState("open")).toBe(true);
    expect(isPendingState("resolved")).toBe(false);
  });

  it("escapes csv and cleans fields", () => {
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(cleanField(" `x` ")).toBe("x");
  });

  it("parses Failures.md style sections", () => {
    const md = `# Failures

## Site

### Broken CTA

- **Status:** open
- **File:** site/app/page.tsx
- **Finding:** missing href
- **Action:** restore link
`;
    const items = parseFailuresMarkdown(md);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      group: "Site",
      section: "Broken CTA",
      resolution_state: "open",
      pending: "yes",
      files: "site/app/page.tsx",
      summary: "missing href",
      action: "restore link",
    });
  });

  it("writes index and pending csv to temp paths (no network)", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "export-pending-"));
    try {
      const input = path.join(tmp, "Failures.md");
      const indexOutput = path.join(tmp, "results", "failures-index.csv");
      const pendingOutput = path.join(tmp, "results", "pending-failures.csv");
      fs.writeFileSync(
        input,
        `## Admin

### Done item
- **Status:** resolved
- **File:** a.ts
- **Finding:** fixed

### Open item
- **Status:** open
- **File:** b.ts
- **Finding:** still broken
`,
        "utf8",
      );

      const result = exportPendingFailures({
        paths: { input, indexOutput, pendingOutput },
        log: () => undefined,
      });

      expect(result.indexCount).toBe(2);
      expect(result.pendingCount).toBe(1);
      expect(fs.existsSync(indexOutput)).toBe(true);
      expect(fs.existsSync(pendingOutput)).toBe(true);
      const indexCsv = fs.readFileSync(indexOutput, "utf8");
      const pendingCsv = fs.readFileSync(pendingOutput, "utf8");
      expect(indexCsv).toContain("resolution_state,pending,status");
      expect(indexCsv).toContain("Open item");
      expect(pendingCsv).toContain("Open item");
      expect(pendingCsv).not.toContain("Done item");
      expect(rowsToCsv(result.pendingRows)).toContain("open");
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
