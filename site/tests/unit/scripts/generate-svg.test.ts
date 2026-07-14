// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runPipeline } from "../../../scripts/generate-svg.mjs";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const fixturePath = path.join(siteRoot, "scripts/generate-svg/_fixtures/chaise.json");

describe("generate-svg (name-mirror)", () => {
  it("rejects descriptors without a slug before writing catalog output", async () => {
    await expect(runPipeline({})).rejects.toThrow(/runPipeline requires descriptor\.slug/);
    await expect(runPipeline({ slug: "" })).rejects.toThrow(/runPipeline requires descriptor\.slug/);
    await expect(runPipeline(null as unknown as { slug: string })).rejects.toThrow(
      /runPipeline requires descriptor\.slug/,
    );
  });

  it("exports runPipeline as the CLI publish entry and keeps the chaise smoke fixture", () => {
    expect(typeof runPipeline).toBe("function");
    expect(fs.existsSync(fixturePath)).toBe(true);
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as { slug?: string };
    expect(typeof fixture.slug).toBe("string");
    expect(fixture.slug!.length).toBeGreaterThan(0);
  });
});
