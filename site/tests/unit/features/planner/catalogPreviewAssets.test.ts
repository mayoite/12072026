/**
 * Controllable console 404s: demo/proof catalog preview URLs must exist under public/.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

// vitest file is site/tests/unit/features/planner → site root is 4 levels up
const publicRoot = path.resolve(__dirname, "../../../../public");

const REQUIRED_PREVIEWS = [
  "proof-chair.svg",
  "placeholder-cabinet.svg",
] as const;

describe("catalog preview static assets (console 404 prevention)", () => {
  it("ships required demo preview SVGs under site/public", () => {
    for (const name of REQUIRED_PREVIEWS) {
      const abs = path.join(publicRoot, name);
      expect(fs.existsSync(abs), `missing public/${name}`).toBe(true);
      const bytes = fs.statSync(abs).size;
      expect(bytes).toBeGreaterThan(80);
      const head = fs.readFileSync(abs, "utf8").slice(0, 80);
      expect(head).toMatch(/<svg/i);
    }
  });
});
