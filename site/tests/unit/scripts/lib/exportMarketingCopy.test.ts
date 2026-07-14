// @vitest-environment node
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const scriptPath = path.join(siteRoot, "scripts/lib/exportMarketingCopy.ts");

describe("exportMarketingCopy (name-mirror)", () => {
  it("prints a JSON marketing copy tree with homepage and route pages", () => {
    const output = execFileSync(
      process.execPath,
      ["--import", "tsx", scriptPath],
      {
        cwd: siteRoot,
        encoding: "utf8",
        timeout: 60_000,
      },
    );

    const marketing = JSON.parse(output) as {
      about: unknown;
      home: { hero: unknown; plannerSuite: unknown };
      products: unknown;
      solutions: { deliverySteps?: unknown };
    };

    expect(marketing.about).toBeTypeOf("object");
    expect(marketing.products).toBeTypeOf("object");
    expect(marketing.home.hero).toBeTypeOf("object");
    expect(marketing.home.plannerSuite).toBeTypeOf("object");
    expect(marketing.solutions).toBeTypeOf("object");
    expect(marketing.solutions.deliverySteps).toBeDefined();
  }, 60_000);
});
