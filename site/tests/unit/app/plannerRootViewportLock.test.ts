import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const GLOBALS_CSS = path.join(process.cwd(), "app", "(site)", "globals.css");

describe("planner-root viewport lock (globals.css)", () => {
  const css = fs.readFileSync(GLOBALS_CSS, "utf8");

  it("uses a class-only selector so any .planner-root node gets the lock", () => {
    expect(css).toMatch(/\.planner-root\s*\{[^}]*overflow:\s*hidden/);
    expect(css).toMatch(/\.planner-root\s*\{[^}]*height:\s*100dvh/);
  });

  it("does not require body.planner-workspace.planner-root (breaks non-body hosts)", () => {
    expect(css).not.toMatch(/body\.planner-workspace\.planner-root\s*\{/);
  });
});
