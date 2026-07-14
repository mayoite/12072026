import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  compileSvgForPublish,
  PUBLISH_COMPILE_AUTHORITY,
} from "@/features/planner/asset-engine/svg/compileSvgForPublish";

// tests/unit/features/planner/asset-engine/svg → site/
const siteRoot = path.resolve(__dirname, "../../../../../../");

describe("compileSvgForPublish", () => {
  it("exports publish authority tag", () => {
    expect(PUBLISH_COMPILE_AUTHORITY).toBe("pipelineCore+normalize");
  });

  it("compiles admin descriptor without disk I/O", async () => {
    const adminPath = path.join(
      siteRoot,
      "inventory",
      "descriptors",
      "side-table-001.json",
    );
    const raw = JSON.parse(readFileSync(adminPath, "utf8")) as unknown;
    const result = await compileSvgForPublish(raw);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.svg).toContain("<svg");
    expect(result.stages.length).toBeGreaterThan(0);
  });
});
