/**
 * Task 1 orphan: canonical S1 suite is under ./svg/.
 * Prefer deleting this file:
 *   Remove-Item -Force site/tests/unit/features/planner/asset-engine/normalizeDescriptorForPipeline.test.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));

describe("normalizeDescriptorForPipeline orphan path", () => {
  it("canonical suite lives under svg/", () => {
    const canonical = path.join(here, "svg", "normalizeDescriptorForPipeline.test.ts");
    expect(fs.existsSync(canonical)).toBe(true);
    const src = fs.readFileSync(canonical, "utf8");
    expect(src).toContain("fixed meeting tabletop + leg-* → union");
    expect(src).toContain("unknown maker recipe throws");
  });
});
